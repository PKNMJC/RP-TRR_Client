"use client";

import { Badge } from "@/components/ui/badge";
import { STATUS_COLORS } from "@/lib/constants";
import type { TicketStatus } from "@/types/ticket";

const STATUS_LABELS: Record<TicketStatus, string> = {
  pending: "รอดำเนินการ",
  in_progress: "กำลังดำเนินการ",
  waiting_parts: "รอชิ้นส่วน",
  completed: "เสร็จสิ้น",
  cancelled: "ยกเลิก",
};

interface StatusBadgeProps {
  status: TicketStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const colors = STATUS_COLORS[status];
  return (
    <Badge className={colors} variant="secondary">
      {STATUS_LABELS[status]}
    </Badge>
  );
}
