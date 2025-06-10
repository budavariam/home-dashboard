// Theme detection and management utility
export const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
};

export const getStoredTheme = (): 'light' | 'dark' | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('theme') as 'light' | 'dark' | null;
  }
  return null;
};

export const setStoredTheme = (theme: 'light' | 'dark'): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('theme', theme);
  }
};

export const applyTheme = (theme: 'light' | 'dark'): void => {
  if (typeof window !== 'undefined') {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }
};

export const initializeTheme = (): 'light' | 'dark' => {
  const storedTheme = getStoredTheme();
  const systemTheme = getSystemTheme();
  const theme = storedTheme || systemTheme;
  
  applyTheme(theme);
  return theme;
};

// Listen for system theme changes
export const watchSystemTheme = (callback: (theme: 'light' | 'dark') => void): () => void => {
  if (typeof window !== 'undefined') {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      const newTheme = e.matches ? 'dark' : 'light';
      // Only apply if no stored preference
      if (!getStoredTheme()) {
        applyTheme(newTheme);
        callback(newTheme);
      }
    };
    
    mediaQuery.addEventListener('change', handler);
    
    // Return cleanup function
    return () => mediaQuery.removeEventListener('change', handler);
  }
  
  return () => {}; // No-op cleanup for SSR
};