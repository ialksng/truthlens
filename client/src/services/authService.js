export const saveToken = (token) => {
  localStorage.setItem("truthlens_token", token);
};

export const getToken = () => {
  return localStorage.getItem("truthlens_token");
};

export const removeToken = () => {
  localStorage.removeItem("truthlens_token");
};

export const isLoggedIn = () => {
  return !!localStorage.getItem("truthlens_token");
};