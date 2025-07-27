'use client';

import React from 'react';
import { FormField } from '@/types/form';
import { CheckCircle, XCircle, Trophy, Clock, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QuizResultsProps {
  fields: FormField[];
  answers: Record<string, any>;
  onRetake?: () => void;
  showCorrectAnswers?: boolean;
  showScore?: boolean;
  allowRetake?: boolean;
}

export function QuizResults({ 
  fields, 
  answers, 
  onRetake, 
  showCorrectAnswers = true, 
  showScore = true,
  allowRetake = true 
}: QuizResultsProps) {
  const quizFields = fields.filter(field => field.quizSettings?.enabled);
  
  const calculateScore = () => {
    let totalPoints = 0;
    let earnedPoints = 0;

    quizFields.forEach(field => {
      const points = field.quizSettings?.points || 1;
      totalPoints += points;

      const userAnswer = answers[field.id];
      const correctAnswer = field.quizSettings?.correctAnswer;

      if (field.type === 'checkbox') {
        // For checkbox, check if arrays match
        const userAnswerArray = Array.isArray(userAnswer) ? userAnswer.sort() : [];
        const correctAnswerArray = Array.isArray(correctAnswer) ? correctAnswer.sort() : [];
        
        if (JSON.stringify(userAnswerArray) === JSON.stringify(correctAnswerArray)) {
          earnedPoints += points;
        }
      } else {
        // For radio and select
        if (userAnswer === correctAnswer) {
          earnedPoints += points;
        }
      }
    });

    const percentage = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
    return { earnedPoints, totalPoints, percentage };
  };

  const isCorrectAnswer = (field: FormField) => {
    const userAnswer = answers[field.id];
    const correctAnswer = field.quizSettings?.correctAnswer;

    if (field.type === 'checkbox') {
      const userAnswerArray = Array.isArray(userAnswer) ? userAnswer.sort() : [];
      const correctAnswerArray = Array.isArray(correctAnswer) ? correctAnswer.sort() : [];
      return JSON.stringify(userAnswerArray) === JSON.stringify(correctAnswerArray);
    } else {
      return userAnswer === correctAnswer;
    }
  };

  const shouldShowExplanation = (field: FormField) => {
    const showExplanation = field.quizSettings?.showExplanation || 'always';
    const isCorrect = isCorrectAnswer(field);
    
    if (showExplanation === 'always') return true;
    if (showExplanation === 'correct' && isCorrect) return true;
    if (showExplanation === 'incorrect' && !isCorrect) return true;
    return false;
  };

  const score = calculateScore();

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Score Summary */}
      {showScore && (
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Trophy className="w-8 h-8 text-yellow-500" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Quiz Results</h2>
                <p className="text-gray-600">
                  You scored {score.earnedPoints} out of {score.totalPoints} points
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">{score.percentage}%</div>
              <div className="text-sm text-gray-500">
                {score.percentage >= 70 ? 'Passed' : 'Failed'}
              </div>
            </div>
          </div>
          
          {allowRetake && (
            <div className="mt-4 pt-4 border-t">
              <Button 
                onClick={onRetake}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retake Quiz</span>
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Question Review */}
      {showCorrectAnswers && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900">Question Review</h3>
          
          {quizFields.map((field, index) => {
            const isCorrect = isCorrectAnswer(field);
            const userAnswer = answers[field.id];
            const correctAnswer = field.quizSettings?.correctAnswer;

            return (
              <div key={field.id} className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {isCorrect ? (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-500" />
                    )}
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        Question {index + 1}: {field.label}
                      </h4>
                      <div className="text-sm text-gray-600 mt-1">
                        Points: {field.quizSettings?.points || 1}
                      </div>
                    </div>

                    {/* User Answer */}
                    <div>
                      <div className="text-sm font-medium text-gray-700">Your Answer:</div>
                      <div className={`text-sm mt-1 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                        {Array.isArray(userAnswer) ? userAnswer.join(', ') : userAnswer || 'No answer'}
                      </div>
                    </div>

                    {/* Correct Answer */}
                    {!isCorrect && (
                      <div>
                        <div className="text-sm font-medium text-gray-700">Correct Answer:</div>
                        <div className="text-sm text-green-600 mt-1">
                          {Array.isArray(correctAnswer) ? correctAnswer.join(', ') : correctAnswer}
                        </div>
                      </div>
                    )}

                    {/* Explanation */}
                    {shouldShowExplanation(field) && field.quizSettings?.explanation && (
                      <div className="bg-blue-50 rounded-lg p-3">
                        <div className="text-sm font-medium text-blue-900 mb-1">Explanation:</div>
                        <div className="text-sm text-blue-800">
                          {field.quizSettings.explanation}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
