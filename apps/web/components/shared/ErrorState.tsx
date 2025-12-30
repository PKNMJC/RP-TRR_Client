"use client";

import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ErrorStateProps {
  error?: Error | null;
  message?: string;
}

export function ErrorState({ error, message }: ErrorStateProps) {
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Alert variant="destructive" className="max-w-md">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {message || error?.message || "เกิดข้อผิดพลาด กรุณาลองใหม่"}
        </AlertDescription>
      </Alert>
    </div>
  );
}
