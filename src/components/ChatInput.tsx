// ChatInput for New Vision: Fixed bottom input bar with text input, upload placeholder, and Send/Pause button.
// Handles optimistic message addition, calls Edge Function via sendMessage, shows loading/error states with toast.
// Enhanced: Auto-focus, Enter to send (no shift), disable while loading, futuristic spinner animation.

'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { sendMessage } from '@/lib/chat';
import { Message } from '@/types';

interface ChatInputProps {
  chatId: string;
  subject: string;
  language: string;
  onMessageSent: (message: Message) => void;
  onError: (error: Error) => void; // For rollback
}

export default function ChatInput({ chatId, subject, language, onMessageSent, onError }: ChatInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      chat_id: chatId,
      role: 'user',
      content: inputValue,
      created_at: new Date().toISOString(),
    };

    // Optimistic update
    onMessageSent(userMessage);
    setInputValue('');
    setIsLoading(true);

    try {
      const assistantResponse = await sendMessage(chatId, subject, language, inputValue);
      onMessageSent({
        chat_id: chatId,
        role: 'assistant',
        content: assistantResponse,
        created_at: new Date().toISOString(),
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to send message. Please try again.',
      });
      console.error('Send error:', error);
      onError(error as Error); // Trigger rollback
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-background p-4 md:static">
      <div className="mx-auto flex max-w-3xl items-center gap-2">
        <Button variant="ghost" size="icon" disabled title="Upload file (<1MB) – Coming soon">
          <Upload className="h-5 w-5" />
        </Button>
        <Input
          ref={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type your question..."
          className="flex-1"
          disabled={isLoading}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <Button onClick={handleSend} disabled={isLoading || !inputValue.trim()}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send'}
        </Button>
      </div>
    </div>
  );
}
