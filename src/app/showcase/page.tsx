'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  FileText, 
  BarChart3, 
  Users, 
  Eye, 
  Grid3X3,
  Star,
  CheckSquare,
  Type,
  Mail,
  Hash,
  Calendar,
  Upload,
  Circle,
  Square,
  ChevronDown,
  Settings,
  Palette,
  Shield,
  Zap,
  ArrowRight
} from 'lucide-react';

const fieldTypes = [
  { icon: Type, name: 'Text Input', description: 'Single-line text fields' },
  { icon: Mail, name: 'Email', description: 'Email validation built-in' },
  { icon: Hash, name: 'Number', description: 'Numeric input with validation' },
  { icon: FileText, name: 'Textarea', description: 'Multi-line text areas' },
  { icon: ChevronDown, name: 'Select Dropdown', description: 'Customizable options' },
  { icon: Circle, name: 'Radio Buttons', description: 'Single selection' },
  { icon: Square, name: 'Checkboxes', description: 'Multiple selections' },
  { icon: Calendar, name: 'Date Picker', description: 'Date input fields' },
  { icon: Upload, name: 'File Upload', description: 'File attachment support' },
  { icon: Grid3X3, name: 'Matrix Questions', description: 'Complex grid layouts' },
  { icon: Star, name: 'Rating Fields', description: 'Star, heart, and number ratings' },
  { icon: BarChart3, name: 'Likert Scales', description: '3-10 point agreement scales' },
];

const features = [
  {
    icon: Palette,
    title: 'Drag & Drop Builder',
    description: 'Intuitive visual form editor with real-time preview',
    color: 'from-blue-500 to-purple-500'
  },
  {
    icon: Settings,
    title: 'Advanced Configuration',
    description: 'Detailed field properties, validation, and custom options',
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: Shield,
    title: 'Smart Validation',
    description: 'Built-in validation with custom patterns and rules',
    color: 'from-pink-500 to-red-500'
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'Track form performance, submissions, and user engagement',
    color: 'from-red-500 to-orange-500'
  },
  {
    icon: Users,
    title: 'Response Management',
    description: 'Collect, organize, and analyze form responses',
    color: 'from-orange-500 to-yellow-500'
  },
  {
    icon: Zap,
    title: 'Real-time Updates',
    description: 'Live form editing with instant preview capabilities',
    color: 'from-yellow-500 to-green-500'
  },
];

export default function FeatureShowcase() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-xl p-3 w-16 h-16 mx-auto mb-6 shadow-lg">
              <FileText className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-6">
              FormBuilder Complete
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              A professional form builder with advanced field types, drag & drop interface, 
              real-time validation, and comprehensive analytics dashboard.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/builder">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl">
                  <Plus className="w-5 h-5 mr-2" />
                  Create New Form
                </Button>
              </Link>
              <Link href="/test-advanced">
                <Button variant="outline" size="lg" className="border-2 border-gray-300 hover:border-blue-400 bg-white/80 backdrop-blur-sm rounded-xl">
                  <Eye className="w-5 h-5 mr-2" />
                  View Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Powerful Features</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to create professional forms with advanced functionality
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 group"
              >
                <div className={`bg-gradient-to-r ${feature.color} rounded-xl p-3 w-14 h-14 mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Field Types Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">12 Field Types Available</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            From basic text inputs to advanced matrix questions and Likert scales
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {fieldTypes.map((field, index) => {
            const Icon = field.icon;
            return (
              <div
                key={index}
                className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-white/20 group"
              >
                <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg p-3 w-12 h-12 mb-4 group-hover:from-blue-100 group-hover:to-purple-100 transition-all duration-300">
                  <Icon className="h-6 w-6 text-gray-700 group-hover:text-blue-700" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{field.name}</h3>
                <p className="text-sm text-gray-600">{field.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Advanced Fields Highlight */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl p-12 text-white shadow-2xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Advanced Field Types</h2>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Go beyond basic forms with our advanced field types designed for complex data collection
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
              <Grid3X3 className="h-12 w-12 mx-auto mb-4 opacity-90" />
              <h3 className="text-xl font-semibold mb-3">Matrix Questions</h3>
              <p className="opacity-80 mb-4">
                Create complex grid layouts with multiple input types for comprehensive surveys
              </p>
              <ul className="text-sm opacity-75 space-y-1">
                <li>• Radio button matrices</li>
                <li>• Checkbox matrices</li>
                <li>• Text input matrices</li>
                <li>• Custom row/column labels</li>
              </ul>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
              <Star className="h-12 w-12 mx-auto mb-4 opacity-90" />
              <h3 className="text-xl font-semibold mb-3">Rating Fields</h3>
              <p className="opacity-80 mb-4">
                Collect ratings with customizable icons and scales for user feedback
              </p>
              <ul className="text-sm opacity-75 space-y-1">
                <li>• Star ratings (1-10 scale)</li>
                <li>• Heart ratings</li>
                <li>• Thumbs up ratings</li>
                <li>• Number ratings</li>
              </ul>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-90" />
              <h3 className="text-xl font-semibold mb-3">Likert Scales</h3>
              <p className="opacity-80 mb-4">
                Professional agreement scales with custom labels and point ranges
              </p>
              <ul className="text-sm opacity-75 space-y-1">
                <li>• 3-10 point scales</li>
                <li>• Custom min/max labels</li>
                <li>• Agreement scales</li>
                <li>• Satisfaction scales</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 text-center shadow-xl border border-white/20">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Build Your Form?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Start creating professional forms with our intuitive drag & drop builder
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/builder">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl">
                Start Building
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" size="lg" className="border-2 border-gray-300 hover:border-blue-400 bg-white/80 backdrop-blur-sm rounded-xl">
                <BarChart3 className="w-5 h-5 mr-2" />
                View Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
