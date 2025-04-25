import axios from "axios";

const API_URL = import.meta.env.VITE_APP_API_URL;

export const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      username,
      password,
    });

    // Lưu token và username vào sessionStorage
    sessionStorage.setItem("accessToken", response.data.token);
    sessionStorage.setItem("username", response.data.username);

    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const register = async (username, email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, {
        username,
        email,
        password,
    });
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

export const getToken = () => {
  return sessionStorage.getItem("accessToken");
};
