'use client';

import React from 'react';
import { useUserRole } from '@/components/role-guard';
import { Button } from '@/components/ui/button';
import { Shield, User, Users, Crown, CheckCircle, XCircle, Settings } from 'lucide-react';
import Link from 'next/link';

export default function AccessInfoPage() {
  const { role } = useUserRole();

  const rolePermissions = {
    user: {
      name: 'Pengguna',
      color: 'green',
      icon: User,
      permissions: [
        { feature: 'Buat Form', access: true },
        { feature: 'Edit Form Sendiri', access: true },
        { feature: 'Lihat Analitik Form', access: true },
        { feature: 'Pengaturan Profil', access: true },
        { feature: 'Pengaturan Aplikasi', access: false },
        { feature: 'Manajemen Pengguna', access: false },
        { feature: 'Admin Sistem', access: false },
      ]
    },
    admin: {
      name: 'Admin',
      color: 'blue',
      icon: Users,
      permissions: [
        { feature: 'Buat Form', access: true },
        { feature: 'Edit Form Sendiri', access: true },
        { feature: 'Lihat Analitik Form', access: true },
        { feature: 'Pengaturan Profil', access: true },   
        { feature: 'Pengaturan Aplikasi', access: true },
        { feature: 'Manajemen Pengguna', access: true },
        { feature: 'Admin Sistem', access: false },
      ]
    },
    super_admin: {
      name: 'Super Admin',
      color: 'yellow',
      icon: Crown,
      permissions: [
        { feature: 'Buat Form', access: true },
        { feature: 'Edit Form Sendiri', access: true },
        { feature: 'Lihat Analitik Form', access: true },
        { feature: 'Pengaturan Profil', access: true },
        { feature: 'Pengaturan Aplikasi', access: true },
        { feature: 'Manajemen Pengguna', access: true },
        { feature: 'Admin Sistem', access: true },
      ]
    }
  };

  const currentRole = rolePermissions[role as keyof typeof rolePermissions] || rolePermissions.user;
  const IconComponent = currentRole.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Informasi Kontrol Akses</h1>
          </div>
          <p className="text-gray-600">
            Memahami peran pengguna dan izin dalam FormBuilder
          </p>
        </div>

        {/* Current Role */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Peran Anda Saat Ini</h2>
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-full ${
              currentRole.color === 'yellow' ? 'bg-yellow-100' :
              currentRole.color === 'blue' ? 'bg-blue-100' : 'bg-green-100'
            }`}>
              <IconComponent className={`w-6 h-6 ${
                currentRole.color === 'yellow' ? 'text-yellow-600' :
                currentRole.color === 'blue' ? 'text-blue-600' : 'text-green-600'
              }`} />
            </div>
            <div>
              <h3 className="text-xl font-medium">{currentRole.name}</h3>
              <p className="text-gray-600">
                {role === 'super_admin' ? 'Akses penuh sistem dengan semua hak administratif' :
                 role === 'admin' ? 'Akses manajemen aplikasi dan administrasi pengguna' :
                 'Akses pengguna standar untuk membuat dan mengelola form'}
              </p>
            </div>
          </div>
        </div>

        {/* Permissions Table */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Rincian Izin</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">Fitur</th>
                  <th className="text-center p-3 font-medium">Pengguna</th>
                  <th className="text-center p-3 font-medium">Admin</th>
                  <th className="text-center p-3 font-medium">Super Admin</th>
                </tr>
              </thead>
              <tbody>
                {rolePermissions.user.permissions.map((permission, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50/50">
                    <td className="p-3 font-medium">{permission.feature}</td>
                    <td className="p-3 text-center">
                      {rolePermissions.user.permissions[index].access ? (
                        <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-400 mx-auto" />
                      )}
                    </td>
                    <td className="p-3 text-center">
                      {rolePermissions.admin.permissions[index].access ? (
                        <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-400 mx-auto" />
                      )}
                    </td>
                    <td className="p-3 text-center">
                      {rolePermissions.super_admin.permissions[index].access ? (
                        <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-400 mx-auto" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Link href="/dashboard">
            <Button variant="outline" className="bg-white/50 hover:bg-white/70">
              Kembali ke Dashboard
            </Button>
          </Link>
          <Link href="/settings">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Settings className="w-4 h-4 mr-2" />
              Buka Pengaturan
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
