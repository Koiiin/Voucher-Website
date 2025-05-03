import axios from "axios";

const API_URL = import.meta.env.VITE_APP_API_URL;

// Các hàm xử lý đăng nhập và đăng ký đã có
export const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      username,
      password,
    });
    return response.data;
  } catch (error) {
    // Nếu server trả về lỗi và có response kèm thông điệp
    if (error.response && error.response.data) {
      return error.response.data; // vẫn trả về { success: false, message: "..."}
    }

    // Nếu lỗi không kết nối được đến server hoặc không có phản hồi
    return {
      success: false,
      message: "⚠️ Lỗi kết nối đến server!",
    };
  }
};

export const register = async (username, email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, { username, email, password });
    return response.data;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

export const logout = () => {
  sessionStorage.removeItem("accessToken");
  sessionStorage.removeItem("username");
};

// Hàm chuyển hướng người dùng đến Google OAuth
export const handleGoogleLogin = () => {
  window.location.href = `${API_URL}/auth/google`; // Chuyển hướng đến Google OAuth
};

export const getToken = () => {
  return sessionStorage.getItem("accessToken");
};
