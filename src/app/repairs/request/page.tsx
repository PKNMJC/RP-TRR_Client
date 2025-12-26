"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function RepairRequestFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const lineId = searchParams.get("lineId") || "";

  const [formData, setFormData] = useState({
    nickname: "",
    department: "",
    phoneNumber: "",
    location: "",
    problemCategory: "HARDWARE",
    problemSubcategory: "MONITOR_BROKEN",
    equipmentName: "",
    description: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const problemSubcategories: Record<string, string[]> = {
    NETWORK: ["INTERNET_DOWN", "SLOW_CONNECTION", "WIFI_ISSUE"],
    HARDWARE: [
      "MONITOR_BROKEN",
      "KEYBOARD_BROKEN",
      "MOUSE_BROKEN",
      "COMPUTER_CRASH",
    ],
    SOFTWARE: ["INSTALLATION", "LICENSE", "PERFORMANCE"],
    PRINTER: ["JAM", "NO_PRINTING", "CARTRIDGE"],
    AIR_CONDITIONING: ["INSTALLATION_AC", "MALFUNCTION_AC"],
    ELECTRICITY: ["POWER_DOWN", "LIGHT_PROBLEM"],
    OTHER: ["OTHER"],
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // ก่อนอื่นสร้างหรือดึงผู้ใช้
      let userId: number;

      // สำหรับ demo ให้ใช้ ID ที่เชื่อมต่อกับ LINE
      if (lineId) {
        // ค้นหาผู้ใช้ที่เชื่อมต่อ LINE นี้
        const linkResponse = await fetch(
          `/api/line-oa/linking/status?lineId=${lineId}`
        );
        if (linkResponse.ok) {
          const linkData = await linkResponse.json();
          userId = linkData.userId;
        } else {
          userId = 1; // Demo user
        }
      } else {
        userId = 1; // Demo user
      }

      const response = await fetch("/api/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: `${formData.problemCategory} - ${formData.equipmentName}`,
          description: formData.description,
          location: formData.location,
          equipmentName: formData.equipmentName,
          problemCategory: formData.problemCategory,
          problemSubcategory: formData.problemSubcategory,
          notes: formData.notes,
          priority: "MEDIUM",
          userId,
        }),
      });

      if (response.ok) {
        const ticket = await response.json();
        setSuccess(true);
        setTimeout(() => {
          if (lineId) {
            window.location.href = `line://nv/profile`;
          } else {
            router.push("/repairs/success");
          }
        }, 2000);
      } else {
        setError("ไม่สามารถส่งแจ้งซ่อมได้ กรุณาลองใหม่อีกครั้ง");
      }
    } catch (error: any) {
      setError(error.message || "เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
          <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">
            🛠 แจ้งซ่อมฝ่าย IT
          </h1>
          <p className="text-center text-gray-600 mb-8">
            กรุณากรอกข้อมูลปัญหาของคุณให้ครบถ้วน
          </p>

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 font-medium">
                ✅ ส่งแจ้งซ่อมสำเร็จ!
              </p>
              <p className="text-green-700 text-sm">
                เจ้าหน้าที่จะติดต่อกลับโดยเร็ว
              </p>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 font-medium">❌ {error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* ข้อมูลผู้แจ้ง */}
            <div className="border-b-2 border-gray-100 pb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                📋 ข้อมูลผู้แจ้ง
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ชื่อเล่น <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nickname}
                    onChange={(e) =>
                      setFormData({ ...formData, nickname: e.target.value })
                    }
                    placeholder="เช่น นิก, สมชาย"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    แผนก <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.department}
                    onChange={(e) =>
                      setFormData({ ...formData, department: e.target.value })
                    }
                    placeholder="เช่น IT, HR, Sales"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    เบอร์โทรศัพท์ (ไม่บังคับ)
                  </label>
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, phoneNumber: e.target.value })
                    }
                    placeholder="เช่น 0812345678"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* ข้อมูลปัญหา */}
            <div className="border-b-2 border-gray-100 pb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                🔧 ข้อมูลปัญหา
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    สถานที่แจ้งซ่อม <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    placeholder="เช่น อาคาร A ชั้น 3 ห้อง 301"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ประเภทปัญหา <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.problemCategory}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        problemCategory: e.target.value,
                        problemSubcategory:
                          problemSubcategories[e.target.value]?.[0] || "OTHER",
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="NETWORK">🌐 อินเทอร์เน็ต/เครือข่าย</option>
                    <option value="HARDWARE">💻 ฮาร์ดแวร์</option>
                    <option value="SOFTWARE">📦 ซอฟต์แวร์</option>
                    <option value="PRINTER">🖨 เครื่องพิมพ์</option>
                    <option value="AIR_CONDITIONING">❄️ แอร์</option>
                    <option value="ELECTRICITY">⚡ ไฟฟ้า</option>
                    <option value="OTHER">📌 อื่น ๆ</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  รายละเอียดประเภทปัญหา (ไม่บังคับ)
                </label>
                <select
                  value={formData.problemSubcategory}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      problemSubcategory: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {(problemSubcategories[formData.problemCategory] || [])?.map(
                    (sub: string) => (
                      <option key={sub} value={sub}>
                        {sub.replace(/_/g, " ")}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ชื่อหรือรหัสอุปกรณ์ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.equipmentName}
                  onChange={(e) =>
                    setFormData({ ...formData, equipmentName: e.target.value })
                  }
                  placeholder="เช่น PC-A01, Printer Brother HL-8360"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  รายละเอียดปัญหา <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="บรรยายปัญหาที่คุณเจอ เช่น เครื่องเปิดไม่ติด, ไม่มีเสียง, เชื่อมต่อ WiFi ไม่ได้"
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  หมายเหตุเพิ่มเติม (ไม่บังคับ)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  placeholder="ข้อมูลเพิ่มเติมที่อาจช่วยได้ เช่น ปัญหาเริ่มจากเมื่อไหร่"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 transition"
              >
                {loading ? "กำลังส่ง..." : "✅ ส่งแจ้งซ่อม"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function RepairRequestForm() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RepairRequestFormContent />
    </Suspense>
  );
}
