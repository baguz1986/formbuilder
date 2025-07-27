'use client';

import React from 'react';
import { FormField } from '@/types/form';
import { cn } from '@/lib/utils';
import { Minus } from 'lucide-react';

interface SectionFieldProps {
  field: FormField;
  sectionNumber?: number;
  totalSections?: number;
  className?: string;
}

export function SectionField({ field, sectionNumber, totalSections, className }: SectionFieldProps) {
  return (
    <div className={cn("py-8 my-6", className)}>
      {/* Section Header */}
      <div className="text-center space-y-4">
        {sectionNumber && totalSections && field.sectionSettings?.showProgress && (
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <span>Section {sectionNumber} of {totalSections}</span>
            <div className="flex space-x-1">
              {Array.from({ length: totalSections }, (_, i) => (
                <div
                  key={i}
                  className={cn(
                    "w-2 h-2 rounded-full",
                    i < sectionNumber ? "bg-blue-500" : "bg-gray-300"
                  )}
                />
              ))}
            </div>
          </div>
        )}
        
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">{field.label}</h2>
          {field.sectionSettings?.description && (
            <p className="text-gray-600 max-w-2xl mx-auto">
              {field.sectionSettings.description}
            </p>
          )}
        </div>
      </div>
      
      {/* Section Divider */}
      <div className="mt-6 mb-8">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">
              <Minus className="w-4 h-4" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
