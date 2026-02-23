// Login page for New Vision: Simple Google Sign-In button with Supabase OAuth.
// Requests drive.file scope; redirects to /chat/new on success. Minimalist, animated UI.

'use client';

import { Button } from '@/components/ui/button'; // Assuming shadcn/ui Button is installed.
import { motion } from 'framer-motion';
import { signInWithGoogle } from '@/lib/auth';

export default function Login() {
  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
      // Supabase handles redirect to /auth/callback, then to /chat/new via auth listener (implement in future).
    } catch (error) {
      console.error('Sign-in error:', error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background text-foreground">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-4"
      >
        <h2 className="text-2xl font-semibold">Sign In to New Vision</h2>
        <p className="text-muted-foreground">Access AI-powered learning with Google.</p>
        <Button
          onClick={handleSignIn}
          variant="outline"
          className="flex items-center gap-2"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            {/* Google icon SVG */}
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.11-3.07C17.5 2.36 14.99 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
            <path d="M1 1h22v22H1z" fill="none" />
          </svg>
          Sign in with Google
        </Button>
      </motion.div>
    </main>
  );
}