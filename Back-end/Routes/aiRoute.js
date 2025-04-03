// Chương trình để tạo một API cho phép người dùng gửi
// lịch sử mua hàng và nhận lại các gợi ý 
// voucher phù hợp từ OpenAI. 
// Chương trình này bao gồm các phần sau:
// 1. Khai báo các thư viện cần thiết.
// 2. Tạo một router mới cho API.
// 3. Định nghĩa một route POST để nhận lịch sử mua hàng.
// 4. Sử dụng OpenAI API để tạo các gợi ý voucher.
// 5. Xuất router để sử dụng.
// Chương trình này sử dụng OpenAI API để tạo các gợi ý voucher

const express = require('express');
const { suggestVoucher } = require('../controllers/aiController');
const router = express.Router();

router.post('/suggestVoucher', suggestVoucher); 

module.exports = router;
