// Main chat page for New Vision: Dynamic [chatId] route with collapsible sidebar, selectors, menu, message list, and input.
// Handles new chat creation, session check, loading states. Responsive layout with framer-motion transitions.
// Enhanced: Auto-scroll to bottom, loading/error states, auto-title from first message if new.

'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'; // Placeholder, but using ChatInput
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
import { supabaseClient } from '@/lib/supabaseClient';
import { loadMessages } from '@/lib/chat';
import { Message, Chat as ChatType } from '@/types';

export default function ChatPage() {
  const { chatId } = useParams<{ chatId: string }>();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chat, setChat] = useState<ChatType | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [subject, setSubject] = useState('physics');
  const [language, setLanguage] = useState('english');
  const messageListRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

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
        let currentChat: ChatType;

        if (chatId === 'new') {
          const { data: newChat, error: createError } = await supabaseClient
            .from('chats')
            .insert({ user_id: session.user.id, title: 'New Chat' })
            .select()
            .single();

          if (createError) throw createError;
          currentChat = newChat;
          router.replace(`/chat/${currentChat.id}`);
        } else {
          const { data: existingChat, error: fetchError } = await supabaseClient
            .from('chats')
            .select('*')
            .eq('id', chatId)
            .eq('user_id', session.user.id)
            .single();

          if (fetchError || !existingChat) throw new Error('Chat not found');
          currentChat = existingChat;
        }

        const loadedMessages = await loadMessages(currentChat.id);
        setChat(currentChat);
        setMessages(loadedMessages);
      } catch (err) {
        setError('Failed to load chat. Please try again.');
        console.error('Init chat error:', err);
      } finally {
        setIsLoading(false);
      }
    }
    initChat();
  }, [chatId, router]);

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  const handleMessageSent = (newMessage: Message) => {
    setMessages((prev) => [...prev, newMessage]);
    // Auto-title if first message and title is 'New Chat'
    if (messages.length === 0 && chat?.title === 'New Chat' && newMessage.role === 'user') {
      // Placeholder: Extract title from message (e.g., first 30 chars)
      const autoTitle = newMessage.content.slice(0, 30) + '...';
      setChat((prev) => prev ? { ...prev, title: autoTitle } : null);
      // Update in DB
      supabaseClient.from('chats').update({ title: autoTitle }).eq('id', chat?.id);
    }
  };

  const handleError = (err: Error) => {
    // Rollback last user message on fail
    setMessages((prev) => prev.slice(0, -1));
    toast({
      variant: 'destructive',
      title: 'Message Failed',
      description: err.message,
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !chat) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background text-destructive">
        <AlertCircle className="h-8 w-8 mb-2" />
        <p>{error}</p>
        <Button variant="outline" onClick={() => router.push('/chat/new')} className="mt-4">
          Start New Chat
        </Button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden border-r border-border"
      >
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </motion.aside>

      {/* Main Chat Area */}
      <main className="flex flex-1 flex-col">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-border p-4 bg-background">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="md:hidden"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
            <h1 className="text-xl font-semibold">{chat.title}</h1>
          </div>
          <div className="flex items-center gap-2">
            <SubjectSelector value={subject} onChange={setSubject} />
            <LanguageSelector value={language} onChange={setLanguage} />
            <ThreeDotMenu chatId={chat.id} />
          </div>
        </header>

        {/* Message List */}
        <div ref={messageListRef} className="flex-1 overflow-y-auto p-4 bg-background">
          {messages.length === 0 ? (
            <WelcomeMessage />
          ) : (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.1 } },
              }}
            >
              <AnimatePresence>
                {messages.map((msg) => (
                  <ChatMessage key={msg.created_at} {...msg} />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>

        {/* Input Area */}
        <ChatInput
          chatId={chat.id}
          subject={subject}
          language={language}
          onMessageSent={handleMessageSent}
          onError={handleError}
        />
      </main>
    </div>
  );
}