"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTickets } from "@/hooks/useTickets";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/tickets/StatusBadge";
import { PriorityBadge } from "@/components/tickets/PriorityBadge";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
import { EmptyState } from "@/components/shared/EmptyState";
import { Search, X } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { formatDistanceToNow } from "date-fns";
import { th } from "date-fns/locale";

export default function TicketsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [priority, setPriority] = useState<string>("all");

  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading, error } = useTickets({
    page,
    limit: 25,
    search: debouncedSearch || undefined,
    status: status !== "all" ? status : undefined,
    priority: priority !== "all" ? priority : undefined,
  });

  const handleReset = () => {
    setSearch("");
    setStatus("all");
    setPriority("all");
    setPage(1);
  };

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error as Error} />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">รายการแจ้งซ่อม</h1>
        <p className="text-muted-foreground">
          จัดการและติดตามรายการแจ้งซ่อมทั้งหมด
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="ค้นหาเลขที่, ชื่อผู้แจ้ง, ปัญหา..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="สถานะ" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">ทั้งหมด</SelectItem>
            <SelectItem value="pending">รอดำเนินการ</SelectItem>
            <SelectItem value="in_progress">กำลังดำเนินการ</SelectItem>
            <SelectItem value="waiting_parts">รอชิ้นส่วน</SelectItem>
            <SelectItem value="completed">เสร็จสิ้น</SelectItem>
            <SelectItem value="cancelled">ยกเลิก</SelectItem>
          </SelectContent>
        </Select>

        <Select value={priority} onValueChange={setPriority}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="ความเร่งด่วน" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">ทั้งหมด</SelectItem>
            <SelectItem value="normal">ปกติ</SelectItem>
            <SelectItem value="urgent">ด่วน</SelectItem>
            <SelectItem value="critical">ด่วนมาก</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" onClick={handleReset}>
          <X className="h-4 w-4 mr-2" />
          ล้างตัวกรอง
        </Button>
      </div>

      {/* Tickets Grid */}
      {!data?.data.length ? (
        <EmptyState message="ไม่พบรายการแจ้งซ่อม" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.data.map((ticket) => (
            <Card
              key={ticket.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => router.push(`/tickets/${ticket.id}`)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <CardTitle className="text-base font-semibold">
                      {ticket.ticketNumber}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {ticket.issueTitle}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <StatusBadge status={ticket.status} />
                    <PriorityBadge priority={ticket.priority} />
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">ผู้แจ้ง</p>
                    <p className="font-medium line-clamp-1">
                      {ticket.nickname}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">แผนก</p>
                    <p className="font-medium line-clamp-1">
                      {ticket.department?.name || "-"}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-muted-foreground">แจ้งเมื่อ</p>
                    <p className="font-medium">
                      {formatDistanceToNow(new Date(ticket.createdAt), {
                        addSuffix: true,
                        locale: th,
                      })}
                    </p>
                  </div>
                </div>

                {ticket.assignedToAdmin && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-xs text-muted-foreground">
                      ผู้รับผิดชอบ
                    </p>
                    <p className="text-sm font-medium">
                      {ticket.assignedToAdmin.fullName}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {data?.meta && data.meta.total > data.meta.limit && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
          >
            ก่อนหน้า
          </Button>
          <div className="flex items-center px-4">
            หน้า {page} จาก {Math.ceil(data.meta.total / data.meta.limit)}
          </div>
          <Button
            variant="outline"
            onClick={() => setPage(page + 1)}
            disabled={!data.meta.hasMore}
          >
            ถัดไป
          </Button>
        </div>
      )}
    </div>
  );
}
