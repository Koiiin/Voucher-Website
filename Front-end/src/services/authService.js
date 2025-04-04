import axios from "axios";

//const API_URL = "http://localhost:3000/api";

const API_URL = import.meta.env.VITE_APP_API_URL || "http://localhost:3000/api";
export const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      username,
      password,
    });
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
