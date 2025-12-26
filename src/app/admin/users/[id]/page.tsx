"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Alert from "@/components/Alert";
import InputField from "@/components/InputField";
import SelectField from "@/components/SelectField";
import { apiClient } from "@/services/api";
import { ArrowLeft } from "lucide-react";

interface UserForm {
  name: string;
  email: string;
  password?: string;
  role: "USER" | "IT" | "ADMIN";
  department?: string;
  phoneNumber?: string;
  lineId?: string;
}

interface ExistingUser extends UserForm {
  id: number;
}

export default function UserFormPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;
  const isNewUser = userId === "new";

  const [form, setForm] = useState<UserForm>({
    name: "",
    email: "",
    role: "USER",
  });

  const [isLoading, setIsLoading] = useState(!isNewUser);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [validation, setValidation] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isNewUser) {
      fetchUser();
    }
  }, [userId]);

  const fetchUser = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await apiClient.get(`/api/users/${userId}`);
      const user = response.data;
      setForm({
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        phoneNumber: user.phoneNumber,
        lineId: user.lineId,
      });
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load user");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!form.name.trim()) {
      errors.name = "Name is required";
    } else if (form.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters";
    }

    if (!form.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = "Invalid email format";
    }

    if (isNewUser && !form.password) {
      errors.password = "Password is required";
    } else if (form.password && form.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    setValidation(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const payload = { ...form };

      if (isNewUser) {
        await apiClient.post("/api/users", payload);
        setSuccess("User created successfully");
        setTimeout(() => {
          router.push("/admin/users");
        }, 500);
      } else {
        // For editing, don't send password if empty
        if (!form.password) {
          const { password, ...dataWithoutPassword } = payload;
          await apiClient.put(`/api/users/${userId}`, dataWithoutPassword);
        } else {
          await apiClient.put(`/api/users/${userId}`, payload);
        }
        setSuccess("User updated successfully");
        setTimeout(() => {
          router.push("/admin/users");
        }, 500);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save user");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (value: string, fieldName: string) => {
    setForm((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
    // Clear validation error when user starts typing
    if (validation[fieldName]) {
      setValidation((prev) => ({
        ...prev,
        [fieldName]: "",
      }));
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
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
                {isNewUser ? "Add New User" : "Edit User"}
              </h1>
              <p className="text-gray-600 mt-1">
                {isNewUser
                  ? "Create a new system user"
                  : "Update user information"}
              </p>
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

          {/* Form */}
          <Card className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  Basic Information
                </h2>
                <div className="space-y-4">
                  <InputField
                    label="Full Name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={(value) => handleInputChange(value, "name")}
                    error={validation.name}
                    required
                  />

                  <InputField
                    label="Email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={(value) => handleInputChange(value, "email")}
                    error={validation.email}
                    required
                  />

                  <InputField
                    label={
                      isNewUser
                        ? "Password"
                        : "Password (leave empty to keep current)"
                    }
                    name="password"
                    type="password"
                    value={form.password || ""}
                    onChange={(value) => handleInputChange(value, "password")}
                    error={validation.password}
                    required={isNewUser}
                  />

                  <SelectField
                    label="Role"
                    name="role"
                    value={form.role}
                    onChange={(value) => handleInputChange(value, "role")}
                    options={[
                      { value: "USER", label: "Employee" },
                      { value: "IT", label: "IT Staff" },
                      { value: "ADMIN", label: "Administrator" },
                    ]}
                  />
                </div>
              </div>

              {/* Additional Information */}
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  Additional Information
                </h2>
                <div className="space-y-4">
                  <InputField
                    label="Department"
                    name="department"
                    type="text"
                    value={form.department || ""}
                    onChange={(value) => handleInputChange(value, "department")}
                    placeholder="e.g., Engineering, Marketing"
                  />

                  <InputField
                    label="Phone Number"
                    name="phoneNumber"
                    type="tel"
                    value={form.phoneNumber || ""}
                    onChange={(value) =>
                      handleInputChange(value, "phoneNumber")
                    }
                    placeholder="e.g., +66-XXX-XXX-XXXX"
                  />

                  <InputField
                    label="LINE ID"
                    name="lineId"
                    type="text"
                    value={form.lineId || ""}
                    onChange={(value) => handleInputChange(value, "lineId")}
                    placeholder="e.g., @username"
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex gap-3 justify-end pt-6 border-t">
                <Button
                  variant="secondary"
                  onClick={() => router.back()}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button variant="primary" type="submit" disabled={isSubmitting}>
                  {isSubmitting
                    ? "Saving..."
                    : isNewUser
                    ? "Create User"
                    : "Update User"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </main>
    </div>
  );
}
