const axios = require('axios');
const { AllVouchers } = require('../models/voucher');

// Map dữ liệu từ API sang schema Mongoose
function ConvertVoucher(v) {
  return {
    id: v.id,
    title: v.title,
    voucherType: v.voucherType,
    voucherAmount: v.voucherAmount,
    maxDiscount: v.maxDiscount,
    minSpend: Number(v.minSpend) || 0,
    voucherCode: v.voucherCode || '',
    startAt: v.startAt,
    expiredAt: v.expiredAt,
    affLink: v.affLink,
    note: v.note,
    totalClick: Number(v.totalClick) || 0, // Convert string/null -> number
    payment: v.payment || null,
    listApplyLink: v.listApplyLink || '',
    useLink: v.useLink || null,
    usageTerms: v.usageTerms || null,
    supplier: {
      title: v.supplier?.title,
      slug: v.supplier?.slug
    },
    voucherCategory: {
      id: v.voucherCategory?.id,
      title: v.voucherCategory?.title
    },
    createdAt: v.createdAt || new Date(),
    updatedAt: new Date()
  };
}

const SUPPLIERS = [
  'shopee', 'lazada', 'tiki', 'dien-may-xanh',
  'nguyen-kim', 'fahasa', 'sendo', 'shopeefood'
];

const headers = {
  'accept': 'application/json, text/plain, */*',
  'accept-language': 'vi,vi-VN;q=0.9,en-US;q=0.8,en;q=0.7',
  'authorization': '',
  'origin': 'https://bloggiamgia.vn',
  'referer': 'https://bloggiamgia.vn/',
  'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)...',
  'sec-fetch-mode': 'cors'
};

async function FetchAndSaveVouchers() {
  let allVouchers = [];

  for (const supplier of SUPPLIERS) {
    let page = 1;
    const limit = 100;

    while (true) {
      const url = `https://portal.piggi.vn/api/voucher?sort=totalClick,DESC&slugSupplier=${supplier}&page=${page}&limit=${limit}`;
      try {
        const response = await axios.get(url, { headers });
        const rawData = response.data?.data?.data;

        if (!Array.isArray(rawData) || rawData.length === 0) break;

        const converted = rawData.map(ConvertVoucher);
        allVouchers.push(...converted);

        console.log(`✅ Fetched ${converted.length} from ${supplier}, page ${page}`);
        page++;

      } catch (err) {
        console.error(`❌ Error fetching from ${supplier}, page ${page}:`, err.message);
        break;
      }
    }
  }

  // Sort tổng hợp theo totalClick (giảm dần)
  allVouchers.sort((a, b) => b.totalClick - a.totalClick);

  // Lưu vào collection AllVouchers
  let savedCount = 0;
  for (const v of allVouchers) {
    await AllVouchers.updateOne({ id: v.id }, { $set: v }, { upsert: true });
    savedCount++;
  }
}

module.exports = { FetchAndSaveVouchers };
