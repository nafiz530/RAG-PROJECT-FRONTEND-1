// Root layout for New Vision: Integrates next-themes for dark mode, sets up metadata, and prepares for Supabase context.
// Mobile-responsive, with modern font and Tailwind globals for a visionary UI.

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from 'next-themes';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'New Vision - AI-Powered Textbook Chat',
  description: 'Multilingual AI chat for grade 10 students in Bangladesh. Empower learning with vision.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}