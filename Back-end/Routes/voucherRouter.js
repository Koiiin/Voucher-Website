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
//lay tat ca voucher cua nguoi dung c 
router.get('/getUserVouchers', voucherController.getUserVouchers);
//Lay voucher theo id
router.get('/getVoucherById/:id', authMiddleware.verifyToken ,voucherController.getVoucherById);
// Lấy voucher đã mua theo username
router.get('/vouchers/purchased/user/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const vouchers = await VoucherModel.find({ 
      ownerUsername: username,
      purchaseType: 'paid'
    });
    res.json(vouchers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Lấy voucher miễn phí đã lưu theo username
router.get('/vouchers/saved/user/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const vouchers = await VoucherModel.find({ 
      ownerUsername: username,
      purchaseType: 'free'
    });
    res.json(vouchers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
