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

export const handleFacebookLogin = () => {
  window.location.href = `${API_URL}/auth/facebook`; // Chuyển hướng đến Facebook OAuth
}

// Hàm gọi API có tự động refresh token nếu accessToken hết hạn
export const authRequest = async (config) => {
  try {
    // Gắn accessToken vào header nếu có
    const token = getToken();
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
    // Gọi API
    return await axios({ ...config, baseURL: API_URL, withCredentials: true });
  } catch (error) {
    // Chỉ refresh token khi lỗi 401/403
    if (error.response && (error.response.status === 401 || error.response.status === 403) && !config._retry) {
      config._retry = true;
      try {
        const res = await axios.post(`${API_URL}/auth/refresh`, {}, { withCredentials: true });
        if (res.status === 200 && res.data.accessToken) {
          sessionStorage.setItem("accessToken", res.data.accessToken);
          config.headers = {
            ...config.headers,
            Authorization: `Bearer ${res.data.accessToken}`,
          };
          return await axios({ ...config, baseURL: API_URL, withCredentials: true });
        }
      } catch (refreshError) {
        // Chỉ đăng xuất khi refresh token cũng hết hạn
        sessionStorage.removeItem("accessToken");
        window.location.href = "/login";
      }
    }
    // Các lỗi khác (400, 422, 500...) chỉ throw error, KHÔNG đăng xuất
    throw error;
  }
};
