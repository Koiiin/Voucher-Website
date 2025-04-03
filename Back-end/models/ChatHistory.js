const mongoose = require("mongoose");

const chatHistorySchema = new mongoose.Schema({
  userId: { type: String, required: true }, // ID của người dùng
  messages: [
    {
      sender: { type: String, enum: ["user", "bot"], required: true }, // Người gửi: user hoặc bot
      message: { type: String, required: true }, // Nội dung tin nhắn
      timestamp: { type: Date, default: Date.now } // Thời gian gửi tin nhắn
    }
  ]
}, { timestamps: true });

const ChatHistory = mongoose.model("ChatHistory", chatHistorySchema);
module.exports = ChatHistory;
