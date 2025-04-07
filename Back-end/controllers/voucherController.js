const VoucherModel = require('../models/voucher');

// Tạo voucher//T
exports.createVoucher = async (req, res) => {
  try {
    const {title, voucherType, category, validityStart, validityEnd, price, quantity, linkanh} = req.body;
    const ownerID = req.user.id; // Lấy ownerID từ token đã xác thực
    if(!title || !voucherType || !validityStart || !validityEnd || !ownerID) {
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin!' });
    }
    const newVoucher = new VoucherModel({
      title,
      voucherType,
      category,
      validityStart,
      validityEnd,
      ownerID,
      price,
      quantity,
      linkanh
    });
    await newVoucher.save();
    res.status(201).json({ message: 'Tạo voucher thành công!', voucher: newVoucher });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
//T
// Lấy tất cả voucher T
exports.getAllVoucher = async (req, res) => {
  try {
    const vouchers = await VoucherModel.find().sort({ createdAt: -1 });
    res.status(200).json(vouchers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Xóa voucher //T
exports.deleteVoucher = async (req, res) => {
  try {
    const voucher = await VoucherModel.findById(req.params.id);
    if (!voucher) return res.status(404).json({ message: 'Voucher không tồn tại' });
    if (voucher.ownerID.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Bạn không có quyền xóa voucher này' });
    }
    
    await VoucherModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Xóa thành công' });
   
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("loi khi xoa ");
  }
};

// Cập nhật voucher
exports.updateVoucher = async (req, res) => {
  try {
    const updated = await VoucherModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Voucher không tồn tại' });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Tìm kiếm voucher
exports.searchVoucher = async (req, res) => {
  try {
    const keyword = req.query.q;
    const results = await VoucherModel.find({
      $or: [
        { title: new RegExp(keyword, 'i') },
        { voucherType: new RegExp(keyword, 'i') }
      ]
    });
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
