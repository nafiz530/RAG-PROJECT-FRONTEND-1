// TypeScript types for New Vision: Essential interfaces for messages, chats, and related entities.
// Ensures type safety across the app, with no 'any' for robust, futuristic development.

export interface Message {
  id?: string; // Optional for new messages
  chat_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string; // ISO string
}

export interface Chat {
  id: string;
  user_id: string;
  title: string;
  updated_at: string; // ISO string
  is_archived?: boolean; // Optional flag for archived chats
  is_pinned?: boolean; // Optional flag for pinned chats
  messages?: Message[]; // Optional array of messages
}

// Additional types if needed (e.g., for selectors)
export type Subject = 'physics' | 'ict' | 'bgs';
export type Language = 'english' | 'bangla' | 'mixed';
