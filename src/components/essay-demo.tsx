'use client';

import React, { useState } from 'react';
import { FormRenderer } from '@/components/form-renderer/form-renderer';
import { FormSchema } from '@/types/form';
import { Button } from '@/components/ui/button';

export function EssayDemo() {
  const [submitted, setSubmitted] = useState(false);
  const [submissionData, setSubmissionData] = useState<any>(null);
  const [currentExample, setCurrentExample] = useState(0);

  const sampleAnswers = [
    {
      name: 'Excellent Answer',
      'intro-essay': 'Artificial Intelligence (AI) is a branch of computer science focused on creating machines capable of intelligent behavior. AI systems utilize machine learning algorithms to learn from data and improve their performance over time. Key components include neural networks, natural language processing, and computer vision. These technologies enable automation in various fields such as healthcare, finance, and autonomous vehicles. AI systems can process vast amounts of data, recognize patterns, and make decisions similar to human reasoning.',
      'short-essay': 'Machine learning is a subset of AI that enables computers to learn and improve from experience without being explicitly programmed using algorithms and data.',
      'programming-essay': 'Algorithms are fundamental step-by-step procedures for solving problems in programming. They provide systematic approaches to problem-solving, improve computational efficiency, and reduce complexity. Good algorithms help programmers break down complex problems into manageable steps, optimize resource usage, and create scalable solutions that perform consistently across different scenarios.'
    },
    {
      name: 'Average Answer',
      'intro-essay': 'AI is technology that makes computers smart. It helps computers think like humans and solve problems. AI is used in many places like phones, cars, and websites. Machine learning is part of AI that helps computers learn new things.',
      'short-essay': 'Machine learning helps computers learn things by looking at data and finding patterns.',
      'programming-essay': 'Algorithms are important in programming because they help solve problems. They make programs work better and faster. Without algorithms, programs would not work properly.'
    },
    {
      name: 'Poor Answer',
      'intro-essay': 'AI is robots and computers. It is new technology that is very advanced. People use it for different things.',
      'short-essay': 'Machine learning is when computers learn stuff.',
      'programming-essay': 'Algorithms are used in programming to make code work.'
    }
  ];

  const sampleEssayForm: FormSchema = {
    id: 'essay-demo-form',
    title: 'AI Essay Grading System - Interactive Demo',
    description: 'Experience real-time AI-powered essay evaluation with instant feedback and scoring',
    createdAt: new Date(),
    updatedAt: new Date(),
    fields: [
      {
        id: 'intro-essay',
        type: 'textarea',
        label: 'Question 1: What is Artificial Intelligence? (100 points)',
        placeholder: 'Write a comprehensive essay about artificial intelligence, its components, and applications...',
        required: true,
        quizSettings: {
          enabled: true,
          points: 100,
          explanation: 'This question evaluates your understanding of AI fundamentals, including key concepts, technologies, and real-world applications.',
          showExplanation: 'always',
          essayKeyAnswer: 'Artificial Intelligence (AI) is a branch of computer science that aims to create machines capable of intelligent behavior. AI systems can learn, reason, and make decisions similar to humans. Key components include machine learning, natural language processing, computer vision, and neural networks. AI applications range from simple automation to complex problem-solving in healthcare, finance, and autonomous vehicles. Modern AI uses algorithms to process data, recognize patterns, and continuously improve performance.',
          essayKeywords: ['machine learning', 'computer science', 'neural networks', 'automation', 'intelligent behavior', 'algorithms', 'data processing', 'natural language processing', 'computer vision'],
          essayMinWords: 50,
          essayMaxWords: 300,
          essayGradingType: 'ai',
          essayPassingThreshold: 70
        }
      },
      {
        id: 'short-essay',
        type: 'text',
        label: 'Question 2: Define Machine Learning (50 points)',
        placeholder: 'Provide a concise but complete definition of machine learning...',
        required: true,
        quizSettings: {
          enabled: true,
          points: 50,
          explanation: 'A clear, concise definition that captures the essence of machine learning is required.',
          showExplanation: 'always',
          essayKeyAnswer: 'Machine learning is a subset of AI that enables computers to learn and improve from experience without being explicitly programmed, using algorithms to analyze data and make predictions.',
          essayKeywords: ['learning', 'AI', 'experience', 'algorithms', 'data', 'predictions', 'subset', 'programmed'],
          essayMinWords: 15,
          essayMaxWords: 50,
          essayGradingType: 'ai',
          essayPassingThreshold: 60
        }
      },
      {
        id: 'programming-essay',
        type: 'textarea',
        label: 'Question 3: Importance of Algorithms in Programming (75 points)',
        placeholder: 'Explain why algorithms are fundamental to programming and software development...',
        required: true,
        quizSettings: {
          enabled: true,
          points: 75,
          explanation: 'Focus on problem-solving aspects, efficiency, and how algorithms structure programming solutions.',
          showExplanation: 'always',
          essayKeyAnswer: 'Algorithms are step-by-step procedures for solving problems and performing computations. They are fundamental to programming because they provide systematic approaches to problem-solving. Good algorithms improve efficiency, reduce computational complexity, and ensure consistent results. Algorithms help programmers break down complex problems into manageable steps, optimize resource usage, and create scalable solutions that perform reliably across different scenarios.',
          essayKeywords: ['problem-solving', 'efficiency', 'step-by-step', 'computational complexity', 'systematic', 'optimization', 'scalable', 'procedures'],
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
      submitButtonText: 'Submit All Essays'
    }
  };

  const handleSubmit = (data: any) => {
    setSubmissionData(data);
    setSubmitted(true);
    console.log('Essays submitted:', data);
  };

  const loadSampleAnswer = (exampleIndex: number) => {
    setCurrentExample(exampleIndex);
    const example = sampleAnswers[exampleIndex];
    
    // Simulate filling the form fields
    Object.keys(example).forEach(key => {
      if (key !== 'name') {
        const textarea = document.getElementById(key) as HTMLTextAreaElement | HTMLInputElement;
        if (textarea) {
          textarea.value = example[key as keyof typeof example] as string;
          textarea.dispatchEvent(new Event('input', { bubbles: true }));
        }
      }
    });
  };

  if (submitted) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-green-800 mb-2">
            🎉 Essay Evaluation Complete!
          </h2>
          <p className="text-green-700">
            Your essays have been processed by our AI grading system. Review the detailed feedback and scores above.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">📊 Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Total Questions:</span>
                <span className="font-medium">3</span>
              </div>
              <div className="flex justify-between">
                <span>Total Points:</span>
                <span className="font-medium">225</span>
              </div>
              <div className="flex justify-between">
                <span>Submission Time:</span>
                <span className="font-medium">{new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          </div>

          <div className="bg-white border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">🤖 AI Features Used</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Content Similarity Analysis
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Keyword Detection & Matching
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                Automated Feedback Generation
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                Real-time Scoring & Evaluation
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <Button
            onClick={() => {
              setSubmitted(false);
              setSubmissionData(null);
            }}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Try Another Demo
          </Button>
          
          <Button
            variant="outline"
            onClick={() => window.open('/builder', '_blank')}
          >
            Create Your Own Quiz
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          🤖 AI Essay Grading Demo
        </h1>
        <p className="text-lg text-gray-600 mb-4">
          Experience intelligent essay evaluation with real-time feedback, scoring, and detailed analysis
        </p>
        
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-blue-800 mb-3">🚀 How Our AI Grading Works:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
            <div className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">📝</span>
              <div>
                <strong>Content Analysis:</strong> Compares your answer with reference answers using advanced similarity algorithms
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-purple-500 mt-1">🔍</span>
              <div>
                <strong>Keyword Detection:</strong> Identifies important concepts and terminology in your responses
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-500 mt-1">⚡</span>
              <div>
                <strong>Instant Feedback:</strong> Get immediate scores, suggestions, and detailed explanations
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-orange-500 mt-1">📊</span>
              <div>
                <strong>Smart Scoring:</strong> Combines multiple AI techniques for accurate and fair evaluation
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sample Answers */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
        <h3 className="font-semibold text-yellow-800 mb-3">💡 Try Sample Answers:</h3>
        <p className="text-yellow-700 text-sm mb-4">
          Load pre-written answers to see how different quality responses are graded by our AI system.
        </p>
        
        <div className="flex flex-wrap gap-3">
          {sampleAnswers.map((sample, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => loadSampleAnswer(index)}
              className={`${
                currentExample === index 
                  ? 'bg-yellow-200 border-yellow-400' 
                  : 'hover:bg-yellow-100'
              }`}
            >
              Load {sample.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg border shadow-sm">
        <FormRenderer
          form={sampleEssayForm}
          onSubmit={handleSubmit}
          className="p-6"
        />
      </div>

      {/* Instructions */}
      <div className="mt-6 bg-gray-50 rounded-lg p-6">
        <h3 className="font-semibold text-gray-800 mb-3">📋 Instructions:</h3>
        <ol className="text-sm text-gray-600 space-y-2">
          <li>1. Choose a sample answer or write your own responses to each question</li>
          <li>2. Click "Grade Essay" button after writing each answer to get instant AI feedback</li>
          <li>3. Review the detailed scoring, similarity analysis, and keyword matching results</li>
          <li>4. Improve your answers based on the feedback and regrade to see score changes</li>
          <li>5. Submit all essays when satisfied with your responses</li>
        </ol>
      </div>
    </div>
  );
}
