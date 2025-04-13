import axios from "axios";

const API_URL = import.meta.env.VITE_APP_API_URL; 

// tao voucher

export const createVoucher = async (voucherData) => {
  try {
    const response = await axios.post(`${API_URL}/createVoucher`, voucherData); 
    if (response.data.success) {
      return response.data.data; 
    } else {
      throw new Error("Không thể tạo voucher!");
    }
  } catch (error) {
    console.error(error);
    throw new Error("Lỗi kết nối đến server!");
  }
};

// lấy voucher 
export const getAllVouchers = async () => {
  try {
    const response = await axios.get(`${API_URL}/getAllVoucher`); 
    if (response.data.success) {
      return response.data.data; 
    } else {
      throw new Error("Không thể tải danh sách voucher!");
    }
  } catch (error) {
    console.error(error);
    throw new Error("Lỗi kết nối đến server!");
  }
};
