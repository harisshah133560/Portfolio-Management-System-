import { createContext, useContext, useState, useEffect } from 'react';

var ThemeContext = createContext(null);

export function ThemeProvider(props) {
  var children = props.children;

  var themeState = useState(function () {
    var saved = localStorage.getItem('ph_theme');
    if (saved === 'light') return 'light';
    return 'dark';
  });
  var theme = themeState[0];
  var setTheme = themeState[1];

  useEffect(function () {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('ph_theme', theme);
  }, [theme]);

  var toggleTheme = function () {
    setTheme(function (prev) { return prev === 'dark' ? 'light' : 'dark'; });
  };

  return (
    <ThemeContext.Provider value={{ theme: theme, toggleTheme: toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  var context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}

export default ThemeContext;