'use client';

import React from 'react';
import { FormField } from '@/types/form';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { GripVertical, Trash2, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SignatureField } from '@/components/form-fields/signature-field';
import { HeadingField } from '@/components/form-fields/heading-field';
import { ImageField } from '@/components/form-fields/image-field';
import { FieldImage } from '@/components/form-fields/field-image';

interface FieldEditorProps {
  field: FormField;
  onUpdate: (field: FormField) => void;
  onDelete: (fieldId: string) => void;
  onEdit: (field: FormField) => void;
}

export function FieldEditor({ field, onUpdate, onDelete, onEdit }: FieldEditorProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: field.id, 
    data: {
      type: 'form-field',
      field: field,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleLabelChange = (newLabel: string) => {
    onUpdate({ ...field, label: newLabel });
  };

  const handlePlaceholderChange = (newPlaceholder: string) => {
    onUpdate({ ...field, placeholder: newPlaceholder });
  };

  const handleRequiredChange = (required: boolean) => {
    onUpdate({ ...field, required });
  };

  const renderFieldPreview = () => {
    switch (field.type) {
      case 'text':
      case 'email':
      case 'number':
        return (
          <Input
            type={field.type}
            placeholder={field.placeholder}
            className="w-full"
            disabled
          />
        );
      case 'textarea':
        return (
          <Textarea
            placeholder={field.placeholder}
            className="w-full"
            disabled
          />
        );
      case 'select':
        return (
          <select
            className="w-full h-10 px-3 py-2 border border-input rounded-md bg-background"
            disabled
          >
            <option>{field.placeholder}</option>
            {field.options?.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input type="radio" name={field.id} disabled />
                <label className="text-sm">{option}</label>
              </div>
            ))}
          </div>
        );
      case 'checkbox':
        return (
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input type="checkbox" disabled />
                <label className="text-sm">{option}</label>
              </div>
            ))}
          </div>
        );
      case 'date':
        return (
          <Input
            type="date"
            className="w-full"
            disabled
          />
        );
      case 'file':
        return (
          <Input
            type="file"
            className="w-full"
            disabled
          />
        );
      case 'matrix':
        const matrixRows = field.matrixRows && field.matrixRows.length > 0 
          ? field.matrixRows.slice(0, 2) // Show only first 2 rows for preview
          : ['Row 1', 'Row 2'];
        const matrixColumns = field.matrixColumns && field.matrixColumns.length > 0 
          ? field.matrixColumns.slice(0, 3) // Show only first 3 columns for preview
          : ['Option A', 'Option B', 'Option C'];
        
        return (
          <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-2 text-left border-r w-1/4"></th>
                  {matrixColumns.map((col, index) => (
                    <th key={index} className="p-2 text-center border-r last:border-r-0 truncate max-w-20">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {matrixRows.map((row, rowIndex) => (
                  <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="p-2 text-sm border-r font-medium truncate">{row}</td>
                    {matrixColumns.map((_, colIndex) => (
                      <td key={colIndex} className="p-2 text-center border-r last:border-r-0">
                        {/* Show different input types in preview */}
                        {(field.matrixType === 'radio' || field.matrixType === 'checkbox' || !field.matrixType) ? (
                          <input 
                            type={field.matrixType || 'radio'} 
                            disabled 
                            className="w-3 h-3 cursor-not-allowed opacity-50" 
                          />
                        ) : field.matrixType === 'textarea' ? (
                          <div className="w-16 h-6 bg-gray-100 border border-gray-300 rounded text-xs opacity-50"></div>
                        ) : (
                          <div className="w-12 h-4 bg-gray-100 border border-gray-300 rounded opacity-50"></div>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {(field.matrixRows && field.matrixRows.length > 2) || (field.matrixColumns && field.matrixColumns.length > 3) ? (
              <div className="p-2 text-xs text-gray-500 bg-gray-50 text-center border-t">
                {field.matrixRows?.length || 3} rows × {field.matrixColumns?.length || 5} columns total
              </div>
            ) : null}
          </div>
        );
      case 'rating':
        const maxRating = field.ratingMax || 5;
        const iconMap = {
          star: '⭐',
          heart: '❤️',
          thumbs: '👍',
          number: '#'
        };
        const icon = iconMap[field.ratingIcon || 'star'];
        
        return (
          <div className="flex items-center space-x-1">
            {Array.from({ length: Math.min(maxRating, 5) }, (_, i) => (
              <span key={i} className="text-gray-300 text-lg cursor-not-allowed">
                {field.ratingIcon === 'number' ? i + 1 : icon}
              </span>
            ))}
            {maxRating > 5 && (
              <span className="text-xs text-gray-500 ml-2">...({maxRating} total)</span>
            )}
          </div>
        );
      case 'likert':
        const scale = field.likertScale || { min: 1, max: 5 };
        const scaleRange = Math.min(scale.max - scale.min + 1, 7); // Limit preview to 7 points
        
        return (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-500">
              <span>{scale.minLabel || 'Strongly Disagree'}</span>
              <span>{scale.maxLabel || 'Strongly Agree'}</span>
            </div>
            <div className="flex justify-between items-center">
              {Array.from({ length: scaleRange }, (_, i) => (
                <div key={i} className="flex flex-col items-center">
                  <input type="radio" disabled className="w-3 h-3 mb-1" />
                  <span className="text-xs text-gray-400">{scale.min + i}</span>
                </div>
              ))}
            </div>
            {(scale.max - scale.min + 1) > 7 && (
              <div className="text-xs text-gray-500 text-center">
                {scale.max - scale.min + 1}-point scale
              </div>
            )}
          </div>
        );
      case 'signature':
        return (
          <div className="p-4 bg-gray-50 rounded border-2 border-dashed">
            <SignatureField field={field} isPreview={true} />
          </div>
        );
      case 'heading':
        return (
          <div className="p-2">
            <HeadingField field={field} isPreview={true} />
          </div>
        );
      case 'image':
        return (
          <div className="p-2">
            <ImageField field={field} isPreview={true} onUpdate={onUpdate} />
          </div>
        );
      case 'section':
        return (
          <div className="p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
            <h3 className="font-semibold text-blue-900">{field.label}</h3>
            <p className="text-sm text-blue-700 mt-1">
              {field.sectionSettings?.description || 'Section break'}
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "bg-white border border-gray-200 rounded-lg p-4 mb-4 group hover:border-blue-300 transition-colors",
        isDragging && "opacity-50"
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <button
            className="cursor-grab hover:cursor-grabbing text-gray-400 hover:text-gray-600"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="w-4 h-4" />
          </button>
          <Input
            value={field.label}
            onChange={(e) => handleLabelChange(e.target.value)}
            className="font-medium border-none p-0 h-auto focus-visible:ring-0"
            placeholder="Field Label"
          />
          {field.required && <span className="text-red-500">*</span>}
        </div>
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(field)}
          >
            <Settings className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(field.id)}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="mb-3">
        <Input
          value={field.placeholder || ''}
          onChange={(e) => handlePlaceholderChange(e.target.value)}
          placeholder="Placeholder text"
          className="text-sm text-gray-500 border-dashed"
        />
      </div>

      <div className="mb-3">
        {/* Render field with image based on position */}
        {field.fieldImage?.src ? (
          <div className={`field-with-image ${
            field.fieldImage.position === 'left' || field.fieldImage.position === 'right' 
              ? 'flex items-start gap-4' 
              : 'space-y-3'
          }`}>
            {/* Image above or left */}
            {(field.fieldImage.position === 'above' || field.fieldImage.position === 'left') && (
              <div className={field.fieldImage.position === 'left' ? 'flex-shrink-0' : ''}>
                <FieldImage field={field} />
              </div>
            )}
            
            {/* The actual field */}
            <div className={field.fieldImage.position === 'left' || field.fieldImage.position === 'right' ? 'flex-1' : ''}>
              {renderFieldPreview()}
            </div>
            
            {/* Image below or right */}
            {(field.fieldImage.position === 'below' || field.fieldImage.position === 'right') && (
              <div className={field.fieldImage.position === 'right' ? 'flex-shrink-0' : ''}>
                <FieldImage field={field} />
              </div>
            )}
          </div>
        ) : (
          renderFieldPreview()
        )}
      </div>

      <div className="flex items-center space-x-2 text-sm">
        <input
          type="checkbox"
          id={`required-${field.id}`}
          checked={field.required || false}
          onChange={(e) => handleRequiredChange(e.target.checked)}
        />
        <label htmlFor={`required-${field.id}`} className="text-gray-600">
          Field wajib diisi
        </label>
      </div>
    </div>
  );
}
