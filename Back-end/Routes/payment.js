const express = require("express");
const axios = require("axios");
const crypto = require("crypto");
const dotenv = require("dotenv");
const VoucherTransaction = require("../models/VoucherTransaction");

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

module.exports = router;
