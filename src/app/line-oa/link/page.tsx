"use client";

import { Suspense } from "react";
import LineOALinkContent from "./client";

function LineOALinkLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-gray-600">กำลังโหลด...</p>
      </div>
    </div>
  );
}

export default function LineOALinkPage() {
  return (
    <Suspense fallback={<LineOALinkLoading />}>
      <LineOALinkContent />
    </Suspense>
  );
}
