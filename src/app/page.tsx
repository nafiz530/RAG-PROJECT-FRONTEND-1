// Home page for New Vision: Welcoming interface with logo, animated bubble, and entry button.
// Checks session; redirects to login if unauthenticated. Framer-motion for subtle, futuristic animations.

'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button'; // Assuming shadcn/ui Button is installed.
import { getSession } from '@/lib/auth';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      const session = await getSession();
      if (session) {
        router.push('/chat/new'); // Redirect to chat if already signed in.
      }
    }
    checkAuth();
  }, [router]);

  const handleEnter = () => {
    router.push('/login');
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background text-foreground">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="text-center space-y-6"
      >
        <Image
          src="/logo.png"
          alt="New Vision Logo"
          width={128}
          height={128}
          className="mx-auto rounded-full shadow-lg"
        />
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">New Vision</h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-lg text-muted-foreground max-w-md mx-auto"
        >
          AI-powered textbook chat for grade 10 students in Bangladesh. Multilingual mastery awaits.
        </motion.p>
        <Button
          onClick={handleEnter}
          className="mt-4 px-6 py-3 text-lg"
          variant="default"
        >
          Enter to Manifest
        </Button>
      </motion.div>
    </main>
  );
}