const { FetchAndSaveVouchers } = require('./crawler');
const {
  ShopeeVoucher,
  LazadaVoucher,
  TikiVoucher,
  DienMayXanhVoucher,
  NguyenKimVoucher,
  FahasaVoucher,
  SendoVoucher,
  ShopeeFoodVoucher,
  AllVouchers
} = require('../models/voucher');

const suppliers = [
  'shopee',
  'lazada',
  'tiki',
  'dien-may-xanh',
  'nguyen-kim',
  'fahasa',
  'sendo',
  'shopeefood'
];

// Hàm xóa tất cả voucher
async function deleteAllVouchers() {
  try {
    console.log('🗑️ Đang xóa tất cả voucher cũ...');
    
    // Xóa từ collection chính
    await AllVouchers.deleteMany({});
    console.log('✅ Đã xóa voucher từ collection chính');

    // Xóa từ các collection của từng sàn
    await ShopeeVoucher.deleteMany({});
    await LazadaVoucher.deleteMany({});
    await TikiVoucher.deleteMany({});
    await DienMayXanhVoucher.deleteMany({});
    await NguyenKimVoucher.deleteMany({});
    await FahasaVoucher.deleteMany({});
    await SendoVoucher.deleteMany({});
    await ShopeeFoodVoucher.deleteMany({});
    
    console.log('✅ Đã xóa voucher từ tất cả các sàn');
  } catch (err) {
    console.error('❌ Lỗi khi xóa voucher:', err.message);
  }
}

// Hàm chạy định kỳ
async function runScheduler() {
  console.log(`🕒 Scheduler chạy lúc ${new Date().toLocaleString()}`);

  // Xóa dữ liệu cũ trước khi lấy dữ liệu mới
  await deleteAllVouchers();
  await FetchAndSaveVouchers();

  console.log('✅ Kết thúc chu kỳ\n');
}

// Hàm chạy cleanup định kỳ 24h
async function runCleanupScheduler() {
  console.log(`🕒 Cleanup scheduler chạy lúc ${new Date().toLocaleString()}`);
  
  try {
    // Chạy scheduler (đã bao gồm xóa và lấy lại dữ liệu)
    await runScheduler();
    console.log('✅ Hoàn tất cleanup và cập nhật dữ liệu\n');
  } catch (err) {
    console.error('❌ Lỗi trong quá trình cleanup:', err.message);
  }
}

// Hàm khởi tạo và chạy scheduler
function startVoucherScheduler() {
  // Gọi lần đầu ngay khi chạy
  runScheduler();

  // Gọi lại mỗi 10 phút = 600000 ms
  const schedulerInterval = setInterval(runScheduler, 1000 * 60 * 1000);
  
  // Chạy cleanup mỗi 24 giờ = 86400000 ms
  const cleanupInterval = setInterval(runCleanupScheduler, 1000 * 60 * 60 * 24);

  // Xử lý khi tắt server
  process.on('SIGTERM', () => {
    clearInterval(schedulerInterval);
    clearInterval(cleanupInterval);
    console.log('🛑 Đã dừng tất cả scheduler');
  });

  return { schedulerInterval, cleanupInterval };
}

// Chỉ export hàm startVoucherScheduler
module.exports = startVoucherScheduler;
