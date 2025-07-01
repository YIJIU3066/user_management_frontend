import axios from "axios";

const API_BASE_URL = "http://localhost:8080";

const instance = axios.create({
  baseURL: API_BASE_URL,
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Error：", error);
    return Promise.reject(error);
  }
);

export default instance;
