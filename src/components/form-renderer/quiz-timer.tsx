'use client';

import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

interface QuizTimerProps {
  timeLimit: number; // in minutes
  onTimeUp: () => void;
  isActive: boolean;
}

export function QuizTimer({ timeLimit, onTimeUp, isActive }: QuizTimerProps) {
  const [timeLeft, setTimeLeft] = useState(timeLimit * 60); // Convert to seconds

  useEffect(() => {
    if (!isActive || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, timeLeft, onTimeUp]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    const percentage = timeLeft / (timeLimit * 60);
    if (percentage > 0.5) return 'text-green-600';
    if (percentage > 0.25) return 'text-yellow-600';
    return 'text-red-600';
  };

  const isUrgent = timeLeft <= 60; // Last minute

  if (!isActive || timeLimit <= 0) return null;

  return (
    <div className={`fixed top-4 right-4 bg-white rounded-lg shadow-lg border-2 p-4 z-50 ${
      isUrgent ? 'border-red-500 animate-pulse' : 'border-gray-200'
    }`}>
      <div className="flex items-center space-x-2">
        {isUrgent ? (
          <AlertTriangle className="w-5 h-5 text-red-500" />
        ) : (
          <Clock className="w-5 h-5 text-gray-500" />
        )}
        <div className="flex flex-col">
          <div className="text-xs text-gray-500 uppercase tracking-wide">Time Remaining</div>
          <div className={`text-lg font-mono font-bold ${getTimerColor()}`}>
            {formatTime(timeLeft)}
          </div>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all duration-1000 ${
            timeLeft / (timeLimit * 60) > 0.5 ? 'bg-green-500' :
            timeLeft / (timeLimit * 60) > 0.25 ? 'bg-yellow-500' : 'bg-red-500'
          }`}
          style={{ width: `${(timeLeft / (timeLimit * 60)) * 100}%` }}
        />
      </div>
      
      {isUrgent && (
        <div className="text-xs text-red-600 mt-1 font-medium">
          Hurry up! Less than 1 minute left!
        </div>
      )}
    </div>
  );
}
