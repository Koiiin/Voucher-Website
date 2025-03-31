const mongoose = require("mongoose");

const VoucherTransactionSchema = new mongoose.Schema({
    orderID: { type: String, required: true, unique: true },
    buyerID: { type: String, required: true },
    voucherID: { type: String, required: true },
    price: { type: Number, required: true },
    status: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("VoucherTransaction", VoucherTransactionSchema);
