const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const voucherSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },            // Tiêu đề voucher
    voucherType: { type: String, required: true, trim: true },      // Loại voucher (nếu cần phân biệt) / GIẢM GIÁ / QUÀ TẶNG / THẺ QUÀ TẶNG...
    category: { type: String, trim: true },                         // Danh mục (có thể giữ hoặc bỏ luôn nếu không dùng)  MÁY BAY / DU LỊCH 
    validityStart: { type: Date, required: true },                  // Ngày bắt đầu
    validityEnd: { type: Date, required: true, index: { expires: 0 } }, // Ngày kết thúc (tự động xóa)
    ownerID: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Chủ sở hữu
    price: { type: Number, default: 0 },                     // Giá trị voucher (nếu có)
    quantity: { type: Number, default: 1, min: 0 },                 // Số lượng (mặc định là 1)
    linkanh: { type: String, trim: true },                            // Link ảnh voucher
  },
  { timestamps: true }
);

const VoucherModel = mongoose.model("Voucher", voucherSchema);
module.exports = VoucherModel;