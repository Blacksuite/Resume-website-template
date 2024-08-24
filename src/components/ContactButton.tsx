'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/app/languageContext';

interface ContactButtonProps {
  phoneNumber: string;
  className?: string;
}

const ContactButton: React.FC<ContactButtonProps> = ({ phoneNumber, className }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { language } = useLanguage();

  const buttonText = language === 'nl' ? 'Bel mij' : 'Call me';

  return (
    <motion.button
      onClick={() => window.location.href = `tel:${phoneNumber}`}
      className={`bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-full transition duration-300 ${className}`}
      whileHover={{ scale: 1.05, backgroundColor: '#2563eb' }}
      whileTap={{ scale: 0.95 }}
    >
      {buttonText}
    </motion.button>
  );
};

export default ContactButton;