import { useFavorites as useStorageFavorites } from '@jigyasu/storage';

export function useFavorites() {
  return useStorageFavorites<string>('campcraft');
}
