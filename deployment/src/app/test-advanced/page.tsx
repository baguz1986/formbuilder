'use client';

import React, { useState } from 'react';
import { FormRenderer } from '@/components/form-renderer/form-renderer';
import { FormSchema } from '@/types/form';
import { v4 as uuidv4 } from 'uuid';

export default function TestAdvancedFields() {
  const [form] = useState<FormSchema>({
    id: uuidv4(),
    title: 'Advanced Form Fields Test',
    description: 'Test form showcasing Matrix, Rating, and Likert Scale fields',
    fields: [
      {
        id: uuidv4(),
        type: 'text',
        label: 'Your Name',
        placeholder: 'Enter your full name',
        required: true,
      },
      {
        id: uuidv4(),
        type: 'matrix',
        label: 'Service Quality Evaluation',
        required: true,
        matrixRows: [
          'Customer Service',
          'Product Quality',
          'Delivery Speed',
          'Website Experience'
        ],
        matrixColumns: [
          'Excellent',
          'Good',
          'Average',
          'Poor',
          'Very Poor'
        ],
        matrixType: 'radio',
      },
      {
        id: uuidv4(),
        type: 'matrix',
        label: 'Skills Assessment',
        required: false,
        matrixRows: [
          'JavaScript',
          'TypeScript',
          'React',
          'Next.js'
        ],
        matrixColumns: [
          'Beginner',
          'Intermediate',
          'Advanced',
          'Expert'
        ],
        matrixType: 'checkbox',
      },
      {
        id: uuidv4(),
        type: 'rating',
        label: 'Overall Satisfaction (Stars)',
        required: true,
        ratingMax: 5,
        ratingIcon: 'star',
      },
      {
        id: uuidv4(),
        type: 'rating',
        label: 'Would you recommend us? (Hearts)',
        required: true,
        ratingMax: 5,
        ratingIcon: 'heart',
      },
      {
        id: uuidv4(),
        type: 'rating',
        label: 'Ease of Use (Numbers)',
        required: true,
        ratingMax: 10,
        ratingIcon: 'number',
      },
      {
        id: uuidv4(),
        type: 'likert',
        label: 'Agreement Level (5-Point Scale)',
        required: true,
        likertScale: {
          min: 1,
          max: 5,
          minLabel: 'Strongly Disagree',
          maxLabel: 'Strongly Agree',
          steps: 5,
        },
      },
      {
        id: uuidv4(),
        type: 'likert',
        label: 'Satisfaction Level (7-Point Scale)',
        required: true,
        likertScale: {
          min: 1,
          max: 7,
          minLabel: 'Extremely Dissatisfied',
          maxLabel: 'Extremely Satisfied',
          steps: 7,
        },
      },
      {
        id: uuidv4(),
        type: 'textarea',
        label: 'Additional Feedback',
        placeholder: 'Please provide any additional comments...',
        required: false,
        validation: {
          maxLength: 500,
        },
      },
    ],
    settings: {
      showTitle: true,
      showDescription: true,
      submitButtonText: 'Submit Test Form',
      theme: 'light',
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const handleSubmit = (data: Record<string, any>) => {
    console.log('Form submission data:', data);
    alert('Form submitted successfully! Check the console for submission data.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-8">
          <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Advanced Form Fields Test
          </h1>
          <p className="text-gray-600 text-center mb-8">
            This test form demonstrates the advanced field types: Matrix Questions, Rating Fields, and Likert Scales.
          </p>
          
          <FormRenderer
            form={form}
            onSubmit={handleSubmit}
            className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-white/20"
          />
        </div>
        
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Field Types Demonstrated:</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">Matrix Questions</h3>
              <ul className="text-sm text-blue-600 space-y-1">
                <li>• Radio button matrix</li>
                <li>• Checkbox matrix</li>
                <li>• Multiple rows/columns</li>
                <li>• Customizable options</li>
              </ul>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-800 mb-2">Rating Fields</h3>
              <ul className="text-sm text-purple-600 space-y-1">
                <li>• Star ratings</li>
                <li>• Heart ratings</li>
                <li>• Number ratings</li>
                <li>• Configurable max values</li>
              </ul>
            </div>
            <div className="bg-indigo-50 p-4 rounded-lg">
              <h3 className="font-semibold text-indigo-800 mb-2">Likert Scales</h3>
              <ul className="text-sm text-indigo-600 space-y-1">
                <li>• 3-10 point scales</li>
                <li>• Custom labels</li>
                <li>• Agreement scales</li>
                <li>• Satisfaction scales</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
