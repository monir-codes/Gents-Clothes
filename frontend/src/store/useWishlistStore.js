import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useWishlistStore = create(
  persist(
    (set, get) => ({
      wishlistItems: [],

      toggleWishlist: (product) => {
        const currentItems = get().wishlistItems;
        const existingItem = currentItems.find(item => item._id === product._id);

        if (existingItem) {
          set({ wishlistItems: currentItems.filter(item => item._id !== product._id) });
        } else {
          set({ wishlistItems: [...currentItems, product] });
        }
      },

      isInWishlist: (productId) => {
        return get().wishlistItems.some(item => item._id === productId);
      }
    }),
    {
      name: 'wishlist-storage'
    }
  )
);

export default useWishlistStore;
