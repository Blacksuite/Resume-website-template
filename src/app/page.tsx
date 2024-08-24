'use client';

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from 'framer-motion';
import InteractiveOpening from "@/components/InteractiveOpening";
import ContactButton from "@/components/ContactButton";
import ExperienceItem from "@/components/ExperienceItem";
import { useLanguage } from '@/app/languageContext';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Experience {
  id: number;
  title: { [key: string]: string };
  company: { [key: string]: string };
  period: { [key: string]: string };
  description: { [key: string]: string };
  order_index: number;
}

interface ContactInfo {
  id: number;
  type: string;
  value: string;
  label: string;
}

export default function Home() {
  const [showOpening, setShowOpening] = useState(true);
  const { language, setLanguage } = useLanguage();
  const [content, setContent] = useState<Record<string, Record<string, string>>>({});
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [contactInfo, setContactInfo] = useState<ContactInfo[]>([]);

  useEffect(() => {
    fetchContent();
    fetchExperiences();
    fetchContactInfo();
  }, [language]);

  const fetchContent = async () => {
    const { data, error } = await supabase
      .from('content')
      .select('*');
    if (error) console.error('Error fetching content:', error);
    else {
      const contentObj: Record<string, Record<string, string>> = {};
      data.forEach((item: any) => {
        if (!contentObj[item.key]) contentObj[item.key] = {};
        contentObj[item.key][item.language] = item.value;
      });
      setContent(contentObj);
    }
  };

  const fetchExperiences = async () => {
    const { data, error } = await supabase
      .from('experiences')
      .select('*')
      .order('order_index', { ascending: true });
    if (error) console.error('Error fetching experiences:', error);
    else {
      const formattedExperiences = data.map((exp: any) => ({
        ...exp,
        title: typeof exp.title === 'string' ? JSON.parse(exp.title) : exp.title,
        company: typeof exp.company === 'string' ? JSON.parse(exp.company) : exp.company,
        period: typeof exp.period === 'string' ? JSON.parse(exp.period) : exp.period,
        description: typeof exp.description === 'string' ? JSON.parse(exp.description) : exp.description,
      }));
      setExperiences(formattedExperiences);
    }
  };

  const fetchContactInfo = async () => {
    const { data, error } = await supabase
      .from('contact_info')
      .select('*');
    if (error) console.error('Error fetching contact info:', error);
    else setContactInfo(data as ContactInfo[]);
  };

  const handleOpeningComplete = (selectedLanguage: string) => {
    setLanguage(selectedLanguage);
    setShowOpening(false);
  };

  const currentContent = {
    title: "John Doe",
    subtitle: "Example Expertise",
    intro: content.intro?.[language] || '',
    experience: language === 'nl' ? "Ervaring" : "Experience",
    personalCharacteristics: language === 'nl' ? "Persoonlijke kenmerken" : "Personal Characteristics",
    languages: language === 'nl' ? "Talen" : "Languages",
    contact: language === 'nl' ? "Contact" : "Contact",
    characteristicsList: language === 'nl' ? ["Enthousiast", "Sociaal", "Leergierig"] : ["Enthusiastic", "Social", "Eager to learn"],
    languagesList: language === 'nl' ? ["Nederlands", "Engels"] : ["Dutch", "English"]
  };

  return (
    <div className="relative w-full min-h-screen bg-[#f5f5f5]">
      <InteractiveOpening onComplete={handleOpeningComplete} showSplash={false} />
      <AnimatePresence>
        {!showOpening && (
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <div className="container mx-auto px-4 py-12 max-w-4xl">
              <div className="bg-white shadow-xl rounded-lg overflow-hidden">
                <header className="bg-gray-800 text-white p-6">
                  <div className="flex items-center justify-between flex-col md:flex-row">
                    <div className="md:mr-6 mb-4 md:mb-0">
                      <Image
                        src={`/profile.jpg?v=${new Date().getTime()}`}
                        alt="Lars Honing"
                        width={150}
                        height={150}
                        className="rounded-full border-4 border-white shadow-lg"
                        unoptimized
                      />
                    </div>
                    <div className="text-center md:text-left">
                      <h1 className="text-3xl font-bold mb-2">{currentContent.title}</h1>
                      <p className="text-xl text-gray-300">{currentContent.subtitle}</p>
                    </div>
                  </div>
                </header>

                <section className="p-6 bg-white">
                  <p className="text-gray-700">{content.intro?.[language] || ''}</p>
                </section>

                <section className="p-6 bg-gray-100">
                  <h2 className="text-2xl font-bold mb-4 text-gray-800">{content.experience?.[language] || ''}</h2>
                  <div className="space-y-4">
                    {experiences.map((item: Experience) => (
                      <ExperienceItem 
                        key={item.id}
                        title={item.title[language] || ''}
                        company={item.company[language] || ''}
                        period={item.period[language] || ''}
                        description={item.description[language] || ''}
                      />
                    ))}
                  </div>
                </section>

                <div className="md:flex">
                  <section className="p-6 border-b md:border-b-0 md:border-r border-gray-300 md:w-1/2">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">{currentContent.personalCharacteristics}</h2>
                    <ul className="list-disc list-inside text-gray-700">
                      {currentContent.characteristicsList.map((characteristic, index) => (
                        <li key={index}>{characteristic}</li>
                      ))}
                    </ul>
                  </section>

                  <section className="p-6 md:w-1/2">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">{currentContent.languages}</h2>
                    <ul className="list-disc list-inside text-gray-700">
                      {currentContent.languagesList.map((language, index) => (
                        <li key={index}>{language}</li>
                      ))}
                    </ul>
                  </section>
                </div>

                <section className="p-6 bg-gray-300">
                  <h2 className="text-2xl font-bold mb-8 text-gray-800 text-center">{currentContent.contact}</h2>
                  <div className="flex flex-col items-center gap-8 max-w-md mx-auto">
                    {contactInfo.filter(item => item.type === 'phone').map((item: ContactInfo) => (
                      <ContactButton 
                        key={item.id} 
                        phoneNumber={item.value} 
                        className="w-48 py-3 text-lg bg-blue-500 hover:bg-blue-600" 
                      />
                    ))}
                    <div className="flex justify-between w-full">
                      {contactInfo.filter(item => item.type !== 'phone').sort((a, b) => {
                        const order = ['calendly', 'linkedin', 'email'];
                        return order.indexOf(a.type) - order.indexOf(b.type);
                      }).map((item: ContactInfo) => (
                        <a
                          key={item.id}
                          href={item.type === 'email' ? `mailto:${item.value}` : item.value}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 text-center text-sm flex items-center justify-center"
                          style={{ width: '30%' }}
                        >
                          {item.label}
                        </a>
                      ))}
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}