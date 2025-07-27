'use client';

import React from 'react';
import { FormField } from '@/types/form';

interface MatrixFieldProps {
  field: FormField;
  value?: Record<string, string | Record<string, string>>;
  onChange?: (value: Record<string, string | Record<string, string>>) => void;
  disabled?: boolean;
}

export function MatrixField({ field, value = {}, onChange, disabled }: MatrixFieldProps) {
  // Ensure we always have default values
  const matrixRows = field.matrixRows && field.matrixRows.length > 0 
    ? field.matrixRows 
    : ['Row 1', 'Row 2', 'Row 3'];
    
  const matrixColumns = field.matrixColumns && field.matrixColumns.length > 0 
    ? field.matrixColumns 
    : ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'];
    
  const matrixType = field.matrixType || 'radio';

  const handleChange = (row: string, column: string, inputValue?: string) => {
    if (disabled) return;

    const newValue = { ...value };
    
    if (matrixType === 'radio') {
      newValue[row] = column;
    } else if (matrixType === 'checkbox') {
      // For checkbox type
      const currentRowValue = newValue[row];
      let currentValues: string[] = [];
      
      if (typeof currentRowValue === 'string') {
        currentValues = currentRowValue ? currentRowValue.split(',') : [];
      }
      
      if (currentValues.includes(column)) {
        newValue[row] = currentValues.filter((v: string) => v !== column).join(',');
      } else {
        newValue[row] = [...currentValues, column].join(',');
      }
    } else {
      // For text, number, email, date, textarea inputs
      if (typeof newValue[row] !== 'object' || newValue[row] === null) {
        newValue[row] = {};
      }
      (newValue[row] as Record<string, string>)[column] = inputValue || '';
    }
    
    onChange?.(newValue);
  };

  const isChecked = (row: string, column: string) => {
    const rowValue = value[row];
    
    if (matrixType === 'radio') {
      return rowValue === column;
    } else if (matrixType === 'checkbox') {
      if (typeof rowValue === 'string') {
        const currentValues = rowValue ? rowValue.split(',') : [];
        return currentValues.includes(column);
      }
      return false;
    }
    return false;
  };

  const getInputValue = (row: string, column: string) => {
    const rowValue = value[row];
    if (typeof rowValue === 'object' && rowValue !== null) {
      return (rowValue as Record<string, string>)[column] || '';
    }
    return '';
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      {/* Show message if no matrix data */}
      {(!matrixRows || matrixRows.length === 0 || !matrixColumns || matrixColumns.length === 0) ? (
        <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
          <p className="text-gray-500 text-center">
            Matrix configuration is incomplete. Please configure rows and columns in the field properties.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b border-gray-200">
                  {/* Empty cell for row headers */}
                </th>
                {matrixColumns.map((column, index) => (
                  <th
                    key={index}
                    className="px-4 py-3 text-center text-sm font-medium text-gray-700 border-b border-l border-gray-200"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {matrixRows.map((row, rowIndex) => (
                <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-3 text-sm font-medium text-gray-700 border-b border-gray-200">
                    {row}
                  </td>
                  {matrixColumns.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      className="px-4 py-3 text-center border-b border-l border-gray-200"
                    >
                      {/* Render different input types based on matrixType */}
                      {matrixType === 'radio' || matrixType === 'checkbox' ? (
                        <input
                          type={matrixType}
                          name={matrixType === 'radio' ? `matrix_${rowIndex}` : `matrix_${rowIndex}_${colIndex}`}
                          checked={isChecked(row, column)}
                          onChange={() => handleChange(row, column)}
                          disabled={disabled}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      ) : matrixType === 'textarea' ? (
                        <textarea
                          value={getInputValue(row, column)}
                          onChange={(e) => handleChange(row, column, e.target.value)}
                          disabled={disabled}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                          rows={2}
                          placeholder={`Enter ${column.toLowerCase()}`}
                        />
                      ) : (
                        <input
                          type={matrixType === 'number' ? 'number' : matrixType === 'email' ? 'email' : matrixType === 'date' ? 'date' : 'text'}
                          value={getInputValue(row, column)}
                          onChange={(e) => handleChange(row, column, e.target.value)}
                          disabled={disabled}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                          placeholder={`Enter ${column.toLowerCase()}`}
                        />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
