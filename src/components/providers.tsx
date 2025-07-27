'use client';

import { SessionProvider } from 'next-auth/react';
import { LanguageProvider } from '@/components/language-provider';
import { SettingsProvider } from '@/components/settings-provider';
import { DynamicTheme } from '@/components/dynamic-theme';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <SettingsProvider>
        <LanguageProvider>
          <DynamicTheme />
          {children}
        </LanguageProvider>
      </SettingsProvider>
    </SessionProvider>
  );
}
