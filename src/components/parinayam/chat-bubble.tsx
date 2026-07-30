import { Check, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ChatBubbleProps {
  from: "self" | "other";
  children: React.ReactNode;
  time?: string;
  read?: boolean;
  className?: string;
}

export function ChatBubble({ from, children, time, read, className }: ChatBubbleProps) {
  const isSelf = from === "self";
  return (
    <div className={cn("flex flex-col gap-1", isSelf ? "items-end" : "items-start", className)}>
      <div
        className={cn(
          "max-w-[80%] px-4 py-2.5 text-sm",
          isSelf
            ? "rounded-[16px_16px_4px_16px] bg-primary text-white"
            : "rounded-[16px_16px_16px_4px] bg-muted text-ink"
        )}
      >
        {children}
      </div>
      {time && (
        <div className="flex items-center gap-1 text-[11px] text-faint">
          {time}
          {isSelf &&
            (read ? (
              <CheckCheck className="size-3.5 text-primary" />
            ) : (
              <Check className="size-3.5" />
            ))}
        </div>
      )}
    </div>
  );
}

export function TypingDots({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex w-fit items-center gap-1 rounded-[16px_16px_16px_4px] bg-muted px-4 py-3.5",
        className
      )}
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="size-1.5 animate-bounce rounded-full bg-faint"
          style={{ animationDelay: `${i * 120}ms` }}
        />
      ))}
    </div>
  );
}
