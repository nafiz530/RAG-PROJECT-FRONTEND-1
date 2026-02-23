// ChatMessage for New Vision: Role-based message bubble with timestamp and framer-motion animations.
// Enhanced: Dynamic "X min ago" timestamp, staggered load animation, polished gradients/shadows for dark mode.
// User: right-aligned, primary gradient; Assistant: left-aligned, muted gradient.

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export default function ChatMessage({ role, content, created_at }: ChatMessageProps) {
  const isUser = role === 'user';
  const timestamp = formatDistanceToNow(new Date(created_at), { addSuffix: true });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={cn(
        'mb-4 flex max-w-[80%] flex-col',
        isUser ? 'ml-auto items-end' : 'mr-auto items-start'
      )}
    >
      <div
        className={cn(
          'rounded-2xl px-4 py-2 shadow-sm',
          isUser
            ? 'bg-gradient-to-r from-primary to-primary/80 text-primary-foreground'
            : 'bg-gradient-to-r from-muted to-muted/80 text-muted-foreground'
        )}
      >
        <p>{content}</p>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">{timestamp}</p>
    </motion.div>
  );
}