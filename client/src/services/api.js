import axios from "axios";

const getBaseUrl = () => {
  if (!import.meta.env.PROD) {
    return "/api";
  }
  const path = window.location.pathname;
  if (path.startsWith("/work/projects/truthlens/app")) {
    return "/work/projects/truthlens/app/api";
  }
  if (path.startsWith("/projects/truthlens")) {
    return "/projects/truthlens/api";
  }
  return "/api";
};

const api = axios.create({
  baseURL: getBaseUrl(),
});

export default api;