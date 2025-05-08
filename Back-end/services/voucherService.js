const { FetchAndSaveVouchers } = require('./crawler');

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

// Hàm chạy định kỳ
async function runScheduler() {
  console.log(`🕒 Scheduler chạy lúc ${new Date().toLocaleString()}`);

  for (const supplier of suppliers) {
    try {
      console.log(`🔍 Đang lấy dữ liệu từ: ${supplier}`);
      await FetchAndSaveVouchers(supplier);
      console.log(`✅ Hoàn tất: ${supplier}`);
    } catch (err) {
      console.error(`❌ Lỗi khi lấy dữ liệu ${supplier}:`, err.message);
    }
  }

  console.log('✅ Kết thúc chu kỳ\n');
}

// Hàm khởi tạo và chạy scheduler
function startVoucherScheduler() {
  // Gọi lần đầu ngay khi chạy
  runScheduler();

  // Gọi lại mỗi 10 phút = 600000 ms
  const schedulerInterval = setInterval(runScheduler, 1000 * 60 * 1000);

  // Xử lý khi tắt server
  process.on('SIGTERM', () => {
    clearInterval(schedulerInterval);
    console.log('🛑 Đã dừng scheduler');
  });

  return schedulerInterval;
}

// Chỉ export hàm startVoucherScheduler
module.exports = startVoucherScheduler;
