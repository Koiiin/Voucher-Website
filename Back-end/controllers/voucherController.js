const VoucherModel = require('../models/UserVouchers');
const { AllVouchers } = require('../models/voucher');
const mongoose = require('mongoose');
const User = require('../models/user');

// Tạo voucher//T
exports.createVoucher = async (req, res) => {
  try {
    const { title, voucherType, category, validityStart, validityEnd, price, quantity, minSpend } = req.body;
    const ownerId = req.user.id;

    // Lấy username của user từ DB
    const user = await User.findById(ownerId).select('username');
    if (!user) {
      return res.status(400).json({ success: false, message: 'Không tìm thấy user!' });
    }
    const ownerUsername = user.username;

    if (!title || !voucherType || !validityStart || !validityEnd || !ownerId) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập đầy đủ thông tin!' });
    }
    const newVoucher = new VoucherModel({
      title,
      voucherType,
      category,
      validityStart,
      validityEnd,
      ownerId,
      ownerUsername, // Bổ sung trường này
      price,
      quantity,
      minSpend: minSpend || 0
    });
    await newVoucher.save();
    res.status(201).json({ success: true, voucher: newVoucher });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
//T
//lay tat ca voucher cua nguoi dung c 
exports.getUserVouchers = async (req, res) => {
  try {
    const vouchers = await VoucherModel.find();
    res.status(200).json({ success: true, data: vouchers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}
// Lấy voucher theo ID
exports.getVoucherById = async (req, res) => { 
  try {
    const ownerId = mongoose.Types.ObjectId.isValid(req.params.id) ? new mongoose.Types.ObjectId(req.params.id) : null;
    if (!ownerId) {
      return res.status(400).json({ success: false, message: 'ID không hợp lệ' });
    }
    const vouchers = await VoucherModel.find({ ownerId }); // Đổi từ ownerID -> ownerId
    if (!vouchers || vouchers.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy voucher nào' });   
    }
    res.status(200).json({ success: true, data: vouchers });
  } catch (error) {
    console.error('Error fetching voucher by ID:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi lấy voucher', error: error.message });
  }
};

// Lấy tất cả voucher T
exports.getAllVoucher = async (req, res) => {
  try {
    let vouchers = await AllVouchers.find().limit(100);

    // Sắp xếp theo totalClick giảm dần (totalClick là string, default null)
    vouchers = vouchers.sort((a, b) => {
      const clickA = parseInt(a.totalClick) || 0;
      const clickB = parseInt(b.totalClick) || 0;
      return clickB - clickA;
    });

    console.log(`Found ${vouchers.length} vouchers`); // Log số lượng voucher

    if (!vouchers || vouchers.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        message: 'Không có voucher nào'
      });
    }

    res.status(200).json({
      success: true,
      data: vouchers,
      message: 'Lấy danh sách voucher thành công'
    });
  } catch (error) {
    console.error('Error in getAllVoucher:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy danh sách voucher',
      error: error.message
    });
  }
};


// Xóa voucher //T
exports.deleteVoucher = async (req, res) => {
  try {
    console.log("User:", req.user);
    console.log("Deleting voucher ID:", req.params.id);

    const voucher = await VoucherModel.findById(req.params.id);
    if (!voucher) {
      console.log("Voucher not found");
      return res.status(404).json({ message: 'Voucher không tồn tại' });
    }

    if (voucher.ownerId.toString() !== req.user.id) { // Đổi từ ownerID -> ownerId
      console.log("Not owner. UserID:", req.user.id, "OwnerID:", voucher.ownerId);
      return res.status(403).json({ message: 'Bạn không có quyền xóa voucher này' });
    }

    await VoucherModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Xóa thành công' });
  } catch (error) {
    console.error("Lỗi khi xóa:", error);
    res.status(500).json({ error: error.message });
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
    const keyword = req.query.q || "";
    const category = req.query.category || "";

    const query = {
      $and: [
        {
          $or: [
            { title: new RegExp(keyword, "i") },
            { voucherType: new RegExp(keyword, "i") }
          ]
        }
      ]
    };

    if (category && category !== "all") {
      query.$and.push({ category: new RegExp(category, "i") });
    }

    const results = await VoucherModel.find(query);
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Lấy danh sách category duy nhất từ DB
exports.getCategories = async (req, res) => {
  try {
    const categories = await VoucherModel.distinct("category", { category: { $ne: "" } });
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy danh mục", error: err.message });
  }
};


/*
const Fuse = require('fuse.js');

exports.searchVoucher = async (req, res) => {
  try {
    const keyword = req.query.q;
    const vouchers = await VoucherModel.find(); // lấy hết để lọc bên ngoài

    const fuse = new Fuse(vouchers, {
      keys: ['title', 'voucherType'],
      threshold: 0.4 // càng nhỏ càng chính xác
    });

    const results = keyword ? fuse.search(keyword).map(r => r.item) : vouchers;

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

*/

exports.getValidVouchers = async (req, res) => {
  try {
    const currentDate = new Date();
    const validVouchers = await VoucherModel.find({
      validityStart: { $lte: currentDate },  
      validityEnd: { $gte: currentDate },   
      quantity: { $gt: 0 }                   
    }).select('title voucherType category price quantity linkanh');

    if (!validVouchers.length) {
      return res.status(404).json({ message: 'Không có voucher hợp lệ nào!' });
    }

    res.status(200).json(validVouchers);  // Trả về danh sách voucher hợp lệ
  } catch (error) {
    console.error('Error while fetching valid vouchers:', error);
    res.status(500).json({ error: error.message });
  }
};

// Lấy voucher theo platform
exports.getVouchersByPlatform = async (req, res) => {
  try {
    const platform = req.params.platform;
    let query = {};
    if (platform !== 'all') {
      query = { 'supplier.slug': platform };
    }
    const vouchers = await AllVouchers.find(query)
      .limit(100);

    res.status(200).json({
      success: true,
      data: vouchers,
      message: 'Lấy danh sách voucher thành công'
    });
  } catch (error) {
    console.error('Error in getVouchersByPlatform:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy danh sách voucher',
      error: error.message
    });
  }
};

// API trả về số lượng voucher theo sàn
exports.getVoucherCountByPlatform = async (req, res) => {
  try {
    const platform = req.params.platform;
    let query = {};
    if (platform !== 'all') {
      query = { 'supplier.slug': platform };
    }
    const count = await AllVouchers.countDocuments(query);
    res.json({ success: true, count });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
  }
};