'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface AppSettings {
  appName: string;
  appDescription: string;
  logo: string;
  primaryColor: string;
  language: string;
  allowRegistration: boolean;
  requireApproval: boolean;
  landingTitle: string;
  landingSubtitle: string;
  landingDescription: string;
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  features: string[];
}

interface SettingsContextType {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => Promise<boolean>;
  loading: boolean;
  refreshSettings: () => Promise<void>;
}

const defaultSettings: AppSettings = {
  appName: 'FormBuilder',
  appDescription: 'Platform pembuat form yang mudah dan powerful',
  logo: '/logo.svg',
  primaryColor: '#6366f1',
  language: 'id',
  allowRegistration: true,
  requireApproval: false,
  landingTitle: 'Buat Form Cantik dalam Hitungan Menit',
  landingSubtitle: 'Platform terdepan untuk membuat form interaktif',
  landingDescription: 'Buat form profesional dengan drag-and-drop builder kami. Kumpulkan respons, analisis data, dan bagikan form Anda ke seluruh dunia—tanpa perlu coding.',
  heroTitle: 'Build Beautiful Forms',
  heroSubtitle: 'in Minutes',
  heroDescription: 'Create professional forms with our intuitive drag-and-drop builder. Collect responses, analyze data, and share your forms with the world—all without code.',
  features: [
    'Drag & Drop Form Builder',
    'AI Essay Grading System',
    'Real-time Analytics',
    'Custom Branding',
    'Multi-language Support',
    'Advanced Quiz Features'
  ]
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      if (response.ok) {
        const data = await response.json();
        console.log('SettingsProvider loaded data:', data);
        setSettings({ ...defaultSettings, ...data });
      } else {
        console.log('SettingsProvider: API response not ok, using defaults');
        setSettings(defaultSettings);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      setSettings(defaultSettings);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings: Partial<AppSettings>): Promise<boolean> => {
    try {
      const updatedSettings = { ...settings, ...newSettings };
      console.log('SettingsProvider updateSettings:', updatedSettings);
      
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedSettings),
      });

      if (response.ok) {
        const savedSettings = await response.json();
        console.log('SettingsProvider saved settings:', savedSettings);
        setSettings(savedSettings);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating settings:', error);
      return false;
    }
  };

  const refreshSettings = async () => {
    setLoading(true);
    await loadSettings();
  };

  useEffect(() => {
    loadSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ 
      settings, 
      updateSettings, 
      loading, 
      refreshSettings 
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
