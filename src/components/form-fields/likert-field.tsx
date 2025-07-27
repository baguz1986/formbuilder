'use client';

import React from 'react';
import { FormField } from '@/types/form';

interface LikertFieldProps {
  field: FormField;
  value?: number;
  onChange?: (value: number) => void;
  disabled?: boolean;
}

export function LikertField({ field, value, onChange, disabled }: LikertFieldProps) {
  const { likertScale } = field;
  
  if (!likertScale) return null;
  
  const { min, max, minLabel, maxLabel, steps = max - min + 1 } = likertScale;

  const handleChange = (selectedValue: number) => {
    if (disabled) return;
    onChange?.(selectedValue);
  };

  const generateScaleValues = () => {
    const values = [];
    for (let i = 0; i < steps; i++) {
      values.push(min + (i * (max - min)) / (steps - 1));
    }
    return values;
  };

  const scaleValues = generateScaleValues();

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div className="space-y-4">
        {/* Scale labels */}
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span className="font-medium">{minLabel || `${min}`}</span>
          <span className="font-medium">{maxLabel || `${max}`}</span>
        </div>
        
        {/* Radio buttons */}
        <div className="flex justify-between items-center">
          {scaleValues.map((scaleValue, index) => {
            const roundedValue = Math.round(scaleValue);
            return (
              <div key={index} className="flex flex-col items-center space-y-2">
                <input
                  type="radio"
                  id={`likert_${field.id}_${roundedValue}`}
                  name={`likert_${field.id}`}
                  value={roundedValue}
                  checked={value === roundedValue}
                  onChange={() => handleChange(roundedValue)}
                  disabled={disabled}
                  className="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label 
                  htmlFor={`likert_${field.id}_${roundedValue}`}
                  className="text-sm text-gray-700 cursor-pointer"
                >
                  {roundedValue}
                </label>
              </div>
            );
          })}
        </div>
        
        {/* Visual scale bar */}
        <div className="relative">
          <div className="w-full h-2 bg-gray-200 rounded-full">
            <div 
              className="h-2 bg-gradient-to-r from-red-400 via-yellow-400 to-green-400 rounded-full transition-all duration-300"
              style={{ 
                width: value ? `${((value - min) / (max - min)) * 100}%` : '0%' 
              }}
            />
          </div>
          {value && (
            <div 
              className="absolute -top-8 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded"
              style={{ 
                left: `${((value - min) / (max - min)) * 100}%` 
              }}
            >
              {value}
            </div>
          )}
        </div>
        
        {/* Clear button */}
        {value && !disabled && (
          <div className="text-center">
            <button
              type="button"
              onClick={() => handleChange(0)}
              className="text-xs text-gray-400 hover:text-gray-600 underline"
            >
              Clear selection
            </button>
          </div>
        )}
      </div>
      
      {field.placeholder && (
        <p className="text-sm text-gray-500">{field.placeholder}</p>
      )}
    </div>
  );
}
