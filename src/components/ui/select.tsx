// src/components/ui/select.tsx
import * as React from "react"

export function Select({ children, ...props }: any) {
  return <select {...props}>{children}</select>
}

export function SelectTrigger({ children, ...props }: any) {
  return <button {...props}>{children}</button>
}

export function SelectValue({ placeholder }: { placeholder: string }) {
  return <span>{placeholder}</span>
}

export function SelectContent({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>
}

export function SelectItem({ value, children }: { value: string; children: React.ReactNode }) {
  return <option value={value}>{children}</option>
}
