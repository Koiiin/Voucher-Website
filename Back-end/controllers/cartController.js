const Cart = require("../models/cart");
const mongoose = require('mongoose');


exports.addToCart = async (req, res) => {
  const userId = req.user.id;
  const { voucherId } = req.body;

  console.log('req.user:', req.user);
  console.log('req.body:', req.body);
  console.log('userId:', userId);
  console.log('voucherId:', voucherId);

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, vouchers: [{ voucherId: new mongoose.Types.ObjectId(voucherId) }] });
    } else {
      const existingVoucher = cart.vouchers.find(
        (item) => item.voucherId && item.voucherId.toString() === voucherId
      );      

      if (existingVoucher) {
        existingVoucher.quantity += 1;
      } else {
        cart.vouchers.push({ voucherId: new mongoose.Types.ObjectId(voucherId) });
      }
    }

    await cart.save();
    res.status(200).json({ success: true, message: "Đã thêm vào giỏ hàng!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Lỗi server!" });
  }
};

exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("User ID từ token:", userId);
  
    // Lấy giỏ hàng kèm theo thông tin voucher
    const cart = await Cart.findOne({ userId }).populate("vouchers.voucherId");

    if (!cart) {
      return res.status(404).json({ message: "Chưa có giỏ hàng." });
    }

    if (!cart.vouchers || cart.vouchers.length === 0) {
      return res.status(200).json({ message: "Giỏ hàng của bạn hiện tại trống.", cart });
    }

    console.log("Thông tin giỏ hàng:", cart); // Log giỏ hàng để kiểm tra

    res.status(200).json({ 
      success: true,
      message: "Lấy giỏ hàng thành công",
      cart: cart
     });
  } catch (error) {
    console.error("Lỗi khi lấy giỏ hàng:", error); // Log chi tiết lỗi
    res.status(500).json({ message: "Lỗi server khi lấy giỏ hàng.", error: error.message });
  }
};

  
