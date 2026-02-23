// src/components/ui/dropdown-menu.tsx
import * as React from "react"

export function DropdownMenu({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>
}

export function DropdownMenuTrigger({ children, ...props }: any) {
  return <button {...props}>{children}</button>
}

export function DropdownMenuContent({ children }: { children: React.ReactNode }) {
  return <div className="bg-white shadow-lg rounded-md">{children}</div>
}

export function DropdownMenuItem({ children, ...props }: any) {
  return <div className="p-2 hover:bg-gray-100 cursor-pointer" {...props}>{children}</div>
}
