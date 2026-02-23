// LanguageSelector for New Vision: Controlled shadcn/ui Select with languages (English, Bangla, Mixed, Bangla).
// Dark mode compatible, with onChange handler.

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface LanguageSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function LanguageSelector({ value, onChange }: LanguageSelectorProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[140px]">
        <SelectValue placeholder="Select Language" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="english">English</SelectItem>
        <SelectItem value="bangla">Bangla</SelectItem>
        <SelectItem value="mixed">Mixed</SelectItem>
        <SelectItem value="bangla">Bangla</SelectItem>
      </SelectContent>
    </Select>
  );
}