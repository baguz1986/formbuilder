'use client';

import React from 'react';
import { FormField } from '@/types/form';

interface HeadingFieldProps {
  field: FormField;
  isPreview?: boolean;
}

export function HeadingField({ field, isPreview = false }: HeadingFieldProps) {
  const settings = field.headingSettings || {
    level: 2,
    alignment: 'left',
    color: '#000000'
  };
  
  const headingClasses = {
    1: 'text-4xl font-bold',
    2: 'text-3xl font-semibold', 
    3: 'text-2xl font-semibold',
    4: 'text-xl font-medium',
    5: 'text-lg font-medium',
    6: 'text-base font-medium'
  };

  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  };

  const renderHeading = () => {
    const className = `
      ${headingClasses[settings.level]} 
      ${alignmentClasses[settings.alignment || 'left']}
      mb-2
    `;
    const style = { color: settings.color || '#000000' };

    switch (settings.level) {
      case 1:
        return <h1 className={className} style={style}>{field.label}</h1>;
      case 2:
        return <h2 className={className} style={style}>{field.label}</h2>;
      case 3:
        return <h3 className={className} style={style}>{field.label}</h3>;
      case 4:
        return <h4 className={className} style={style}>{field.label}</h4>;
      case 5:
        return <h5 className={className} style={style}>{field.label}</h5>;
      case 6:
        return <h6 className={className} style={style}>{field.label}</h6>;
      default:
        return <h2 className={className} style={style}>{field.label}</h2>;
    }
  };

  return (
    <div className="py-2">
      {renderHeading()}
    </div>
  );
}
