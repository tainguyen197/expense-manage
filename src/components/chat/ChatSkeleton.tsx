"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function HeaderSkeleton() {
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[150px]" />
          <Skeleton className="h-3 w-[100px]" />
        </div>
      </div>
      <Skeleton className="h-8 w-8 rounded-md" />
    </div>
  );
}

export function MessageSkeleton() {
  return (
    <div className="flex flex-col gap-6 p-4">
      {/* AI Message */}
      <div className="flex gap-3 items-start">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="space-y-2.5 flex-1">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-20 w-full max-w-[80%]" />
        </div>
      </div>
      {/* User Message */}
      <div className="flex gap-3 items-start justify-end">
        <div className="space-y-2.5 flex-1">
          <div className="flex justify-end">
            <Skeleton className="h-4 w-[200px]" />
          </div>
          <div className="flex justify-end">
            <Skeleton className="h-16 w-full max-w-[70%]" />
          </div>
        </div>
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    </div>
  );
}

export function InputSkeleton() {
  return (
    <div className="p-4 border-t">
      <div className="flex gap-2">
        <Skeleton className="flex-1 h-[42px] rounded-full" />
        <Skeleton className="h-[42px] w-[42px] rounded-full" />
      </div>
    </div>
  );
}

export function EmptyChat() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
      <div className="w-[300px] h-[300px] mb-8 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/30 to-secondary/40 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-muted/40 to-muted/50 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        <div className="relative h-full flex items-center justify-center">
          <svg
            className="w-32 h-32 text-muted-foreground/30"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </div>
      </div>
      <h3 className="text-2xl font-semibold text-foreground mb-2">
        No messages yet
      </h3>
      <p className="text-muted-foreground max-w-sm">
        Start a conversation with AI Chat. Ask questions, get insights, or just
        chat about anything you'd like to discuss.
      </p>
    </div>
  );
}
