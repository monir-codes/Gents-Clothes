import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      cartItems: [],
      isCartOpen: false,

      // Actions
      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
      
      addToCart: (item) => {
        const { cartItems } = get();
        const existingItem = cartItems.find((x) => x.product === item.product && x.size === item.size && x.color === item.color);
        
        if (existingItem) {
          set({
            cartItems: cartItems.map((x) => 
              (x.product === existingItem.product && x.size === existingItem.size && x.color === existingItem.color) 
              ? { ...x, qty: x.qty + item.qty } 
              : x
            ),
            isCartOpen: true
          });
        } else {
          set({ 
            cartItems: [...cartItems, item],
            isCartOpen: true 
          });
        }
      },

      removeFromCart: (productId, size, color) => {
        const { cartItems } = get();
        set({
          cartItems: cartItems.filter((x) => !(x.product === productId && x.size === size && x.color === color))
        });
      },

      updateQty: (productId, size, color, qty) => {
        const { cartItems } = get();
        set({
          cartItems: cartItems.map((x) => 
            (x.product === productId && x.size === size && x.color === color)
            ? { ...x, qty: qty }
            : x
          )
        });
      },

      clearCart: () => set({ cartItems: [] })
    }),
    {
      name: 'gentsclothes-cart', // local storage key
    }
  )
);

export default useCartStore;
