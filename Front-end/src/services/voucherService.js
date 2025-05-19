import axios from "axios";
import { getToken, authRequest } from "./authService"

const API_URL = import.meta.env.VITE_APP_API_URL; 

// tao voucher

export const createVoucher = async (voucherData) => {
  try {
    const response = await authRequest({
      url: "/createVoucher",
      method: "POST",
      data: voucherData,
    });
    return response.data;  
  } catch (error) {
    console.error("Lỗi tạo voucher:", error);
    throw error;  // Throw error để component có thể catch
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

// Lấy voucher theo platform
export const getVouchersByPlatform = async (platform) => {
  try {
    const response = await axios.get(`${API_URL}/vouchers/getVouchersByPlatform/${platform}`);
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

export const addToCart = async (voucherId, token) => {
  // Thêm kiểm tra
  if (!voucherId) {
    throw new Error("Voucher ID không được để trống!");
  }
  
  try {
    const response = await authRequest({
      url: "/cart/add",
      method: "POST",
      data: { voucherId: voucherId.toString() }, // Chuyển sang chuỗi để đảm bảo
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi thêm vào giỏ hàng:", error);
    throw new Error(
      error.response?.data?.message || "Lỗi kết nối khi thêm vào giỏ hàng!"
    );
  }
};

// Lấy số lượng voucher theo platform
export const getVoucherCountByPlatform = async (platform) => {
  try {
    const response = await axios.get(`${API_URL}/vouchers/getVoucherCountByPlatform/${platform}`);
    if (response.data.success) {
      return response.data.count;
    } else {
      throw new Error("Không thể lấy số lượng voucher!");
    }
  } catch (error) {
    console.error(error);
    throw new Error("Lỗi kết nối đến server!");
  }
};
