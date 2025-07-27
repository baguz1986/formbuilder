'use client';

import React, { useState } from 'react';
import { FormRenderer } from '@/components/form-renderer/form-renderer';
import { FormSchema } from '@/types/form';

export function EssayTest() {
  const [submitted, setSubmitted] = useState(false);
  const [submissionData, setSubmissionData] = useState<any>(null);

  const sampleEssayForm: FormSchema = {
    id: 'essay-test-form',
    title: 'AI Essay Grading Demo',
    description: 'Test the AI-powered essay grading system',
    createdAt: new Date(),
    updatedAt: new Date(),
    fields: [
      {
        id: 'intro-essay',
        type: 'textarea',
        label: 'What is Artificial Intelligence?',
        placeholder: 'Write your essay about artificial intelligence...',
        required: true,
        quizSettings: {
          enabled: true,
          points: 100,
          explanation: 'This question tests your understanding of AI concepts.',
          showExplanation: 'always',
          essayKeyAnswer: 'Artificial Intelligence (AI) is a branch of computer science that aims to create machines capable of intelligent behavior. AI systems can learn, reason, and make decisions similar to humans. Key components include machine learning, natural language processing, computer vision, and neural networks. AI applications range from simple automation to complex problem-solving in healthcare, finance, and autonomous vehicles.',
          essayKeywords: ['machine learning', 'computer science', 'neural networks', 'automation', 'intelligent behavior', 'algorithms', 'data processing'],
          essayMinWords: 50,
          essayMaxWords: 300,
          essayGradingType: 'ai',
          essayPassingThreshold: 70
        }
      },
      {
        id: 'short-essay',
        type: 'text',
        label: 'Define Machine Learning (Short Answer)',
        placeholder: 'Brief definition of machine learning...',
        required: true,
        quizSettings: {
          enabled: true,
          points: 50,
          explanation: 'Concise definition required.',
          showExplanation: 'always',
          essayKeyAnswer: 'Machine learning is a subset of AI that enables computers to learn and improve from experience without being explicitly programmed.',
          essayKeywords: ['learning', 'AI', 'experience', 'algorithms', 'data'],
          essayMinWords: 10,
          essayMaxWords: 50,
          essayGradingType: 'ai',
          essayPassingThreshold: 60
        }
      },
      {
        id: 'programming-essay',
        type: 'textarea',
        label: 'Explain the importance of algorithms in programming',
        placeholder: 'Discuss why algorithms are fundamental to programming...',
        required: true,
        quizSettings: {
          enabled: true,
          points: 75,
          explanation: 'Focus on problem-solving and efficiency aspects.',
          showExplanation: 'always',
          essayKeyAnswer: 'Algorithms are step-by-step procedures for solving problems and performing computations. They are fundamental to programming because they provide systematic approaches to problem-solving. Good algorithms improve efficiency, reduce computational complexity, and ensure consistent results. Algorithms help programmers break down complex problems into manageable steps, optimize resource usage, and create scalable solutions.',
          essayKeywords: ['problem-solving', 'efficiency', 'step-by-step', 'computational complexity', 'systematic', 'optimization'],
          essayMinWords: 40,
          essayMaxWords: 200,
          essayGradingType: 'ai',
          essayPassingThreshold: 65
        }
      }
    ],
    settings: {
      showTitle: true,
      showDescription: true,
      submitButtonText: 'Submit Essays'
    }
  };

  const handleSubmit = (data: any) => {
    setSubmissionData(data);
    setSubmitted(true);
    console.log('Form submitted:', data);
  };

  if (submitted) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-green-800 mb-2">
            Essay Test Completed! 🎉
          </h2>
          <p className="text-green-600">
            Your essays have been submitted. The AI grading system provided real-time feedback.
          </p>
        </div>
        
        <div className="bg-white border rounded-lg p-6 mb-4">
          <h3 className="text-lg font-medium mb-4">Submission Data:</h3>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(submissionData, null, 2)}
          </pre>
        </div>

        <button
          onClick={() => {
            setSubmitted(false);
            setSubmissionData(null);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          AI Essay Grading Demo
        </h1>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-800 mb-1">How it works:</h3>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• Write your essay answers in the text areas below</li>
            <li>• Click "Grade Essay" to get instant AI feedback</li>
            <li>• The system analyzes content similarity and keyword presence</li>
            <li>• Get detailed feedback with scoring and suggestions</li>
            <li>• Pass/fail status based on configured thresholds</li>
          </ul>
        </div>
      </div>

      <FormRenderer
        form={sampleEssayForm}
        onSubmit={handleSubmit}
        className="space-y-6"
      />
    </div>
  );
}
