import axios from "axios"

const BASE_URL = import.meta.env.VITE_API_BASE_URL

const authAxios = axios.create({
   baseURL: BASE_URL,
   withCredentials: true,
   headers: {
      "Content-Type": "application/json",
   },
})

const authAuthorized = axios.create({
   baseURL: BASE_URL,
   withCredentials: true
})

authAuthorized.interceptors.request.use(
   (config) => config,
   (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
   failedQueue.forEach((prom) => {
      if (error) prom.reject(error);
      else prom.resolve();
   });
   failedQueue = [];
};

authAuthorized.interceptors.response.use(
   (response) => response,
   async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
         if (isRefreshing) {
            return new Promise((resolve, reject) => {
               failedQueue.push({ resolve, reject });
            }).then(() => authAuthorized(originalRequest));
         }

         originalRequest._retry = true;
         isRefreshing = true;

         try {
            // Call refresh token API (cookies automatically sent)
            await axios.post(
               `${import.meta.env.VITE_API_BASE_URL}/users/refresh-token`,
               {},
               { withCredentials: true }
            );

            processQueue(null);
            return authAuthorized(originalRequest);
         } catch (err) {
            processQueue(err);

            await authAxios.post("/users/logout",
               {},
               { withCredentials: true });

            localStorage.removeItem("persist:root");

            window.location.href = "/signin";
            return Promise.reject(err);
         } finally {
            isRefreshing = false;
         }
      }

      return Promise.reject(error);
   }
);

export { authAxios };
export default authAuthorized;
