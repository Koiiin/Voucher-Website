const express = require('express');
const router = express.Router();
const voucherController = require('../controllers/voucherController');
const authMiddleware = require('../controllers/middlewareController');

// tao voucher
router.post('/createVoucher',authMiddleware.verifyToken ,voucherController.createVoucher);
// lay tat ca voucher
router.get('/getAllVoucher', voucherController.getAllVoucher);


router.delete('/deleteVoucher/:id',authMiddleware.verifyToken , voucherController.deleteVoucher);
router.put('/updateVoucher/:id', voucherController.updateVoucher);

// tim kiem voucher
router.get('/search', voucherController.searchVoucher);
router.get("/categories", voucherController.getCategories);

// Lấy các voucher hợp lệ 
router.get('/getValidVouchers', voucherController.getValidVouchers);

// Lấy voucher theo platform
router.get('/getVouchersByPlatform/:platform', voucherController.getVouchersByPlatform);
// API trả về số lượng voucher theo sàn
router.get('/getVoucherCountByPlatform/:platform', voucherController.getVoucherCountByPlatform);

module.exports = router;
