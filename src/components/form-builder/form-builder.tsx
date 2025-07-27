'use client';

import React, { useState } from 'react';
import { FormSchema, FormField } from '@/types/form';
import { DndContext, closestCenter, DragEndEvent, DragOverEvent, useDroppable, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { FieldPalette } from './field-palette';
import { FieldEditor } from './field-editor';
import { FieldProperties } from './field-properties';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useSettings } from '@/components/settings-provider';
import { createFieldFromTemplate, fieldTemplates } from '@/lib/form-utils';
import { Eye, Save, Settings, ArrowLeft, X, FormInput } from 'lucide-react';
import Link from 'next/link';

// Droppable Form Area Component
function DroppableFormArea({ children }: { children: React.ReactNode }) {
  const { isOver, setNodeRef } = useDroppable({
    id: 'form-area',
  });

  return (
    <div
      ref={setNodeRef}
      className={`min-h-[400px] p-6 rounded-lg transition-all duration-200 ${
        isOver 
          ? 'bg-blue-50 border-2 border-dashed border-blue-300' 
          : 'bg-white/30 border-2 border-dashed border-gray-200'
      }`}
    >
      {children}
    </div>
  );
}

interface FormBuilderProps {
  form: FormSchema;
  onFormUpdate: (form: FormSchema) => void;
  onPreview: () => void;
  onSave: () => void;
}

export function FormBuilder({ form, onFormUpdate, onPreview, onSave }: FormBuilderProps) {
  const { settings } = useSettings();
  const [selectedField, setSelectedField] = useState<FormField | null>(null);
  const [showFormSettings, setShowFormSettings] = useState(false);
  const [showPalette, setShowPalette] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draggedFieldType, setDraggedFieldType] = useState<string | null>(null);

  const handleFieldSelect = (fieldType: string) => {
    const newField = createFieldFromTemplate(fieldType);
    const updatedForm = {
      ...form,
      fields: [...form.fields, newField],
    };
    onFormUpdate(updatedForm);
  };

  const handleFieldUpdate = (updatedField: FormField) => {
    const updatedFields = form.fields.map(field =>
      field.id === updatedField.id ? updatedField : field
    );
    onFormUpdate({
      ...form,
      fields: updatedFields,
    });
  };

  const handleFieldDelete = (fieldId: string) => {
    const updatedFields = form.fields.filter(field => field.id !== fieldId);
    onFormUpdate({
      ...form,
      fields: updatedFields,
    });
  };

  const handleFieldEdit = (field: FormField) => {
    setSelectedField(field);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
    
    // If dragging from palette, store the field type
    if (active.data.current?.type === 'palette-item') {
      setDraggedFieldType(active.data.current.fieldType);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    setActiveId(null);
    setDraggedFieldType(null);

    if (!over) return;

    // Handle dragging from palette to form area
    if (active.data.current?.type === 'palette-item') {
      const fieldType = active.data.current.fieldType;
      const newField = createFieldFromTemplate(fieldType);

      // If dropped over form area or existing field, add the field
      if (over.id === 'form-area' || over.data.current?.type === 'form-field') {
        // If dropped over an existing field, insert at that position
        if (over.data.current?.type === 'form-field') {
          const overIndex = form.fields.findIndex(field => field.id === over.id);
          const updatedFields = [...form.fields];
          updatedFields.splice(overIndex + 1, 0, newField);
          
          onFormUpdate({
            ...form,
            fields: updatedFields,
          });
        } else {
          // Otherwise, add to end
          onFormUpdate({
            ...form,
            fields: [...form.fields, newField],
          });
        }
      }
      return;
    }

    // Handle reordering existing fields
    if (active.id !== over.id && active.data.current?.type === 'form-field') {
      const oldIndex = form.fields.findIndex(field => field.id === active.id);
      const newIndex = form.fields.findIndex(field => field.id === over.id);

      const updatedFields = arrayMove(form.fields, oldIndex, newIndex);
      onFormUpdate({
        ...form,
        fields: updatedFields,
      });
    }
  };

  const updateFormMeta = (updates: Partial<FormSchema>) => {
    onFormUpdate({ ...form, ...updates });
  };

  const updateFormSettings = (updates: Partial<FormSchema['settings']>) => {
    onFormUpdate({
      ...form,
      settings: { ...form.settings, ...updates },
    });
  };

  // Drag Overlay Component
  const renderDragOverlay = () => {
    if (!activeId) return null;

    if (draggedFieldType) {
      // Dragging from palette
      const template = fieldTemplates[draggedFieldType];
      if (!template) return null;

      return (
        <div className="bg-white rounded-lg shadow-lg p-4 border-2 border-blue-300">
          <div className="font-medium text-gray-900">{template.label}</div>
          <div className="text-xs text-gray-500 mt-1">Drop to add to form</div>
        </div>
      );
    }

    // Dragging existing field
    const draggedField = form.fields.find((f: FormField) => f.id === activeId);
    if (!draggedField) return null;

    return (
      <div className="bg-white rounded-lg shadow-lg p-4 border-2 border-blue-300 opacity-90">
        <div className="font-medium text-gray-900">{draggedField.label}</div>
        <div className="text-xs text-gray-500 mt-1">Reordering field</div>
      </div>
    );
  };

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex h-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Mobile Palette Toggle */}
        <div className="lg:hidden fixed top-4 left-4 z-50">
          <Button
            onClick={() => setShowPalette(!showPalette)}
            className="bg-white/90 hover:bg-white shadow-lg rounded-xl"
            size="sm"
          >
            <FormInput className="w-4 h-4" />
          </Button>
        </div>

        {/* Field Palette - Responsive */}
        <div className={`
          ${showPalette ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          fixed lg:relative top-0 left-0 z-40 lg:z-auto
          w-80 h-full lg:h-auto
          bg-white/95 lg:bg-white/90 backdrop-blur-sm 
          border-r border-gray-200/50 shadow-xl 
          overflow-y-auto flex-shrink-0
          transition-transform duration-300 ease-in-out
        `}>
          <FieldPalette onFieldSelect={handleFieldSelect} />
          
          {/* Mobile Close Button */}
          <div className="lg:hidden absolute top-4 right-4">
            <Button
              onClick={() => setShowPalette(false)}
              variant="ghost"
              size="sm"
              className="bg-white/50 hover:bg-white/70"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Overlay for mobile */}
        {showPalette && (
          <div 
            className="lg:hidden fixed inset-0 bg-black/20 z-30"
            onClick={() => setShowPalette(false)}
          />
        )}
        
        <div className="flex-1 flex flex-col min-w-0">{/* Added min-w-0 for mobile overflow */}
          {/* Header */}
          <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 p-3 sm:p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex-1 mr-2 sm:mr-4 min-w-0">
                <Input
                  value={form.title}
                  onChange={(e) => updateFormMeta({ title: e.target.value })}
                  className="text-lg sm:text-xl font-semibold border-none p-0 h-auto bg-transparent focus-visible:ring-0 text-gray-900"
                  placeholder="Form Tanpa Judul"
                />
                <Textarea
                  value={form.description || ''}
                  onChange={(e) => updateFormMeta({ description: e.target.value })}
                  className="mt-2 text-gray-600 border-none p-0 min-h-[40px] sm:min-h-[60px] resize-none focus-visible:ring-0 bg-transparent text-sm sm:text-base"
                  placeholder="Deskripsi form (opsional)"
                />
              </div>
              <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                <Link href="/dashboard">
                  <Button variant="outline" className="border-white/20 bg-white/50 hover:bg-white/70 rounded-xl backdrop-blur-sm text-xs sm:text-sm px-2 sm:px-4">
                    <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                    <span className="hidden sm:inline">Dashboard</span>
                  </Button>
                </Link>
                <Button variant="outline" onClick={() => setShowFormSettings(true)} className="border-white/20 bg-white/50 hover:bg-white/70 rounded-xl backdrop-blur-sm text-xs sm:text-sm px-2 sm:px-4">
                  <Settings className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Pengaturan</span>
                </Button>
                <Button variant="outline" onClick={onPreview} className="border-white/20 bg-white/50 hover:bg-white/70 rounded-xl backdrop-blur-sm text-xs sm:text-sm px-2 sm:px-4">
                  <Eye className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Pratinjau</span>
                </Button>
                <Button 
                  onClick={onSave} 
                  className="text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl text-xs sm:text-sm px-2 sm:px-4"
                  style={{ 
                    backgroundColor: settings?.primaryColor || '#6366f1',
                    borderColor: settings?.primaryColor || '#6366f1'
                  }}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Simpan Form
                </Button>
              </div>
            </div>
          </div>

          {/* Form Canvas */}
          <div className="flex-1 overflow-auto p-6">
            <div className="max-w-2xl mx-auto">
              {form.fields.length === 0 ? (
                <DroppableFormArea>
                  <div className="text-center py-12 text-gray-500">
                    <div className="text-lg font-medium mb-2 text-gray-700">Form Anda masih kosong</div>
                    <div className="text-gray-600">Seret dan letakkan elemen dari panel kiri untuk mulai membangun form Anda</div>
                  </div>
                </DroppableFormArea>
              ) : (
                <DroppableFormArea>
                  <SortableContext
                    items={form.fields.map(field => field.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {form.fields.map((field) => (
                      <FieldEditor
                        key={field.id}
                        field={field}
                        onUpdate={handleFieldUpdate}
                        onDelete={handleFieldDelete}
                        onEdit={handleFieldEdit}
                      />
                    ))}
                  </SortableContext>

                  {form.fields.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-white/20">
                      <Button size="lg" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl">
                        {form.settings.submitButtonText}
                      </Button>
                    </div>
                  )}
                </DroppableFormArea>
              )}
            </div>
          </div>
        </div>
      </div>

      <DragOverlay>
        {renderDragOverlay()}
      </DragOverlay>

      {/* Field Properties Modal */}
      {selectedField && (
        <FieldProperties
          field={selectedField}
          onUpdate={handleFieldUpdate}
          onClose={() => setSelectedField(null)}
          allFields={form.fields}
        />
      )}

      {/* Form Settings Modal */}
      {showFormSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl w-full max-w-md border border-white/20">
            <div className="flex items-center justify-between p-6 border-b border-white/20">
              <h3 className="text-lg font-semibold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Pengaturan Form</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowFormSettings(false)} className="hover:bg-white/50 rounded-xl">
                ×
              </Button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Teks Tombol Submit</label>
                <Input
                  value={form.settings.submitButtonText}
                  onChange={(e) => updateFormSettings({ submitButtonText: e.target.value })}
                  placeholder="Kirim"
                  className="bg-white/50 border-white/20 focus:border-blue-300 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">URL Redirect (opsional)</label>
                <Input
                  value={form.settings.redirectUrl || ''}
                  onChange={(e) => updateFormSettings({ redirectUrl: e.target.value })}
                  placeholder="https://contoh.com/terima-kasih"
                  className="bg-white/50 border-white/20 focus:border-blue-300 rounded-xl"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="showTitle"
                  checked={form.settings.showTitle}
                  onChange={(e) => updateFormSettings({ showTitle: e.target.checked })}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="showTitle" className="text-sm text-gray-700">Tampilkan judul form</label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="showDescription"
                  checked={form.settings.showDescription}
                  onChange={(e) => updateFormSettings({ showDescription: e.target.checked })}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="showDescription" className="text-sm text-gray-700">Tampilkan deskripsi form</label>
              </div>
            </div>
            <div className="flex justify-end gap-2 p-6 border-t border-white/20">
              <Button variant="outline" onClick={() => setShowFormSettings(false)} className="border-white/20 bg-white/50 hover:bg-white/70 rounded-xl">
                Tutup
              </Button>
            </div>
          </div>
        </div>
      )}
    </DndContext>
  );
}
