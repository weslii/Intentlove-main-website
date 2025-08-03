import create from 'zustand';
import { persist } from 'zustand/middleware';

export type CartItem = {
  productId: string;
  quantity: number;
  customData?: any;
  customLink?: string; // for custom products
};

interface CartState {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>(
  persist(
    (set, get) => ({
      items: [],
      addToCart: (item) => {
        const existing = get().items.find(i => i.productId === item.productId);
        if (existing) {
          set({ items: get().items.map(i => i.productId === item.productId ? { ...i, quantity: i.quantity + item.quantity } : i) });
        } else {
          set({ items: [...get().items, item] });
        }
      },
      removeFromCart: (productId) => set({ items: get().items.filter(i => i.productId !== productId) }),
      updateQuantity: (productId, quantity) => set({ items: get().items.map(i => i.productId === productId ? { ...i, quantity } : i) }),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'cart', // localStorage key
    }
  )
); 