"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react";
import { apiFetch } from "@/services/api";
import { useLiff } from "@/hooks/useLiff";

export default function LineOALinkPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { liffContext, isLoading, error } = useLiff();
  const [isLinking, setIsLinking] = useState(false);
  const [linkStatus, setLinkStatus] = useState<
    "idle" | "linking" | "success" | "error"
  >("idle");
  const [linkError, setLinkError] = useState<string | null>(null);

  const lineId = searchParams.get("lineId");
  const userId = searchParams.get("userId");

  const handleLinkAccount = async () => {
    if (!lineId) {
      setLinkError("ไม่พบ LINE ID");
      return;
    }

    setIsLinking(true);
    setLinkStatus("linking");

    try {
      // เชื่อมต่อบัญชี LINE กับระบบ
      const response = await apiFetch("/api/line-oa/linking/verify", {
        method: "POST",
        body: JSON.stringify({
          userId: parseInt(userId || "1"),
          lineUserId: lineId,
          verificationToken: Math.random().toString(36).substring(7),
        }),
      });

      if (response.success || response.isLinked) {
        setLinkStatus("success");
        setTimeout(() => {
          // @ts-ignore
          if (typeof window !== "undefined" && window.liff) {
            // @ts-ignore
            window.liff.closeWindow();
          } else {
            router.push("/");
          }
        }, 2000);
      }
    } catch (err) {
      setLinkStatus("error");
      setLinkError(
        err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการเชื่อมต่อ"
      );
      setIsLinking(false);
    }
  };

  useEffect(() => {
    if (liffContext && !isLinking) {
      handleLinkAccount();
    }
  }, [liffContext]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังเชื่อมต่อ...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">เชื่อมต่อ LINE</h1>
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Status Display */}
        {linkStatus === "idle" && (
          <div>
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-blue-900 text-sm">
                {liffContext?.displayName &&
                  `สวัสดีค่ะ ${liffContext.displayName}`}
                {!liffContext?.displayName && "กรุณายืนยันการเชื่อมต่อ"}
              </p>
            </div>

            <button
              onClick={handleLinkAccount}
              disabled={isLinking}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 transition"
            >
              {isLinking ? "กำลังเชื่อมต่อ..." : "✅ ยืนยันการเชื่อมต่อ"}
            </button>
          </div>
        )}

        {linkStatus === "linking" && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">กำลังเชื่อมต่อบัญชีของคุณ...</p>
          </div>
        )}

        {linkStatus === "success" && (
          <div className="text-center">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              เชื่อมต่อสำเร็จ!
            </h2>
            <p className="text-gray-600">สามารถใช้งานระบบแจ้งซ่อมได้เลยค่ะ</p>
          </div>
        )}

        {linkStatus === "error" && (
          <div>
            <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-900">เกิดข้อผิดพลาด</p>
                <p className="text-red-700 text-sm mt-1">{linkError}</p>
              </div>
            </div>

            <button
              onClick={handleLinkAccount}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              🔄 ลองใหม่
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
