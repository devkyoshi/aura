import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import AppProviders from '@/contexts/AppProviders';
import { APP_CONSTANTS } from '@/config/app.constants';
import React from 'react';
import { toAbsoluteUrl } from '@/lib/utils';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: APP_CONSTANTS.APP_NAME,
  description: 'E-learning platform',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <link rel="icon" href={toAbsoluteUrl('/media/images/app-logo.png')} />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AppProviders> {children}</AppProviders>
      </body>
    </html>
  );
}
