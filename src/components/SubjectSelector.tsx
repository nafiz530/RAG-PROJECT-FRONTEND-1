// SubjectSelector for New Vision: Controlled shadcn/ui Select with subjects (Physics, ICT, BGS).
// Dark mode ready, with onChange handler.

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SubjectSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SubjectSelector({ value, onChange }: SubjectSelectorProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[140px]">
        <SelectValue placeholder="Select Subject" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="physics">Physics</SelectItem>
        <SelectItem value="ict">ICT</SelectItem>
        <SelectItem value="bgs">BGS</SelectItem>
      </SelectContent>
    </Select>
  );
}