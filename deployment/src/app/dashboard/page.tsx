'use client';

import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSettings } from '@/components/settings-provider';
import { DynamicHead } from '@/components/dynamic-head';
import { 
  Plus, 
  FileText, 
  BarChart3, 
  Users, 
  Eye, 
  Edit3, 
  Trash2, 
  Search,
  Filter,
  MoreHorizontal,
  Calendar,
  TrendingUp,
  Activity,
  Globe,
  Settings,
  LogOut,
  User,
  Play,
  Pause,
  Share,
  Shield,
  Link2
} from 'lucide-react';

interface Form {
  id: string;
  title: string;
  description: string;
  isPublished: boolean;
  views: number;
  createdAt: string;
  updatedAt: string;
  _count: {
    submissions: number;
  };
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const { settings, loading: settingsLoading } = useSettings();
  const router = useRouter();
  const [forms, setForms] = useState<Form[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showSettings, setShowSettings] = useState(false);
  const [selectedForm, setSelectedForm] = useState<Form | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated') {
      fetchForms();
    }
  }, [status, router]);

  const fetchForms = async () => {
    try {
      console.log('Fetching forms...');
      
      // Add timeout to fetch request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch('/api/forms', {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Forms data:', data);
        setForms(data);
      } else {
        const errorData = await response.text();
        console.error('API Error:', response.status, errorData);
        alert(`Error loading forms: ${response.status} ${errorData}`);
      }
    } catch (error) {
      console.error('Error fetching forms:', error);
      if (error instanceof Error && error.name === 'AbortError') {
        alert('Request timeout: Server is taking too long to respond');
      } else {
        alert('Network error: Unable to load forms. Please check your connection.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const copyFormLink = async (formId: string) => {
    const formUrl = `${window.location.origin}/form/${formId}`;
    try {
      await navigator.clipboard.writeText(formUrl);
      alert('Link form berhasil disalin!');
    } catch (error) {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = formUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Link form berhasil disalin!');
    }
  };

  const deleteForm = async (formId: string) => {
    if (confirm('Are you sure you want to delete this form?')) {
      try {
        const response = await fetch(`/api/forms/${formId}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setForms(forms.filter(form => form.id !== formId));
        }
      } catch (error) {
        console.error('Error deleting form:', error);
      }
    }
  };

  const togglePublish = async (formId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/forms/${formId}/publish`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isPublished: !currentStatus }),
      });
      
      if (response.ok) {
        setForms(forms.map(form => 
          form.id === formId 
            ? { ...form, isPublished: !currentStatus }
            : form
        ));
      }
    } catch (error) {
      console.error('Error updating form status:', error);
    }
  };

  const openFormSettings = (form: Form) => {
    setSelectedForm(form);
    setShowSettings(true);
  };

  const filteredForms = forms.filter(form => {
    const matchesSearch = form.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         form.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' ||
                         (filterStatus === 'published' && form.isPublished) ||
                         (filterStatus === 'draft' && !form.isPublished);
    return matchesSearch && matchesFilter;
  });

  const totalResponses = forms.reduce((sum, form) => sum + form._count.submissions, 0);
  const totalViews = forms.reduce((sum, form) => sum + form.views, 0);
  const publishedForms = forms.filter(form => form.isPublished).length;

  // Use default settings if settings are still loading
  const currentSettings = settings || {
    appName: 'FormBuilder',
    primaryColor: '#6366f1',
    logo: '/logo.svg'
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading session...</p>
        </div>
      </div>
    );
  }

  if (isLoading && status === 'authenticated') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <DynamicHead title="Dashboard" description="Manage your forms and view analytics" />
      
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center min-w-0 flex-1">
              <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-xl p-1.5 sm:p-2 mr-2 sm:mr-3 shadow-lg flex-shrink-0" style={{ backgroundColor: currentSettings?.primaryColor || '#6366f1' }}>
                {currentSettings?.logo && currentSettings.logo !== '/logo.svg' ? (
                  <img 
                    src={currentSettings.logo} 
                    alt="Logo" 
                    className="h-4 w-4 sm:h-6 sm:w-6 object-contain"
                  />
                ) : (
                  <FileText className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent truncate">
                  {currentSettings?.appName || 'FormBuilder'}
                </h1>
                <div className="flex items-center flex-wrap gap-1 sm:gap-2">
                  <p className="text-xs sm:text-sm text-gray-500 truncate">
                    Halo, {session.user?.name}
                  </p>
                  <span className="px-2 py-0.5 sm:py-1 bg-blue-100 text-blue-800 text-xs rounded-full flex-shrink-0">
                    {(session.user as any)?.role === 'super_admin' ? 'Super Admin' :
                     (session.user as any)?.role === 'admin' ? 'Admin' : 'User'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
              <Link href="/builder">
                <Button 
                  className="text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl text-sm sm:text-base px-3 sm:px-4"
                  style={{ 
                    backgroundColor: currentSettings?.primaryColor || '#6366f1',
                    borderColor: currentSettings?.primaryColor || '#6366f1'
                  }}
                >
                  <Plus className="w-4 h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Buat Form</span>
                  <span className="sm:hidden">Buat</span>
                </Button>
              </Link>
              
              <Link href="/access-info">
                <Button variant="ghost" size="sm" className="hover:bg-white/50 rounded-xl text-xs px-2 sm:px-3">
                  <Shield className="w-4 h-4 sm:mr-1" />
                  <span className="hidden sm:inline">Info</span>
                </Button>
              </Link>
              
              <div className="relative">
                <Link href="/settings">
                  <Button variant="ghost" size="sm" className="w-8 h-8 p-0 hover:bg-white/50 rounded-xl">
                    <Settings className="w-4 h-4 text-gray-600" />
                  </Button>
                </Link>
              </div>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => signOut()}
                className="text-gray-600 hover:text-gray-900 hover:bg-white/50 rounded-xl"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-white/20 hover:scale-105">
            <div className="flex items-center">
              <div 
                className="rounded-xl p-3 shadow-lg"
                style={{ backgroundColor: currentSettings?.primaryColor || '#6366f1' }}
              >
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">{forms.length}</div>
                <div className="text-sm text-gray-600 font-medium">Total Form</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-white/20 hover:scale-105">
            <div className="flex items-center">
              <div 
                className="rounded-xl p-3 shadow-lg"
                style={{ backgroundColor: currentSettings?.primaryColor || '#6366f1' }}
              >
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">{totalResponses}</div>
                <div className="text-sm text-gray-600 font-medium">Total Respons</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-white/20 hover:scale-105">
            <div className="flex items-center">
              <div 
                className="rounded-xl p-3 shadow-lg"
                style={{ backgroundColor: currentSettings?.primaryColor || '#6366f1' }}
              >
                <Eye className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">{totalViews}</div>
                <div className="text-sm text-gray-600 font-medium">Total Tampilan</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-white/20 hover:scale-105">
            <div className="flex items-center">
              <div 
                className="rounded-xl p-3 shadow-lg"
                style={{ backgroundColor: currentSettings?.primaryColor || '#6366f1' }}
              >
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-800 bg-clip-text text-transparent">{publishedForms}</div>
                <div className="text-sm text-gray-600 font-medium">Terpublikasi</div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Cari form..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/50 border-white/20 focus:border-blue-300 rounded-xl"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="h-10 px-3 py-2 border border-white/20 rounded-xl bg-white/50 backdrop-blur-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all duration-200"
              >
                <option value="all">Semua Form</option>
                <option value="published">Terpublikasi</option>
                <option value="draft">Draft</option>
              </select>
              
              <Button variant="outline" size="sm" className="border-white/20 bg-white/50 hover:bg-white/70 rounded-xl backdrop-blur-sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter Lainnya
              </Button>
            </div>
          </div>
        </div>

        {/* Forms List */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
          {filteredForms.length === 0 ? (
            <div className="p-12 text-center">
              <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-inner">
                <FileText className="w-8 h-8 text-gray-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || filterStatus !== 'all' ? 'Tidak ada form ditemukan' : 'Belum ada form'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || filterStatus !== 'all' 
                  ? 'Coba ubah kata kunci pencarian atau filter Anda' 
                  : 'Mulai dengan membuat form pertama Anda'
                }
              </p>
              {!searchTerm && filterStatus === 'all' && (
                <Link href="/builder">
                  <Button className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                    <Plus className="w-4 h-4 mr-2" />
                    Buat Form Pertama Anda
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="divide-y divide-white/20">
              {filteredForms.map((form) => (
                <div key={form.id} className="p-6 hover:bg-white/50 transition-all duration-200 group">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 truncate mr-3">
                          {form.title}
                        </h3>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium shadow-sm ${
                          form.isPublished 
                            ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-200' 
                            : 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border border-yellow-200'
                        }`}>
                          {form.isPublished ? 'Terpublikasi' : 'Draft'}
                        </span>
                      </div>
                      
                      {form.description && (
                        <p className="text-gray-600 mb-3 line-clamp-2">{form.description}</p>
                      )}
                      
                      <div className="flex items-center text-sm text-gray-500 space-x-6">
                        <div className="flex items-center">
                          <Eye className="w-4 h-4 mr-1" />
                          <span>{form.views} tampilan</span>
                        </div>
                        <div className="flex items-center">
                          <BarChart3 className="w-4 h-4 mr-1" />
                          <span>{form._count.submissions} respons</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>Diperbarui {new Date(form.updatedAt).toLocaleDateString('id-ID')}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => togglePublish(form.id, form.isPublished)}
                        className={`${form.isPublished 
                          ? 'text-orange-600 hover:text-orange-700 hover:bg-orange-50' 
                          : 'text-green-600 hover:text-green-700 hover:bg-green-50'
                        }`}
                      >
                        {form.isPublished ? (
                          <>
                            <Pause className="w-4 h-4 mr-1" />
                            Batal Publikasi
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 mr-1" />
                            Publikasikan
                          </>
                        )}
                      </Button>

                      <Link href={`/form/${form.id}`}>
                        <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                          <Eye className="w-4 h-4 mr-1" />
                          Lihat
                        </Button>
                      </Link>

                      {form.isPublished && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => copyFormLink(form.id)}
                          className="text-teal-600 hover:text-teal-700 hover:bg-teal-50"
                        >
                          <Link2 className="w-4 h-4 mr-1" />
                          Link
                        </Button>
                      )}
                      
                      <Link href={`/builder?id=${form.id}`}>
                        <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
                          <Edit3 className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                      </Link>

                      <Link href={`/forms/${form.id}/analytics`}>
                        <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-700 hover:bg-purple-50">
                          <BarChart3 className="w-4 h-4 mr-1" />
                          Analytics
                        </Button>
                      </Link>

                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => openFormSettings(form)}
                        className="text-gray-600 hover:text-gray-700 hover:bg-gray-50"
                      >
                        <Settings className="w-4 h-4 mr-1" />
                        Settings
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => deleteForm(form.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Form Settings Modal */}
      {showSettings && selectedForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl w-full max-w-md border border-white/20">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Form Settings</h2>
              <Button variant="ghost" size="sm" onClick={() => setShowSettings(false)}>
                ×
              </Button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Form Status</span>
                <Button 
                  size="sm"
                  onClick={() => {
                    togglePublish(selectedForm.id, selectedForm.isPublished);
                    setShowSettings(false);
                  }}
                  className={`${selectedForm.isPublished 
                    ? 'bg-orange-100 text-orange-700 hover:bg-orange-200' 
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  {selectedForm.isPublished ? 'Published' : 'Draft'}
                </Button>
              </div>
              
              <div className="space-y-2">
                <span className="text-sm font-medium text-gray-700">Quick Actions</span>
                <div className="grid grid-cols-2 gap-2">
                  <Link href={`/form/${selectedForm.id}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" className="w-full" onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/form/${selectedForm.id}`);
                    alert('Form URL copied to clipboard!');
                  }}>
                    <Share className="w-4 h-4 mr-2" />
                    Copy Link
                  </Button>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="text-sm text-gray-600 space-y-1">
                  <div>Views: <span className="font-medium">{selectedForm.views}</span></div>
                  <div>Responses: <span className="font-medium">{selectedForm._count.submissions}</span></div>
                  <div>Created: <span className="font-medium">{new Date(selectedForm.createdAt).toLocaleDateString()}</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
