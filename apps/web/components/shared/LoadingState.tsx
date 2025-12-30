"use client";

export function LoadingState() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="space-y-4">
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-primary rounded-full animate-bounce"></div>
          <div
            className="w-3 h-3 bg-primary rounded-full animate-bounce"
            style={{ animationDelay: "0.1s" }}
          ></div>
          <div
            className="w-3 h-3 bg-primary rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></div>
        </div>
        <p className="text-center text-muted-foreground">กำลังโหลด...</p>
      </div>
    </div>
  );
}
