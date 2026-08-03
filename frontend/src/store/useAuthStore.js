import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await axios.post('/api/users/login', { email, password });
          set({ user: data, token: data.token, isLoading: false });
          return true;
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error.response?.data?.message || 'Login failed' 
          });
          return false;
        }
      },

      register: async (name, email, password) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await axios.post('/api/users', { name, email, password });
          set({ user: data, token: data.token, isLoading: false });
          return true;
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error.response?.data?.message || 'Registration failed' 
          });
          return false;
        }
      },

      logout: () => set({ user: null, token: null }),
      
      clearError: () => set({ error: null })
    }),
    {
      name: 'gentfits-auth',
    }
  )
);

export default useAuthStore;
