"use client";

import { useTicket } from "@/hooks/useTickets";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/tickets/StatusBadge";
import { PriorityBadge } from "@/components/tickets/PriorityBadge";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { th } from "date-fns/locale";

interface TicketDetailPageProps {
  params: {
    id: string;
  };
}

export default function TicketDetailPage({ params }: TicketDetailPageProps) {
  const router = useRouter();
  const { data: ticket, isLoading, error } = useTicket(params.id);

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error as Error} />;
  if (!ticket) return <ErrorState message="ไม่พบรายการแจ้งซ่อม" />;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{ticket.ticketNumber}</h1>
          <p className="text-muted-foreground">{ticket.issueTitle}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>รายละเอียดปัญหา</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {ticket.issueDescription || "-"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>ข้อมูลสถานที่</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-sm text-muted-foreground">อาคาร</p>
                <p className="font-medium">{ticket.locationBuilding}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">ชั้น</p>
                <p className="font-medium">{ticket.locationFloor}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">ห้อง</p>
                <p className="font-medium">{ticket.locationRoom}</p>
              </div>
              {ticket.locationDetail && (
                <div>
                  <p className="text-sm text-muted-foreground">
                    รายละเอียดเพิ่มเติม
                  </p>
                  <p className="font-medium">{ticket.locationDetail}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">สถานะ</CardTitle>
            </CardHeader>
            <CardContent>
              <StatusBadge status={ticket.status} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">ความเร่งด่วน</CardTitle>
            </CardHeader>
            <CardContent>
              <PriorityBadge priority={ticket.priority} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">ผู้แจ้ง</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-sm text-muted-foreground">ชื่อ</p>
                <p className="font-medium">{ticket.nickname}</p>
              </div>
              {ticket.phone && (
                <div>
                  <p className="text-sm text-muted-foreground">เบอร์โทร</p>
                  <p className="font-medium">{ticket.phone}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">แผนก</p>
                <p className="font-medium">{ticket.department?.name || "-"}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">เวลา</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>
                <p className="text-muted-foreground">แจ้งเมื่อ</p>
                <p className="font-medium">
                  {formatDistanceToNow(new Date(ticket.createdAt), {
                    addSuffix: true,
                    locale: th,
                  })}
                </p>
              </div>
              {ticket.completedAt && (
                <div>
                  <p className="text-muted-foreground">เสร็จเมื่อ</p>
                  <p className="font-medium">
                    {formatDistanceToNow(new Date(ticket.completedAt), {
                      addSuffix: true,
                      locale: th,
                    })}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {ticket.assignedToAdmin && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">ผู้รับผิดชอบ</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">{ticket.assignedToAdmin.fullName}</p>
                <p className="text-sm text-muted-foreground">
                  {ticket.assignedToAdmin.email}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
