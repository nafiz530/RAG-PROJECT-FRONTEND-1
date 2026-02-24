// src/components/ui/use-toast.tsx
import { toast } from "sonner";

export function useToast() {
  return {
    toast: (props: any) => toast(props.title, {
      description: props.description,
      style: props.variant === "destructive" ? { background: "#ef4444", color: "white" } : {},
    }),
  };
}
