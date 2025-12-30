"use client";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">แดชบอร์ด</h1>
        <p className="text-muted-foreground">
          ยินดีต้อนรับเข้าสู่ระบบแจ้งซ่อมอุปกรณ์ IT
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg border">
          <p className="text-sm text-muted-foreground">รอดำเนินการ</p>
          <p className="text-3xl font-bold">0</p>
        </div>
        <div className="bg-white p-6 rounded-lg border">
          <p className="text-sm text-muted-foreground">กำลังดำเนินการ</p>
          <p className="text-3xl font-bold">0</p>
        </div>
        <div className="bg-white p-6 rounded-lg border">
          <p className="text-sm text-muted-foreground">รอชิ้นส่วน</p>
          <p className="text-3xl font-bold">0</p>
        </div>
        <div className="bg-white p-6 rounded-lg border">
          <p className="text-sm text-muted-foreground">เสร็จสิ้น</p>
          <p className="text-3xl font-bold">0</p>
        </div>
      </div>

      {/* Coming Soon */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <p className="text-blue-800">
          📊 กำลังพัฒนา: กราฟสถิติ, รายการแจ้งซ่อมล่าสุด และฟีเจอร์อื่น ๆ
        </p>
      </div>
    </div>
  );
}
