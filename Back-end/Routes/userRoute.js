const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyTokenOnly, verifyTokenAndAdAuth } = require('../controllers/middlewareController');

// Admin - Public
router.get('/', userController.getAllUser);
router.get('/:id/vouchers', userController.getUserVouchers);
router.delete('/:id', userController.deleteUser);

// User - Private - cần token
router.get('/profile', verifyTokenOnly, userController.getUserProfile);
router.post('/addVoucherToCart', verifyTokenOnly, userController.addVoucherToCart);
router.put('/profile', verifyTokenOnly, userController.updateUserProfile);

module.exports = router;
