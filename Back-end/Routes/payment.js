const express = require("express");
const axios = require("axios");
const crypto = require("crypto");
const dotenv = require("dotenv");
const VoucherTransaction = require("../models/VoucherTransaction");
const UserVoucher = require("../models/UserVouchers");
const mongoose = require('mongoose');

dotenv.config();
const router = express.Router();

router.post("/payment/momo", async (req, res) => {
    // Lấy dữ liệu từ frontend gửi lên
    const { voucherData, userInfo } = req.body;

    // Kiểm tra dữ liệu
    if (!voucherData || !voucherData.price) {
        return res.status(400).json({ error: "Thiếu thông tin voucher" });
    }

    // Các tham số MoMo
    var accessKey = process.env.MOMO_ACCESS_KEY || 'F8BBA842ECF85';
    var secretKey = process.env.MOMO_SECRET_KEY || 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
    var orderInfo = `Thanh toán voucher: ${voucherData.title}`;
    var partnerCode = process.env.MOMO_PARTNER_CODE || 'MOMO';
    
    // URL cho redirect và callback dựa vào môi trường
    var redirectUrl = process.env.NODE_ENV === 'production'
        ? 'https://voucher-website-fe.onrender.com/payment/status'
        : 'http://localhost:5173/payment/success';
    
    var ipnUrl = process.env.NODE_ENV === 'production'
        ? 'https://voucher-website-ba.onrender.com/api/payment/status'
        : 'http://localhost:3000/api/payment/status';
    
    var requestType = "payWithMethod";
    var amount = String(voucherData.price);
    var orderId = partnerCode + new Date().getTime();
    var requestId = orderId;
    var extraData = '';
    var orderGroupId = '';
    var autoCapture = true;
    var lang = 'vi';

    var rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

    console.log("--------------------RAW SIGNATURE----------------")
    console.log(rawSignature);

    var signature = crypto.createHmac('sha256', secretKey)
        .update(rawSignature)
        .digest('hex');

    console.log("--------------------SIGNATURE----------------")
    console.log(signature);

    // Giảm thời gian hết hạn xuống 10 phút (600 giây)
    var expiryTime = Math.floor(Date.now() / 1000) + 600; 

    // Lưu giao dịch vào database (nếu cần)
    try {
        await VoucherTransaction.create({
            user: userInfo,
            voucher: voucherData,
            orderId,
            amount,
            status: 'pending'
        });
    } catch (err) {
        // Nếu không cần lưu, có thể bỏ qua phần này
        console.log('Không thể lưu giao dịch:', err.message);
    }

    const requestBody = JSON.stringify({
        partnerCode,
        partnerName: "Test",
        storeId: "MomoTestStore",
        requestId,
        amount,
        orderId,
        orderInfo,
        redirectUrl,
        ipnUrl,
        lang,
        requestType,
        autoCapture,
        extraData,
        orderGroupId,
        signature,
        expiryTime
    });

    const https = require('https');
    const options = {
        hostname: 'test-payment.momo.vn',
        port: 443,
        path: '/v2/gateway/api/create',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(requestBody)
        }
    };

    const reqmomo = https.request(options, momoRes => {
        console.log(`Status: ${momoRes.statusCode}`);
        console.log(`Headers: ${JSON.stringify(momoRes.headers)}`);

        let responseData = '';

        momoRes.on('data', (chunk) => {
            responseData += chunk;
        });

        momoRes.on('end', () => {
            console.log('Body: ', responseData);
            res.json(JSON.parse(responseData)); // Gửi phản hồi về client
        });
    });

    reqmomo.on('error', (e) => {
        console.log(`Problem with request: ${e.message}`);
        res.status(500).json({ error: e.message }); // Gửi lỗi về client
    });

    console.log("Sending....");
    reqmomo.write(requestBody);
    reqmomo.end();
});

// Thêm route check payment status
router.get("/payment/status/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    const transaction = await VoucherTransaction.findOne({ orderId });
    
    if (!transaction) {
      return res.status(404).json({ 
        message: "Không tìm thấy giao dịch",
        orderId 
      });
    }

    if (transaction.status === 'completed') {
      // Tìm voucher gốc
      const originalVoucher = await UserVoucher.findById(transaction.voucher._id);
      
      if (originalVoucher && originalVoucher.quantity > 0) {
        // Tạo voucher mới cho người mua
        const newVoucher = new UserVoucher({
          ...originalVoucher.toObject(),
          _id: new mongoose.Types.ObjectId(),
          ownerId: transaction.userInfo.userId,
          quantity: 1
        });

        // Giảm số lượng voucher gốc
        originalVoucher.quantity -= 1;

        await Promise.all([
          newVoucher.save(),
          originalVoucher.save()
        ]);

        return res.json({ 
          status: transaction.status,
          message: 'Thanh toán thành công! Voucher đã được thêm vào tài khoản của bạn'
        });
      }
    } else if (transaction.status === 'pending') {
      const now = new Date();
      const createdAt = new Date(transaction.createdAt);
      const diffMinutes = (now - createdAt) / 1000 / 60;

      // Timeout sau 10 phút 
      if (diffMinutes > 10) {
        transaction.status = 'timeout';
        await transaction.save();
        return res.json({ 
          status: 'timeout',
          message: 'Giao dịch đã hết hạn'
        });
      }
    }

    res.json({ 
      status: transaction.status,
      message: getStatusMessage(transaction.status)
    });

  } catch (error) {
    console.error("Error checking payment status:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
});

// Thêm route để hủy giao dịch khi đóng tab
router.post("/payment/cancel/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    const transaction = await VoucherTransaction.findOne({ orderId });
    
    if (!transaction) {
      return res.status(404).json({ message: "Không tìm thấy giao dịch" });
    }

    if (transaction.status === 'pending') {
      transaction.status = 'canceled';
      await transaction.save();
    }

    res.json({ status: 'canceled', message: 'Đã hủy giao dịch' });
  } catch (error) {
    console.error("Error canceling payment:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
});

// Thêm route xử lý callback từ MoMo
router.get("/payment/status", async (req, res) => {
  try {
    const {
      orderId,
      resultCode,
      message,
      transId,
      orderInfo,
      amount,
      signature
    } = req.query;

    // Thêm khai báo baseUrl
    const baseUrl = process.env.NODE_ENV === 'production'
      ? 'https://voucher-website-fe.onrender.com'
      : 'http://localhost:5173';

    // Xác thực chữ ký callback từ MoMo (để đảm bảo an toàn)
    const secretKey = process.env.MOMO_SECRET_KEY || 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
    const rawSignature = `accessKey=${process.env.MOMO_ACCESS_KEY}&amount=${amount}&extraData=&message=${message}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=momo_wallet&partnerCode=${process.env.MOMO_PARTNER_CODE}&payType=napas&requestId=${orderId}&responseTime=${req.query.responseTime}&resultCode=${resultCode}&transId=${transId}`;
    
    const calculatedSignature = crypto
      .createHmac('sha256', secretKey)
      .update(rawSignature)
      .digest('hex');

    // Kiểm tra chữ ký và mã kết quả
    if (calculatedSignature === signature && resultCode === '0') {
      const transaction = await VoucherTransaction.findOne({ orderId });
      if (transaction) {
        transaction.status = 'completed';
        transaction.transId = transId;
        await transaction.save();
      }

      // Trả về HTML với script đóng tab và chuyển về tab gốc
      res.send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Thanh toán thành công</title>
          <script>
            window.onload = function() {
              if (window.opener) {
                // Gửi thông báo thành công về tab gốc
                window.opener.postMessage({
                  type: 'PAYMENT_SUCCESS',
                  orderId: '${orderId}',
                  transId: '${transId}'
                }, '*');
              }
              setTimeout(function() {
                window.close();
              }, 500);
            };
          </script>
        </head>
        <body style="text-align: center; padding: 50px;">
          <h2>Thanh toán thành công!</h2>
          <p>Cửa sổ này sẽ tự động đóng...</p>
        </body>
        </html>
      `);
    } else {
      // Nếu thanh toán thất bại
      if (transaction) {
        transaction.status = 'failed';
        await transaction.save();
      }
      res.send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Thanh toán thất bại</title>
          <script>
            window.onload = function() {
              if (window.opener) {
                window.opener.postMessage({ type: 'PAYMENT_FAILED' }, '*');
                window.close();
              }
            };
          </script>
        </head>
        <body style="text-align: center; padding: 50px;">
          <h2>Thanh toán thất bại!</h2>
          <p>Cửa sổ này sẽ tự động đóng...</p>
        </body>
        </html>
      `);
    }

  } catch (error) {
    console.error("Error processing MoMo callback:", error);
    res.redirect('http://localhost:5173/payment/failed');
  }
});

function getStatusMessage(status) {
  switch(status) {
    case 'completed': return 'Thanh toán thành công';
    case 'pending': return 'Đang chờ thanh toán';
    case 'failed': return 'Thanh toán thất bại'; 
    case 'canceled': return 'Đã hủy thanh toán';
    case 'timeout': return 'Giao dịch hết hạn';
    default: return 'Không xác định';
  }
}

module.exports = router;
