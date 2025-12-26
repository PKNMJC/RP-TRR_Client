"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

interface Ticket {
  id: number;
  ticketCode: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  location: string;
  equipmentName: string;
  createdAt: string;
  updatedAt: string;
  assignee?: {
    name: string;
  };
}

export default function RepairStatusCheck() {
  const searchParams = useSearchParams();
  const lineId = searchParams.get("lineId") || "";

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    setError("");

    try {
      let userId: number = 1; // Demo user

      if (lineId) {
        // ค้นหาผู้ใช้ที่เชื่อมต่อ LINE นี้
        try {
          const linkResponse = await fetch(
            `/api/line-oa/linking/status?lineId=${lineId}`
          );
          if (linkResponse.ok) {
            const linkData = await linkResponse.json();
            userId = linkData.userId;
          }
        } catch (e) {
          // ถ้าหาไม่เจอก็ใช้ demo user
        }
      }

      const response = await fetch(`/api/tickets/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTickets(data);
      } else {
        setError("ไม่สามารถดึงข้อมูลได้");
      }
    } catch (error: any) {
      setError(error.message || "เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
      setSearched(true);
    }
  };

  const getStatusEmoji = (status: string) => {
    const emojis: Record<string, string> = {
      OPEN: "📌",
      IN_PROGRESS: "⚙️",
      WAITING_USER: "⏳",
      DONE: "✅",
      CANCEL: "❌",
    };
    return emojis[status] || "📌";
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      OPEN: "รอรับเรื่อง",
      IN_PROGRESS: "กำลังดำเนินการ",
      WAITING_USER: "รอข้อมูลเพิ่มเติม",
      DONE: "เสร็จสิ้น",
      CANCEL: "ยกเลิก",
    };
    return labels[status] || status;
  };

  const getPriorityLabel = (priority: string) => {
    const labels: Record<string, string> = {
      LOW: "ต่ำ",
      MEDIUM: "ปานกลาง",
      HIGH: "สูง",
    };
    return labels[priority] || priority;
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      LOW: "text-gray-600",
      MEDIUM: "text-yellow-600",
      HIGH: "text-red-600",
    };
    return colors[priority] || "text-gray-600";
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      OPEN: "bg-yellow-50 border-yellow-200",
      IN_PROGRESS: "bg-blue-50 border-blue-200",
      WAITING_USER: "bg-orange-50 border-orange-200",
      DONE: "bg-green-50 border-green-200",
      CANCEL: "bg-red-50 border-red-200",
    };
    return colors[status] || "bg-gray-50 border-gray-200";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
          <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">
            📊 ตรวจสอบสถานะแจ้งซ่อม
          </h1>
          <p className="text-center text-gray-600 mb-8">
            ดูสถานะล่าสุดของแจ้งซ่อมของคุณ
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 font-medium">❌ {error}</p>
            </div>
          )}

          {!searched && (
            <div className="text-center mb-8">
              <button
                onClick={handleSearch}
                disabled={loading}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 transition text-lg"
              >
                {loading ? "กำลังโหลด..." : "🔍 ตรวจสอบสถานะ"}
              </button>
            </div>
          )}

          {searched && tickets.length === 0 && !error && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg mb-4">
                📭 ยังไม่มีแจ้งซ่อมของคุณ
              </p>
              <button
                onClick={() => setSearched(false)}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                ← กลับไป
              </button>
            </div>
          )}

          {/* Tickets List */}
          {tickets.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                📋 แจ้งซ่อมของคุณ ({tickets.length})
              </h2>

              {tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className={`border-2 rounded-lg p-6 transition ${getStatusColor(
                    ticket.status
                  )}`}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">เลขที่แจ้งซ่อม</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {ticket.ticketCode}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">สถานะ</p>
                      <p className="text-xl font-semibold">
                        {getStatusEmoji(ticket.status)}{" "}
                        {getStatusLabel(ticket.status)}
                      </p>
                    </div>
                  </div>

                  <div className="bg-white bg-opacity-50 rounded p-4 mb-4">
                    <h3 className="font-semibold text-gray-800 mb-2">
                      🔧 เรื่อง
                    </h3>
                    <p className="text-gray-700">{ticket.title}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">📍 สถานที่</p>
                      <p className="text-gray-800 font-medium">
                        {ticket.location}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">💻 อุปกรณ์</p>
                      <p className="text-gray-800 font-medium">
                        {ticket.equipmentName}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">⚠️ ความสำคัญ</p>
                      <p
                        className={`font-semibold ${getPriorityColor(
                          ticket.priority
                        )}`}
                      >
                        {getPriorityLabel(ticket.priority)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">📅 สร้างเมื่อ</p>
                      <p className="text-gray-800">
                        {new Date(ticket.createdAt).toLocaleDateString("th-TH")}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">👨‍💼 ผู้รับเรื่อง</p>
                      <p className="text-gray-800">
                        {ticket.assignee?.name || "ยังไม่ได้มอบหมาย"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              <div className="text-center mt-8">
                <button
                  onClick={() => {
                    setSearched(false);
                    setTickets([]);
                  }}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
                >
                  ← ตรวจสอบใหม่
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
