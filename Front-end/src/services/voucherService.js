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
    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error("Không thể tạo voucher!");
    }
  } catch (error) {
    console.error("Lỗi tạo voucher:", error);
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

export const addToCart = async (voucherId) => {
  try {
    const response = await authRequest({
      url: "/cart/add",
      method: "POST",
      data: { voucherId },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi thêm vào giỏ hàng:", error);
    throw new Error(
      error.response?.data?.message || "Lỗi kết nối khi thêm vào giỏ hàng!"
    );
  }
};
