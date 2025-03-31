const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const voucherSchema = new Schema(
  {
    voucherType: { type: String, required: true, trim: true }, // Loại voucher
    category: { type: String, required: true, trim: true }, // Danh mục
    title: { type: String, required: true, trim: true }, // Tiêu đề
    validityStart: { type: Date, required: true }, // Ngày bắt đầu hiệu lực
    validityEnd: { type: Date, required: true, expires: 0 }, // Ngày hết hạn, tự động xóa khi hết hạn
    description: { type: String }, // Mô tả
    ownerID: { type: String, required: true }, // Chủ sở hữu
    sourceProductID: { type: String, trim: true }, // ID sản phẩm nguồn
    exchangeType: { type: String, required: true }, // Loại trao đổi
    quantity: { type: Number, required: true, default: 1, min: 0 }, // Số lượng (không âm)
    currency: { type: String, required: true }, // Loại tiền tệ
    voucherPrice: { type: Number, required: true, default: 0, min: 0 } // Giá trị voucher (không âm)
  },
  { timestamps: true }
);

const VoucherModel = mongoose.model("Voucher", voucherSchema);
module.exports = VoucherModel;
