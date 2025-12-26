"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Alert from "@/components/Alert";
import { apiClient } from "@/services/api";
import { ArrowLeft, User, Calendar, AlertCircle, Send } from "lucide-react";

interface Ticket {
  id: number;
  ticketCode: string;
  title: string;
  description: string;
  status: "OPEN" | "IN_PROGRESS" | "WAITING_USER" | "DONE" | "CANCEL";
  priority: "LOW" | "MEDIUM" | "HIGH";
  equipmentName: string;
  location: string;
  problemCategory: string;
  problemSubcategory: string;
  notes?: string;
  user: {
    id: number;
    name: string;
    email: string;
    department?: string;
    phoneNumber?: string;
  };
  assignee?: {
    id: number;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  attachments: Array<{
    id: number;
    filename: string;
    fileUrl: string;
  }>;
  logs?: Array<{
    id: number;
    status: string;
    comment?: string;
    createdAt: string;
  }>;
}

interface UpdateForm {
  status: string;
  assignedTo?: number;
  notes?: string;
  comment?: string;
}

export default function TicketDetail() {
  const router = useRouter();
  const params = useParams();
  const ticketId = params.id as string;

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [users, setUsers] = useState<Array<{ id: number; name: string }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [updateForm, setUpdateForm] = useState<UpdateForm>({
    status: "",
    assignedTo: undefined,
    notes: "",
    comment: "",
  });

  useEffect(() => {
    fetchTicketDetail();
    fetchUsers();
  }, [ticketId]);

  const fetchTicketDetail = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await apiClient.get(`/api/tickets/${ticketId}`);
      setTicket(response.data);
      setUpdateForm((prev) => ({
        ...prev,
        status: response.data.status,
        assignedTo: response.data.assignee?.id,
      }));
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load ticket");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await apiClient.get("/api/users");
      setUsers(response.data);
    } catch (err) {
      console.error("Failed to load users:", err);
    }
  };

  const handleUpdateTicket = async () => {
    if (!ticket) return;

    setIsUpdating(true);
    setError("");
    setSuccess("");

    try {
      const payload: any = {
        status: updateForm.status,
      };

      if (updateForm.assignedTo) {
        payload.assignedTo = updateForm.assignedTo;
      }

      if (updateForm.notes) {
        payload.notes = updateForm.notes;
      }

      // If status is changing, send with comment
      if (updateForm.status !== ticket.status && updateForm.comment) {
        await apiClient.put(`/api/tickets/${ticketId}/status`, {
          status: updateForm.status,
          comment: updateForm.comment,
        });
      } else {
        await apiClient.put(`/api/tickets/${ticketId}`, payload);
      }

      setSuccess("Ticket updated successfully");
      setTimeout(() => {
        fetchTicketDetail();
      }, 500);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update ticket");
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      OPEN: "bg-blue-100 text-blue-800",
      IN_PROGRESS: "bg-yellow-100 text-yellow-800",
      WAITING_USER: "bg-purple-100 text-purple-800",
      DONE: "bg-green-100 text-green-800",
      CANCEL: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      HIGH: "text-red-600 bg-red-50",
      MEDIUM: "text-yellow-600 bg-yellow-50",
      LOW: "text-green-600 bg-green-50",
    };
    return colors[priority] || "text-gray-600 bg-gray-50";
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      OPEN: "Open",
      IN_PROGRESS: "In Progress",
      WAITING_USER: "Waiting User",
      DONE: "Completed",
      CANCEL: "Cancelled",
    };
    return labels[status] || status;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading ticket details...</p>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="mx-auto mb-4" size={48} />
          <p className="text-gray-600">Ticket not found</p>
          <Button onClick={() => router.back()} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6 flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-200 rounded-lg transition"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {ticket.ticketCode}
              </h1>
              <p className="text-gray-600 mt-1">{ticket.title}</p>
            </div>
          </div>

          {/* Alerts */}
          {error && (
            <Alert type="error" message={error} onClose={() => setError("")} />
          )}
          {success && (
            <Alert
              type="success"
              message={success}
              onClose={() => setSuccess("")}
            />
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Ticket Info */}
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4 text-gray-900">
                  Ticket Information
                </h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Status
                      </label>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-1 ${getStatusColor(
                          ticket.status
                        )}`}
                      >
                        {getStatusLabel(ticket.status)}
                      </span>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Priority
                      </label>
                      <span
                        className={`inline-block mt-1 px-3 py-1 rounded ${getPriorityColor(
                          ticket.priority
                        )}`}
                      >
                        {ticket.priority}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Equipment
                      </label>
                      <p className="text-gray-900 mt-1">
                        {ticket.equipmentName}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Location
                      </label>
                      <p className="text-gray-900 mt-1">{ticket.location}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Category
                      </label>
                      <p className="text-gray-900 mt-1">
                        {ticket.problemCategory}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Subcategory
                      </label>
                      <p className="text-gray-900 mt-1">
                        {ticket.problemSubcategory}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Description
                    </label>
                    <p className="text-gray-900 mt-2 whitespace-pre-wrap">
                      {ticket.description}
                    </p>
                  </div>

                  {ticket.notes && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Notes
                      </label>
                      <p className="text-gray-900 mt-2 whitespace-pre-wrap">
                        {ticket.notes}
                      </p>
                    </div>
                  )}
                </div>
              </Card>

              {/* Reporter Info */}
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4 text-gray-900">
                  Reporter Information
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <User size={20} className="text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Name</p>
                      <p className="text-gray-900 font-medium">
                        {ticket.user.name}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="text-gray-900">{ticket.user.email}</p>
                  </div>
                  {ticket.user.phoneNumber && (
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="text-gray-900">{ticket.user.phoneNumber}</p>
                    </div>
                  )}
                  {ticket.user.department && (
                    <div>
                      <p className="text-sm text-gray-600">Department</p>
                      <p className="text-gray-900">{ticket.user.department}</p>
                    </div>
                  )}
                </div>
              </Card>

              {/* Attachments */}
              {ticket.attachments && ticket.attachments.length > 0 && (
                <Card className="p-6">
                  <h2 className="text-xl font-bold mb-4 text-gray-900">
                    Attachments
                  </h2>
                  <div className="space-y-2">
                    {ticket.attachments.map((attachment) => (
                      <a
                        key={attachment.id}
                        href={attachment.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                      >
                        📎 {attachment.filename}
                      </a>
                    ))}
                  </div>
                </Card>
              )}

              {/* Activity Log */}
              {ticket.logs && ticket.logs.length > 0 && (
                <Card className="p-6">
                  <h2 className="text-xl font-bold mb-4 text-gray-900">
                    Activity History
                  </h2>
                  <div className="space-y-3">
                    {ticket.logs.map((log, index) => (
                      <div key={log.id} className="flex gap-4">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                        <div>
                          <p className="font-medium text-gray-900">
                            Status changed to {getStatusLabel(log.status)}
                          </p>
                          {log.comment && (
                            <p className="text-gray-600 text-sm mt-1">
                              {log.comment}
                            </p>
                          )}
                          <p className="text-gray-500 text-xs mt-1">
                            {new Date(log.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>

            {/* Sidebar - Update Form */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-8">
                <h2 className="text-xl font-bold mb-4 text-gray-900">
                  Update Ticket
                </h2>

                <div className="space-y-4">
                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={updateForm.status}
                      onChange={(e) =>
                        setUpdateForm((prev) => ({
                          ...prev,
                          status: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="OPEN">Open</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="WAITING_USER">Waiting User</option>
                      <option value="DONE">Completed</option>
                      <option value="CANCEL">Cancelled</option>
                    </select>
                  </div>

                  {/* Assign To */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Assign To
                    </label>
                    <select
                      value={updateForm.assignedTo || ""}
                      onChange={(e) =>
                        setUpdateForm((prev) => ({
                          ...prev,
                          assignedTo: e.target.value
                            ? parseInt(e.target.value)
                            : undefined,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Unassigned</option>
                      {users.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Comment */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Comment
                    </label>
                    <textarea
                      value={updateForm.comment || ""}
                      onChange={(e) =>
                        setUpdateForm((prev) => ({
                          ...prev,
                          comment: e.target.value,
                        }))
                      }
                      placeholder="Add a comment..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={4}
                    />
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Internal Notes
                    </label>
                    <textarea
                      value={updateForm.notes || ""}
                      onChange={(e) =>
                        setUpdateForm((prev) => ({
                          ...prev,
                          notes: e.target.value,
                        }))
                      }
                      placeholder="Internal notes..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                    />
                  </div>

                  {/* Action Button */}
                  <Button
                    onClick={handleUpdateTicket}
                    disabled={isUpdating}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <Send size={18} />
                    {isUpdating ? "Updating..." : "Update Ticket"}
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
