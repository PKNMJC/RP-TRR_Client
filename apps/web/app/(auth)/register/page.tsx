"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authApi } from "@/lib/api";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    fullName: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = (): boolean => {
    if (
      !formData.email ||
      !formData.username ||
      !formData.password ||
      !formData.fullName
    ) {
      toast.error("กรุณากรอกข้อมูลทั้งหมด");
      return false;
    }

    if (formData.email && !formData.email.includes("@")) {
      toast.error("อีเมลไม่ถูกต้อง");
      return false;
    }

    if (formData.username.length < 3) {
      toast.error("ชื่อผู้ใช้ต้องมีอย่างน้อย 3 ตัวอักษร");
      return false;
    }

    if (formData.password.length < 6) {
      toast.error("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const response = await authApi.register({
        email: formData.email,
        username: formData.username,
        password: formData.password,
        fullName: formData.fullName,
      });

      const { accessToken } = response.data.data;
      localStorage.setItem("access_token", accessToken);
      toast.success("สมัครสมาชิกสำเร็จ");

      router.push("/dashboard");
    } catch (error: any) {
      toast.error(
        error.response?.data?.error?.message ||
          error.response?.data?.message ||
          "สมัครสมาชิกไม่สำเร็จ"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl">สมัครสมาชิก</CardTitle>
          <CardDescription>
            ระบบแจ้งซ่อมอุปกรณ์ IT - ผู้ดูแลระบบ
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">ชื่อผู้ใช้</label>
              <Input
                type="text"
                name="username"
                placeholder="admin_user"
                value={formData.username}
                onChange={handleChange}
                disabled={loading}
                minLength={3}
                maxLength={20}
              />
              <p className="text-xs text-gray-500">ความยาว 3-20 ตัวอักษร</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">อีเมล</label>
              <Input
                type="email"
                name="email"
                placeholder="admin@example.com"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">ชื่อ-นามสกุล</label>
              <Input
                type="text"
                name="fullName"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={handleChange}
                disabled={loading}
                minLength={2}
                maxLength={100}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">รหัสผ่าน</label>
              <Input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                minLength={6}
                maxLength={50}
              />
              <p className="text-xs text-gray-500">ความยาว 6-50 ตัวอักษร</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">ยืนยันรหัสผ่าน</label>
              <Input
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "กำลังสมัครสมาชิก..." : "สมัครสมาชิก"}
            </Button>

            <div className="text-center text-sm">
              <span className="text-gray-600">มีบัญชีอยู่แล้ว? </span>
              <Link
                href="/login"
                className="text-blue-600 hover:underline font-medium"
              >
                เข้าสู่ระบบ
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
