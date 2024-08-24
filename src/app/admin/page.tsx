'use client';

import React, { useState, useEffect } from 'react';
import { createClient, Session, PostgrestResponse } from '@supabase/supabase-js';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import EditedExperienceEditor from '@/components/EditedExperienceEditor';
import ContactInfoEditor from '@/components/ContactInfoEditor';
import TopBar from '@/components/TopBar';
import { supabase } from '@/lib/supabaseClient';

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

const customTheme = {
  ...ThemeSupa,
  colors: {
    ...ThemeSupa.colors,
    brand: 'blue',
    brandAccent: 'darkblue',
  },
};

const AdminPage = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [editedExperiences, setEditedExperiences] = useState<Experience[]>([]);
  const [contactInfo, setContactInfo] = useState<ContactInfo[]>([]);
  const [originalContent, setOriginalContent] = useState<Record<string, Record<string, string>>>({});
  const [editedContent, setEditedContent] = useState<Record<string, Record<string, string>>>({});
  const [activeTab, setActiveTab] = useState('nl');
  const [showNotification, setShowNotification] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: string, session: Session | null) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) {
      fetchExperiences();
      fetchContactInfo();
      fetchContent();
    }
  }, [session]);

  useEffect(() => {
    if (experiences.length > 0) {
      const storedExperiences = localStorage.getItem('editedExperiences');
      if (storedExperiences) {
        setEditedExperiences(JSON.parse(storedExperiences));
      } else {
        setEditedExperiences(experiences);
      }
    }
  }, [experiences]);

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
      setEditedExperiences(formattedExperiences);
    }
  };

  const fetchContactInfo = async () => {
    const { data, error } = await supabase
      .from('contact_info')
      .select('*');
    if (error) console.error('Error fetching contact info:', error);
    else setContactInfo(data as ContactInfo[]);
  };

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
      setOriginalContent(contentObj);
      setEditedContent(contentObj);
    }
  };

  const updateExperience = (id: number, updatedExperience: Partial<Experience>) => {
    setEditedExperiences(prevExperiences => {
      const newExperiences = prevExperiences.map(exp => {
        if (exp.id === id) {
          const updatedExp = {
            ...exp,
            ...updatedExperience,
          };
          for (const key of ['title', 'company', 'period', 'description'] as const) {
            if (updatedExperience[key]) {
              updatedExp[key] = { ...exp[key], ...updatedExperience[key] };
            }
          }
          return updatedExp;
        }
        return exp;
      });
      localStorage.setItem('editedExperiences', JSON.stringify(newExperiences));
      return newExperiences;
    });
  };

  const addExperience = async () => {
    const newExperience: Omit<Experience, 'id'> = {
      title: { nl: 'Nieuwe ervaring', en: 'New Experience' },
      company: { nl: '', en: '' },
      period: { nl: '', en: '' },
      description: { nl: '', en: '' },
      order_index: -1 // This will ensure it's at the top
    };
    
    const { data, error } = await supabase.from('experiences').insert(newExperience).select();
    if (error) {
      console.error('Error adding experience:', error);
    } else if (data && data.length > 0) {
      const updatedExperiences = [data[0] as Experience, ...editedExperiences].map((exp, index) => ({
        ...exp,
        order_index: index
      }));
      setEditedExperiences(updatedExperiences);
    }
  };

  const removeExperience = (id: number) => {
    setEditedExperiences(prevExperiences => prevExperiences.filter(exp => exp.id !== id));
  };

  const updateContactInfo = (id: number, updatedInfo: Partial<ContactInfo>) => {
    setContactInfo(prevInfo =>
      prevInfo.map(info => info.id === id ? { ...info, ...updatedInfo } : info)
    );
  };

  const updateContent = (key: string, language: string, value: string) => {
    setEditedContent(prevContent => ({
      ...prevContent,
      [key]: {
        ...prevContent[key],
        [language]: value
      }
    }));
  };

  const moveExperience = (id: number, direction: 'up' | 'down') => {
    setEditedExperiences(prevExperiences => {
      const index = prevExperiences.findIndex(exp => exp.id === id);
      if (
        (direction === 'up' && index === 0) ||
        (direction === 'down' && index === prevExperiences.length - 1)
      ) {
        return prevExperiences;
      }

      const newExperiences = [...prevExperiences];
      const [movedItem] = newExperiences.splice(index, 1);
      newExperiences.splice(direction === 'up' ? index - 1 : index + 1, 0, movedItem);

      return newExperiences.map((exp, i) => ({ ...exp, order_index: i }));
    });
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const experiencePromises = editedExperiences.map((exp, index) => 
        supabase.from('experiences').upsert({
          id: exp.id,
          title: JSON.stringify(exp.title),
          company: JSON.stringify(exp.company),
          period: JSON.stringify(exp.period),
          description: JSON.stringify(exp.description),
          order_index: index
        })
      );

      const contactInfoPromise = supabase.from('contact_info').upsert(contactInfo);

      // Fetch existing content first
      const { data: existingContent, error: fetchError } = await supabase
        .from('content')
        .select('key, language');

      if (fetchError) throw fetchError;

      const existingEntries = new Set(existingContent.map((item: { key: string; language: string }) => `${item.key}-${item.language}`));

      const contentToUpsert = Object.entries(editedContent).flatMap(([key, langObj]) =>
        Object.entries(langObj).map(([lang, value]) => ({
          key,
          language: lang,
          value
        }))
      );

      const contentPromise = supabase.from('content').upsert(
        contentToUpsert.filter(item => {
          const entryKey = `${item.key}-${item.language}`;
          return !existingEntries.has(entryKey) || item.value !== originalContent[item.key]?.[item.language];
        })
      );

      const results = await Promise.all([...experiencePromises, contactInfoPromise, contentPromise]);

      for (const result of results) {
        if (result.error) {
          throw result.error;
        }
      }

      setExperiences(editedExperiences);
      setEditedExperiences(editedExperiences);
      localStorage.removeItem('editedExperiences');
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    } catch (error) {
      console.error('Error saving changes:', error);
      alert(`Failed to save changes: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <div className="w-full max-w-sm bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: customTheme }}
            providers={[]}
            view="sign_in"
            showLinks={false}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <TopBar userName={session?.user?.email || ''} onSignOut={() => supabase.auth.signOut()} />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Content Management</h1>
        
        <div className="mb-4">
          <button
            className={`mr-2 px-4 py-2 ${activeTab === 'nl' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setActiveTab('nl')}
          >
            Dutch
          </button>
          <button
            className={`px-4 py-2 ${activeTab === 'en' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setActiveTab('en')}
          >
            English
          </button>
        </div>

        <section className="mb-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Introduction</h2>
          <textarea
            className="w-full p-2 border rounded mb-2 text-gray-900"
            value={editedContent.intro?.[activeTab] || ''}
            onChange={(e) => updateContent('intro', activeTab, e.target.value)}
            rows={5}
          />
        </section>

        <section className="mb-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Experiences</h2>
          {editedExperiences.map((exp, index) => (
            <EditedExperienceEditor
              key={exp.id}
              experience={exp}
              index={index}
              updateExperience={updateExperience}
              removeExperience={removeExperience}
              moveExperience={moveExperience}
              activeTab={activeTab}
              isFirst={index === 0}
              isLast={index === editedExperiences.length - 1}
            />
          ))}
          <button
            className="bg-green-500 text-white px-4 py-2 rounded mt-4"
            onClick={addExperience}
          >
            Add Experience
          </button>
        </section>

        <section className="mb-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
          {contactInfo.map((info) => (
            <ContactInfoEditor
              key={info.id}
              contactInfo={info}
              updateContactInfo={updateContactInfo}
            />
          ))}
        </section>

        <div className="flex justify-between items-center">
          <button
            className={`bg-blue-500 text-white px-4 py-2 rounded ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded"
            onClick={() => {
              setEditedContent(originalContent);
              setEditedExperiences(experiences);
              localStorage.removeItem('editedExperiences');
            }}
          >
            Discard Changes
          </button>
        </div>

        {showNotification && (
          <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded">
            Changes saved successfully!
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;