"use client";

import { Badge } from "@/components/ui/badge";
import { PRIORITY_COLORS } from "@/lib/constants";
import type { TicketPriority } from "@/types/ticket";

const PRIORITY_LABELS: Record<TicketPriority, string> = {
  normal: "ปกติ",
  urgent: "ด่วน",
  critical: "ด่วนมาก",
};

interface PriorityBadgeProps {
  priority: TicketPriority;
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const colors = PRIORITY_COLORS[priority];
  return (
    <Badge className={colors} variant="secondary">
      {PRIORITY_LABELS[priority]}
    </Badge>
  );
}
