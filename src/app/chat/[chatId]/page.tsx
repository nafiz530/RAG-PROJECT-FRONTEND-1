// src/app/chat/[chatId]/page.tsx
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import Sidebar from '@/components/Sidebar';
import WelcomeMessage from '@/components/WelcomeMessage';
import ThreeDotMenu from '@/components/ThreeDotMenu';
import SubjectSelector from '@/components/SubjectSelector';
import LanguageSelector from '@/components/LanguageSelector';
import ChatInput from '@/components/ChatInput';
import ChatMessage from '@/components/ChatMessage';
import { getSession } from '@/lib/auth';
import { supabase } from '@/lib/supabaseClient';
import { loadMessages } from '@/lib/chat';
import { Message } from '@/types';

export default function ChatPage() {
  const { chatId } = useParams<{ chatId: string }>();
  const router = useRouter();
  const { toast } = useToast();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [subject, setSubject] = useState('Physics');
  const [language, setLanguage] = useState('English');
  const messageListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function initChat() {
      const session = await getSession();
      if (!session) {
        router.push('/login');
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Load messages for this chat (only 1 argument: chatId)
        const loadedMessages = await loadMessages(chatId as string);
        setMessages(loadedMessages);
      } catch (err: any) {
        setError('Failed to load chat history. Please try again.');
        console.error('Init chat error:', err);
        toast({
          variant: 'destructive',
          title: 'Load Failed',
          description: err.message || 'Could not load messages',
        });
      } finally {
        setIsLoading(false);
      }
    }

    initChat();
  }, [chatId, router, toast]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  const handleMessageSent = (newMessage: Message) => {
    setMessages((prev) => [...prev, newMessage]);
  };

  const handleError = (err: Error) => {
    toast({
      variant: 'destructive',
      title: 'Message Failed',
      description: err.message || 'Failed to get response from AI',
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background text-destructive">
        <AlertCircle className="h-12 w-12 mb-4" />
        <p className="text-lg font-medium">{error}</p>
        <Button variant="outline" onClick={() => router.push('/chat/new')} className="mt-6">
          Start New Chat
        </Button>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden border-r border-border bg-card"
      >
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </motion.aside>

      {/* Main Chat Area */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-border p-4 bg-background sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="md:hidden"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
            <h1 className="text-xl font-semibold">{subject}</h1>
          </div>
          <div className="flex items-center gap-3">
            <SubjectSelector value={subject} onChange={setSubject} />
            <LanguageSelector value={language} onChange={setLanguage} />
            <ThreeDotMenu chatId={chatId as string} />
          </div>
        </header>

        {/* Messages List */}
        <div ref={messageListRef} className="flex-1 overflow-y-auto p-4 space-y-6">
          {messages.length === 0 ? (
            <WelcomeMessage />
          ) : (
            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div
                  key={msg.timestamp}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChatMessage message={msg} />
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Input Area */}
        <ChatInput
          chatId={chatId as string}
          subject={subject}
          language={language}
          onMessageSent={handleMessageSent}
          onError={handleError}
        />
      </div>
    </div>
  );
}
