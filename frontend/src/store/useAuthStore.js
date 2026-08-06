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
          // Registration successful, but wait for verification.
          set({ isLoading: false });
          return data; // returns { message: "..." }
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error.response?.data?.message || 'Registration failed' 
          });
          return false;
        }
      },

      logout: () => set({ user: null, token: null }),
      
      updateProfile: async (profileData) => {
        set({ isLoading: true, error: null });
        try {
          const config = {
            headers: {
              Authorization: `Bearer ${get().token}`
            }
          };
          const { data } = await axios.put('/api/users/profile', profileData, config);
          set({ user: data, isLoading: false });
          return true;
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error.response?.data?.message || 'Profile update failed' 
          });
          return false;
        }
      },
      
      clearError: () => set({ error: null })
    }),
    {
      name: 'gentfits-auth',
    }
  )
);

export default useAuthStore;
