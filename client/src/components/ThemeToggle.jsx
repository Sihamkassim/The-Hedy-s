import { useState, useRef, useEffect } from 'react';
import { Palette, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { theme, setTheme, isDark, setIsDark } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const themes = [
    { id: 'theme-lavender', name: 'Lavender', color: '#774c8d' },
    { id: 'theme-earth', name: 'Earth', color: '#9e6d59' },
    { id: 'theme-green', name: 'Green', color: '#58715c' },
    { id: 'theme-pink', name: 'Pink', color: '#b3035c' },
  ];

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-colors border border-accent bg-base-bg text-base-text hover:opacity-80"
        title="Theme Settings"
      >
        <Palette className="w-4 h-4 text-primary" />
        <span className="hidden sm:inline">Theme</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-base-bg border border-accent rounded-lg shadow-lg overflow-hidden z-50 text-base-text">
          <div className="p-3 border-b border-accent/20 flex justify-between items-center">
            <span className="text-sm font-medium">Dark Mode</span>
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-1 rounded-full bg-accent/10 hover:bg-accent/20 transition-colors"
            >
              {isDark ? <Sun className="w-4 h-4 text-primary" /> : <Moon className="w-4 h-4 text-primary" />}
            </button>
          </div>
          
          <div className="p-2">
            <span className="text-xs font-semibold px-2 text-accent uppercase tracking-wider">Palettes</span>
            <div className="mt-2 space-y-1">
              {themes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setTheme(t.id);
                    setIsOpen(false);
                  }}
                  className={`flex items-center gap-3 w-full px-2 py-2 text-sm rounded-md transition-colors ${
                    theme === t.id ? 'bg-primary/10 font-medium' : 'hover:bg-accent/5'
                  }`}
                >
                  <span
                    className="w-4 h-4 rounded-full border border-base-bg shadow-sm"
                    style={{ backgroundColor: t.color }}
                  />
                  {t.name}
                  {theme === t.id && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
