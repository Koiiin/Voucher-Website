const express = require("express");
const axios = require("axios");
const crypto = require("crypto");
const dotenv = require("dotenv");
const VoucherTransaction = require("../models/VoucherTransaction");

dotenv.config();
const router = express.Router();

router.post("/payment/momo", async (req, res) => {
    var accessKey = 'F8BBA842ECF85';
    var secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
    var orderInfo = 'pay with MoMo';
    var partnerCode = 'MOMO';
    var redirectUrl = 'https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b';
    var ipnUrl = 'https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b';
    var requestType = "payWithMethod";
    var amount = '50000';
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
