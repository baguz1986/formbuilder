'use client';

import React from 'react';
import { MatrixField } from './form-fields/matrix-field';
import { FormField } from '@/types/form';

const testMatrixField: FormField = {
  id: 'test-matrix',
  type: 'matrix',
  label: 'Test Matrix Question',
  required: false,
  matrixRows: ['How satisfied are you?', 'How likely to recommend?', 'Overall experience?'],
  matrixColumns: ['Very Poor', 'Poor', 'Fair', 'Good', 'Excellent'],
  matrixType: 'radio',
};

export function TestMatrix() {
  const [value, setValue] = React.useState<Record<string, string | Record<string, string>>>({});

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Matrix Field Test</h2>
      
      <div className="bg-white border rounded-lg p-6">
        <MatrixField
          field={testMatrixField}
          value={value}
          onChange={setValue}
        />
      </div>
      
      <div className="mt-6 p-4 bg-gray-100 rounded">
        <h3 className="font-semibold mb-2">Current Value:</h3>
        <pre>{JSON.stringify(value, null, 2)}</pre>
      </div>
      
      <div className="mt-4 p-4 bg-blue-50 rounded">
        <h3 className="font-semibold mb-2">Field Configuration:</h3>
        <pre>{JSON.stringify(testMatrixField, null, 2)}</pre>
      </div>
    </div>
  );
}
