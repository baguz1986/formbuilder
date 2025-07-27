'use client';

import React, { useState } from 'react';
import { FormField } from '@/types/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, Image as ImageIcon } from 'lucide-react';

interface ImageFieldProps {
  field: FormField;
  isPreview?: boolean;
  onUpdate?: (field: FormField) => void;
}

export function ImageField({ field, isPreview = false, onUpdate }: ImageFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [imageUrl, setImageUrl] = useState(field.imageSettings?.src || '');

  const settings = field.imageSettings || {
    src: '',
    alt: 'Image description',
    width: 300,
    height: 200,
    alignment: 'center'
  };

  const alignmentClasses = {
    left: 'flex justify-start',
    center: 'flex justify-center',
    right: 'flex justify-end'
  };

  const handleImageUrlChange = (url: string) => {
    setImageUrl(url);
    if (onUpdate) {
      onUpdate({
        ...field,
        imageSettings: {
          ...settings,
          src: url
        }
      });
    }
  };

  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
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
      handleImageUrlChange(result.url);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  if (!settings.src && !isEditing && !isPreview) {
    return (
      <div className={`py-4 ${alignmentClasses[settings.alignment || 'center']}`}>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50 max-w-md">
          <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-sm text-gray-600 mb-4">Add an image to your form</p>
          
          <div className="space-y-3">
            <div>
              <Input
                type="url"
                placeholder="Enter image URL..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="text-sm"
              />
              <Button
                type="button"
                size="sm"
                onClick={() => handleImageUrlChange(imageUrl)}
                className="mt-2 w-full"
              >
                Add Image URL
              </Button>
            </div>
            
            <div className="text-xs text-gray-500">or</div>
            
            <div>
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="inline-block w-full">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full pointer-events-none"
                    disabled={isUploading}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {isUploading ? 'Uploading...' : 'Upload Image'}
                  </Button>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!settings.src) return null;

  return (
    <div className={`py-4 ${alignmentClasses[settings.alignment || 'center']}`}>
      <div className="relative group">
        <img
          src={settings.src}
          alt={settings.alt || 'Form image'}
          className="rounded-lg shadow-sm"
          style={{
            maxWidth: settings.width || 300,
            maxHeight: settings.height || 200,
            objectFit: 'contain'
          }}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
          }}
        />
        
        {!isPreview && (
          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => setIsEditing(true)}
              className="text-white bg-white/20 hover:bg-white/30 border-white/30"
            >
              Change Image
            </Button>
          </div>
        )}
      </div>
      
      {isEditing && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-3">
          <Input
            type="url"
            placeholder="Enter new image URL..."
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="text-sm"
          />
          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              onClick={() => {
                handleImageUrlChange(imageUrl);
                setIsEditing(false);
              }}
            >
              Update Image
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => {
                setIsEditing(false);
                setImageUrl(settings.src || '');
              }}
            >
              Cancel
            </Button>
          </div>
          
          <div className="text-xs text-gray-500">or</div>
          
          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                handleFileUpload(e);
                setIsEditing(false);
              }}
              className="hidden"
            />
            <div className="inline-block w-full">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full pointer-events-none"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload New Image
              </Button>
            </div>
          </label>
        </div>
      )}
    </div>
  );
}
