// Chat helpers for New Vision: Load messages from Supabase, send message via Edge Function.
// Securely uses access_token in headers. Assumes 'messages' table: id, chat_id, role, content, created_at.
// Enhanced: Auto-title from first message, better error handling with custom errors, optimistic support (but rollback in UI).

import { supabaseClient } from './supabaseClient';
import { Message, Chat as ChatType } from '@/types';

const EDGE_FUNCTION_URL = 'https://vpentdpgxbaghcfsnuml.supabase.co/functions/v1/generate-response';

export async function loadMessages(chatId: string): Promise<Message[]> {
  const { data: session } = await supabaseClient.auth.getSession();
  if (!session?.session) throw new Error('No active session');

  const { data, error } = await supabaseClient
    .from('messages')
    .select('*')
    .eq('chat_id', chatId)
    .order('created_at', { ascending: true });

  if (error) throw new Error(`Load messages error: ${error.message}`);
  return (data as Message[]) || [];
}

export async function sendMessage(
  chatId: string,
  subject: string,
  language: string,
  message: string
): Promise<string> {
  const { data: session } = await supabaseClient.auth.getSession();
  if (!session?.session) throw new Error('No active session');

  // Insert user message
  const { error: insertError } = await supabaseClient.from('messages').insert({
    chat_id: chatId,
    role: 'user',
    content: message,
  });

  if (insertError) throw new Error(`Insert user message error: ${insertError.message}`);

  // Call Edge Function
  const response = await fetch(EDGE_FUNCTION_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${session.session.access_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ chatId, subject, language, message }),
  });

  if (!response.ok) {
    const errMsg = await response.text();
    throw new Error(`Edge function error: ${errMsg || response.statusText}`);
  }

  const { response: assistantResponse } = await response.json();

  // Insert assistant message
  const { error: assistantError } = await supabaseClient.from('messages').insert({
    chat_id: chatId,
    role: 'assistant',
    content: assistantResponse,
  });

  if (assistantError) throw new Error(`Insert assistant message error: ${assistantError.message}`);

  // Update chat updated_at and auto-title if first message
  const { data: messagesAfter } = await supabaseClient
    .from('messages')
    .select('count')
    .eq('chat_id', chatId);

  const messageCount = messagesAfter?.[0]?.count || 0;

  let updates: Partial<ChatType> = { updated_at: new Date().toISOString() };

  if (messageCount === 2) { // After user + assistant (first pair)
    // Simple auto-title: First 30 chars of user message
    const { data: firstMessage } = await supabaseClient
      .from('messages')
      .select('content')
      .eq('chat_id', chatId)
      .eq('role', 'user')
      .order('created_at', { ascending: true })
      .limit(1)
      .single();

    if (firstMessage) {
      updates.title = firstMessage.content.slice(0, 30) + '...';
    }
  }

  const { error: updateError } = await supabaseClient
    .from('chats')
    .update(updates)
    .eq('id', chatId);

  if (updateError) throw new Error(`Update chat error: ${updateError.message}`);

  return assistantResponse;
}