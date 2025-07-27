'use client';

import React, { useRef, useState, useEffect } from 'react';
import { FormField } from '@/types/form';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface SignatureFieldProps {
  field: FormField;
  value?: string;
  onChange?: (value: string) => void;
  isPreview?: boolean;
}

export function SignatureField({ field, value = '', onChange, isPreview = false }: SignatureFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);

  const settings = field.signatureSettings || {
    width: 400,
    height: 200,
    penColor: '#000000',
    backgroundColor: '#ffffff'
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = settings.width || 400;
    canvas.height = settings.height || 200;

    // Set background
    ctx.fillStyle = settings.backgroundColor || '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Set drawing style
    ctx.strokeStyle = settings.penColor || '#000000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // If there's a value (base64 image), draw it
    if (value) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
        setIsEmpty(false);
      };
      img.src = value;
    }
  }, [settings, value]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isPreview) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || isPreview) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineTo(x, y);
    ctx.stroke();
    setIsEmpty(false);
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    
    setIsDrawing(false);
    
    // Convert canvas to base64 and call onChange
    const canvas = canvasRef.current;
    if (canvas && onChange) {
      const dataURL = canvas.toDataURL('image/png');
      onChange(dataURL);
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = settings.backgroundColor || '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    setIsEmpty(true);
    if (onChange) {
      onChange('');
    }
  };

  // Touch events for mobile
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousedown', {
      clientX: touch.clientX,
      clientY: touch.clientY
    });
    startDrawing(mouseEvent as any);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousemove', {
      clientX: touch.clientX,
      clientY: touch.clientY
    });
    draw(mouseEvent as any);
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    stopDrawing();
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
        <canvas
          ref={canvasRef}
          className="border border-gray-300 rounded cursor-crosshair bg-white mx-auto block"
          style={{ 
            maxWidth: '100%',
            height: 'auto',
            touchAction: 'none'
          }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />
        
        {!isPreview && (
          <div className="flex justify-center mt-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={clearSignature}
              disabled={isEmpty}
              className="text-gray-600 hover:text-red-600"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Clear Signature
            </Button>
          </div>
        )}
        
        {isEmpty && !isPreview && (
          <p className="text-center text-sm text-gray-500 mt-2">
            Click and drag to sign, or use touch on mobile
          </p>
        )}
      </div>
      
      {field.required && isEmpty && (
        <p className="text-sm text-red-500">Signature is required</p>
      )}
    </div>
  );
}
