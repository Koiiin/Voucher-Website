const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User"); // Đảm bảo bạn đã import model User
const router = express.Router();

router.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin!" });
        }
        // Kiểm tra xem username hoặc email đã tồn tại chưa
        const existingUser = await User.findOne({ username });
        const existingEmail = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: "Tên người dùng đã tồn tại!" });
        }
        if (existingEmail) {
            return res.status(400).json({ message: "Email đã được sử dụng!" });
        }

        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);

        // Tạo người dùng mới
        await User.create({ username, email, password: hashedPassword });

        res.status(201).json({ message: "Đăng ký thành công!" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server!", error });
    }
});
// Đăng nhập tài khoản
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log(username);
        console.log(password);
        const user = await User.findOne({ username });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: "Sai tài khoản hoặc mật khẩu!" });
        }

        res.json({ 
            success: true,
            message: "Đăng nhập thành công!" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server!", error });
    }
});
module.exports = router;
