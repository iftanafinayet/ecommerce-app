import axios from "axios";

const API_BASE_URL = '/api';

export const api = {
  // --- PRODUCTS ---
  products: {
    getAll: async () => {
      const { data } = await axios.get(`${API_BASE_URL}/products`);
      return data;
    },
    getById: async (id: string) => {
      const { data } = await axios.get(`${API_BASE_URL}/products/${id}`);
      return data;
    },
    create: async (productData: any, token: string) => {
      const { data } = await axios.post(`${API_BASE_URL}/products`, productData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    },
    update: async (id: string, productData: any, token: string) => {
      const { data } = await axios.put(`${API_BASE_URL}/products/${id}`, productData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    },
    delete: async (id: string, token: string) => {
      const { data } = await axios.delete(`${API_BASE_URL}/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    },
  },

  // --- USERS ---
  users: {
    login: async (email: string, password: string) => {
      const { data } = await axios.post(`${API_BASE_URL}/users/login`, { email, password });
      return data;
    },
    register: async (name: string, email: string, password: string) => {
      const { data } = await axios.post(`${API_BASE_URL}/users`, { name, email, password });
      return data;
    },
    getProfile: async (token: string) => {
      const { data } = await axios.get(`${API_BASE_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    },
  },

  // --- ORDERS ---
  orders: {
    create: async (orderData: any, token: string) => {
      const { data } = await axios.post(`${API_BASE_URL}/orders`, orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    },
getMyOrders: async (token: string) => {
      // COBA GANTI /mine MENJADI /myorders JIKA 404
      const { data } = await axios.get(`${API_BASE_URL}/orders/myorders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    },
    getOrderDetails: async (id: string, token: string) => {
      const { data } = await axios.get(`${API_BASE_URL}/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    },
    getOrderProgress: async (id: string, token: string) => {
      const { data } = await axios.get(`${API_BASE_URL}/orders/${id}/progress`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    },
    getAllOrders: async (token: string) => {
      const { data } = await axios.get(`${API_BASE_URL}/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    },
    updateToDelivered: async (id: string, token: string) => {
      const { data } = await axios.put(`${API_BASE_URL}/orders/${id}/deliver`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    },
    deleteOrder: async (id: string, token: string) => {
      const { data } = await axios.delete(`${API_BASE_URL}/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    },
  },
};