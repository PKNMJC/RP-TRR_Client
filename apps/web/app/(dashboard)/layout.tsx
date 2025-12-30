"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut, LayoutDashboard, Ticket, Settings } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const { admin, isLoading, logout } = useAuth();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isLoading && !admin) {
      router.push("/login");
    }
  }, [admin, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">กำลังโหลด...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white p-6 hidden md:block">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">IT Repair</h1>
          <p className="text-sm text-slate-400">ระบบแจ้งซ่อมอุปกรณ์</p>
        </div>

        <nav className="space-y-2">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-slate-800 transition"
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>แดชบอร์ด</span>
          </Link>

          <Link
            href="/tickets"
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-slate-800 transition"
          >
            <Ticket className="h-4 w-4" />
            <span>รายการแจ้งซ่อม</span>
          </Link>

          <Link
            href="/settings"
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-slate-800 transition"
          >
            <Settings className="h-4 w-4" />
            <span>ตั้งค่า</span>
          </Link>
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-700">
          {admin && (
            <div className="mb-4 p-4 bg-slate-800 rounded-lg">
              <p className="text-sm text-slate-400">ผู้ดูแลระบบ</p>
              <p className="font-medium truncate">{admin.fullName}</p>
              <p className="text-xs text-slate-400">{admin.email}</p>
            </div>
          )}

          <Button
            variant="outline"
            className="w-full bg-slate-800 border-slate-700 hover:bg-slate-700"
            onClick={() => logout()}
          >
            <LogOut className="h-4 w-4 mr-2" />
            ออกจากระบบ
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
