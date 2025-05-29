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
    var redirectUrl = process.env.MOMO_REDIRECT_URL || 'https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b';
    var ipnUrl = process.env.MOMO_IPN_URL || 'https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b';
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
