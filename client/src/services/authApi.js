import api from "./api";
import { saveToken, removeToken } from "./authService";

export const registerUser = async (userData) => {
  const res = await api.post("/auth/register", userData);

  if (res.data.token) {
    saveToken(res.data.token);
    localStorage.setItem("truthlens_user", JSON.stringify(res.data));
  }

  return res.data;
};

export const loginUser = async (userData) => {
  const res = await api.post("/auth/login", userData);

  if (res.data.token) {
    saveToken(res.data.token);
    localStorage.setItem("truthlens_user", JSON.stringify(res.data));
  }

  return res.data;
};

export const logoutUser = () => {
  removeToken();
  localStorage.removeItem("truthlens_user");
};