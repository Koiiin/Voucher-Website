const User = require('../models/user');

exports.getAllUser = async (req, res) => {
    try {
        const user = await User.find().select("-password");;
        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json({ message: "Lỗi server ❌", error: error.message });
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if(!user) {
            res.status(404).json({
                message: 'Không tìm thấy người dùng! ❌'
            });
        }
        res.status(200).json({
            message: 'Xóa tài khoản thành công! ✅'
        });
    } 
    catch (error) {
        res.status(500).json({ message: "Lỗi server ❌", error: error.message });
    }
}