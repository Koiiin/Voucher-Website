// Chương trình này tạo một API cho phép người dùng lưu và lấy lịch sử chat của họ.
// Nó bao gồm các phần sau:
// 1. Khai báo các thư viện cần thiết.
// 2. Tạo một router mới cho API.
// 3. Định nghĩa một route POST để lưu tin nhắn.
// 4. Định nghĩa một route GET để lấy lịch sử chat của một người dùng.
// 5. Xuất router để sử dụng.

const express = require("express");
const ChatHistory = require("../models/ChatHistory");

const router = express.Router();

// Lưu tin nhắn 
router.post("/save", async (req, res) => {
  const { userId, sender, message } = req.body;

  try {
    if (!userId || !sender || !message) {
        return res.status(400).json({ error: "Thiếu thông tin tin nhắn" });
      }

    let chat = await ChatHistory.findOne({ userId });

    if (!chat) {
      chat = new ChatHistory({ userId, messages: [] });
    }

    chat.messages.push({ sender, message });
    await chat.save();

    res.status(200).json({ success: true, chat });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Lấy lịch sử chat của một user
router.get("/:userId", async (req, res) => {
  try {
    const chat = await ChatHistory.findOne({ userId: req.params.userId });
    res.status(200).json(chat || { messages: [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
