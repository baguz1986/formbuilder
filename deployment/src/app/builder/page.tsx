'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { FormBuilder } from '@/components/form-builder/form-builder';
import { FormRenderer } from '@/components/form-renderer/form-renderer';
import { FormSchema } from '@/types/form';
import { DynamicHead } from '@/components/dynamic-head';
import { v4 as uuidv4 } from 'uuid';

function BuilderContent() {
  const searchParams = useSearchParams();
  const formId = searchParams.get('id');
  const [isPreview, setIsPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(!!formId);
  const [form, setForm] = useState<FormSchema>({
    id: uuidv4(),
    title: 'Untitled Form',
    description: '',
    fields: [],
    settings: {
      showTitle: true,
      showDescription: true,
      submitButtonText: 'Submit',
      theme: 'light',
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  useEffect(() => {
    if (formId) {
      loadForm(formId);
    }
  }, [formId]);

  const loadForm = async (id: string) => {
    try {
      const response = await fetch(`/api/forms/${id}`);
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
      } else {
        console.error('Failed to load form');
        alert('Failed to load form. Creating a new one instead.');
      }
    } catch (error) {
      console.error('Error loading form:', error);
      alert('Error loading form. Creating a new one instead.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormUpdate = (updatedForm: FormSchema) => {
    setForm({ ...updatedForm, updatedAt: new Date() });
  };

  const handlePreview = () => {
    setIsPreview(!isPreview);
  };

  const handleSave = async () => {
    try {
      const isUpdating = formId && form.id !== uuidv4();
      const url = isUpdating ? `/api/forms/${form.id}` : '/api/forms';
      const method = isUpdating ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          schema: form.fields,
          settings: form.settings,
        }),
      });

      if (response.ok) {
        const savedForm = await response.json();
        console.log('Form saved:', savedForm);
        alert(isUpdating ? 'Form updated successfully!' : 'Form saved successfully!');
        
        // Update the form ID to reflect the saved form if it's a new form
        if (!isUpdating) {
          setForm(prev => ({ ...prev, id: savedForm.id }));
        }
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save form');
      }
    } catch (error) {
      console.error('Error saving form:', error);
      alert('Error saving form. Please try again.');
    }
  };

  const handleFormSubmit = async (data: Record<string, any>) => {
    try {
      // TODO: Implement API call to save form submission
      console.log('Form submission:', data);
      alert('Form submitted successfully!');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting form. Please try again.');
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <DynamicHead 
        title={`Form Builder - ${form.title}`} 
        description="Create and edit your forms with the drag-and-drop builder" 
      />
      
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading form...</p>
          </div>
        </div>
      ) : isPreview ? (
        <div className="flex-1">
          <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 px-6 py-4 shadow-lg">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Form Preview</h2>
              <button
                onClick={handlePreview}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Back to Editor
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-auto py-8">
            <FormRenderer
              form={form}
              onSubmit={handleFormSubmit}
              className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 mx-auto max-w-2xl"
            />
          </div>
        </div>
      ) : (
        <FormBuilder
          form={form}
          onFormUpdate={handleFormUpdate}
          onPreview={handlePreview}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

export default function BuilderPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <BuilderContent />
    </Suspense>
  );
}
