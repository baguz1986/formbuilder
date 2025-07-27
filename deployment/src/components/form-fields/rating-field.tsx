'use client';

import React, { useState } from 'react';
import { FormField } from '@/types/form';
import { Star, Heart, ThumbsUp } from 'lucide-react';

interface RatingFieldProps {
  field: FormField;
  value?: number;
  onChange?: (value: number) => void;
  disabled?: boolean;
}

export function RatingField({ field, value = 0, onChange, disabled }: RatingFieldProps) {
  const [hoverValue, setHoverValue] = useState(0);
  const { ratingMax = 5, ratingIcon = 'star' } = field;

  const handleClick = (rating: number) => {
    if (disabled) return;
    onChange?.(rating);
  };

  const handleMouseEnter = (rating: number) => {
    if (disabled) return;
    setHoverValue(rating);
  };

  const handleMouseLeave = () => {
    setHoverValue(0);
  };

  const getIcon = (index: number) => {
    const isActive = index <= (hoverValue || value);
    const iconClass = `w-8 h-8 cursor-pointer transition-colors ${
      isActive ? 'text-yellow-400 fill-current' : 'text-gray-300'
    } ${disabled ? 'cursor-not-allowed' : 'hover:text-yellow-400'}`;

    switch (ratingIcon) {
      case 'heart':
        return <Heart className={iconClass} />;
      case 'thumbs':
        return <ThumbsUp className={iconClass} />;
      case 'number':
        return (
          <div
            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium cursor-pointer transition-colors ${
              isActive 
                ? 'bg-blue-500 text-white border-blue-500' 
                : 'bg-white text-gray-500 border-gray-300'
            } ${disabled ? 'cursor-not-allowed' : 'hover:border-blue-400'}`}
          >
            {index}
          </div>
        );
      default:
        return <Star className={iconClass} />;
    }
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div className="flex items-center space-x-2">
        {Array.from({ length: ratingMax }, (_, index) => {
          const rating = index + 1;
          return (
            <div
              key={rating}
              onClick={() => handleClick(rating)}
              onMouseEnter={() => handleMouseEnter(rating)}
              onMouseLeave={handleMouseLeave}
              className="transition-transform hover:scale-110"
            >
              {getIcon(rating)}
            </div>
          );
        })}
        
        {value > 0 && (
          <div className="ml-4 flex items-center space-x-2">
            <span className="text-sm text-gray-600">
              {value} of {ratingMax}
            </span>
            {!disabled && (
              <button
                type="button"
                onClick={() => handleClick(0)}
                className="text-xs text-gray-400 hover:text-gray-600 underline"
              >
                Clear
              </button>
            )}
          </div>
        )}
      </div>
      
      {field.placeholder && (
        <p className="text-sm text-gray-500">{field.placeholder}</p>
      )}
    </div>
  );
}
