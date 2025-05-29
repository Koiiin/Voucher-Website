const mongoose = require("mongoose");

const VoucherTransactionSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  transactionId: { type: String }, // ID giao dịch từ MoMo
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  voucherId: { type: mongoose.Schema.Types.ObjectId, ref: "UserVoucher" },
  amount: { type: Number, required: true },
  status: {
    type: String,
    enum: ["pending", "completed", "failed", "canceled"],
    default: "pending",
  },
  paymentMethod: { type: String, default: "momo" },
  paymentTime: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("VoucherTransaction", VoucherTransactionSchema);
