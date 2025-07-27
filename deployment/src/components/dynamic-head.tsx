'use client';

import Head from 'next/head';
import { useSettings } from '@/components/settings-provider';

interface DynamicHeadProps {
  title?: string;
  description?: string;
}

export function DynamicHead({ title, description }: DynamicHeadProps) {
  const { settings } = useSettings();
  
  const appName = settings?.appName || 'FormBuilder';
  const appDescription = settings?.appDescription || 'Create beautiful forms';
  const favicon = settings?.logo && settings.logo !== '/logo.svg' ? settings.logo : '/favicon.ico';
  
  const pageTitle = title ? `${title} - ${appName}` : `${appName} - ${appDescription}`;
  const pageDescription = description || appDescription;
  
  return (
    <Head>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <link rel="icon" href={favicon} />
      <link rel="apple-touch-icon" href={favicon} />
      {settings?.primaryColor && (
        <meta name="theme-color" content={settings.primaryColor} />
      )}
    </Head>
  );
}
