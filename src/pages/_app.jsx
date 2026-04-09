import { Syne, Inter } from 'next/font/google';
import { useEffect, useState, createContext } from 'react';
import '../styles/globals.css';

const syne = Syne({ 
  subsets: ['latin'],
  variable: '--font-syne',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const ThemeContext = createContext();

export default function App({ Component, pageProps }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  // 1. Initial Load from LocalStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const savedAuth = localStorage.getItem('isLoggedIn');
    const savedProfile = localStorage.getItem('userProfile');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const defaultProfile = {
      name: '', email: '', phone: '',
      dept: '', semester: '', collegeId: '', course: '',
      skills: [], certificates: [], avatar: null
    };

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
    }
    if (savedAuth === 'true') {
      setIsLoggedIn(true);
    }
    if (savedProfile) {
      setUserProfile({ ...defaultProfile, ...JSON.parse(savedProfile) });
    } else {
      setUserProfile(defaultProfile);
    }
    setIsMounted(true);
  }, []);

  // 2. Reactive Class Management (Theme)
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // 3. Auth & Profile Handlers
  const toggleTheme = () => setIsDarkMode((prev) => !prev);
  
  const login = (profileData = null) => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
    if (profileData) {
      updateProfile(profileData);
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserProfile(null);
    localStorage.setItem('isLoggedIn', 'false');
    localStorage.removeItem('userProfile');
  };

  const updateProfile = (data) => {
    const newProfile = { ...userProfile, ...data };
    setUserProfile(newProfile);
    localStorage.setItem('userProfile', JSON.stringify(newProfile));
  };

  if (!isMounted) return <div className="bg-white dark:bg-[#020617] min-h-screen" />;

  return (
    <ThemeContext.Provider value={{ 
      isDarkMode, toggleTheme, 
      isLoggedIn, login, logout,
      userProfile, updateProfile 
    }}>
      <div className={`${syne.variable} ${inter.variable} font-inter antialiased transition-colors duration-500 min-h-screen bg-white dark:bg-[#020617] text-[#0F172A] dark:text-white`}>
        <Component {...pageProps} />
      </div>
    </ThemeContext.Provider>
  );
}
