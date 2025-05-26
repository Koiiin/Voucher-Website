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

// Hàm xóa tất cả voucher
async function deleteAllVouchers() {
  try {
    console.log('🗑️ Đang xóa tất cả voucher cũ...');

    const collections = [
      { name: 'Lazada', model: LazadaVoucher },
      { name: 'Tiki', model: TikiVoucher },
      { name: 'DienMayXanh', model: DienMayXanhVoucher },
      { name: 'NguyenKim', model: NguyenKimVoucher },
      { name: 'Fahasa', model: FahasaVoucher },
      { name: 'Sendo', model: SendoVoucher },
      { name: 'ShopeeFood', model: ShopeeFoodVoucher },
      { name: 'Shopee', model: ShopeeVoucher }
    ];

    for (const collection of collections) {
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        await collection.model.deleteMany({});
        console.log(`✅ Đã xóa voucher từ ${collection.name}`);
      } catch (err) {
        console.error(`❌ Lỗi khi xóa ${collection.name}:`, err.message);
      }
    }

    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      await AllVouchers.deleteMany({});
      console.log('✅ Đã xóa voucher từ collection chính');
    } catch (err) {
      console.error('❌ Lỗi khi xóa collection chính:', err.message);
    }

    console.log('✅ Đã xóa tất cả voucher');
  } catch (err) {
    console.error('❌ Lỗi khi xóa voucher:', err.message);
  }
}

// Hàm chỉ fetch & cập nhật
async function runFetchScheduler() {
  console.log(`🕒 Fetch scheduler chạy lúc ${new Date().toLocaleString()}`);
  try {
    await FetchAndSaveVouchers();
    console.log('✅ Hoàn tất fetch & cập nhật\n');
  } catch (err) {
    console.error('❌ Lỗi khi fetch:', err.message);
  }
}

// Hàm cleanup (xóa dữ liệu) mỗi 24h
async function runCleanupScheduler() {
  console.log(`🕒 Cleanup scheduler chạy lúc ${new Date().toLocaleString()}`);
  try {
    await deleteAllVouchers();
    console.log('✅ Hoàn tất cleanup dữ liệu\n');
  } catch (err) {
    console.error('❌ Lỗi trong cleanup:', err.message);
  }
}

// Hàm khởi động scheduler
async function startVoucherScheduler() {
  // Chỉ fetch dữ liệu mới khi khởi động
  await runFetchScheduler();

  // Chạy fetch mỗi phút
  const fetchInterval = setInterval(runFetchScheduler, 1000 * 60 * 5);
  
  // Chạy cleanup mỗi 24 giờ
  const cleanupInterval = setInterval(runCleanupScheduler, 1000 * 60 * 60 * 24);

  process.on('SIGTERM', () => {
    clearInterval(fetchInterval);
    clearInterval(cleanupInterval);
    console.log('🛑 Đã dừng tất cả scheduler');
  });

  return { fetchInterval, cleanupInterval };
}

module.exports = startVoucherScheduler;
