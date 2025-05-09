const User = require('../models/user');
const Voucher = require('../models/voucher');

exports.getAllUser = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.status(200).json(users);
    }
    catch (error) {
        res.status(500).json({ message: "Lỗi server ❌", error: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({
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
};

exports.getUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId)
            .select('-password')
            .populate('vouchers') // Populates the vouchers array (if exists)
            .populate('ratings.fromUser', 'username avatarUrl'); // Populates the user who gave the rating
        
        if (!user) return res.status(404).json({ message: 'Không tìm thấy user!' });

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server ❌', error: error.message });
    }
};

exports.updateUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { username, email, bio, avatarUrl } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { username, email, bio, avatarUrl },
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) return res.status(404).json({ message: 'Không tìm thấy user!' });

        res.status(200).json(updatedUser);
    } 
    catch (error) {
        res.status(500).json({ message: 'Lỗi server ❌', error: error.message });
    }
};

exports.getUserVouchers = async (req, res) => {
    try {
        const userId = req.user.id;
        const vouchers = await Voucher.find({ ownerID: userId });

        if (!vouchers) return res.status(404).json({ message: 'Không tìm thấy voucher của người dùng!' });

        res.status(200).json(vouchers);
    } 
    catch (error) {
        res.status(500).json({ message: 'Lỗi server ❌', error: error.message });
    }
};

exports.addVoucherToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { voucherId } = req.body;
    if (!voucherId) {
      return res.status(400).json({ success: false, message: "Thiếu voucherId" });
    }
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "Không tìm thấy user" });
    if (user.vouchers.includes(voucherId)) {
      return res.status(400).json({ success: false, message: "Voucher đã có trong giỏ hàng" });
    }
    user.vouchers.push(voucherId);
    await user.save();
    res.json({ success: true, message: "Đã thêm voucher vào giỏ hàng" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
  }
};
