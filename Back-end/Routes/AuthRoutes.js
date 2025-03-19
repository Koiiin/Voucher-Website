const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();

// Đăng ký tài khoản
router.post("/register", async (req, res) => {
    try {
        const { username, password } = req.body;
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "Tên người dùng đã tồn tại!" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ username, password: hashedPassword });

        res.status(201).json({ message: "Đăng ký thành công!" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server!", error });
    }
});

// Đăng nhập tài khoản
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: "Sai tài khoản hoặc mật khẩu!" });
        }

        res.json({ message: "Đăng nhập thành công!" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server!", error });
    }
});

module.exports = router;
