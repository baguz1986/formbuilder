'use client';

import React from 'react';
import { fieldTemplates } from '@/lib/form-utils';
import { Button } from '@/components/ui/button';
import { useDraggable } from '@dnd-kit/core';
import { 
  Type, 
  Mail, 
  Hash, 
  FileText, 
  ChevronDown, 
  Circle, 
  Square, 
  Calendar, 
  Upload,
  Grid3X3,
  Star,
  BarChart3,
  Layers,
  PenTool,
  Heading,
  Image
} from 'lucide-react';

const fieldIcons = {
  text: Type,
  email: Mail,
  number: Hash,
  textarea: FileText,
  select: ChevronDown,
  radio: Circle,
  checkbox: Square,
  date: Calendar,
  file: Upload,
  matrix: Grid3X3,
  rating: Star,
  likert: BarChart3,
  section: Layers,
  signature: PenTool,
  heading: Heading,
  image: Image
};

interface FieldPaletteProps {
  onFieldSelect: (fieldType: string) => void;
}

interface DraggableFieldButtonProps {
  type: string;
  template: any;
  Icon: React.ComponentType<{ className?: string }>;
  onFieldSelect: (fieldType: string) => void;
}

function DraggableFieldButton({ type, template, Icon, onFieldSelect }: DraggableFieldButtonProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: `palette-${type}`,
    data: {
      type: 'palette-item',
      fieldType: type,
    },
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <Button
      ref={setNodeRef}
      style={style}
      variant="outline"
      className={`w-full justify-start text-left h-auto p-3 hover:bg-blue-50 hover:border-blue-200 transition-colors border-gray-200 bg-white/50 backdrop-blur-sm cursor-grab active:cursor-grabbing ${
        isDragging ? 'opacity-50 shadow-lg' : ''
      }`}
      onClick={() => onFieldSelect(type)}
      {...listeners}
      {...attributes}
    >
      <div className="bg-blue-100 rounded-lg p-1.5 mr-3">
        <Icon className="w-4 h-4 text-blue-600" />
      </div>
      <div>
        <div className="font-medium text-gray-900">{template.label}</div>
        <div className="text-xs text-gray-500 capitalize">{type}</div>
      </div>
    </Button>
  );
}

const fieldCategories = {
  'Field Layout': ['section', 'heading', 'image'],
  'Field Dasar': ['text', 'email', 'number', 'textarea', 'date', 'file'],
  'Field Pilihan': ['select', 'radio', 'checkbox'],
  'Field Lanjutan': ['matrix', 'rating', 'likert', 'signature'],
};

export function FieldPalette({ onFieldSelect }: FieldPaletteProps) {
  return (
    <div className="p-4 pb-6 space-y-6 min-h-full">
      {Object.entries(fieldCategories).map(([category, fieldTypes]) => (
        <div key={category}>
          <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
            {category}
          </h4>
          <div className="space-y-2 pb-2">
            {fieldTypes.map((type) => {
              const template = fieldTemplates[type];
              const Icon = fieldIcons[type as keyof typeof fieldIcons];
              return (
                <DraggableFieldButton
                  key={type}
                  type={type}
                  template={template}
                  Icon={Icon}
                  onFieldSelect={onFieldSelect}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
