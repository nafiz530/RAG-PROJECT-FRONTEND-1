// Collapsible Sidebar for New Vision: Displays chat history from Supabase, with loading/error states.
// Bottom settings for dark mode toggle and sign out. Animated with framer-motion.

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Loader2, LogOut, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { signOut, getSession } from '@/lib/auth';
import { supabaseClient } from '@/lib/supabaseClient';

interface Chat {
  id: string;
  title: string;
  updated_at: string;
}

interface SidebarProps {
  onClose: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [chats, setChats] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchChats() {
      const session = await getSession();
      if (!session) return;

      const { data, error } = await supabaseClient
        .from('chats')
        .select('id, title, updated_at')
        .eq('user_id', session.user.id)
        .order('updated_at', { ascending: false });

      if (error) {
        setError('Failed to load chats');
      } else {
        setChats(data || []);
      }
      setIsLoading(false);
    }
    fetchChats();
  }, []);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <div className="flex h-full flex-col p-4 w-64 md:w-72">
      {/* Chat History */}
      <h2 className="text-lg font-semibold mb-4">Chat History</h2>
      {isLoading ? (
        <div className="flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : error ? (
        <p className="text-destructive">{error}</p>
      ) : (
        <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-2 overflow-y-auto flex-1"
        >
          {chats.map((chat) => (
            <motion.li
              key={chat.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Button
                variant="ghost"
                className="w-full justify-start text-left truncate"
                onClick={() => {
                  router.push(`/chat/${chat.id}`);
                  onClose();
                }}
              >
                <div>
                  <p className="font-medium">{chat.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(chat.updated_at).toLocaleString()}
                  </p>
                </div>
              </Button>
            </motion.li>
          ))}
        </motion.ul>
      )}

      {/* Settings */}
      <div className="mt-auto pt-4 border-t border-border">
        <div className="flex items-center justify-between mb-2">
          <label className="flex items-center gap-2">
            {theme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            Dark Mode
          </label>
          <Switch
            checked={theme === 'dark'}
            onCheckedChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          />
        </div>
        <Button variant="ghost" className="w-full justify-start" onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}