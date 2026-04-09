import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.PROD ? "/projects/truthlens/api" : "/api",
});

export default api;