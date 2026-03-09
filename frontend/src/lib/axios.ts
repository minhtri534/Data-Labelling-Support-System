import axios from 'axios';
import { authService } from '../services/authService';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Cấu hình port backend tại đây
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: Array<{ resolve: (value?: unknown) => void; reject: (reason?: any) => void }> = [];

const processQueue = (error: any | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request Interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Nếu lỗi là 401 và không phải là request refresh token
    if (error.response?.status === 401 && originalRequest.url !== '/auth/refresh-token') {
      // Tránh lặp vô hạn nếu refresh token cũng trả về 401
      if (originalRequest._retry) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Nếu đang refresh, thêm request vào queue
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        // Không có refresh token, đăng xuất người dùng
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        const rs = await authService.refreshToken({ refreshToken });
        if (rs.isSuccess && rs.data) {
          localStorage.setItem('accessToken', rs.data.accessToken);
          localStorage.setItem('refreshToken', rs.data.refreshToken);
          api.defaults.headers.common.Authorization = `Bearer ${rs.data.accessToken}`;
          processQueue(null, rs.data.accessToken);
          return api(originalRequest);
        } else {
          // Refresh token thất bại, đăng xuất
          localStorage.clear();
          window.location.href = '/login';
          processQueue(error);
          return Promise.reject(error);
        }
      } catch (_error) {
        // Lỗi khi gọi refresh token API, đăng xuất
        localStorage.clear();
        window.location.href = '/login';
        processQueue(_error);
        return Promise.reject(_error);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
