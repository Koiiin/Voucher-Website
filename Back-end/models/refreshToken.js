const mongoose = require("mongoose");

const refreshTokenSchema = new mongoose.Schema({
    token: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    expiresAt: { type: Date, required: true }
});

// Model có tên "RefreshToken"
const refreshToken = mongoose.model("RefreshToken", refreshTokenSchema);

module.exports = refreshToken;