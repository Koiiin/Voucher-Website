const axios = require('axios');
const mongoose = require('mongoose');

// Các model tương ứng với từng supplier
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
    totalClick: Number(v.totalClick) || 0,
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

// Lấy đúng Mongoose model theo supplier
function getVoucherModelBySupplier(supplier) {
  switch (supplier) {
    case 'shopee': return ShopeeVoucher;
    case 'lazada': return LazadaVoucher;
    case 'tiki': return TikiVoucher;
    case 'dien-may-xanh': return DienMayXanhVoucher;
    case 'nguyen-kim': return NguyenKimVoucher;
    case 'fahasa': return FahasaVoucher;
    case 'sendo': return SendoVoucher;
    case 'shopeefood': return ShopeeFoodVoucher;
    default: throw new Error(`Không hỗ trợ supplier: ${supplier}`);
  }
}


async function FetchAndSaveVouchers(supplier) {
	const headers = {
	  'accept': 'application/json, text/plain, */*',
	  'accept-language': 'vi,vi-VN;q=0.9,en-US;q=0.8,en;q=0.7',
	  'authorization': '',
	  'dnt': '1',
	  'origin': 'https://bloggiamgia.vn',
	  'priority': 'u=1, i',
	  'referer': 'https://bloggiamgia.vn/',
	  'sec-ch-ua': '"Chromium";v="134", "Not:A-Brand";v="24", "Google Chrome";v="134"',
	  'sec-ch-ua-mobile': '?0',
	  'sec-ch-ua-platform': '"Windows"',
	  'sec-fetch-dest': 'empty',
	  'sec-fetch-mode': 'cors',
	  'sec-fetch-site': 'cross-site',
	  'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36',
	};
  
	const VoucherModel = getVoucherModelBySupplier(supplier);
	let page = 1;
	const limit = 100; // Số lượng mục trên mỗi trang
	let totalSaved = 0;
  
	while (true) {
	  const url = `https://portal.piggi.vn/api/voucher?sort=totalClick,DESC&slugSupplier=${supplier}&page=${page}&limit=${limit}`;
  
	  try {
		const response = await axios.get(url, { headers });
		const rawData = response.data?.data?.data;
  
		if (!Array.isArray(rawData) || rawData.length === 0) {
		  break; // Không còn dữ liệu để lấy
		}
  
		const data_convert = rawData.map(ConvertVoucher);
  
		for (const v of data_convert) {
		  await VoucherModel.updateOne({ id: v.id }, { $set: v }, { upsert: true });
		  await AllVouchers.updateOne({ id: v.id }, { $set: v }, { upsert: true });
		}
  
		totalSaved += data_convert.length;
		console.log(`✅ Trang ${page}: đã lưu ${data_convert.length} voucher từ ${supplier}`);
  
		page++; // Chuyển sang trang tiếp theo
  
	  } catch (err) {
		console.error(`❌ Lỗi ở trang ${page} từ supplier "${supplier}":`, err.message);
		break;
	  }
	}
  
	console.log(`✅ Tổng cộng đã lưu ${totalSaved} voucher từ ${supplier}`);
}
  

module.exports = { FetchAndSaveVouchers };
