'use client';

import React from 'react';
import { FormField } from '@/types/form';

interface FieldImageProps {
  field: FormField;
  className?: string;
}

export function FieldImage({ field, className = '' }: FieldImageProps) {
  if (!field.fieldImage?.src) return null;

  const settings = field.fieldImage;

  return (
    <div className={`field-image ${className}`}>
      <img
        src={settings.src}
        alt={settings.alt || `Image for ${field.label}`}
        className="rounded-lg shadow-sm border border-gray-200"
        style={{
          maxWidth: settings.width || 400,
          maxHeight: settings.height || 300,
          width: 'auto',
          height: 'auto',
          objectFit: 'contain'
        }}
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
        }}
      />
      {settings.alt && (
        <p className="text-xs text-gray-500 mt-1 italic">
          {settings.alt}
        </p>
      )}
    </div>
  );
}
