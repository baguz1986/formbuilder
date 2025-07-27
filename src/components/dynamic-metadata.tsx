'use client';

import { useEffect } from 'react';
import { useSettings } from '@/components/settings-provider';

export function DynamicMetadata() {
  const { settings } = useSettings();

  useEffect(() => {
    if (settings) {
      // Update document title
      document.title = `${settings.appName} - ${settings.appDescription}`;
      
      // Update favicon
      const favicon = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
      if (favicon && settings.logo && settings.logo !== '/logo.svg') {
        favicon.href = settings.logo;
      }
      
      // Update meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', settings.appDescription);
      }
      
      // Update theme color based on primary color
      let themeColorMeta = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement;
      if (!themeColorMeta) {
        themeColorMeta = document.createElement('meta');
        themeColorMeta.name = 'theme-color';
        document.head.appendChild(themeColorMeta);
      }
      themeColorMeta.content = settings.primaryColor;
    }
  }, [settings]);

  return null; // This component doesn't render anything visual
}
