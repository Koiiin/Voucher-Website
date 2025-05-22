const mongoose = require('mongoose');

const voucherSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true }, // ID từ API gốc
  title: { type: String, required: true },
  voucherType: { type: String }, // 'percent', 'amount', v.v.
  voucherAmount: { type: Number },
  maxDiscount: { type: Number },
  minSpend: { type: Number },
  voucherCode: { type: String, default: '' },
  startAt: { type: Date },
  expiredAt: { type: Date },
  affLink: { type: String },
  note: { type: String },
  totalClick: { type: String, default: null },
  payment: { type: String, default: null },
  listApplyLink: { type: String, default: '' },
  useLink: { type: String, default: null },
  usageTerms: { type: String, default: null },
  avatar: { type: String, default: null },
  supplier: {
    title: { type: String },
    slug: { type: String }
  },

  voucherCategory: {
    id: { type: Number },
    title: { type: String }
  },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Tạo các model tương ứng từng collection riêng biệt
const ShopeeVoucher = mongoose.model('ShopeeVoucher', voucherSchema, 'shopee_vouchers');
const LazadaVoucher = mongoose.model('LazadaVoucher', voucherSchema, 'lazada_vouchers');
const TikiVoucher = mongoose.model('TikiVoucher', voucherSchema, 'tiki_vouchers');
const DienMayXanhVoucher = mongoose.model('DienMayXanhVoucher', voucherSchema, 'dienmayxanh_vouchers');
const NguyenKimVoucher = mongoose.model('NguyenKimVoucher', voucherSchema, 'nguyenkim_vouchers');
const FahasaVoucher = mongoose.model('FahasaVoucher', voucherSchema, 'fahasa_vouchers');
const SendoVoucher = mongoose.model('SendoVoucher', voucherSchema, 'sendo_vouchers');
const ShopeeFoodVoucher = mongoose.model('ShopeeFoodVoucher', voucherSchema, 'shopeefood_vouchers');
const AllVouchers = mongoose.model('AllVouchers', voucherSchema, 'all_vouchers');
//const User_vouchers = mongoose.model('UserVoucher', voucherSchema, 'user_vouchers');
// Xuất ra để dùng ở nơi khác
module.exports = {
  ShopeeVoucher,
  LazadaVoucher,
  TikiVoucher,
  DienMayXanhVoucher,
  NguyenKimVoucher,
  FahasaVoucher,
  SendoVoucher,
  ShopeeFoodVoucher,
  AllVouchers
};
