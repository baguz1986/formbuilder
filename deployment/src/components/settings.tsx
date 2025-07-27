'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useLanguage } from '@/components/language-provider';
import { useSettings } from '@/components/settings-provider';
import { useUserRole } from '@/components/role-guard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Settings as SettingsIcon, 
  User, 
  Globe, 
  Palette, 
  Shield, 
  Save,
  Upload,
  Eye,
  Users,
  Crown,
  ArrowLeft
} from 'lucide-react';

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

interface UserSettings {
  displayName: string;
  email: string;
  role: 'user' | 'admin' | 'super_admin';
  notifications: boolean;
  language: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export function Settings() {
  const { data: session } = useSession();
  const { language, setLanguage, t } = useLanguage();
  const { settings: globalSettings, updateSettings } = useSettings();
  const { role, isAdmin, isSuperAdmin } = useUserRole();
  const [activeTab, setActiveTab] = useState('profile'); // Default ke profile untuk semua user
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [appSettings, setAppSettings] = useState<AppSettings>({
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
  });

  const [userSettings, setUserSettings] = useState<UserSettings>({
    displayName: session?.user?.name || '',
    email: session?.user?.email || '',
    role: 'user',
    notifications: true,
    language: language,
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [users, setUsers] = useState([
    { id: '1', name: 'Bagus Taryana', email: 'bagus@example.com', role: 'super_admin', status: 'active' },
    { id: '2', name: 'John Doe', email: 'john@example.com', role: 'admin', status: 'active' },
    { id: '3', name: 'Jane Smith', email: 'jane@example.com', role: 'user', status: 'pending' },
  ]);

  // State untuk modal edit user
  const [editingUser, setEditingUser] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Load settings from context
  useEffect(() => {
    if (globalSettings) {
      setAppSettings({
        ...globalSettings,
        // Ensure all fields have values
        appName: globalSettings.appName || 'FormBuilder',
        appDescription: globalSettings.appDescription || 'Platform pembuat form yang mudah dan powerful',
        logo: globalSettings.logo || '/logo.svg',
        primaryColor: globalSettings.primaryColor || '#6366f1',
        language: globalSettings.language || 'id',
        allowRegistration: globalSettings.allowRegistration ?? true,
        requireApproval: globalSettings.requireApproval ?? false,
        landingTitle: globalSettings.landingTitle || 'Buat Form Cantik dalam Hitungan Menit',
        landingSubtitle: globalSettings.landingSubtitle || 'Platform terdepan untuk membuat form interaktif',
        landingDescription: globalSettings.landingDescription || 'Buat form profesional dengan drag-and-drop builder kami.',
        heroTitle: globalSettings.heroTitle || 'Build Beautiful Forms',
        heroSubtitle: globalSettings.heroSubtitle || 'in Minutes',
        heroDescription: globalSettings.heroDescription || 'Create professional forms with our intuitive drag-and-drop builder.',
        features: globalSettings.features || []
      });
      
      // Update language if different from current
      if (globalSettings.language && globalSettings.language !== language) {
        setLanguage(globalSettings.language as 'id' | 'en');
      }
      setLoading(false);
    }
  }, [globalSettings, language, setLanguage]);

  const handleSaveAppSettings = async () => {
    setSaving(true);
    try {
      // Update global settings context (ini akan handle API call)
      const success = await updateSettings(appSettings);
      
      if (success) {
        alert(t('messages.settingsSaved'));
        // Update global language if changed
        if (appSettings.language !== language) {
          setLanguage(appSettings.language as any);
        }
      } else {
        alert(t('messages.settingsError'));
      }
    } catch (error) {
      alert(t('messages.settingsError'));
    } finally {
      setSaving(false);
    }
  };

  const handleSaveUserSettings = async () => {
    setSaving(true);
    try {
      // Validate password fields if user wants to change password
      if (userSettings.newPassword || userSettings.currentPassword || userSettings.confirmPassword) {
        // Check if all password fields are filled
        if (!userSettings.currentPassword || !userSettings.newPassword || !userSettings.confirmPassword) {
          alert('Harap isi semua field password untuk mengubah password');
          setSaving(false);
          return;
        }
        
        // Check if new passwords match
        if (userSettings.newPassword !== userSettings.confirmPassword) {
          alert('Password baru dan konfirmasi tidak cocok');
          setSaving(false);
          return;
        }
        
        // Check password length
        if (userSettings.newPassword.length < 8) {
          alert('Password harus minimal 8 karakter');
          setSaving(false);
          return;
        }
      }
      
      // Prepare update data
      const updateData: any = {
        displayName: userSettings.displayName,
        email: userSettings.email
      };
      
      // Add password data if user wants to change password
      if (userSettings.currentPassword && userSettings.newPassword) {
        updateData.currentPassword = userSettings.currentPassword;
        updateData.newPassword = userSettings.newPassword;
      }
      
      // Call API to update profile
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        alert(result.error || 'Terjadi kesalahan saat menyimpan profil');
        setSaving(false);
        return;
      }
      
      // Clear password fields after successful save
      setUserSettings(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
      
      alert('Profil berhasil disimpan!');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Terjadi kesalahan saat menyimpan profil');
    } finally {
      setSaving(false);
    }
  };

  const handlePreview = async () => {
    // Save settings first using context
    setSaving(true);
    try {
      const success = await updateSettings(appSettings);
      
      if (success) {
        // Open preview in new tab
        window.open('/', '_blank');
      } else {
        alert(t('messages.settingsError'));
      }
    } catch (error) {
      alert(t('messages.settingsError'));
    } finally {
      setSaving(false);
    }
  };

  const handleAddUser = () => {
    const name = prompt('Nama pengguna:');
    const email = prompt('Email pengguna:');
    
    if (name && email) {
      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        role: 'user' as const,
        status: 'pending' as const
      };
      setUsers([...users, newUser]);
      alert('Pengguna berhasil ditambahkan!');
    }
  };

  const handleEditUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setEditingUser({...user});
      setShowEditModal(true);
    }
  };

  const handleSaveEditUser = () => {
    if (editingUser) {
      const updatedUsers = users.map(u => 
        u.id === editingUser.id ? editingUser : u
      );
      setUsers(updatedUsers);
      setShowEditModal(false);
      setEditingUser(null);
      alert('Pengguna berhasil diperbarui!');
    }
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
    setEditingUser(null);
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm(t('messages.deleteConfirm'))) {
      const updatedUsers = users.filter(u => u.id !== userId);
      setUsers(updatedUsers);
      alert(t('messages.deleteSuccess'));
    }
  };

  const handleUploadLogo = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file terlalu besar. Maksimal 5MB.');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Hanya file gambar yang diperbolehkan.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setAppSettings({...appSettings, logo: result.url});
        alert('Logo berhasil diupload!');
      } else {
        alert(result.error || 'Gagal upload logo');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Gagal upload logo');
    }
  };

  const handleBackupDatabase = () => {
    alert('Fitur backup database akan segera tersedia!');
  };

  const handleViewLogs = () => {
    alert('Fitur system logs akan segera tersedia!');
  };

  const handleMaintenanceMode = () => {
    if (confirm('Aktifkan mode maintenance? Ini akan menonaktifkan akses untuk semua pengguna.')) {
      alert('Mode maintenance telah diaktifkan!');
    }
  };

  const handleResetData = () => {
    const confirmation = prompt('PERINGATAN: Ini akan menghapus SEMUA data! Ketik "DELETE ALL" untuk konfirmasi:');
    if (confirmation === 'DELETE ALL') {
      alert('Semua data telah dihapus! (Demo mode - data tidak benar-benar dihapus)');
    } else {
      alert('Penghapusan dibatalkan.');
    }
  };

  // Generate tabs berdasarkan role
  const getTabsByRole = () => {
    const baseTabs = [
      { id: 'profile', label: 'Profil Saya', icon: User },
    ];

    if (isAdmin || isSuperAdmin) {
      baseTabs.unshift({ id: 'app', label: 'Pengaturan Aplikasi', icon: Palette });
      baseTabs.push({ id: 'users', label: 'Manajemen User', icon: Users });
    }

    if (isSuperAdmin) {
      baseTabs.push({ id: 'super', label: 'Super Admin', icon: Crown });
    }

    return baseTabs;
  };

  const tabs = getTabsByRole();

  return (
    <div className="min-h-screen bg-gray-50">
      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back to Dashboard Button */}
        <div className="mb-4">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Kembali ke Dashboard</span>
          </Link>
        </div>
        
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <SettingsIcon className="w-6 h-6 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Pengaturan Sistem</h1>
          </div>
          <p className="text-gray-600">
            Kelola pengaturan aplikasi, pengguna, dan kustomisasi tampilan
          </p>
          
          {/* Role Info */}
          <div className="mt-4 flex items-center gap-2">
            <span className="text-sm text-gray-500">Your Role:</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              role === 'super_admin' ? 'bg-yellow-100 text-yellow-800' :
              role === 'admin' ? 'bg-blue-100 text-blue-800' :
              'bg-green-100 text-green-800'
            }`}>
              {role === 'super_admin' ? 'Super Admin' : 
               role === 'admin' ? 'Admin' : 'User'}
            </span>
            
            {/* Access Level Info */}
            <div className="ml-4 text-xs text-gray-400">
              Access: {
                role === 'super_admin' ? 'Full System Access' :
                role === 'admin' ? 'App Settings + User Management' :
                'Profile Only'
              }
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border">
              {/* App Settings */}
              {activeTab === 'app' && (
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <Palette className="w-5 h-5 text-blue-600" />
                    <h2 className="text-xl font-semibold">Pengaturan Aplikasi</h2>
                  </div>

                  <div className="space-y-6">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="appName">Nama Aplikasi</Label>
                        <Input
                          id="appName"
                          value={appSettings?.appName || ''}
                          onChange={(e) => setAppSettings({...appSettings, appName: e.target.value})}
                          placeholder="FormBuilder"
                        />
                      </div>
                      <div>
                        <Label htmlFor="primaryColor">Warna Utama</Label>
                        <div className="flex gap-2">
                          <Input
                            id="primaryColor"
                            type="color"
                            value={appSettings?.primaryColor || '#6366f1'}
                            onChange={(e) => setAppSettings({...appSettings, primaryColor: e.target.value})}
                            className="w-16 h-10 p-1"
                          />
                          <Input
                            value={appSettings?.primaryColor || '#6366f1'}
                            onChange={(e) => setAppSettings({...appSettings, primaryColor: e.target.value})}
                            placeholder="#6366f1"
                            className="flex-1"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="logo">Logo Aplikasi</Label>
                      <div className="space-y-3">
                        {/* Current Logo Preview */}
                        <div className="flex gap-3 items-center">
                          <div className="w-16 h-16 rounded border-2 border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center">
                            {appSettings?.logo && appSettings.logo !== '/logo.svg' ? (
                              <img 
                                src={appSettings.logo} 
                                alt="Current Logo" 
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            ) : (
                              <div className="text-gray-400 text-xs text-center">
                                No Logo
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">Logo Saat Ini</p>
                            <p className="text-xs text-gray-500">
                              {appSettings?.logo || 'Tidak ada logo'}
                            </p>
                          </div>
                        </div>

                        {/* Logo URL Input */}
                        <div>
                          <Label htmlFor="logoUrl" className="text-sm">URL Logo (Opsional)</Label>
                          <Input
                            id="logoUrl"
                            value={appSettings?.logo || ''}
                            onChange={(e) => setAppSettings({...appSettings, logo: e.target.value})}
                            placeholder="/logo.svg atau https://example.com/logo.png"
                          />
                        </div>

                        {/* Upload Logo */}
                        <div>
                          <Label htmlFor="logoUpload" className="text-sm">Upload Logo Baru</Label>
                          <div className="flex gap-2">
                            <input
                              id="logoUpload"
                              type="file"
                              accept="image/*"
                              onChange={handleUploadLogo}
                              className="hidden"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => document.getElementById('logoUpload')?.click()}
                              className="flex items-center gap-2"
                            >
                              <Upload className="w-4 h-4" />
                              Pilih File
                            </Button>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Format: JPG, PNG, GIF, WebP. Maksimal 5MB. Direkomendasikan ukuran 200x200px atau rasio 1:1.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="appDescription">Deskripsi Aplikasi</Label>
                      <Textarea
                        id="appDescription"
                        value={appSettings?.appDescription || ''}
                        onChange={(e) => setAppSettings({...appSettings, appDescription: e.target.value})}
                        placeholder="Deskripsi singkat tentang aplikasi"
                        rows={3}
                      />
                    </div>

                    {/* Landing Page Customization */}
                    <div className="border-t pt-6">
                      <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                        <Globe className="w-5 h-5" />
                        Kustomisasi Landing Page
                      </h3>
                      
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="landingTitle">Judul Utama</Label>
                          <Input
                            id="landingTitle"
                            value={appSettings?.landingTitle || ''}
                            onChange={(e) => setAppSettings({...appSettings, landingTitle: e.target.value})}
                            placeholder="Buat Form Cantik dalam Hitungan Menit"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="landingSubtitle">Sub Judul</Label>
                          <Input
                            id="landingSubtitle"
                            value={appSettings?.landingSubtitle || ''}
                            onChange={(e) => setAppSettings({...appSettings, landingSubtitle: e.target.value})}
                            placeholder="Platform terdepan untuk membuat form interaktif"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="landingDescription">Deskripsi</Label>
                          <Textarea
                            id="landingDescription"
                            value={appSettings?.landingDescription || ''}
                            onChange={(e) => setAppSettings({...appSettings, landingDescription: e.target.value})}
                            placeholder="Deskripsi detail tentang fitur aplikasi"
                            rows={4}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Hero Section */}
                    <div className="border-t pt-6">
                      <h3 className="text-lg font-medium mb-4">Hero Section</h3>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="heroTitle">Hero Title</Label>
                          <Input
                            id="heroTitle"
                            value={appSettings?.heroTitle || ''}
                            onChange={(e) => setAppSettings({...appSettings, heroTitle: e.target.value})}
                            placeholder="Build Beautiful Forms"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="heroSubtitle">Hero Subtitle</Label>
                          <Input
                            id="heroSubtitle"
                            value={appSettings?.heroSubtitle || ''}
                            onChange={(e) => setAppSettings({...appSettings, heroSubtitle: e.target.value})}
                            placeholder="in Minutes"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="heroDescription">Hero Description</Label>
                          <Textarea
                            id="heroDescription"
                            value={appSettings?.heroDescription || ''}
                            onChange={(e) => setAppSettings({...appSettings, heroDescription: e.target.value})}
                            placeholder="Create professional forms with our intuitive drag-and-drop builder..."
                            rows={3}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Features List */}
                    <div className="border-t pt-6">
                      <h3 className="text-lg font-medium mb-4">Fitur Unggulan</h3>
                      <div className="space-y-2">
                        {appSettings.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Input
                              value={feature}
                              onChange={(e) => {
                                const newFeatures = [...appSettings.features];
                                newFeatures[index] = e.target.value;
                                setAppSettings({...appSettings, features: newFeatures});
                              }}
                              placeholder="Nama fitur"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const newFeatures = appSettings.features.filter((_, i) => i !== index);
                                setAppSettings({...appSettings, features: newFeatures});
                              }}
                            >
                              Hapus
                            </Button>
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          onClick={() => setAppSettings({
                            ...appSettings, 
                            features: [...appSettings.features, 'Fitur Baru']
                          })}
                        >
                          Tambah Fitur
                        </Button>
                      </div>
                    </div>

                    {/* Language & Access */}
                    <div className="border-t pt-6">
                      <h3 className="text-lg font-medium mb-4">Bahasa & Akses</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="language">Bahasa Default</Label>
                          <select
                            id="language"
                            value={appSettings?.language || 'id'}
                            onChange={(e) => setAppSettings({...appSettings, language: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          >
                            <option value="id">Bahasa Indonesia</option>
                            <option value="en">English</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id="allowRegistration"
                              checked={appSettings.allowRegistration}
                              onChange={(e) => setAppSettings({...appSettings, allowRegistration: e.target.checked})}
                            />
                            <Label htmlFor="allowRegistration">Izinkan Registrasi Publik</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id="requireApproval"
                              checked={appSettings.requireApproval}
                              onChange={(e) => setAppSettings({...appSettings, requireApproval: e.target.checked})}
                            />
                            <Label htmlFor="requireApproval">Butuh Persetujuan Admin</Label>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-6 border-t">
                      <Button onClick={handleSaveAppSettings} disabled={saving}>
                        <Save className="w-4 h-4 mr-2" />
                        {saving ? 'Menyimpan...' : 'Simpan Pengaturan'}
                      </Button>
                      <Button variant="outline" onClick={handlePreview}>
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* User Management */}
              {activeTab === 'users' && (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-blue-600" />
                      <h2 className="text-xl font-semibold">Manajemen Pengguna</h2>
                    </div>
                    <Button onClick={handleAddUser}>
                      <User className="w-4 h-4 mr-2" />
                      Tambah User
                    </Button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-3">Nama</th>
                          <th className="text-left p-3">Email</th>
                          <th className="text-left p-3">Role</th>
                          <th className="text-left p-3">Status</th>
                          <th className="text-left p-3">Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user) => (
                          <tr key={user.id} className="border-b hover:bg-gray-50">
                            <td className="p-3 font-medium">{user.name}</td>
                            <td className="p-3 text-gray-600">{user.email}</td>
                            <td className="p-3">
                              <select
                                value={user.role}
                                onChange={(e) => {
                                  const newUsers = users.map(u => 
                                    u.id === user.id ? {...u, role: e.target.value as any} : u
                                  );
                                  setUsers(newUsers);
                                }}
                                className="px-2 py-1 border rounded text-sm"
                              >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                                <option value="super_admin">Super Admin</option>
                              </select>
                            </td>
                            <td className="p-3">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                user.status === 'active' 
                                  ? 'bg-green-100 text-green-700' 
                                  : 'bg-yellow-100 text-yellow-700'
                              }`}>
                                {user.status === 'active' ? 'Aktif' : 'Pending'}
                              </span>
                            </td>
                            <td className="p-3">
                              <div className="flex gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleEditUser(user.id)}
                                >
                                  Edit
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="text-red-600 hover:bg-red-50"
                                  onClick={() => handleDeleteUser(user.id)}
                                >
                                  Hapus
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Profile Settings */}
              {activeTab === 'profile' && (
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <User className="w-5 h-5 text-blue-600" />
                    <h2 className="text-xl font-semibold">Profil Saya</h2>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="displayName">Nama Tampilan</Label>
                        <Input
                          id="displayName"
                          value={userSettings.displayName}
                          onChange={(e) => setUserSettings({...userSettings, displayName: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={userSettings.email}
                          onChange={(e) => setUserSettings({...userSettings, email: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="userLanguage">Bahasa</Label>
                        <select
                          id="userLanguage"
                          value={userSettings.language}
                          onChange={(e) => setUserSettings({...userSettings, language: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        >
                          <option value="id">Bahasa Indonesia</option>
                          <option value="en">English</option>
                        </select>
                      </div>
                      <div className="flex items-center space-x-2 pt-6">
                        <input
                          type="checkbox"
                          id="notifications"
                          checked={userSettings.notifications}
                          onChange={(e) => setUserSettings({...userSettings, notifications: e.target.checked})}
                        />
                        <Label htmlFor="notifications">Terima Notifikasi Email</Label>
                      </div>
                    </div>

                    {/* Password Change Section */}
                    <div className="border-t pt-6">
                      <h3 className="text-lg font-medium mb-4">Ubah Password</h3>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="currentPassword">Password Saat Ini</Label>
                          <Input
                            id="currentPassword"
                            type="password"
                            value={userSettings.currentPassword || ''}
                            onChange={(e) => setUserSettings({...userSettings, currentPassword: e.target.value})}
                            placeholder="Masukkan password saat ini"
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="newPassword">Password Baru</Label>
                            <Input
                              id="newPassword"
                              type="password"
                              value={userSettings.newPassword || ''}
                              onChange={(e) => setUserSettings({...userSettings, newPassword: e.target.value})}
                              placeholder="Masukkan password baru"
                            />
                          </div>
                          <div>
                            <Label htmlFor="confirmPassword">Konfirmasi Password Baru</Label>
                            <Input
                              id="confirmPassword"
                              type="password"
                              value={userSettings.confirmPassword || ''}
                              onChange={(e) => setUserSettings({...userSettings, confirmPassword: e.target.value})}
                              placeholder="Konfirmasi password baru"
                            />
                          </div>
                        </div>
                        {userSettings.newPassword && userSettings.confirmPassword && 
                         userSettings.newPassword !== userSettings.confirmPassword && (
                          <p className="text-red-500 text-sm">Password baru dan konfirmasi tidak cocok</p>
                        )}
                        {userSettings.newPassword && userSettings.newPassword.length < 8 && (
                          <p className="text-red-500 text-sm">Password harus minimal 8 karakter</p>
                        )}
                      </div>
                    </div>

                    <Button onClick={handleSaveUserSettings} disabled={saving}>
                      <Save className="w-4 h-4 mr-2" />
                      {saving ? 'Menyimpan...' : 'Simpan Profil'}
                    </Button>
                  </div>
                </div>
              )}

              {/* Super Admin */}
              {activeTab === 'super' && (
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <Crown className="w-5 h-5 text-yellow-600" />
                    <h2 className="text-xl font-semibold">Panel Super Admin</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* System Stats */}
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                      <h3 className="font-medium text-blue-900 mb-2">Total Users</h3>
                      <div className="text-2xl font-bold text-blue-700">1,247</div>
                      <div className="text-sm text-blue-600">+12 hari ini</div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
                      <h3 className="font-medium text-green-900 mb-2">Total Forms</h3>
                      <div className="text-2xl font-bold text-green-700">5,893</div>
                      <div className="text-sm text-green-600">+45 hari ini</div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
                      <h3 className="font-medium text-purple-900 mb-2">Responses</h3>
                      <div className="text-2xl font-bold text-purple-700">23,451</div>
                      <div className="text-sm text-purple-600">+123 hari ini</div>
                    </div>
                  </div>

                  <div className="mt-8 space-y-4">
                    <h3 className="text-lg font-medium">Aksi Super Admin</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Button 
                        variant="outline" 
                        className="justify-start h-auto p-4 hover:bg-blue-50"
                        onClick={handleBackupDatabase}
                      >
                        <div>
                          <div className="font-medium">Backup Database</div>
                          <div className="text-sm text-gray-500">Buat backup semua data</div>
                        </div>
                      </Button>

                      <Button 
                        variant="outline" 
                        className="justify-start h-auto p-4 hover:bg-green-50"
                        onClick={handleViewLogs}
                      >
                        <div>
                          <div className="font-medium">System Logs</div>
                          <div className="text-sm text-gray-500">Lihat log aktivitas sistem</div>
                        </div>
                      </Button>

                      <Button 
                        variant="outline" 
                        className="justify-start h-auto p-4 hover:bg-yellow-50"
                        onClick={handleMaintenanceMode}
                      >
                        <div>
                          <div className="font-medium">Maintenance Mode</div>
                          <div className="text-sm text-gray-500">Aktifkan mode maintenance</div>
                        </div>
                      </Button>

                      <Button 
                        variant="outline" 
                        className="justify-start h-auto p-4 text-red-600 border-red-200 hover:bg-red-50"
                        onClick={handleResetData}
                      >
                        <div>
                          <div className="font-medium">Reset All Data</div>
                          <div className="text-sm text-red-400">Hapus semua data (berbahaya!)</div>
                        </div>
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        </div>
      )}

      {/* Modal Edit User */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Edit Pengguna</h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="editName">Nama</Label>
                <Input
                  id="editName"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                  placeholder="Nama pengguna"
                />
              </div>
              
              <div>
                <Label htmlFor="editEmail">Email</Label>
                <Input
                  id="editEmail"
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                  placeholder="Email pengguna"
                />
              </div>
              
              <div>
                <Label htmlFor="editRole">Role</Label>
                <select
                  id="editRole"
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>
              
              <div>
                <Label htmlFor="editStatus">Status</Label>
                <select
                  id="editStatus"
                  value={editingUser.status}
                  onChange={(e) => setEditingUser({...editingUser, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="active">Aktif</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-2 mt-6">
              <Button onClick={handleSaveEditUser} className="flex-1">
                Simpan
              </Button>
              <Button onClick={handleCancelEdit} variant="outline" className="flex-1">
                Batal
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
