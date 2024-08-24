'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';

type LanguageContextType = {
  language: string;
  setLanguage: (lang: string) => void;
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'nl',
  setLanguage: () => {},
});

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState('nl');

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);