import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../app/languageContext';

interface InteractiveOpeningProps {
  onComplete: (selectedLanguage: string) => void;
  showSplash?: boolean; // Add this prop to control splash screen visibility
}

const InteractiveOpening: React.FC<InteractiveOpeningProps> = ({ onComplete, showSplash = true }) => {
  const [stage, setStage] = useState(0);
  const { language, setLanguage } = useLanguage();

  const handleLanguageSelect = (selectedLanguage: string) => {
    setLanguage(selectedLanguage);
    if (showSplash) {
      setStage(1);
    } else {
      onComplete(selectedLanguage);
    }
  };

  const welcomeText = {
    nl: "Welkom bij mijn CV, deze website is volledig gemaakt met AI. Ik heb ZERO coding skills. Dat telt vast ook als een skill ;)",
    en: "Welcome to my resume, this website is fully made with AI. I have ZERO coding skills. That should also count as a skill ;)"
  };

  useEffect(() => {
    if (stage === 1) {
      const timer = setTimeout(() => {
        setStage(2);
      }, 4200); // Display welcome message for 1 second

      return () => clearTimeout(timer);
    }
  }, [stage]);

  useEffect(() => {
    if (stage === 2) {
      onComplete(language);
    }
  }, [stage, language, onComplete]);

  return (
    <AnimatePresence>
      {stage < 2 && (
        <motion.div
          className="fixed inset-0 bg-white flex items-center justify-center"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center">
            {stage === 0 && (
              <motion.div
                className="flex flex-col items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-2xl font-bold text-blue-600 mb-4">Select your language / Kies je taal</h2>
                <div className="flex justify-center mt-4">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4"
                    onClick={() => handleLanguageSelect('nl')}
                  >
                    Nederlands
                  </button>
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => handleLanguageSelect('en')}
                  >
                    English
                  </button>
                </div>
              </motion.div>
            )}
            {stage === 1 && showSplash && (
              <motion.h2
                className="text-2xl font-bold text-blue-600 mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                {welcomeText[language as keyof typeof welcomeText]}
              </motion.h2>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InteractiveOpening;