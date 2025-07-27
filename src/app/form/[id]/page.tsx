'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { FormRenderer } from '@/components/form-renderer/form-renderer';
import { MultiStepFormRenderer } from '@/components/form-renderer/multi-step-form-renderer';
import { FormSchema } from '@/types/form';
import { hasSectionBasedNavigation } from '@/lib/section-navigation';
import { DynamicHead } from '@/components/dynamic-head';

export default function FormView() {
  const params = useParams();
  const formId = params.id as string;
  const [form, setForm] = useState<FormSchema | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (formId) {
      fetchForm();
    }
  }, [formId]);

  const fetchForm = async () => {
    try {
      const response = await fetch(`/api/forms/${formId}`);
      if (response.ok) {
        const data = await response.json();
        // Convert the API response to FormSchema format
        const formSchema: FormSchema = {
          id: data.id,
          title: data.title,
          description: data.description || '',
          fields: data.schema || [],
          settings: data.settings || {
            showTitle: true,
            showDescription: true,
            submitButtonText: 'Submit',
            theme: 'light',
          },
          createdAt: new Date(data.createdAt),
          updatedAt: new Date(data.updatedAt),
        };
        setForm(formSchema);
      } else if (response.status === 403) {
        setError('Form is not available. It may be unpublished or private.');
      } else if (response.status === 404) {
        setError('Form not found');
      } else {
        setError('Error loading form');
      }
    } catch (error) {
      console.error('Error fetching form:', error);
      setError('Error loading form');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = async (data: Record<string, any>) => {
    try {
      const response = await fetch(`/api/forms/${formId}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert('Form submitted successfully!');
        // Optionally redirect to a thank you page
        if (form?.settings.redirectUrl) {
          window.location.href = form.settings.redirectUrl;
        }
      } else {
        throw new Error('Failed to submit form');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting form. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading form...</p>
        </div>
      </div>
    );
  }

  if (error || !form) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error || 'Form not found'}
          </div>
          <a href="/dashboard" className="text-blue-600 hover:text-blue-800 underline">
            Back to Dashboard
          </a>
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Form Not Found</h1>
          <p className="text-gray-600 mb-4">The form you're looking for doesn't exist or has been removed.</p>
          <a 
            href="/" 
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Go back to homepage
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8">
      <DynamicHead 
        title={form?.title || 'Form'} 
        description={form?.description || 'Fill out this form'} 
      />
      
      <div className="max-w-4xl mx-auto px-4">
        {hasSectionBasedNavigation(form.fields || []) ? (
          <MultiStepFormRenderer
            form={form}
            onSubmit={handleFormSubmit}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20"
          />
        ) : (
          <FormRenderer
            form={form}
            onSubmit={handleFormSubmit}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20"
          />
        )}
      </div>
    </div>
  );
}
