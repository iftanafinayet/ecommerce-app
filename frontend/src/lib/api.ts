import axios from "axios";

// Instance ini akan otomatis menggunakan proxy yang ada di vite.config.ts
const API = axios.create({
  baseURL: '/api', 
});

export const api = {
  // --- PRODUCTS ---
  products: {
    getAll: async () => {
      // Gunakan API, bukan axios global. Hapus API_BASE_URL.
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
  },

  // --- ADMIN ---
admin: {
    getSummary: async (token: string) => {
      const { data } = await API.get('/orders/summary', {
        headers: { 
          // WAJIB: Gunakan backticks (`) bukan tanda kutip (') agar ${token} terbaca
          'Authorization': `Bearer ${token}` 
        },
      });
      return data;
    },
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