import React from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeProvider';
import { Toaster } from 'react-hot-toast';

// This component is a wrapper for all the providers in the app
const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <AuthProvider>{children}</AuthProvider>
      </ThemeProvider>
      <Toaster
        position="top-center"
        reverseOrder={true}
      />
    </>
  );
};

export default AppProviders;
