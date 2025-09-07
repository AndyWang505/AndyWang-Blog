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
    <div className="inline-flex items-center p-0.5 rounded-3xl bg-orange-200 dark:bg-zinc-600">
      {themes.map((t) => {
        const checked = t === theme;
        return (
          <button
            key={t}
            className={`${
              checked ? 'bg-white text-black' : ''
            } flex cursor-pointer rounded-3xl p-2`}
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {t === 'light' ? <IoSunny className="dark:text-white" /> : <IoMoon />}
          </button>
        );
      })}
    </div>
  ) : (
    <div />
  );
}
