// Grok-optimized Supabase client: Browser-side initialization for secure, real-time auth and data ops.
// Ensures seamless integration with Google Auth and future DB features in New Vision.

import { createBrowserClient } from '@supabase/ssr';

export const supabaseClient = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);