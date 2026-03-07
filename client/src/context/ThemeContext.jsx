import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('app-theme') || 'theme-lavender';
  });
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('app-dark-mode') === 'true';
  });

  useEffect(() => {
    const root = document.documentElement;
    
    // Remove all theme classes
    root.classList.remove('theme-lavender', 'theme-earth', 'theme-green', 'theme-pink');
    
    // Add active theme class
    root.classList.add(theme);
    
    // Toggle dark mode
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    localStorage.setItem('app-theme', theme);
    localStorage.setItem('app-dark-mode', isDark);
  }, [theme, isDark]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDark, setIsDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
