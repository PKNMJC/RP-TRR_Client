"use client";

import { InboxIcon } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  message: string;
  icon?: React.ReactNode;
}

export function EmptyState({
  title = "ไม่พบข้อมูล",
  message,
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
      <div className="text-muted-foreground mb-4">
        {icon || <InboxIcon className="h-16 w-16" />}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground text-center max-w-md">
        {message}
      </p>
    </div>
  );
}
