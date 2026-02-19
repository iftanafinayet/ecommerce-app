import axios from "axios";

// 1. Definisikan URL Backend secara eksplisit agar tidak tertukar dengan port Vite (5173)
const BASE_URL = "http://localhost:5000";

const API = axios.create({
  baseURL: `${BASE_URL}/api`, 
});

// Helper untuk mengambil URL Gambar dari folder uploads
export const getImageUrl = (path: string) => {
  if (!path) return "https://placehold.co/100x100?text=No+Image";
  // Jika path sudah berupa URL (cloudinary/internet), langsung kembalikan
  if (path.startsWith('http')) return path;
  // Jika path lokal, gabungkan dengan URL Backend (Pastikan path diawali /)
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${BASE_URL}${cleanPath}`;
};

export const api = {
  // --- PRODUCTS ---
  products: {
    getAll: async () => {
      const { data } = await API.get(`/products`);
      return data;
    },
    getById: async (id: string) => {
      const { data } = await API.get(`/products/${id}`);
      return data;
    },
    create: async (productData: any, token: string) => {
      const { data } = await API.post(`/products`, productData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    },
    update: async (id: string, productData: any, token: string) => {
      const { data } = await API.put(`/products/${id}`, productData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    },
    delete: async (id: string, token: string) => {
      const { data } = await API.delete(`/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    },
  },

  // --- USERS ---
  users: {
    login: async (email: string, password: string) => {
      const { data } = await API.post(`/users/login`, { email, password });
      return data;
    },
    register: async (name: string, email: string, password: string) => {
      const { data } = await API.post(`/users`, { name, email, password });
      return data;
    },
    getProfile: async (token: string) => {
      const { data } = await API.get(`/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    },
    updateProfile: async (userData: any, token: string) => {
      const { data } = await API.put(`/users/profile`, userData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    },
  },

  // --- ADMIN ---
  admin: {
  getSummary: async (token: string) => {
    const response = await axios.get(`${BASE_URL}/api/orders/summary`, { // Pastikan /orders/summary
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
},

  // --- ORDERS ---
  orders: {
    create: async (orderData: any, token: string) => {
      const { data } = await API.post(`/orders`, orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    },
    getMyOrders: async (token: string) => {
      const { data } = await API.get(`/orders/myorders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    },
    getOrderDetails: async (id: string, token: string) => {
      const { data } = await API.get(`/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    },
    getAllOrders: async (token: string) => {
      const { data } = await API.get(`/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    },
    updateToDelivered: async (id: string, token: string) => {
      const { data } = await API.put(`/orders/${id}/deliver`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    },
    deleteOrder: async (id: string, token: string) => {
      const { data } = await API.delete(`/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    },
    
  },
};