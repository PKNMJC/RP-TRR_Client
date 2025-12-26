"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { apiClient } from "@/services/api";

interface Ticket {
  id: number;
  ticketCode: string;
  title: string;
  description: string;
  status: "OPEN" | "IN_PROGRESS" | "WAITING_USER" | "DONE" | "CANCEL";
  priority: "LOW" | "MEDIUM" | "HIGH";
  user: {
    id: number;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function TicketManagement() {
  const { role, isLoading } = useAuth() as any;
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [comment, setComment] = useState("");

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const data = await apiClient.get<Ticket[]>("/api/tickets");
      setTickets(data);
    } catch (error) {
      console.error("Failed to fetch tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedTicket || !newStatus) return;

    try {
      await apiClient.put(`/api/tickets/${selectedTicket.id}/status`, {
        status: newStatus,
        comment,
      });
      setShowStatusModal(false);
      setNewStatus("");
      setComment("");
      fetchTickets();
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const filteredTickets = tickets.filter((ticket) => {
    const matchesFilter = filter === "ALL" || ticket.status === filter;
    const matchesSearch =
      ticket.ticketCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      OPEN: "bg-yellow-100 text-yellow-800",
      IN_PROGRESS: "bg-blue-100 text-blue-800",
      WAITING_USER: "bg-orange-100 text-orange-800",
      DONE: "bg-green-100 text-green-800",
      CANCEL: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      LOW: "bg-gray-100 text-gray-800",
      MEDIUM: "bg-yellow-100 text-yellow-800",
      HIGH: "bg-red-100 text-red-800",
    };
    return colors[priority] || "bg-gray-100 text-gray-800";
  };

  if (isLoading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (role !== "ADMIN" && role !== "IT") {
    return <div className="p-8 text-center text-red-600">Access Denied</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">จัดการแจ้งซ่อม</h1>

        {/* Search and Filter */}
        <div className="mb-6 flex gap-4 flex-col sm:flex-row">
          <input
            type="text"
            placeholder="ค้นหา เลขที่หรือเรื่อง..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="ALL">ทั้งหมด</option>
            <option value="OPEN">รอรับเรื่อง</option>
            <option value="IN_PROGRESS">กำลังดำเนินการ</option>
            <option value="WAITING_USER">รอข้อมูลเพิ่มเติม</option>
            <option value="DONE">เสร็จสิ้น</option>
            <option value="CANCEL">ยกเลิก</option>
          </select>
        </div>

        {/* Tickets Table */}
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">
                    เลขที่
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">
                    เรื่อง
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">
                    ผู้แจ้ง
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">
                    สถานะ
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">
                    ความสำคัญ
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">
                    วันที่สร้าง
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">
                    การดำเนิน
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.map((ticket) => (
                  <tr key={ticket.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-blue-600">
                      {ticket.ticketCode}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {ticket.title}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {ticket.user.name}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          ticket.status
                        )}`}
                      >
                        {ticket.status === "OPEN" && "รอรับเรื่อง"}
                        {ticket.status === "IN_PROGRESS" && "กำลังดำเนินการ"}
                        {ticket.status === "WAITING_USER" && "รอข้อมูล"}
                        {ticket.status === "DONE" && "เสร็จสิ้น"}
                        {ticket.status === "CANCEL" && "ยกเลิก"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(
                          ticket.priority
                        )}`}
                      >
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(ticket.createdAt).toLocaleDateString("th-TH")}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => {
                          setSelectedTicket(ticket);
                          setNewStatus(ticket.status);
                          setShowStatusModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        เปลี่ยนสถานะ
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Status Update Modal */}
        {showStatusModal && selectedTicket && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full">
              <h2 className="text-xl font-bold mb-4">
                เปลี่ยนสถานะ: {selectedTicket.ticketCode}
              </h2>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  สถานะใหม่
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">เลือกสถานะ</option>
                  <option value="OPEN">รอรับเรื่อง</option>
                  <option value="IN_PROGRESS">กำลังดำเนินการ</option>
                  <option value="WAITING_USER">รอข้อมูลเพิ่มเติม</option>
                  <option value="DONE">เสร็จสิ้น</option>
                  <option value="CANCEL">ยกเลิก</option>
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  หมายเหตุ
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="เพิ่มหมายเหตุ (ไม่บังคับ)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowStatusModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={handleUpdateStatus}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                >
                  บันทึก
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
