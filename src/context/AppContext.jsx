import { createContext, useContext } from 'react';

// Global context for app state
export const AppContext = createContext(null);

export function useApp() {
  return useContext(AppContext);
}
