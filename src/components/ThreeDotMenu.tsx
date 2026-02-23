// ThreeDotMenu for New Vision: shadcn/ui DropdownMenu with Delete, Archive, Pin placeholders.
// Logs actions; integrate real handlers later (e.g., Supabase updates).

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';

interface ThreeDotMenuProps {
  chatId: string;
}

export default function ThreeDotMenu({ chatId }: ThreeDotMenuProps) {
  const handleAction = (action: 'Delete' | 'Archive' | 'Pin') => {
    // Placeholder: Implement Supabase actions here.
    console.log(`${action} chat ${chatId}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => handleAction('Pin')}>Pin Chat</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAction('Archive')}>Archive Chat</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAction('Delete')} className="text-destructive">
          Delete Chat
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}