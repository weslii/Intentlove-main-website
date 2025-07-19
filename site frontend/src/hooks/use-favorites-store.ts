import create from 'zustand';
import { persist } from 'zustand/middleware';

interface FavoritesState {
  favorites: string[];
  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>(
  persist(
    (set, get) => ({
      favorites: [],
      addFavorite: (id) => set({ favorites: Array.from(new Set([...get().favorites, id])) }),
      removeFavorite: (id) => set({ favorites: get().favorites.filter(fav => fav !== id) }),
      toggleFavorite: (id) => {
        if (get().favorites.includes(id)) {
          set({ favorites: get().favorites.filter(fav => fav !== id) });
        } else {
          set({ favorites: Array.from(new Set([...get().favorites, id])) });
        }
      },
      isFavorite: (id) => get().favorites.includes(id),
    }),
    { name: 'favorites' }
  )
); 