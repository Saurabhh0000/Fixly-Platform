import axios from "axios";

const fixlyApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // ✅ ENV BASED

  withCredentials: true,
});

/* ================= REQUEST ================= */
fixlyApi.interceptors.request.use(
  (config) => {
    const auth = localStorage.getItem("auth");
    if (auth) {
      config.headers.Authorization = `Basic ${auth}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* ================= RESPONSE ================= */
fixlyApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const currentPath = window.location.pathname;

    // ✅ redirect ONLY if logged in
    const isLoggedIn = localStorage.getItem("user");

    if (
      status === 401 &&
      isLoggedIn &&
      !["/login", "/register"].includes(currentPath)
    ) {
      localStorage.clear();
      window.location.replace("/login"); // prevents back-button bug
    }

    return Promise.reject(error);
  }
);

export default fixlyApi;
