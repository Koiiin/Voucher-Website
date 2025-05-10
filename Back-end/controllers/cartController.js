const Cart = require("../models/cart");
const { AllVouchers } = require("../models/voucher");
const mongoose = require('mongoose');

exports.addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    let { voucherId } = req.body;

    // Validate voucherId
    if (!voucherId) {
      return res.status(400).json({ 
        success: false, 
        message: "Voucher ID không hợp lệ!" 
      });
    }

    // Chuẩn hóa voucherId
    voucherId = voucherId.toString().trim();
    
    let voucher;
    
    // Tìm bằng _id (ObjectId) nếu hợp lệ
    if (mongoose.Types.ObjectId.isValid(voucherId)) {
      voucher = await AllVouchers.findById(voucherId);
    }
    
    // Tìm bằng id (số) nếu không tìm thấy bằng _id
    if (!voucher && !isNaN(voucherId)) {
      voucher = await AllVouchers.findOne({ id: Number(voucherId) });
    }

    // Nếu không tìm thấy voucher
    if (!voucher) {
      return res.status(404).json({ 
        success: false, 
        message: "Voucher không tồn tại hoặc đã bị xóa!" 
      });
    }

    // Lấy _id của voucher tìm được
    const voucherObjectId = voucher._id;
    
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ 
        userId, 
        vouchers: [{ 
          voucherId: voucherObjectId,
          quantity: 1 
        }] 
      });
    } else {
      const existingVoucher = cart.vouchers.find(
        (item) => item.voucherId && item.voucherId.toString() === voucherObjectId.toString()
      );      

      if (existingVoucher) {
        existingVoucher.quantity += 1;
      } else {
        cart.vouchers.push({ 
          voucherId: voucherObjectId,
          quantity: 1 
        });
      }
    }

    await cart.save();
    res.status(200).json({ 
      success: true, 
      message: "Đã thêm vào giỏ hàng!" 
    });
  } catch (err) {
    console.error("Lỗi khi thêm vào giỏ hàng:", err);
    res.status(500).json({ 
      success: false, 
      message: "Lỗi server khi thêm vào giỏ hàng!",
      error: err.message // Thêm chi tiết lỗi để debug
    });
  }
};

exports.getCart = async (req, res) => {
  try {
    // Kiểm tra user
    if (!req.user || !req.user.id) {
      return res.status(401).json({ 
        success: false, 
        message: "Vui lòng đăng nhập để xem giỏ hàng!" 
      });
    }

    const userId = req.user.id;
    
    // Lấy giỏ hàng kèm theo thông tin voucher
    const cart = await Cart.findOne({ userId })
      .populate({
        path: 'vouchers.voucherId',
        model: 'AllVouchers'
      });

    if (!cart) {
      return res.status(200).json({ 
        success: true,
        message: "Chưa có giỏ hàng.",
        cart: { vouchers: [] }
      });
    }

    if (!cart.vouchers || cart.vouchers.length === 0) {
      return res.status(200).json({ 
        success: true,
        message: "Giỏ hàng của bạn hiện tại trống.", 
        cart 
      });
    }

    res.status(200).json({ 
      success: true,
      message: "Lấy giỏ hàng thành công",
      cart: cart
    });
  } catch (error) {
    console.error("Lỗi khi lấy giỏ hàng:", error);
    res.status(500).json({ 
      success: false,
      message: "Lỗi server khi lấy giỏ hàng.", 
      error: error.message 
    });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { voucherId } = req.body;

    if (!voucherId) {
      return res.status(400).json({
        success: false,
        message: "Voucher ID không hợp lệ!"
      });
    }

    // Tìm giỏ hàng của user
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy giỏ hàng!"
      });
    }

    // Xóa voucher khỏi giỏ hàng
    const initialLength = cart.vouchers.length;
    cart.vouchers = cart.vouchers.filter(
      item => item.voucherId && item.voucherId.toString() !== voucherId.toString()
    );

    if (cart.vouchers.length === initialLength) {
      return res.status(404).json({
        success: false,
        message: "Voucher không tồn tại trong giỏ hàng!"
      });
    }

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Đã xóa voucher khỏi giỏ hàng!"
    });
  } catch (err) {
    console.error("Lỗi khi xóa khỏi giỏ hàng:", err);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi xóa khỏi giỏ hàng!",
      error: err.message
    });
  }
};

  
