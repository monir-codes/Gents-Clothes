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
      otpEmail: null,
      otpRequired: false,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await axios.post('/api/users/login', { email, password });
          if (data.message === 'OTP_SENT') {
            set({ otpEmail: email, otpRequired: true, isLoading: false });
            return 'OTP_REQUIRED';
          }
          set({ user: data, token: data.token, isLoading: false, otpRequired: false });
          return true;
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error.response?.data?.message || 'Login failed' 
          });
          return false;
        }
      },

      googleLogin: async (name, email) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await axios.post('/api/users/google', { name, email });
          set({ user: data, token: data.token, isLoading: false, otpRequired: false });
          return true;
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error.response?.data?.message || 'Google Login failed' 
          });
          return false;
        }
      },

      register: async (name, email, password, phone) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await axios.post('/api/users', { name, email, password, phone });
          if (data.message === 'OTP_SENT') {
            set({ otpEmail: email, otpRequired: true, isLoading: false });
            return 'OTP_REQUIRED';
          }
          set({ isLoading: false });
          return data;
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error.response?.data?.message || 'Registration failed' 
          });
          return false;
        }
      },

      verifyOtp: async (email, otp) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await axios.post('/api/users/verify-otp', { email, otp });
          set({ user: data, token: data.token, isLoading: false, otpRequired: false, otpEmail: null });
          return true;
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error.response?.data?.message || 'OTP Verification failed' 
          });
          return false;
        }
      },

      forgotPassword: async (email) => {
        set({ isLoading: true, error: null });
        try {
          await axios.post('/api/users/forgot-password', { email });
          set({ otpEmail: email, isLoading: false });
          return true;
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error.response?.data?.message || 'Request failed' 
          });
          return false;
        }
      },

      resetPassword: async (email, otp, password) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await axios.post('/api/users/reset-password', { email, otp, password });
          set({ isLoading: false, otpEmail: null });
          return data;
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error.response?.data?.message || 'Reset failed' 
          });
          return false;
        }
      },

      logout: () => set({ user: null, token: null, otpRequired: false, otpEmail: null }),
      
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
      name: 'gentsclothes-auth',
    }
  )
);

export default useAuthStore;
