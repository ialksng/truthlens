import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.PROD ? "/work/projects/truthlens/app/api" : "/api",
});

export default api;