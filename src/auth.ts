// Auth utilities for New Vision: Handles Google OAuth with drive.file scope for textbook integrations.
// Secure, async helpers for sign-in, sign-out, and session management via Supabase.

import { supabaseClient } from './supabaseClient';

export async function signInWithGoogle() {
  const { data, error } = await supabaseClient.auth.signInWithOAuth({
    provider: 'google',
    options: {
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
      scopes: 'https://www.googleapis.com/auth/drive.file', // Scope for Google Drive file access.
      redirectTo: `${window.location.origin}/auth/callback`, // Handle callback in App Router.
    },
  });

  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabaseClient.auth.signOut();
  if (error) throw error;
}

export async function getSession() {
  const { data: { session } } = await supabaseClient.auth.getSession();
  return session;
}