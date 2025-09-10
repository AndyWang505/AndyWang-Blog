import React, { useEffect, useState } from 'react';
import { IoSunny, IoMoon } from 'react-icons/io5';

const themes = ['light', 'dark'];

export default function ThemeToggle() {
  const [isMounted, setIsMounted] = useState(false);
  const [theme, setTheme] = useState(() => {
    if (import.meta.env.SSR) {
      return undefined;
    }
    // 使用 inline script 設置的全域變數
    return (window as any).__theme || 'light';
  });

  const toggleTheme = () => {
    const t = theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', t);
    setTheme(t);
  };

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      root.classList.add('dark');
    }
  }, [theme]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted ? (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100/60 dark:hover:bg-gray-800/60 transition-all duration-200 active:scale-95"
    >
      {theme === 'light' ? (
        <IoSunny className="w-5 h-5 text-gray-700 dark:text-gray-300" />
      ) : (
        <IoMoon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
      )}
    </button>
  ) : (
    <div className="w-9 h-9" />
  );
}
