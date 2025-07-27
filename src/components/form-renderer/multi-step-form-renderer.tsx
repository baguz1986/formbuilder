'use client';

import React, { useState } from 'react';
import { FormSchema, FormField } from '@/types/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { MatrixField } from '@/components/form-fields/matrix-field';
import { RatingField } from '@/components/form-fields/rating-field';
import { LikertField } from '@/components/form-fields/likert-field';
import { SectionField } from '@/components/form-fields/section-field';
import { HeadingField } from '@/components/form-fields/heading-field';
import { ImageField } from '@/components/form-fields/image-field';
import { validateField } from '@/lib/form-utils';
import { shouldShowField } from '@/lib/conditional-logic';
import { 
  getNextSectionId, 
  getAllSections, 
  getFieldsInSection, 
  getFieldsBeforeFirstSection,
  getSectionProgress,
  hasSectionBasedNavigation 
} from '@/lib/section-navigation';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MultiStepFormRendererProps {
  form: FormSchema;
  onSubmit: (data: Record<string, any>) => void;
  className?: string;
}

export function MultiStepFormRenderer({ form, onSubmit, className }: MultiStepFormRendererProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentSectionId, setCurrentSectionId] = useState<string | null>(null);

  const sections = getAllSections(form.fields);
  const hasMultipleSections = hasSectionBasedNavigation(form.fields) && sections.length > 0;

  // Initialize current section
  React.useEffect(() => {
    if (hasMultipleSections && !currentSectionId) {
      setCurrentSectionId(sections[0]?.id || null);
    }
  }, [hasMultipleSections, currentSectionId, sections]);

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
    
    // Clear error when user starts typing
    if (errors[fieldId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }

    // Handle section jump logic for radio/select fields
    const field = form.fields.find(f => f.id === fieldId);
    if (field && field.sectionJumpLogic?.enabled && ['radio', 'select'].includes(field.type)) {
      const nextSectionId = getNextSectionId(field, value, form.fields);
      
      if (nextSectionId === 'SUBMIT') {
        // Auto-submit form
        handleSubmit();
      } else if (nextSectionId && nextSectionId !== currentSectionId) {
        // Auto-navigate to next section
        setTimeout(() => {
          setCurrentSectionId(nextSectionId);
        }, 500); // Small delay for better UX
      }
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);

    // Validate all visible fields
    const newErrors: Record<string, string> = {};
    
    form.fields.forEach(field => {
      if (shouldShowField(field, formData)) {
        const error = validateField(field, formData[field.id]);
        if (error) {
          newErrors[field.id] = error;
        }
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      await onSubmit(formData);
      setFormData({});
      setErrors({});
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const goToNextSection = () => {
    if (!currentSectionId) return;
    
    const currentIndex = sections.findIndex(s => s.id === currentSectionId);
    if (currentIndex < sections.length - 1) {
      setCurrentSectionId(sections[currentIndex + 1].id);
    }
  };

  const goToPreviousSection = () => {
    if (!currentSectionId) return;
    
    const currentIndex = sections.findIndex(s => s.id === currentSectionId);
    if (currentIndex > 0) {
      setCurrentSectionId(sections[currentIndex - 1].id);
    }
  };

  const renderField = (field: FormField) => {
    // Section, heading, and image fields should always be shown unless explicitly hidden
    // Other fields check conditional logic
    if (!['section', 'heading', 'image'].includes(field.type) && !shouldShowField(field, formData)) {
      return null;
    }

    const hasError = errors[field.id];
    const value = formData[field.id] || '';

    const fieldComponent = () => {
      switch (field.type) {
        case 'text':
        case 'email':
        case 'number':
          return (
            <Input
              type={field.type}
              id={field.id}
              value={value}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              placeholder={field.placeholder}
              className={cn(hasError && "border-red-500")}
              required={field.required}
            />
          );

        case 'textarea':
          return (
            <Textarea
              id={field.id}
              value={value}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              placeholder={field.placeholder}
              className={cn(hasError && "border-red-500")}
              required={field.required}
            />
          );

        case 'select':
          return (
            <select
              id={field.id}
              value={value}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              className={cn(
                "w-full h-10 px-3 py-2 border border-input rounded-md bg-background text-sm",
                hasError && "border-red-500"
              )}
              required={field.required}
            >
              <option value="">{field.placeholder}</option>
              {field.options?.map((option: string, index: number) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          );

        case 'radio':
          return (
            <div className="space-y-2">
              {field.options?.map((option: string, index: number) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id={`${field.id}-${index}`}
                    name={field.id}
                    value={option}
                    checked={value === option}
                    onChange={(e) => handleFieldChange(field.id, e.target.value)}
                    className="text-primary"
                  />
                  <Label htmlFor={`${field.id}-${index}`} className="text-sm font-normal">
                    {option}
                  </Label>
                  {field.sectionJumpLogic?.enabled && (
                    <span className="text-xs text-gray-500 ml-2">
                      {(() => {
                        const rule = field.sectionJumpLogic.jumpRules.find(r => r.optionValue === option);
                        if (rule?.action === 'jump') {
                          const targetSection = form.fields.find(f => f.id === rule.targetSectionId);
                          return `→ ${targetSection?.label || 'Unknown section'}`;
                        } else if (rule?.action === 'submit') {
                          return '→ Submit form';
                        }
                        return '→ Continue';
                      })()}
                    </span>
                  )}
                </div>
              ))}
            </div>
          );

        case 'checkbox':
          return (
            <div className="space-y-2">
              {field.options?.map((option: string, index: number) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`${field.id}-${index}`}
                    value={option}
                    checked={Array.isArray(value) && value.includes(option)}
                    onChange={(e) => {
                      const currentValues = Array.isArray(value) ? value : [];
                      if (e.target.checked) {
                        handleFieldChange(field.id, [...currentValues, option]);
                      } else {
                        handleFieldChange(field.id, currentValues.filter((v: string) => v !== option));
                      }
                    }}
                    className="text-primary"
                  />
                  <Label htmlFor={`${field.id}-${index}`} className="text-sm font-normal">
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          );

        case 'date':
          return (
            <Input
              type="date"
              id={field.id}
              value={value}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              className={cn(hasError && "border-red-500")}
              required={field.required}
            />
          );

        case 'file':
          return (
            <Input
              type="file"
              id={field.id}
              onChange={(e) => handleFieldChange(field.id, e.target.files?.[0])}
              className={cn(hasError && "border-red-500")}
              required={field.required}
            />
          );

        case 'matrix':
          return (
            <MatrixField
              field={field}
              value={value}
              onChange={(value) => handleFieldChange(field.id, value)}
            />
          );

        case 'rating':
          return (
            <RatingField
              field={field}
              value={value}
              onChange={(value) => handleFieldChange(field.id, value)}
            />
          );

        case 'likert':
          return (
            <LikertField
              field={field}
              value={value}
              onChange={(value) => handleFieldChange(field.id, value)}
            />
          );

        case 'heading':
          return (
            <HeadingField
              field={field}
              isPreview={false}
            />
          );

        case 'image':
          return (
            <ImageField
              field={field}
              isPreview={false}
            />
          );

        case 'section':
          const { current, total } = getSectionProgress(field.id, form.fields);
          return (
            <SectionField
              field={field}
              sectionNumber={current}
              totalSections={total}
            />
          );

        default:
          return null;
      }
    };

    const renderedFieldComponent = fieldComponent();

    // Section, heading, and image fields render themselves completely
    if (['section', 'heading', 'image'].includes(field.type)) {
      return renderedFieldComponent;
    }

    return (
      <div key={field.id} className="space-y-2">
        <Label htmlFor={field.id} className="text-sm font-medium">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        {renderedFieldComponent}
        {hasError && (
          <p className="text-sm text-red-500">{errors[field.id]}</p>
        )}
      </div>
    );
  };

  // For single-page forms or non-section forms
  if (!hasMultipleSections) {
    return (
      <div className={cn("max-w-2xl mx-auto p-6", className)}>
        {form.settings.showTitle && (
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{form.title}</h1>
            {form.settings.showDescription && form.description && (
              <p className="text-gray-600">{form.description}</p>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {form.fields.map(renderField)}

          <div className="pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full"
              size="lg"
            >
              {isSubmitting ? 'Submitting...' : form.settings.submitButtonText}
            </Button>
          </div>
        </form>
      </div>
    );
  }

  // Multi-section form
  const currentSection = sections.find(s => s.id === currentSectionId);
  const currentSectionIndex = sections.findIndex(s => s.id === currentSectionId);
  const fieldsInCurrentSection = currentSectionId ? getFieldsInSection(currentSectionId, form.fields) : [];
  const fieldsBeforeFirstSection = getFieldsBeforeFirstSection(form.fields);
  const isLastSection = currentSectionIndex === sections.length - 1;
  const isFirstSection = currentSectionIndex === 0;

  return (
    <div className={cn("max-w-2xl mx-auto p-6", className)}>
      {form.settings.showTitle && (
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{form.title}</h1>
          {form.settings.showDescription && form.description && (
            <p className="text-gray-600">{form.description}</p>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Render fields that appear before the first section (only when at first section) */}
        {isFirstSection && fieldsBeforeFirstSection.map(field => (
          <div key={field.id}>
            {renderField(field)}
          </div>
        ))}
        
        {/* Render current section */}
        {currentSection && (
          <div key={currentSection.id}>
            {renderField(currentSection)}
          </div>
        )}
        
        {/* Render fields in current section */}
        {fieldsInCurrentSection.map(field => (
          <div key={field.id}>
            {renderField(field)}
          </div>
        ))}

        {/* Navigation buttons */}
        <div className="flex justify-between pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={goToPreviousSection}
            disabled={isFirstSection || !currentSection?.sectionSettings?.allowPrevious}
            className="flex items-center"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            {currentSection?.sectionSettings?.previousButtonText || 'Back'}
          </Button>

          {isLastSection ? (
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center"
            >
              {isSubmitting ? 'Submitting...' : form.settings.submitButtonText}
            </Button>
          ) : (
            <Button
              type="button"
              onClick={goToNextSection}
              disabled={!currentSection?.sectionSettings?.allowNext}
              className="flex items-center"
            >
              {currentSection?.sectionSettings?.nextButtonText || 'Continue'}
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
