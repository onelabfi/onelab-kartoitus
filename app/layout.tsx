import type { Metadata } from 'next';
import './globals.css';
import { LangProvider } from '@/lib/LangContext';

export const metadata: Metadata = {
  title: 'Asbestikartoitus',
  description: 'Asbestos sample collection and reporting',
  manifest: '/manifest.json',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fi">
      <body>
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  );
}
