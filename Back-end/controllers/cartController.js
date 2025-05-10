const Cart = require("../models/cart");
const { AllVouchers } = require("../models/voucher");
const mongoose = require('mongoose');

exports.addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { voucherId } = req.body;

    // Validate voucherId
    if (!voucherId) {
      return res.status(400).json({ 
        success: false, 
        message: "Voucher ID không hợp lệ!" 
      });
    }

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(voucherId)) {
      return res.status(400).json({ 
        success: false, 
        message: "Định dạng Voucher ID không hợp lệ!" 
      });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ 
        userId, 
        vouchers: [{ 
          voucherId: new mongoose.Types.ObjectId(voucherId),
          quantity: 1 
        }] 
      });
    } else {
      const existingVoucher = cart.vouchers.find(
        (item) => item.voucherId && item.voucherId.toString() === voucherId
      );      

      if (existingVoucher) {
        existingVoucher.quantity += 1;
      } else {
        cart.vouchers.push({ 
          voucherId: new mongoose.Types.ObjectId(voucherId),
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
      message: "Lỗi server khi thêm vào giỏ hàng!" 
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

  
