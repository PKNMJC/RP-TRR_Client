"use client";

import { useRouter } from "next/navigation";

export default function RepairSuccessPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 sm:p-12 max-w-md w-full text-center">
        <div className="text-6xl mb-4">✅</div>

        <h1 className="text-3xl font-bold text-green-600 mb-2">
          ส่งแจ้งซ่อมสำเร็จ!
        </h1>

        <p className="text-gray-700 mb-2">ขอบคุณที่ใช้บริการฝ่าย IT</p>

        <p className="text-gray-600 text-sm mb-8">
          เจ้าหน้าที่ IT จะตรวจสอบและติดต่อกลับไม่เกิน 24 ชั่วโมง
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <p className="text-sm text-gray-700 mb-2">💡 เคล็ดลับ:</p>
          <p className="text-gray-600 text-sm">
            คุณสามารถตรวจสอบสถานะแจ้งซ่อมผ่าน LINE ได้ตลอดเวลา
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => router.push("/repairs/status")}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
          >
            ตรวจสอบสถานะ
          </button>

          <button
            onClick={() => router.push("/repairs/request")}
            className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
          >
            แจ้งซ่อมใหม่
          </button>
        </div>
      </div>
    </div>
  );
}
