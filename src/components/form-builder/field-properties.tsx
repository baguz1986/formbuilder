'use client';

import React, { useState } from 'react';
import { FormField } from '@/types/form';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { X, Star, Plus, Trash2 } from 'lucide-react';
import { getAvailableFieldsForConditions, getOperatorsForFieldType } from '@/lib/conditional-logic';

interface FieldPropertiesProps {
  field: FormField | null;
  allFields: FormField[]; // Add this to access all fields for conditional logic
  onUpdate: (field: FormField) => void;
  onClose: () => void;
}

export function FieldProperties({ field, allFields, onUpdate, onClose }: FieldPropertiesProps) {
  const [localField, setLocalField] = useState<FormField | null>(field);

  React.useEffect(() => {
    setLocalField(field);
  }, [field]);

  if (!localField) return null;

  const handleSave = () => {
    onUpdate(localField);
    onClose();
  };

  const updateField = (updates: Partial<FormField>) => {
    setLocalField(prev => prev ? { ...prev, ...updates } : null);
  };

  const updateValidation = (updates: Partial<FormField['validation']>) => {
    setLocalField(prev => prev ? {
      ...prev,
      validation: { ...prev.validation, ...updates }
    } : null);
  };

  const addOption = () => {
    const newOptions = [...(localField.options || []), `Opsi ${(localField.options?.length || 0) + 1}`];
    updateField({ options: newOptions });
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...(localField.options || [])];
    newOptions[index] = value;
    updateField({ options: newOptions });
  };

  const removeOption = (index: number) => {
    const newOptions = [...(localField.options || [])];
    newOptions.splice(index, 1);
    updateField({ options: newOptions });
  };

  const hasOptions = ['select', 'radio', 'checkbox'].includes(localField.type);
  const hasValidation = ['text', 'email', 'number', 'textarea'].includes(localField.type);
  const isMatrix = localField.type === 'matrix';
  const isRating = localField.type === 'rating';
  const isLikert = localField.type === 'likert';
  const isSection = localField.type === 'section';
  const isSignature = localField.type === 'signature';
  const isHeading = localField.type === 'heading';
  const isImage = localField.type === 'image';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-white/20">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Edit Properti Field
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="hover:bg-gray-100 rounded-xl">
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <Label htmlFor="label">Label Field</Label>
            <Input
              id="label"
              value={localField.label}
              onChange={(e) => updateField({ label: e.target.value })}
              placeholder="Label field"
            />
          </div>

          <div>
            <Label htmlFor="placeholder">Placeholder</Label>
            <Input
              id="placeholder"
              value={localField.placeholder || ''}
              onChange={(e) => updateField({ placeholder: e.target.value })}
              placeholder="Teks placeholder"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="required"
              checked={localField.required || false}
              onChange={(e) => updateField({ required: e.target.checked })}
            />
            <Label htmlFor="required">Field wajib diisi</Label>
          </div>

          {/* Field Image Section - Available for all field types except image and heading */}
          {!['image', 'heading', 'section'].includes(localField.type) && (
            <div className="space-y-4 border-t pt-4">
              <Label className="text-base font-medium">Lampirkan Gambar ke Field</Label>
              <p className="text-sm text-gray-600">Tambahkan gambar ke field ini (berguna untuk pertanyaan dengan konten visual)</p>
              
              <div>
                <Label htmlFor="fieldImageSrc">URL Gambar</Label>
                <Input
                  id="fieldImageSrc"
                  value={localField.fieldImage?.src || ''}
                  onChange={(e) => updateField({ 
                    fieldImage: { 
                      ...localField.fieldImage,
                      src: e.target.value,
                      alt: localField.fieldImage?.alt || '',
                      width: localField.fieldImage?.width || 400,
                      height: localField.fieldImage?.height || 300,
                      position: localField.fieldImage?.position || 'above',
                    } 
                  })}
                  placeholder="https://contoh.com/gambar.jpg atau upload file"
                />
              </div>

              {localField.fieldImage?.src && (
                <>
                  <div>
                    <Label htmlFor="fieldImageAlt">Deskripsi Gambar (Alt Text)</Label>
                    <Input
                      id="fieldImageAlt"
                      value={localField.fieldImage?.alt || ''}
                      onChange={(e) => updateField({ 
                        fieldImage: { 
                          ...localField.fieldImage,
                          alt: e.target.value
                        } 
                      })}
                      placeholder="Describe what the image shows"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="fieldImageWidth">Max Width</Label>
                      <Input
                        id="fieldImageWidth"
                        type="number"
                        value={localField.fieldImage?.width || 400}
                        onChange={(e) => updateField({ 
                          fieldImage: { 
                            ...localField.fieldImage,
                            width: parseInt(e.target.value) || 400
                          } 
                        })}
                        placeholder="400"
                      />
                    </div>

                    <div>
                      <Label htmlFor="fieldImageHeight">Max Height</Label>
                      <Input
                        id="fieldImageHeight"
                        type="number"
                        value={localField.fieldImage?.height || 300}
                        onChange={(e) => updateField({ 
                          fieldImage: { 
                            ...localField.fieldImage,
                            height: parseInt(e.target.value) || 300
                          } 
                        })}
                        placeholder="300"
                      />
                    </div>

                    <div>
                      <Label htmlFor="fieldImagePosition">Position</Label>
                      <select
                        id="fieldImagePosition"
                        value={localField.fieldImage?.position || 'above'}
                        onChange={(e) => updateField({ 
                          fieldImage: { 
                            ...localField.fieldImage,
                            position: e.target.value as 'above' | 'below' | 'left' | 'right'
                          } 
                        })}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="above">Above field</option>
                        <option value="below">Below field</option>
                        <option value="left">Left of field</option>
                        <option value="right">Right of field</option>
                      </select>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm font-medium mb-2">Preview:</p>
                    <img
                      src={localField.fieldImage.src}
                      alt={localField.fieldImage.alt || 'Field image preview'}
                      className="max-w-full h-auto rounded border"
                      style={{
                        maxWidth: Math.min(localField.fieldImage.width || 400, 300),
                        maxHeight: Math.min(localField.fieldImage.height || 300, 200)
                      }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => updateField({ fieldImage: undefined })}
                    className="text-sm text-red-600 hover:text-red-800 underline"
                  >
                    Remove image
                  </button>
                </>
              )}
            </div>
          )}

          {hasOptions && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Options</Label>
                <Button type="button" variant="outline" size="sm" onClick={addOption}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add Option
                </Button>
              </div>
              <div className="space-y-2">
                {(localField.options || []).map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeOption(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quiz Settings for Multiple Choice Questions */}
          {hasOptions && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">Quiz Settings</Label>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="enableQuiz"
                    checked={localField.quizSettings?.enabled || false}
                    onChange={(e) => {
                      if (e.target.checked) {
                        updateField({
                          quizSettings: {
                            enabled: true,
                            correctAnswer: localField.type === 'checkbox' ? [] : '',
                            points: 1,
                            explanation: '',
                            showExplanation: 'always'
                          }
                        });
                      } else {
                        updateField({ quizSettings: undefined });
                      }
                    }}
                  />
                  <Label htmlFor="enableQuiz" className="text-sm cursor-pointer">
                    Enable Quiz Mode
                  </Label>
                </div>
              </div>

              {localField.quizSettings?.enabled && (
                <div className="space-y-4 pl-4 border-l-2 border-blue-200">
                  <div className="text-sm text-gray-600">
                    Configure correct answers and scoring for this question.
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Correct Answer(s)</Label>
                    <div className="mt-2 space-y-2">
                      {localField.type === 'radio' && (
                        <div className="space-y-2">
                          {localField.options?.map((option, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <input
                                type="radio"
                                name="correctAnswer"
                                id={`correct-${index}`}
                                checked={localField.quizSettings?.correctAnswer === option}
                                onChange={() => updateField({
                                  quizSettings: {
                                    ...localField.quizSettings!,
                                    correctAnswer: option
                                  }
                                })}
                                className="w-4 h-4 text-green-600"
                              />
                              <Label htmlFor={`correct-${index}`} className="text-sm">
                                {option}
                              </Label>
                            </div>
                          ))}
                        </div>
                      )}

                      {localField.type === 'checkbox' && (
                        <div className="space-y-2">
                          {localField.options?.map((option, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id={`correct-multi-${index}`}
                                checked={Array.isArray(localField.quizSettings?.correctAnswer) && 
                                         localField.quizSettings.correctAnswer.includes(option)}
                                onChange={(e) => {
                                  const currentAnswers = Array.isArray(localField.quizSettings?.correctAnswer) 
                                    ? localField.quizSettings.correctAnswer 
                                    : [];
                                  
                                  let newAnswers;
                                  if (e.target.checked) {
                                    newAnswers = [...currentAnswers, option];
                                  } else {
                                    newAnswers = currentAnswers.filter(a => a !== option);
                                  }
                                  
                                  updateField({
                                    quizSettings: {
                                      ...localField.quizSettings!,
                                      correctAnswer: newAnswers
                                    }
                                  });
                                }}
                                className="w-4 h-4 text-green-600"
                              />
                              <Label htmlFor={`correct-multi-${index}`} className="text-sm">
                                {option}
                              </Label>
                            </div>
                          ))}
                        </div>
                      )}

                      {localField.type === 'select' && (
                        <select
                          value={localField.quizSettings?.correctAnswer as string || ''}
                          onChange={(e) => updateField({
                            quizSettings: {
                              ...localField.quizSettings!,
                              correctAnswer: e.target.value
                            }
                          })}
                          className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                          <option value="">Select correct answer...</option>
                          {localField.options?.map((option, index) => (
                            <option key={index} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="points" className="text-sm font-medium">Points</Label>
                      <Input
                        id="points"
                        type="number"
                        min="0"
                        step="0.5"
                        value={localField.quizSettings?.points || 1}
                        onChange={(e) => updateField({
                          quizSettings: {
                            ...localField.quizSettings!,
                            points: parseFloat(e.target.value) || 1
                          }
                        })}
                        placeholder="1"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="showExplanation" className="text-sm font-medium">Show Explanation</Label>
                      <select
                        id="showExplanation"
                        value={localField.quizSettings?.showExplanation || 'always'}
                        onChange={(e) => updateField({
                          quizSettings: {
                            ...localField.quizSettings!,
                            showExplanation: e.target.value as 'always' | 'correct' | 'incorrect'
                          }
                        })}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="always">Always</option>
                        <option value="correct">Only when correct</option>
                        <option value="incorrect">Only when incorrect</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="explanation" className="text-sm font-medium">Answer Explanation</Label>
                    <Textarea
                      id="explanation"
                      value={localField.quizSettings?.explanation || ''}
                      onChange={(e) => updateField({
                        quizSettings: {
                          ...localField.quizSettings!,
                          explanation: e.target.value
                        }
                      })}
                      placeholder="Explain why this is the correct answer..."
                      className="mt-1"
                      rows={3}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Essay Quiz Settings for Text/Textarea Fields */}
          {(localField.type === 'text' || localField.type === 'textarea') && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">Essay Quiz Settings</Label>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="enableEssayQuiz"
                    checked={localField.quizSettings?.enabled || false}
                    onChange={(e) => {
                      if (e.target.checked) {
                        updateField({
                          quizSettings: {
                            enabled: true,
                            points: 10,
                            explanation: '',
                            showExplanation: 'always',
                            essayKeyAnswer: '',
                            essayKeywords: [],
                            essayMinWords: 50,
                            essayMaxWords: 500,
                            essayGradingType: 'ai',
                            essayPassingThreshold: 60
                          }
                        });
                      } else {
                        updateField({ quizSettings: undefined });
                      }
                    }}
                  />
                  <Label htmlFor="enableEssayQuiz" className="text-sm cursor-pointer">
                    Enable Essay Quiz Mode
                  </Label>
                </div>
              </div>

              {localField.quizSettings?.enabled && (
                <div className="space-y-4 pl-4 border-l-2 border-purple-200">
                  <div className="text-sm text-gray-600">
                    Configure AI-based grading for essay questions. The system will analyze content similarity and keyword presence.
                  </div>

                  <div>
                    <Label htmlFor="essayKeyAnswer" className="text-sm font-medium">Key Answer (Reference Answer)</Label>
                    <Textarea
                      id="essayKeyAnswer"
                      value={localField.quizSettings?.essayKeyAnswer || ''}
                      onChange={(e) => updateField({
                        quizSettings: {
                          ...localField.quizSettings!,
                          essayKeyAnswer: e.target.value
                        }
                      })}
                      placeholder="Enter the ideal/reference answer that students should provide..."
                      className="mt-1"
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label htmlFor="essayKeywords" className="text-sm font-medium">Important Keywords</Label>
                    <Input
                      id="essayKeywords"
                      value={localField.quizSettings?.essayKeywords?.join(', ') || ''}
                      onChange={(e) => updateField({
                        quizSettings: {
                          ...localField.quizSettings!,
                          essayKeywords: e.target.value.split(',').map(k => k.trim()).filter(k => k)
                        }
                      })}
                      placeholder="keyword1, keyword2, keyword3..."
                      className="mt-1"
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      Separate keywords with commas. These words should appear in good answers.
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="essayPoints" className="text-sm font-medium">Points</Label>
                      <Input
                        id="essayPoints"
                        type="number"
                        min="0"
                        step="0.5"
                        value={localField.quizSettings?.points || 10}
                        onChange={(e) => updateField({
                          quizSettings: {
                            ...localField.quizSettings!,
                            points: parseFloat(e.target.value) || 10
                          }
                        })}
                        placeholder="10"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="essayPassingThreshold" className="text-sm font-medium">Passing Threshold (%)</Label>
                      <Input
                        id="essayPassingThreshold"
                        type="number"
                        min="0"
                        max="100"
                        value={localField.quizSettings?.essayPassingThreshold || 60}
                        onChange={(e) => updateField({
                          quizSettings: {
                            ...localField.quizSettings!,
                            essayPassingThreshold: parseInt(e.target.value) || 60
                          }
                        })}
                        placeholder="60"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="essayMinWords" className="text-sm font-medium">Min Words</Label>
                      <Input
                        id="essayMinWords"
                        type="number"
                        min="0"
                        value={localField.quizSettings?.essayMinWords || 50}
                        onChange={(e) => updateField({
                          quizSettings: {
                            ...localField.quizSettings!,
                            essayMinWords: parseInt(e.target.value) || 50
                          }
                        })}
                        placeholder="50"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="essayMaxWords" className="text-sm font-medium">Max Words</Label>
                      <Input
                        id="essayMaxWords"
                        type="number"
                        min="0"
                        value={localField.quizSettings?.essayMaxWords || 500}
                        onChange={(e) => updateField({
                          quizSettings: {
                            ...localField.quizSettings!,
                            essayMaxWords: parseInt(e.target.value) || 500
                          }
                        })}
                        placeholder="500"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="essayGradingType" className="text-sm font-medium">Grading Method</Label>
                    <select
                      id="essayGradingType"
                      value={localField.quizSettings?.essayGradingType || 'ai'}
                      onChange={(e) => updateField({
                        quizSettings: {
                          ...localField.quizSettings!,
                          essayGradingType: e.target.value as 'keyword' | 'similarity' | 'ai'
                        }
                      })}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="keyword">Keyword Matching Only</option>
                      <option value="similarity">Content Similarity Only</option>
                      <option value="ai">AI Combined (Recommended)</option>
                    </select>
                    <div className="text-xs text-gray-500 mt-1">
                      AI Combined uses both content similarity and keyword matching for best results.
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="essayExplanation" className="text-sm font-medium">Feedback Message</Label>
                    <Textarea
                      id="essayExplanation"
                      value={localField.quizSettings?.explanation || ''}
                      onChange={(e) => updateField({
                        quizSettings: {
                          ...localField.quizSettings!,
                          explanation: e.target.value
                        }
                      })}
                      placeholder="Additional feedback or explanation to show students..."
                      className="mt-1"
                      rows={3}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Section Jump Logic */}
          {hasOptions && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">Section Jump Logic</Label>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="enableSectionJump"
                    checked={localField.sectionJumpLogic?.enabled || false}
                    onChange={(e) => {
                      if (e.target.checked) {
                        // Enable section jump logic with default rules
                        updateField({
                          sectionJumpLogic: {
                            enabled: true,
                            jumpRules: localField.options?.map(option => ({
                              optionValue: option,
                              action: 'next' as const,
                              targetSectionId: undefined
                            })) || []
                          }
                        });
                      } else {
                        // Disable section jump logic by removing it completely
                        const { sectionJumpLogic, ...fieldWithoutSectionJump } = localField;
                        updateField({ sectionJumpLogic: undefined });
                      }
                    }}
                  />
                  <Label htmlFor="enableSectionJump" className="text-sm">Enable section jumps based on answers</Label>
                </div>
              </div>

              {localField.sectionJumpLogic?.enabled && (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">Configure what happens when each option is selected:</p>
                  
                  {localField.options?.map((option, index) => {
                    const jumpRule = localField.sectionJumpLogic?.jumpRules.find(rule => rule.optionValue === option);
                    const availableSections = allFields.filter(f => f.type === 'section');
                    
                    return (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg space-y-2">
                        <div className="font-medium text-sm text-gray-700">
                          When "{option}" is selected:
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label className="text-xs">Action</Label>
                            <select
                              value={jumpRule?.action || 'next'}
                              onChange={(e) => {
                                const newRules = [...(localField.sectionJumpLogic?.jumpRules || [])];
                                const ruleIndex = newRules.findIndex(rule => rule.optionValue === option);
                                const newRule = {
                                  optionValue: option,
                                  action: e.target.value as 'next' | 'jump' | 'submit',
                                  targetSectionId: e.target.value === 'jump' ? jumpRule?.targetSectionId : undefined
                                };
                                
                                if (ruleIndex >= 0) {
                                  newRules[ruleIndex] = newRule;
                                } else {
                                  newRules.push(newRule);
                                }
                                
                                updateField({
                                  sectionJumpLogic: {
                                    ...localField.sectionJumpLogic!,
                                    jumpRules: newRules
                                  }
                                });
                              }}
                              className="w-full px-2 py-1 text-xs border rounded"
                            >
                              <option value="next">Continue to next section</option>
                              <option value="jump">Jump to specific section</option>
                              <option value="submit">Submit form</option>
                            </select>
                          </div>

                          {jumpRule?.action === 'jump' && (
                            <div>
                              <Label className="text-xs">Target Section</Label>
                              <select
                                value={jumpRule?.targetSectionId || ''}
                                onChange={(e) => {
                                  const newRules = [...(localField.sectionJumpLogic?.jumpRules || [])];
                                  const ruleIndex = newRules.findIndex(rule => rule.optionValue === option);
                                  if (ruleIndex >= 0) {
                                    newRules[ruleIndex] = {
                                      ...newRules[ruleIndex],
                                      targetSectionId: e.target.value
                                    };
                                    updateField({
                                      sectionJumpLogic: {
                                        ...localField.sectionJumpLogic!,
                                        jumpRules: newRules
                                      }
                                    });
                                  }
                                }}
                                className="w-full px-2 py-1 text-xs border rounded"
                              >
                                <option value="">Select section...</option>
                                {availableSections.map(section => (
                                  <option key={section.id} value={section.id}>
                                    {section.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Matrix Field Configuration */}
          {isMatrix && (
            <div className="space-y-4">
              <div>
                <Label className="text-base font-medium">Matrix Configuration</Label>
                
                <div className="mt-3">
                  <Label htmlFor="matrixType">Input Type</Label>
                  <select
                    id="matrixType"
                    value={localField.matrixType || 'radio'}
                    onChange={(e) => updateField({ matrixType: e.target.value as 'radio' | 'checkbox' | 'text' | 'number' | 'email' | 'date' | 'textarea' })}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="radio">Single Choice (Radio)</option>
                    <option value="checkbox">Multiple Choice (Checkbox)</option>
                    <option value="text">Text Input</option>
                    <option value="number">Number Input</option>
                    <option value="email">Email Input</option>
                    <option value="date">Date Input</option>
                    <option value="textarea">Text Area</option>
                  </select>
                </div>

                <div className="mt-3">
                  <div className="flex items-center justify-between mb-2">
                    <Label>Matrix Rows</Label>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        const currentRows = localField.matrixRows && localField.matrixRows.length > 0 ? localField.matrixRows : ['Row 1', 'Row 2', 'Row 3'];
                        updateField({ matrixRows: [...currentRows, `Row ${currentRows.length + 1}`] });
                      }}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Row
                    </Button>
                  </div>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {(localField.matrixRows && localField.matrixRows.length > 0 ? localField.matrixRows : ['Row 1', 'Row 2', 'Row 3']).map((row, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Input
                          value={row}
                          onChange={(e) => {
                            const currentRows = localField.matrixRows && localField.matrixRows.length > 0 ? localField.matrixRows : ['Row 1', 'Row 2', 'Row 3'];
                            const newRows = [...currentRows];
                            newRows[index] = e.target.value;
                            updateField({ matrixRows: newRows });
                          }}
                          placeholder={`Row ${index + 1}`}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const currentRows = localField.matrixRows && localField.matrixRows.length > 0 ? localField.matrixRows : ['Row 1', 'Row 2', 'Row 3'];
                            const newRows = [...currentRows];
                            newRows.splice(index, 1);
                            updateField({ matrixRows: newRows });
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-3">
                  <div className="flex items-center justify-between mb-2">
                    <Label>Matrix Columns</Label>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        const currentCols = localField.matrixColumns && localField.matrixColumns.length > 0 ? localField.matrixColumns : ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'];
                        updateField({ matrixColumns: [...currentCols, `Column ${currentCols.length + 1}`] });
                      }}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Column
                    </Button>
                  </div>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {(localField.matrixColumns && localField.matrixColumns.length > 0 ? localField.matrixColumns : ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']).map((col, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Input
                          value={col}
                          onChange={(e) => {
                            const currentCols = localField.matrixColumns && localField.matrixColumns.length > 0 ? localField.matrixColumns : ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'];
                            const newCols = [...currentCols];
                            newCols[index] = e.target.value;
                            updateField({ matrixColumns: newCols });
                          }}
                          placeholder={`Column ${index + 1}`}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const currentCols = localField.matrixColumns && localField.matrixColumns.length > 0 ? localField.matrixColumns : ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'];
                            const newCols = [...currentCols];
                            newCols.splice(index, 1);
                            updateField({ matrixColumns: newCols });
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Rating Field Configuration */}
          {isRating && (
            <div className="space-y-4">
              <Label className="text-base font-medium">Rating Configuration</Label>
              
              <div>
                <Label htmlFor="ratingMax">Maximum Rating</Label>
                <Input
                  id="ratingMax"
                  type="number"
                  min="1"
                  max="10"
                  value={localField.ratingMax || 5}
                  onChange={(e) => updateField({ ratingMax: parseInt(e.target.value) || 5 })}
                  placeholder="Maximum rating value"
                />
              </div>

              <div>
                <Label htmlFor="ratingIcon">Rating Icon</Label>
                <select
                  id="ratingIcon"
                  value={localField.ratingIcon || 'star'}
                  onChange={(e) => updateField({ ratingIcon: e.target.value as 'star' | 'heart' | 'thumbs' | 'number' })}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="star">⭐ Stars</option>
                  <option value="heart">❤️ Hearts</option>
                  <option value="thumbs">👍 Thumbs Up</option>
                  <option value="number">🔢 Numbers</option>
                </select>
              </div>
            </div>
          )}

          {/* Likert Scale Configuration */}
          {isLikert && (
            <div className="space-y-4">
              <Label className="text-base font-medium">Likert Scale Configuration</Label>
              
              <div>
                <Label htmlFor="likertScale">Scale Range</Label>
                <select
                  id="likertScale"
                  value={localField.likertScale?.max || 5}
                  onChange={(e) => {
                    const max = parseInt(e.target.value);
                    updateField({ 
                      likertScale: { 
                        min: 1, 
                        max: max,
                        minLabel: localField.likertScale?.minLabel || '',
                        maxLabel: localField.likertScale?.maxLabel || '',
                        steps: max
                      } 
                    });
                  }}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={3}>3-Point Scale</option>
                  <option value={4}>4-Point Scale</option>
                  <option value={5}>5-Point Scale</option>
                  <option value={7}>7-Point Scale</option>
                  <option value={10}>10-Point Scale</option>
                </select>
              </div>

              <div>
                <Label htmlFor="minLabel">Left Label (Minimum)</Label>
                <Input
                  id="minLabel"
                  value={localField.likertScale?.minLabel || ''}
                  onChange={(e) => updateField({ 
                    likertScale: { 
                      ...localField.likertScale,
                      min: localField.likertScale?.min || 1,
                      max: localField.likertScale?.max || 5,
                      minLabel: e.target.value 
                    } 
                  })}
                  placeholder="e.g., Strongly Disagree"
                />
              </div>

              <div>
                <Label htmlFor="maxLabel">Right Label (Maximum)</Label>
                <Input
                  id="maxLabel"
                  value={localField.likertScale?.maxLabel || ''}
                  onChange={(e) => updateField({ 
                    likertScale: { 
                      ...localField.likertScale,
                      min: localField.likertScale?.min || 1,
                      max: localField.likertScale?.max || 5,
                      maxLabel: e.target.value 
                    } 
                  })}
                  placeholder="e.g., Strongly Agree"
                />
              </div>
            </div>
          )}

          {/* Section Settings */}
          {isSection && (
            <div className="space-y-4">
              <Label className="text-base font-medium">Section Settings</Label>
              
              <div>
                <Label htmlFor="sectionDescription">Section Description</Label>
                <Textarea
                  id="sectionDescription"
                  value={localField.sectionSettings?.description || ''}
                  onChange={(e) => updateField({ 
                    sectionSettings: { 
                      ...localField.sectionSettings,
                      description: e.target.value,
                      showProgress: localField.sectionSettings?.showProgress ?? true,
                      allowPrevious: localField.sectionSettings?.allowPrevious ?? true,
                      allowNext: localField.sectionSettings?.allowNext ?? true,
                      nextButtonText: localField.sectionSettings?.nextButtonText || 'Continue',
                      previousButtonText: localField.sectionSettings?.previousButtonText || 'Back',
                    } 
                  })}
                  placeholder="Describe this section of the form..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nextButtonText">Next Button Text</Label>
                  <Input
                    id="nextButtonText"
                    value={localField.sectionSettings?.nextButtonText || ''}
                    onChange={(e) => updateField({ 
                      sectionSettings: { 
                        ...localField.sectionSettings,
                        nextButtonText: e.target.value,
                        showProgress: localField.sectionSettings?.showProgress ?? true,
                        allowPrevious: localField.sectionSettings?.allowPrevious ?? true,
                        allowNext: localField.sectionSettings?.allowNext ?? true,
                        previousButtonText: localField.sectionSettings?.previousButtonText || 'Back',
                      } 
                    })}
                    placeholder="Continue"
                  />
                </div>

                <div>
                  <Label htmlFor="previousButtonText">Previous Button Text</Label>
                  <Input
                    id="previousButtonText"
                    value={localField.sectionSettings?.previousButtonText || ''}
                    onChange={(e) => updateField({ 
                      sectionSettings: { 
                        ...localField.sectionSettings,
                        previousButtonText: e.target.value,
                        showProgress: localField.sectionSettings?.showProgress ?? true,
                        allowPrevious: localField.sectionSettings?.allowPrevious ?? true,
                        allowNext: localField.sectionSettings?.allowNext ?? true,
                        nextButtonText: localField.sectionSettings?.nextButtonText || 'Continue',
                      } 
                    })}
                    placeholder="Back"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="showProgress"
                    checked={localField.sectionSettings?.showProgress ?? true}
                    onChange={(e) => updateField({
                      sectionSettings: {
                        ...localField.sectionSettings,
                        showProgress: e.target.checked,
                        allowPrevious: localField.sectionSettings?.allowPrevious ?? true,
                        allowNext: localField.sectionSettings?.allowNext ?? true,
                        nextButtonText: localField.sectionSettings?.nextButtonText || 'Continue',
                        previousButtonText: localField.sectionSettings?.previousButtonText || 'Back',
                      }
                    })}
                  />
                  <Label htmlFor="showProgress" className="text-sm">Show progress indicator</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="allowPrevious"
                    checked={localField.sectionSettings?.allowPrevious ?? true}
                    onChange={(e) => updateField({
                      sectionSettings: {
                        ...localField.sectionSettings,
                        allowPrevious: e.target.checked,
                        showProgress: localField.sectionSettings?.showProgress ?? true,
                        allowNext: localField.sectionSettings?.allowNext ?? true,
                        nextButtonText: localField.sectionSettings?.nextButtonText || 'Continue',
                        previousButtonText: localField.sectionSettings?.previousButtonText || 'Back',
                      }
                    })}
                  />
                  <Label htmlFor="allowPrevious" className="text-sm">Allow previous navigation</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="allowNext"
                    checked={localField.sectionSettings?.allowNext ?? true}
                    onChange={(e) => updateField({
                      sectionSettings: {
                        ...localField.sectionSettings,
                        allowNext: e.target.checked,
                        showProgress: localField.sectionSettings?.showProgress ?? true,
                        allowPrevious: localField.sectionSettings?.allowPrevious ?? true,
                        nextButtonText: localField.sectionSettings?.nextButtonText || 'Continue',
                        previousButtonText: localField.sectionSettings?.previousButtonText || 'Back',
                      }
                    })}
                  />
                  <Label htmlFor="allowNext" className="text-sm">Allow next navigation</Label>
                </div>
              </div>
            </div>
          )}

          {/* Signature Field Settings */}
          {isSignature && (
            <div className="space-y-4">
              <Label className="text-base font-medium">Signature Settings</Label>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="signatureWidth">Canvas Width</Label>
                  <Input
                    id="signatureWidth"
                    type="number"
                    value={localField.signatureSettings?.width || 400}
                    onChange={(e) => updateField({ 
                      signatureSettings: { 
                        ...localField.signatureSettings,
                        width: parseInt(e.target.value) || 400,
                        height: localField.signatureSettings?.height || 200,
                        penColor: localField.signatureSettings?.penColor || '#000000',
                        backgroundColor: localField.signatureSettings?.backgroundColor || '#ffffff',
                      } 
                    })}
                    placeholder="400"
                  />
                </div>

                <div>
                  <Label htmlFor="signatureHeight">Canvas Height</Label>
                  <Input
                    id="signatureHeight"
                    type="number"
                    value={localField.signatureSettings?.height || 200}
                    onChange={(e) => updateField({ 
                      signatureSettings: { 
                        ...localField.signatureSettings,
                        width: localField.signatureSettings?.width || 400,
                        height: parseInt(e.target.value) || 200,
                        penColor: localField.signatureSettings?.penColor || '#000000',
                        backgroundColor: localField.signatureSettings?.backgroundColor || '#ffffff',
                      } 
                    })}
                    placeholder="200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="penColor">Pen Color</Label>
                  <Input
                    id="penColor"
                    type="color"
                    value={localField.signatureSettings?.penColor || '#000000'}
                    onChange={(e) => updateField({ 
                      signatureSettings: { 
                        ...localField.signatureSettings,
                        width: localField.signatureSettings?.width || 400,
                        height: localField.signatureSettings?.height || 200,
                        penColor: e.target.value,
                        backgroundColor: localField.signatureSettings?.backgroundColor || '#ffffff',
                      } 
                    })}
                  />
                </div>

                <div>
                  <Label htmlFor="backgroundColor">Background Color</Label>
                  <Input
                    id="backgroundColor"
                    type="color"
                    value={localField.signatureSettings?.backgroundColor || '#ffffff'}
                    onChange={(e) => updateField({ 
                      signatureSettings: { 
                        ...localField.signatureSettings,
                        width: localField.signatureSettings?.width || 400,
                        height: localField.signatureSettings?.height || 200,
                        penColor: localField.signatureSettings?.penColor || '#000000',
                        backgroundColor: e.target.value,
                      } 
                    })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Heading Field Settings */}
          {isHeading && (
            <div className="space-y-4">
              <Label className="text-base font-medium">Heading Settings</Label>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="headingLevel">Heading Level</Label>
                  <select
                    id="headingLevel"
                    value={localField.headingSettings?.level || 2}
                    onChange={(e) => updateField({ 
                      headingSettings: { 
                        ...localField.headingSettings,
                        level: parseInt(e.target.value) as 1 | 2 | 3 | 4 | 5 | 6,
                        alignment: localField.headingSettings?.alignment || 'left',
                        color: localField.headingSettings?.color || '#000000',
                      } 
                    })}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={1}>H1 - Main Title</option>
                    <option value={2}>H2 - Section Title</option>
                    <option value={3}>H3 - Subsection</option>
                    <option value={4}>H4 - Minor Heading</option>
                    <option value={5}>H5 - Small Heading</option>
                    <option value={6}>H6 - Smallest Heading</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="headingAlignment">Text Alignment</Label>
                  <select
                    id="headingAlignment"
                    value={localField.headingSettings?.alignment || 'left'}
                    onChange={(e) => updateField({ 
                      headingSettings: { 
                        ...localField.headingSettings,
                        level: localField.headingSettings?.level || 2,
                        alignment: e.target.value as 'left' | 'center' | 'right',
                        color: localField.headingSettings?.color || '#000000',
                      } 
                    })}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="headingColor">Text Color</Label>
                <Input
                  id="headingColor"
                  type="color"
                  value={localField.headingSettings?.color || '#000000'}
                  onChange={(e) => updateField({ 
                    headingSettings: { 
                      ...localField.headingSettings,
                      level: localField.headingSettings?.level || 2,
                      alignment: localField.headingSettings?.alignment || 'left',
                      color: e.target.value,
                    } 
                  })}
                />
              </div>
            </div>
          )}

          {/* Image Field Settings */}
          {isImage && (
            <div className="space-y-4">
              <Label className="text-base font-medium">Image Settings</Label>
              
              <div className="space-y-3">
                <div>
                  <Label htmlFor="imageSrc">Image URL</Label>
                  <Input
                    id="imageSrc"
                    value={localField.imageSettings?.src || ''}
                    onChange={(e) => updateField({ 
                      imageSettings: { 
                        ...localField.imageSettings,
                        src: e.target.value,
                        alt: localField.imageSettings?.alt || 'Image description',
                        width: localField.imageSettings?.width || 300,
                        height: localField.imageSettings?.height || 200,
                        alignment: localField.imageSettings?.alignment || 'center',
                      } 
                    })}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="text-center text-sm text-gray-500">
                  or
                </div>

                <div>
                  <Label>Upload Image</Label>
                  <div className="mt-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;

                        try {
                          const formData = new FormData();
                          formData.append('file', file);

                          const response = await fetch('/api/upload', {
                            method: 'POST',
                            body: formData,
                          });

                          if (!response.ok) {
                            const error = await response.json();
                            throw new Error(error.error || 'Upload failed');
                          }

                          const result = await response.json();
                          updateField({ 
                            imageSettings: { 
                              ...localField.imageSettings,
                              src: result.url,
                              alt: localField.imageSettings?.alt || 'Image description',
                              width: localField.imageSettings?.width || 300,
                              height: localField.imageSettings?.height || 200,
                              alignment: localField.imageSettings?.alignment || 'center',
                            } 
                          });
                        } catch (error) {
                          console.error('Upload error:', error);
                          alert('Failed to upload image. Please try again.');
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="imageAlt">Alt Text (Accessibility)</Label>
                <Input
                  id="imageAlt"
                  value={localField.imageSettings?.alt || ''}
                  onChange={(e) => updateField({ 
                    imageSettings: { 
                      ...localField.imageSettings,
                      src: localField.imageSettings?.src || '',
                      alt: e.target.value,
                      width: localField.imageSettings?.width || 300,
                      height: localField.imageSettings?.height || 200,
                      alignment: localField.imageSettings?.alignment || 'center',
                    } 
                  })}
                  placeholder="Description of the image"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="imageWidth">Max Width</Label>
                  <Input
                    id="imageWidth"
                    type="number"
                    value={localField.imageSettings?.width || 300}
                    onChange={(e) => updateField({ 
                      imageSettings: { 
                        ...localField.imageSettings,
                        src: localField.imageSettings?.src || '',
                        alt: localField.imageSettings?.alt || 'Image description',
                        width: parseInt(e.target.value) || 300,
                        height: localField.imageSettings?.height || 200,
                        alignment: localField.imageSettings?.alignment || 'center',
                      } 
                    })}
                    placeholder="300"
                  />
                </div>

                <div>
                  <Label htmlFor="imageHeight">Max Height</Label>
                  <Input
                    id="imageHeight"
                    type="number"
                    value={localField.imageSettings?.height || 200}
                    onChange={(e) => updateField({ 
                      imageSettings: { 
                        ...localField.imageSettings,
                        src: localField.imageSettings?.src || '',
                        alt: localField.imageSettings?.alt || 'Image description',
                        width: localField.imageSettings?.width || 300,
                        height: parseInt(e.target.value) || 200,
                        alignment: localField.imageSettings?.alignment || 'center',
                      } 
                    })}
                    placeholder="200"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="imageAlignment">Image Alignment</Label>
                <select
                  id="imageAlignment"
                  value={localField.imageSettings?.alignment || 'center'}
                  onChange={(e) => updateField({ 
                    imageSettings: { 
                      ...localField.imageSettings,
                      src: localField.imageSettings?.src || '',
                      alt: localField.imageSettings?.alt || 'Image description',
                      width: localField.imageSettings?.width || 300,
                      height: localField.imageSettings?.height || 200,
                      alignment: e.target.value as 'left' | 'center' | 'right',
                    } 
                  })}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                </select>
              </div>
            </div>
          )}

          {/* Field Image Attachment - For all input fields except heading and section */}
          {!isHeading && localField.type !== 'section' && (
            <div className="space-y-4">
              <Label className="text-base font-medium">Question Image</Label>
              <div className="text-sm text-gray-600 mb-3">
                Add an image to this question to create visual questions or provide context.
              </div>
              
              <div className="space-y-3">
                <div>
                  <Label htmlFor="fieldImageSrc">Image URL</Label>
                  <Input
                    id="fieldImageSrc"
                    value={localField.fieldImage?.src || ''}
                    onChange={(e) => updateField({ 
                      fieldImage: { 
                        ...localField.fieldImage,
                        src: e.target.value,
                        alt: localField.fieldImage?.alt || 'Question image',
                        width: localField.fieldImage?.width || 300,
                        height: localField.fieldImage?.height || 200,
                        position: localField.fieldImage?.position || 'above',
                      } 
                    })}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="text-center text-sm text-gray-500">
                  or
                </div>

                <div>
                  <Label>Upload Image</Label>
                  <div className="mt-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;

                        try {
                          const formData = new FormData();
                          formData.append('file', file);

                          const response = await fetch('/api/upload', {
                            method: 'POST',
                            body: formData,
                          });

                          if (!response.ok) {
                            const error = await response.json();
                            throw new Error(error.error || 'Upload failed');
                          }

                          const result = await response.json();
                          updateField({ 
                            fieldImage: { 
                              ...localField.fieldImage,
                              src: result.url,
                              alt: localField.fieldImage?.alt || 'Question image',
                              width: localField.fieldImage?.width || 300,
                              height: localField.fieldImage?.height || 200,
                              position: localField.fieldImage?.position || 'above',
                            } 
                          });
                        } catch (error) {
                          console.error('Upload error:', error);
                          alert('Failed to upload image. Please try again.');
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                </div>

                {localField.fieldImage?.src && (
                  <>
                    <div>
                      <Label htmlFor="fieldImageAlt">Alt Text (Accessibility)</Label>
                      <Input
                        id="fieldImageAlt"
                        value={localField.fieldImage?.alt || ''}
                        onChange={(e) => updateField({ 
                          fieldImage: { 
                            ...localField.fieldImage,
                            alt: e.target.value,
                          } 
                        })}
                        placeholder="Description of the image"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="fieldImageWidth">Max Width</Label>
                        <Input
                          id="fieldImageWidth"
                          type="number"
                          value={localField.fieldImage?.width || 300}
                          onChange={(e) => updateField({ 
                            fieldImage: { 
                              ...localField.fieldImage,
                              width: parseInt(e.target.value) || 300,
                            } 
                          })}
                          placeholder="300"
                        />
                      </div>

                      <div>
                        <Label htmlFor="fieldImageHeight">Max Height</Label>
                        <Input
                          id="fieldImageHeight"
                          type="number"
                          value={localField.fieldImage?.height || 200}
                          onChange={(e) => updateField({ 
                            fieldImage: { 
                              ...localField.fieldImage,
                              height: parseInt(e.target.value) || 200,
                            } 
                          })}
                          placeholder="200"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="fieldImagePosition">Image Position</Label>
                      <select
                        id="fieldImagePosition"
                        value={localField.fieldImage?.position || 'above'}
                        onChange={(e) => updateField({ 
                          fieldImage: { 
                            ...localField.fieldImage,
                            position: e.target.value as 'above' | 'below',
                          } 
                        })}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="above">Above Question</option>
                        <option value="below">Below Question</option>
                      </select>
                    </div>

                    <div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => updateField({ fieldImage: undefined })}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Remove Image
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Conditional Logic Configuration */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">Conditional Logic</Label>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="enableConditional"
                  checked={localField.conditionalLogic?.enabled || false}
                  onChange={(e) => {
                    if (e.target.checked) {
                      // Enable conditional logic with default values
                      const newConditionalLogic = {
                        enabled: true,
                        condition: 'show' as const,
                        rules: [],
                        operator: 'and' as const
                      };
                      updateField({
                        conditionalLogic: newConditionalLogic
                      });
                    } else {
                      // Disable conditional logic by removing it completely
                      const { conditionalLogic, ...fieldWithoutConditionalLogic } = localField;
                      setLocalField(fieldWithoutConditionalLogic as FormField);
                    }
                  }}
                />
                <Label htmlFor="enableConditional" className="text-sm">Enable conditional logic</Label>
              </div>
            </div>

            {localField.conditionalLogic?.enabled && (
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-3">
                  Configure when this field should be shown or hidden based on other field values.
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Action</Label>
                    <select
                      value={localField.conditionalLogic.condition}
                      onChange={(e) => updateField({
                        conditionalLogic: {
                          ...localField.conditionalLogic!,
                          condition: e.target.value as 'show' | 'hide'
                        }
                      })}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="show">Show this field</option>
                      <option value="hide">Hide this field</option>
                    </select>
                  </div>

                  <div>
                    <Label>When</Label>
                    <select
                      value={localField.conditionalLogic.operator}
                      onChange={(e) => updateField({
                        conditionalLogic: {
                          ...localField.conditionalLogic!,
                          operator: e.target.value as 'and' | 'or'
                        }
                      })}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="and">All conditions are met</option>
                      <option value="or">Any condition is met</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Conditions</Label>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => {
                        console.log('Current localField.id:', localField.id);
                        console.log('allFields:', allFields);
                        
                        if (!allFields || allFields.length === 0) {
                          alert('No fields available. Please add some fields to the form first.');
                          return;
                        }
                        
                        const availableFields = getAvailableFieldsForConditions(localField.id, allFields);
                        console.log('Available fields for conditions:', availableFields);
                        
                        if (availableFields.length === 0) {
                          alert('No fields available for conditions. Add some fields before this one first.');
                          return;
                        }
                        updateField({
                          conditionalLogic: {
                            ...localField.conditionalLogic!,
                            rules: [
                              ...localField.conditionalLogic!.rules,
                              {
                                fieldId: availableFields[0].id,
                                operator: 'equals',
                                value: ''
                              }
                            ]
                          }
                        });
                      }}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Condition
                    </Button>
                  </div>

                  {localField.conditionalLogic.rules.map((rule, index) => {
                    const availableFields = getAvailableFieldsForConditions(localField.id, allFields);
                    const selectedField = availableFields.find(f => f.id === rule.fieldId);
                    const operators = selectedField ? getOperatorsForFieldType(selectedField.type) : [];

                    return (
                      <div key={index} className="p-3 bg-white rounded border space-y-3">
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <Label className="text-xs">Field</Label>
                            <select
                              value={rule.fieldId}
                              onChange={(e) => {
                                const newRules = [...localField.conditionalLogic!.rules];
                                newRules[index] = { ...rule, fieldId: e.target.value };
                                updateField({
                                  conditionalLogic: {
                                    ...localField.conditionalLogic!,
                                    rules: newRules
                                  }
                                });
                              }}
                              className="w-full px-2 py-1 text-xs border rounded"
                            >
                              {availableFields.map(field => (
                                <option key={field.id} value={field.id}>
                                  {field.label}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <Label className="text-xs">Condition</Label>
                            <select
                              value={rule.operator}
                              onChange={(e) => {
                                const newRules = [...localField.conditionalLogic!.rules];
                                newRules[index] = { ...rule, operator: e.target.value as any };
                                updateField({
                                  conditionalLogic: {
                                    ...localField.conditionalLogic!,
                                    rules: newRules
                                  }
                                });
                              }}
                              className="w-full px-2 py-1 text-xs border rounded"
                            >
                              {operators.map(op => (
                                <option key={op.value} value={op.value}>
                                  {op.label}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="flex items-end space-x-1">
                            <div className="flex-1">
                              <Label className="text-xs">Value</Label>
                              {selectedField?.options ? (
                                <select
                                  value={rule.value as string}
                                  onChange={(e) => {
                                    const newRules = [...localField.conditionalLogic!.rules];
                                    newRules[index] = { ...rule, value: e.target.value };
                                    updateField({
                                      conditionalLogic: {
                                        ...localField.conditionalLogic!,
                                        rules: newRules
                                      }
                                    });
                                  }}
                                  className="w-full px-2 py-1 text-xs border rounded"
                                >
                                  <option value="">Select value</option>
                                  {selectedField.options.map(option => (
                                    <option key={option} value={option}>
                                      {option}
                                    </option>
                                  ))}
                                </select>
                              ) : (
                                <Input
                                  value={rule.value as string}
                                  onChange={(e) => {
                                    const newRules = [...localField.conditionalLogic!.rules];
                                    newRules[index] = { ...rule, value: e.target.value };
                                    updateField({
                                      conditionalLogic: {
                                        ...localField.conditionalLogic!,
                                        rules: newRules
                                      }
                                    });
                                  }}
                                  className="text-xs"
                                  placeholder="Enter value"
                                />
                              )}
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const newRules = localField.conditionalLogic!.rules.filter((_, i) => i !== index);
                                updateField({
                                  conditionalLogic: {
                                    ...localField.conditionalLogic!,
                                    rules: newRules
                                  }
                                });
                              }}
                              className="text-red-500 hover:text-red-700 p-1"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {localField.conditionalLogic.rules.length === 0 && (
                    <div className="text-sm text-gray-500 text-center py-2">
                      No conditions added yet. Click "Add Condition" to get started.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {hasValidation && (
            <div>
              <Label className="text-base font-medium">Validation</Label>
              <div className="space-y-3 mt-2">
                {(localField.type === 'text' || localField.type === 'textarea') && (
                  <>
                    <div>
                      <Label htmlFor="minLength">Minimum Length</Label>
                      <Input
                        id="minLength"
                        type="number"
                        value={localField.validation?.minLength || ''}
                        onChange={(e) => updateValidation({ 
                          minLength: e.target.value ? parseInt(e.target.value) : undefined 
                        })}
                        placeholder="Minimum characters"
                      />
                    </div>
                    <div>
                      <Label htmlFor="maxLength">Maximum Length</Label>
                      <Input
                        id="maxLength"
                        type="number"
                        value={localField.validation?.maxLength || ''}
                        onChange={(e) => updateValidation({ 
                          maxLength: e.target.value ? parseInt(e.target.value) : undefined 
                        })}
                        placeholder="Maximum characters"
                      />
                    </div>
                  </>
                )}

                {localField.type === 'number' && (
                  <>
                    <div>
                      <Label htmlFor="min">Minimum Value</Label>
                      <Input
                        id="min"
                        type="number"
                        value={localField.validation?.min || ''}
                        onChange={(e) => updateValidation({ 
                          min: e.target.value ? parseInt(e.target.value) : undefined 
                        })}
                        placeholder="Minimum value"
                      />
                    </div>
                    <div>
                      <Label htmlFor="max">Maximum Value</Label>
                      <Input
                        id="max"
                        type="number"
                        value={localField.validation?.max || ''}
                        onChange={(e) => updateValidation({ 
                          max: e.target.value ? parseInt(e.target.value) : undefined 
                        })}
                        placeholder="Maximum value"
                      />
                    </div>
                  </>
                )}

                {localField.type === 'text' && (
                  <div>
                    <Label htmlFor="pattern">Pattern (Regex)</Label>
                    <Input
                      id="pattern"
                      value={localField.validation?.pattern || ''}
                      onChange={(e) => updateValidation({ pattern: e.target.value })}
                      placeholder="Regular expression pattern"
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 p-6 border-t">
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button onClick={handleSave}>
            Simpan Perubahan
          </Button>
        </div>
      </div>
    </div>
  );
}
