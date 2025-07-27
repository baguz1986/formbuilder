'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  Share,
  Play,
  Pause
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

export default function TestDashboard() {
  const [forms, setForms] = useState<Form[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showSettings, setShowSettings] = useState(false);
  const [selectedForm, setSelectedForm] = useState<Form | null>(null);

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      const response = await fetch('/api/forms');
      if (response.ok) {
        const data = await response.json();
        setForms(data);
      }
    } catch (error) {
      console.error('Error fetching forms:', error);
    } finally {
      setIsLoading(false);
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
          alert('Form deleted successfully!');
        } else {
          alert('Failed to delete form');
        }
      } catch (error) {
        console.error('Error deleting form:', error);
        alert('Error deleting form');
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
        alert(`Form ${!currentStatus ? 'published' : 'unpublished'} successfully!`);
      } else {
        alert('Failed to update form status');
      }
    } catch (error) {
      console.error('Error updating form status:', error);
      alert('Error updating form status');
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-white/20 shadow-lg sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-xl p-2 mr-3 shadow-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">FormBuilder Test</h1>
                <p className="text-sm text-gray-500">Testing Dashboard Features</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link href="/builder">
                <Button className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Form
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-3 shadow-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{forms.length}</div>
                <div className="text-sm text-gray-600 font-medium">Total Forms</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-3 shadow-lg">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{totalResponses}</div>
                <div className="text-sm text-gray-600 font-medium">Total Responses</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-3 shadow-lg">
                <Eye className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{totalViews}</div>
                <div className="text-sm text-gray-600 font-medium">Total Views</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl p-3 shadow-lg">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{publishedForms}</div>
                <div className="text-sm text-gray-600 font-medium">Published</div>
              </div>
            </div>
          </div>
        </div>

        {/* Forms List */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          <div className="p-6 border-b border-white/20">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <h2 className="text-xl font-semibold text-gray-900">Your Forms</h2>
              
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search forms..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/50 border-white/20 focus:border-blue-300 rounded-xl"
                  />
                </div>
                
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 bg-white/50 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300"
                >
                  <option value="all">All Forms</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>
          </div>

          {filteredForms.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || filterStatus !== 'all' ? 'No forms found' : 'No forms yet'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || filterStatus !== 'all' 
                  ? 'Try adjusting your search or filters' 
                  : 'Get started by creating your first form'
                }
              </p>
              {!searchTerm && filterStatus === 'all' && (
                <Link href="/builder">
                  <Button className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Form
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
                          {form.isPublished ? 'Published' : 'Draft'}
                        </span>
                      </div>
                      
                      {form.description && (
                        <p className="text-gray-600 mb-3 line-clamp-2">{form.description}</p>
                      )}
                      
                      <div className="flex items-center text-sm text-gray-500 space-x-6">
                        <div className="flex items-center">
                          <Eye className="w-4 h-4 mr-1" />
                          <span>{form.views} views</span>
                        </div>
                        <div className="flex items-center">
                          <BarChart3 className="w-4 h-4 mr-1" />
                          <span>{form._count.submissions} responses</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>Updated {new Date(form.updatedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
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
                            Unpublish
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 mr-1" />
                            Publish
                          </>
                        )}
                      </Button>

                      <Link href={`/form/${form.id}`}>
                        <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </Link>
                      
                      <Link href={`/builder?id=${form.id}`}>
                        <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
                          <Edit3 className="w-4 h-4 mr-1" />
                          Edit
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
