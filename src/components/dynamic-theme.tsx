'use client';

import { useSettings } from '@/components/settings-provider';
import { useEffect } from 'react';

export function DynamicTheme() {
  const { settings } = useSettings();

  useEffect(() => {
    if (settings?.primaryColor) {
      // Convert hex to HSL for CSS custom properties
      const hexToHsl = (hex: string) => {
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h = 0;
        let s = 0;
        const l = (max + min) / 2;

        if (max !== min) {
          const d = max - min;
          s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

          switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
          }
          h /= 6;
        }

        return {
          h: Math.round(h * 360),
          s: Math.round(s * 100),
          l: Math.round(l * 100)
        };
      };

      try {
        const hsl = hexToHsl(settings.primaryColor);
        
        // Update CSS custom properties
        document.documentElement.style.setProperty('--primary-color', settings.primaryColor);
        document.documentElement.style.setProperty('--primary', `${hsl.h} ${hsl.s}% ${hsl.l}%`);
        
        // Update button styles
        const style = document.getElementById('dynamic-theme-style');
        if (style) {
          style.remove();
        }
        
        const newStyle = document.createElement('style');
        newStyle.id = 'dynamic-theme-style';
        newStyle.textContent = `
          .btn-primary {
            background-color: ${settings.primaryColor} !important;
            border-color: ${settings.primaryColor} !important;
          }
          .btn-primary:hover {
            background-color: ${settings.primaryColor}dd !important;
            border-color: ${settings.primaryColor}dd !important;
          }
          .text-primary {
            color: ${settings.primaryColor} !important;
          }
          .bg-primary {
            background-color: ${settings.primaryColor} !important;
          }
          .border-primary {
            border-color: ${settings.primaryColor} !important;
          }
        `;
        document.head.appendChild(newStyle);
      } catch (error) {
        console.error('Error applying theme:', error);
      }
    }
  }, [settings?.primaryColor]);

  return null;
}
