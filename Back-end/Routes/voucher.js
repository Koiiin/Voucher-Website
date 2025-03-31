const express = require("express");
const router = express.Router();
const VoucherModel = require("../models/voucher");

// Hàm hỗ trợ truy vấn không phân biệt chữ hoa chữ thường
function caseInsensitiveQuery(optValues) {
  return optValues.map(opt => new RegExp(opt, "i"));
}

// 1️⃣ Lấy danh sách voucher
router.get("/get_v", async (req, res) => {
  try {
    let searchFilter = req.query.searchFilter || "";
    let regex = new RegExp(searchFilter, "i");
    let oSubFilters = {};

    if (req.query.subFilters) {
      try {
        oSubFilters = JSON.parse(req.query.subFilters);
      } catch (error) {
        return res.status(400).json({ error: "Định dạng subFilters không hợp lệ" });
      }
    }

    let oQuery = searchFilter
      ? { $or: [{ title: regex }, { description: regex }, { category: regex }, { voucherType: regex }] }
      : {};

    for (const key in oSubFilters) {
      oQuery[key] = caseInsensitiveQuery(oSubFilters[key]);
    }

    const vouchers = await VoucherModel.find(oQuery).sort("validityEnd");

    if (vouchers.length === 0) {
      return res.json({ message: "Không có voucher nào" });
    }

    res.json(vouchers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2️⃣ Thêm voucher mới
router.post("/add", async (req, res) => {
  try {
    const {
      voucherType, category, voucherPrice, title,
      validityStart, validityEnd, description, ownerID,
      sourceProductID, exchangeType, quantity, currency
    } = req.body;

    if (!voucherType || !category || !title || !validityStart || !validityEnd || !ownerID || !exchangeType || !currency) {
      return res.status(400).json({ error: "Thiếu thông tin bắt buộc" });
    }

    const newVoucher = new VoucherModel({
      voucherType,
      category,
      voucherPrice: Math.max(0, isNaN(Number(voucherPrice)) ? 0 : Number(voucherPrice)),
      title,
      validityStart: isNaN(Date.parse(validityStart)) ? new Date() : new Date(validityStart),
      validityEnd: isNaN(Date.parse(validityEnd)) ? new Date() : new Date(validityEnd),
      description,
      ownerID,
      sourceProductID,
      exchangeType,
      quantity: Math.max(1, isNaN(Number(quantity)) ? 1 : Number(quantity)),
      currency
    });

    console.log("Voucher trước khi lưu:", newVoucher); // Debug

    await newVoucher.save();
    res.json({ message: "Thêm thành công", voucher: newVoucher });
  } catch (error) {
    console.error("Lỗi khi thêm voucher:", error); // Debug lỗi chi tiết
    res.status(400).json({ error: error.message });
  }
});


// 3️⃣ Cập nhật thông tin voucher
router.put("/update/:id", async (req, res) => {
  try {
    const { quantity, voucherPrice, validityEnd } = req.body;

    if (quantity !== undefined && quantity < 0) {
      return res.status(400).json({ error: "Số lượng không hợp lệ" });
    }

    if (voucherPrice !== undefined && voucherPrice < 0) {
      return res.status(400).json({ error: "Giá không hợp lệ" });
    }

    const updatedVoucher = await VoucherModel.findByIdAndUpdate(
      req.params.id,
      { ...req.body, validityEnd: validityEnd ? new Date(validityEnd) : undefined },
      { new: true }
    );

    if (!updatedVoucher) return res.status(404).json({ error: "Voucher không tồn tại" });

    res.json({ message: "Cập nhật thành công", voucher: updatedVoucher });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 4️⃣ Xóa voucher
router.delete("/delete/:id", async (req, res) => {
  try {
    const deletedVoucher = await VoucherModel.findByIdAndDelete(req.params.id);
    if (!deletedVoucher) return res.status(404).json({ error: "Voucher không tồn tại" });

    res.json({ message: "Xóa thành công" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 5️⃣ Giảm số lượng voucher khi có người đổi
router.post("/reduce/:id", async (req, res) => {
  try {
    const voucher = await VoucherModel.findById(req.params.id);
    if (!voucher) return res.status(404).json({ error: "Voucher không tồn tại" });

    if (voucher.quantity <= 0) return res.status(400).json({ error: "Voucher đã hết số lượng" });

    voucher.quantity -= 1;
    await voucher.save();
    
    res.json({ message: "Đổi thành công", voucher });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
