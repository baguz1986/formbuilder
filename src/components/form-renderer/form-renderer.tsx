'use client';

import React, { useState } from 'react';
import { FormSchema, FormSubmission } from '@/types/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { MatrixField } from '@/components/form-fields/matrix-field';
import { RatingField } from '@/components/form-fields/rating-field';
import { LikertField } from '@/components/form-fields/likert-field';
import { SectionField } from '@/components/form-fields/section-field';
import { SignatureField } from '@/components/form-fields/signature-field';
import { HeadingField } from '@/components/form-fields/heading-field';
import { ImageField } from '@/components/form-fields/image-field';
import { FieldImage } from '@/components/form-fields/field-image';
import { validateField } from '@/lib/form-utils';
import { shouldShowField } from '@/lib/conditional-logic';
import { gradeEssay } from '@/lib/essay-grading';
import { cn } from '@/lib/utils';

interface FormRendererProps {
  form: FormSchema;
  onSubmit: (data: Record<string, any>) => void;
  className?: string;
}

export function FormRenderer({ form, onSubmit, className }: FormRendererProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [essayGrades, setEssayGrades] = useState<Record<string, any>>({});

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

    // Clear essay grade when user changes answer
    if (essayGrades[fieldId]) {
      setEssayGrades(prev => {
        const newGrades = { ...prev };
        delete newGrades[fieldId];
        return newGrades;
      });
    }
  };

  const handleEssayGrading = (fieldId: string, field: any) => {
    const answer = formData[fieldId] || '';
    if (!answer.trim() || !field.quizSettings?.essayKeyAnswer) return;

    const result = gradeEssay(
      answer,
      field.quizSettings.essayKeyAnswer,
      field.quizSettings.essayKeywords || [],
      field.quizSettings.essayMinWords || 50,
      field.quizSettings.essayMaxWords || 500,
      field.quizSettings.essayPassingThreshold || 60,
      field.quizSettings.essayGradingType || 'ai'
    );

    setEssayGrades(prev => ({ ...prev, [fieldId]: result }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate all fields
    const newErrors: Record<string, string> = {};
    
    form.fields.forEach(field => {
      const error = validateField(field, formData[field.id]);
      if (error) {
        newErrors[field.id] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      await onSubmit(formData);
      // Reset form after successful submission
      setFormData({});
      setErrors({});
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field: any) => {
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
          const isTextEssayQuiz = field.type === 'text' && field.quizSettings?.enabled;
          const textEssayGrade = essayGrades[field.id];
          
          return (
            <div className="space-y-2">
              <Input
                type={field.type}
                id={field.id}
                value={value}
                onChange={(e) => handleFieldChange(field.id, e.target.value)}
                placeholder={field.placeholder}
                className={cn(hasError && "border-red-500")}
                required={field.required}
                minLength={isTextEssayQuiz ? field.quizSettings?.essayMinWords : undefined}
                maxLength={isTextEssayQuiz ? field.quizSettings?.essayMaxWords : undefined}
              />
              
              {isTextEssayQuiz && (
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleEssayGrading(field.id, field)}
                    disabled={!value.trim()}
                  >
                    Grade Answer
                  </Button>
                  
                  {textEssayGrade && (
                    <div className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium",
                      textEssayGrade.passed ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    )}>
                      {textEssayGrade.percentage}% ({textEssayGrade.passed ? 'Pass' : 'Fail'})
                    </div>
                  )}
                </div>
              )}
              
              {textEssayGrade && (
                <div className="text-sm space-y-1">
                  <div className="text-gray-600">
                    Words: {textEssayGrade.wordCount} | Similarity: {Math.round(textEssayGrade.similarityScore * 100)}%
                  </div>
                  {textEssayGrade.keywordsFound.length > 0 && (
                    <div className="text-green-600">
                      Keywords found: {textEssayGrade.keywordsFound.join(', ')}
                    </div>
                  )}
                  {textEssayGrade.keywordsMissing.length > 0 && (
                    <div className="text-red-600">
                      Missing keywords: {textEssayGrade.keywordsMissing.join(', ')}
                    </div>
                  )}
                  {textEssayGrade.feedback && (
                    <div className="text-blue-600 italic">
                      {textEssayGrade.feedback}
                    </div>
                  )}
                </div>
              )}
            </div>
          );

        case 'textarea':
          const isTextareaEssayQuiz = field.quizSettings?.enabled;
          const textareaEssayGrade = essayGrades[field.id];
          
          return (
            <div className="space-y-2">
              <Textarea
                id={field.id}
                value={value}
                onChange={(e) => handleFieldChange(field.id, e.target.value)}
                placeholder={field.placeholder}
                className={cn(hasError && "border-red-500")}
                required={field.required}
                rows={isTextareaEssayQuiz ? 6 : 3}
              />
              
              {isTextareaEssayQuiz && (
                <div className="flex items-center gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleEssayGrading(field.id, field)}
                    disabled={!value.trim()}
                  >
                    Nilai Esai
                  </Button>
                  
                  <div className="text-sm text-gray-500">
                    Jumlah kata: {value.trim().split(/\s+/).filter((w: string) => w).length}
                    {field.quizSettings?.essayMinWords && ` (min: ${field.quizSettings.essayMinWords})`}
                    {field.quizSettings?.essayMaxWords && ` (maks: ${field.quizSettings.essayMaxWords})`}
                  </div>
                  
                  {textareaEssayGrade && (
                    <div className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium",
                      textareaEssayGrade.passed ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    )}>
                      Score: {textareaEssayGrade.percentage}% ({textareaEssayGrade.passed ? 'Lulus' : 'Gagal'})
                    </div>
                  )}
                </div>
              )}
              
              {textareaEssayGrade && (
                <div className="bg-gray-50 p-3 rounded-md space-y-2 text-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="font-medium">Skor Kemiripan:</span> {Math.round(textareaEssayGrade.similarityScore * 100)}%
                    </div>
                    <div>
                      <span className="font-medium">Jumlah Kata:</span> {textareaEssayGrade.wordCount}
                    </div>
                  </div>
                  
                  {textareaEssayGrade.keywordsFound.length > 0 && (
                    <div>
                      <span className="font-medium text-green-600">Kata Kunci Ditemukan:</span>{' '}
                      <span className="text-green-600">{textareaEssayGrade.keywordsFound.join(', ')}</span>
                    </div>
                  )}
                  
                  {textareaEssayGrade.keywordsMissing.length > 0 && (
                    <div>
                      <span className="font-medium text-red-600">Kata Kunci Hilang:</span>{' '}
                      <span className="text-red-600">{textareaEssayGrade.keywordsMissing.join(', ')}</span>
                    </div>
                  )}
                  
                  {textareaEssayGrade.feedback && (
                    <div className="border-t pt-2">
                      <span className="font-medium">Feedback:</span>
                      <div className="italic text-blue-700 mt-1">{textareaEssayGrade.feedback}</div>
                    </div>
                  )}
                </div>
              )}
            </div>
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

        case 'signature':
          return (
            <SignatureField
              field={field}
              value={value}
              onChange={(value) => handleFieldChange(field.id, value)}
            />
          );

        case 'heading':
          console.log('Rendering heading field:', field.label);
          return (
            <HeadingField
              field={field}
              isPreview={false}
            />
          );

        case 'image':
          console.log('Rendering image field:', field.label, field.imageSettings?.src);
          return (
            <ImageField
              field={field}
              isPreview={false}
            />
          );

        case 'section':
          return (
            <SectionField
              field={field}
              sectionNumber={1} // TODO: Calculate section number
              totalSections={1} // TODO: Calculate total sections
            />
          );

        default:
          return null;
      }
    };

    const renderedFieldComponent = fieldComponent();

    // Section fields render themselves completely
    if (field.type === 'section') {
      return renderedFieldComponent;
    }

    // Heading and Image fields don't need the standard field wrapper
    if (['heading', 'image'].includes(field.type)) {
      return renderedFieldComponent;
    }

    return (
      <div key={field.id} className="space-y-3">
        {/* Field with image based on position */}
        {field.fieldImage?.src ? (
          <div>
            <Label htmlFor={field.id} className="text-sm font-medium block mb-2">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            
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
                {renderedFieldComponent}
              </div>
              
              {/* Image below or right */}
              {(field.fieldImage.position === 'below' || field.fieldImage.position === 'right') && (
                <div className={field.fieldImage.position === 'right' ? 'flex-shrink-0' : ''}>
                  <FieldImage field={field} />
                </div>
              )}
            </div>
          </div>
        ) : (
          <div>
            <Label htmlFor={field.id} className="text-sm font-medium">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            {renderedFieldComponent}
          </div>
        )}
        
        {hasError && (
          <p className="text-sm text-red-500">{errors[field.id]}</p>
        )}
      </div>
    );
  };

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
        {form.fields.map((field) => (
          <div key={field.id}>
            {renderField(field)}
          </div>
        ))}

        <div className="pt-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full"
            size="lg"
          >
            {isSubmitting ? 'Mengirim...' : form.settings.submitButtonText}
          </Button>
        </div>
      </form>
    </div>
  );
}
