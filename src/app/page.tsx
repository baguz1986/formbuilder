'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus, FileText, BarChart3, Users, Star, ArrowRight, Check, Building2, Clipboard, FormInput } from 'lucide-react';
import { useSettings } from '@/components/settings-provider';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { settings } = useSettings();

  // Debug: log settings
  useEffect(() => {
    console.log('Homepage settings:', settings);
  }, [settings]);

  useEffect(() => {
    if (session) {
      router.push('/dashboard');
    }
  }, [session, router]);

  const [forms] = useState([
    {
      id: '1',
      title: 'Contact Form',
      description: 'Get in touch with your customers',
      responses: 24,
      createdAt: '2024-01-15',
    },
    {
      id: '2',
      title: 'Feedback Survey',
      description: 'Collect user feedback',
      responses: 12,
      createdAt: '2024-01-10',
    },
    {
      id: '3',
      title: 'Event Registration',
      description: 'Register for upcoming events',
      responses: 48,
      createdAt: '2024-01-08',
    },
  ]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (session) {
    return null; // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center min-w-0 flex-1">
              {settings?.logo && settings.logo !== '/logo.svg' ? (
                <div className="w-8 h-8 sm:w-10 sm:h-10 mr-2 sm:mr-3 rounded-xl overflow-hidden bg-white shadow-md flex-shrink-0">
                  <img 
                    src={settings.logo} 
                    alt={`${settings?.appName || 'FormBuilder'} Logo`}
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-1.5 sm:p-2 mr-2 sm:mr-3 flex-shrink-0">
                  <FileText className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                </div>
              )}
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">{settings?.appName || 'FormBuilder'}</h1>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
              <Link href="/auth/signin">
                <Button variant="ghost" className="text-gray-600 hover:text-gray-900 text-sm sm:text-base px-3 sm:px-4">
                  Masuk
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 text-sm sm:text-base px-3 sm:px-4">
                  Daftar
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            {settings?.heroTitle || 'Build Beautiful Forms'}
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {settings?.heroSubtitle || 'in Minutes'}
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            {settings?.heroDescription || 'Create professional forms with our intuitive drag-and-drop builder. Collect responses, analyze data, and share your forms with the world—all without code.'}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link href="/builder">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg px-8 py-4 shadow-xl hover:shadow-2xl transition-all duration-200 rounded-xl">
                Buat Form Baru
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" size="lg" className="text-lg px-8 py-4 border-2 hover:bg-gray-50 border-gray-200 text-gray-600 rounded-xl">
                Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Semua yang Anda butuhkan untuk membuat form yang luar biasa
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Fitur-fitur canggih yang membantu Anda mengumpulkan data yang lebih baik dan membuat keputusan yang tepat
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-100 hover:border-blue-200">
              <div className="bg-blue-100 rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-center">Drag & Drop Builder</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Buat form secara visual dengan antarmuka drag-and-drop yang intuitif. Tidak perlu kemampuan coding.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-100 hover:border-green-200">
              <div className="bg-green-100 rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <BarChart3 className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-center">Analitik Real-time</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Lacak respons dan analisis data dengan grafik yang indah dan wawasan yang detail.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-100 hover:border-purple-200">
              <div className="bg-purple-100 rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-center">Berbagi Mudah</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Bagikan form Anda melalui link, embed di website, atau integrasikan dengan tools favorit Anda.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              {settings?.logo && settings.logo !== '/logo.svg' ? (
                <div className="w-10 h-10 mr-3 rounded-xl overflow-hidden bg-white shadow-md">
                  <img 
                    src={settings.logo} 
                    alt={`${settings?.appName || 'FormBuilder'} Logo`}
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-2 mr-3">
                  <FileText className="h-6 w-6 text-white" />
                </div>
              )}
              <h3 className="text-xl font-bold text-gray-900">{settings?.appName || 'FormBuilder'}</h3>
            </div>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {settings?.appDescription || 'Platform pembuat form untuk kebutuhan internal perusahaan'}
            </p>
          </div>
          
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600">
            <p>&copy; 2025 {settings?.appName || 'FormBuilder'}. Internal Company Use.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
