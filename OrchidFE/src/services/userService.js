import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// User API functions
export const userAPI = {
  // Create user account
  createUser: async (userData) => {
    try {
      const response = await api.post('/user', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Lấy danh sách tất cả user (ADMIN)
  getAllUsers: async (params = {}) => {
    try {
      const token = localStorage.getItem('accessToken');
      const queryParams = new URLSearchParams();
      if (params.page !== undefined) queryParams.append('page', params.page);
      if (params.size !== undefined) queryParams.append('size', params.size);
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortDirection) queryParams.append('sortDirection', params.sortDirection);
      if (params.username) queryParams.append('username', params.username);
      if (params.role) queryParams.append('role', params.role);
      const url = `/user/admin/all${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const response = await api.get(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Cập nhật role user (ADMIN)
  updateUserRole: async (userId, role) => {
    try {
      const token = localStorage.getItem('accessToken');
      const url = `/user/admin/${userId}/role?role=${role}`;
      const response = await api.put(url, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Deactivate user (ADMIN)
  deactivateUser: async (userId) => {
    try {
      const token = localStorage.getItem('accessToken');
      const url = `/user/admin/${userId}/deactivate`;
      const response = await api.put(url, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Reactivate user (ADMIN)
  activateUser: async (userId) => {
    try {
      const token = localStorage.getItem('accessToken');
      const url = `/user/admin/${userId}/activate`;
      const response = await api.put(url, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

// Auth API functions
export const authAPI = {
  // Login to get access token
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/token', credentials);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

// Orchid API functions
export const orchidAPI = {
  // Get available orchids (public)
  getOrchids: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      // Add pagination params
      if (params.page !== undefined) queryParams.append('page', params.page);
      if (params.size !== undefined) queryParams.append('size', params.size);
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortDirection) queryParams.append('sortDirection', params.sortDirection);
      
      // Add filter params
      if (params.name) queryParams.append('name', params.name);
      if (params.isNatural !== undefined) queryParams.append('isNatural', params.isNatural);
      if (params.minPrice !== undefined) queryParams.append('minPrice', params.minPrice);
      if (params.maxPrice !== undefined) queryParams.append('maxPrice', params.maxPrice);
      
      const url = `/orchids${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get orchids for admin/staff
  getOrchidsAdmin: async (params = {}) => {
    try {
      const token = localStorage.getItem('accessToken');
      const queryParams = new URLSearchParams();
      
      // Add pagination params
      if (params.page !== undefined) queryParams.append('page', params.page);
      if (params.size !== undefined) queryParams.append('size', params.size);
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortDirection) queryParams.append('sortDirection', params.sortDirection);
      
      // Add filter params
      if (params.name) queryParams.append('name', params.name);
      if (params.isAvailable !== undefined) queryParams.append('isAvailable', params.isAvailable);
      if (params.isNatural !== undefined) queryParams.append('isNatural', params.isNatural);
      if (params.minPrice !== undefined) queryParams.append('minPrice', params.minPrice);
      if (params.maxPrice !== undefined) queryParams.append('maxPrice', params.maxPrice);
      
      const url = `/orchids/admin${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const response = await api.get(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get orchid by ID
  getOrchidById: async (id) => {
    try {
      const response = await api.get(`/orchids/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create new orchid (admin/staff only)
  createOrchid: async (orchidData) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await api.post('/orchids', orchidData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update orchid (admin/staff only)
  updateOrchid: async (id, orchidData) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await api.put(`/orchids/${id}`, orchidData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete orchid (admin only)
  deleteOrchid: async (id) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await api.delete(`/orchids/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

// Order API functions for USER
export const orderAPI = {
  // Create new order
  createOrder: async (orderData) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await api.post('/orders', orderData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get current user's orders
  getMyOrders: async (params = {}) => {
    try {
      const token = localStorage.getItem('accessToken');
      const queryParams = new URLSearchParams();
      if (params.page !== undefined) queryParams.append('page', params.page);
      if (params.size !== undefined) queryParams.append('size', params.size);
      if (params.status) queryParams.append('status', params.status);
      const url = `/orders/my-orders${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const response = await api.get(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get order by ID (current user)
  getOrderById: async (id) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await api.get(`/orders/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Cancel order (current user)
  cancelOrder: async (id) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await api.put(`/orders/${id}/cancel`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Lấy tất cả đơn hàng (ADMIN/STAFF)
  getAllOrders: async (params = {}) => {
    try {
      const token = localStorage.getItem('accessToken');
      const queryParams = new URLSearchParams();
      if (params.page !== undefined) queryParams.append('page', params.page);
      if (params.size !== undefined) queryParams.append('size', params.size);
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortDirection) queryParams.append('sortDirection', params.sortDirection);
      if (params.userId) queryParams.append('userId', params.userId);
      if (params.status) queryParams.append('status', params.status);
      const url = `/orders/admin${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const response = await api.get(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  // Cập nhật trạng thái đơn hàng (ADMIN/STAFF)
  updateOrderStatus: async (id, status) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await api.put(`/orders/${id}/status?status=${status}`, {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  // Hủy đơn hàng (USER/ADMIN/STAFF)
  cancelOrder: async (id) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await api.put(`/orders/${id}/cancel`, {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  // Lấy chi tiết đơn hàng
  getOrderById: async (id) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await api.get(`/orders/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default api;
