const mongoose = require('mongoose');
const Voucher = require('./voucher');

// | Trường           | Mô tả                                        |
// | ---------------- | -------------------------------------------- |
// | `avatarUrl`      | Ảnh đại diện người dùng                      |
// | `bio`            | Tiểu sử                                      |
// | `vouchersPosted` | Số voucher đã đăng                           |
// | `ratings`        | Danh sách đánh giá từ người dùng khác        |
// | `wallet`         | Số dư ví + lịch sử giao dịch                 |
// | `theme`          | giao diện người dùng (light/dark)            |
// | ---------------- | -------------------------------------------- |

const RatingSchema = new mongoose.Schema({
    fromUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    stars: { type: Number, min: 1, max: 5 },
    comment: String,
    createdAt: { type: Date, default: Date.now }
  });
  
  const WalletHistorySchema = new mongoose.Schema({
    amount: Number,
    type: { type: String, enum: ['deposit', 'withdrawal', 'purchase', 'sale'] },
    date: { type: Date, default: Date.now }
  });
  
  const UserSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true,
      unique: true, 
      trim: true,
      minlength: 6,
      maxlength: 20,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      minlength: 8,
      maxlength: 40
    },
    password: {
      type : String,
      required: false,
      minlength: 8,
      maxlength: 30
    },
    admin: {
      type: Boolean,
      default: false
    },
    googleId: {
      type: String,
      unique: true,
      required: false,
      sparse: true
    },
  
    avatarUrl: {
      type: String,
      default: '/default-avatar.png'
    },
    bio: {
      type: String,
      maxlength: 200
    },
  
    vouchersPosted: { type: Number, default: 0 },
    vouchersSold: { type: Number, default: 0 },
    vouchersBought: { type: Number, default: 0 },
  
    // Trường vouchers sẽ tham chiếu đến mô hình Voucher
    vouchers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Voucher' }],
  
    ratings: [RatingSchema],
  
    wallet: {
      balance: { type: Number, default: 0 },
      history: [WalletHistorySchema]
    },
  
    theme: { type: String, enum: ['light', 'dark'], default: 'light' }
  
  }, { timestamps: true });
  
  const User = mongoose.model('User', UserSchema);
  module.exports = User;
