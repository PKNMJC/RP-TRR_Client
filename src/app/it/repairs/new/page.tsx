"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ITSidebar from "@/components/ITSidebar";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Alert from "@/components/Alert";
import InputField from "@/components/InputField";
import SelectField from "@/components/SelectField";
import FileUpload from "@/components/FileUpload";
import { apiClient } from "@/services/api";
import { ArrowLeft } from "lucide-react";

interface CreateTicketForm {
  title: string;
  description: string;
  equipmentName: string;
  location: string;
  problemCategory: string;
  problemSubcategory: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
}

const PROBLEM_CATEGORIES = [
  { value: "NETWORK", label: "Network" },
  { value: "HARDWARE", label: "Hardware" },
  { value: "SOFTWARE", label: "Software" },
  { value: "PRINTER", label: "Printer" },
  { value: "AIR_CONDITIONING", label: "Air Conditioning" },
  { value: "ELECTRICITY", label: "Electricity" },
  { value: "OTHER", label: "Other" },
];

const PROBLEM_SUBCATEGORIES: Record<
  string,
  Array<{ value: string; label: string }>
> = {
  NETWORK: [
    { value: "INTERNET_DOWN", label: "Internet Down" },
    { value: "SLOW_CONNECTION", label: "Slow Connection" },
    { value: "WIFI_ISSUE", label: "WiFi Issue" },
  ],
  HARDWARE: [
    { value: "MONITOR_BROKEN", label: "Monitor Broken" },
    { value: "KEYBOARD_BROKEN", label: "Keyboard Broken" },
    { value: "MOUSE_BROKEN", label: "Mouse Broken" },
  ],
  SOFTWARE: [
    { value: "COMPUTER_CRASH", label: "Computer Crash" },
    { value: "INSTALLATION", label: "Installation" },
    { value: "LICENSE", label: "License" },
    { value: "PERFORMANCE", label: "Performance" },
  ],
  PRINTER: [
    { value: "JAM", label: "Jam" },
    { value: "NO_PRINTING", label: "Not Printing" },
    { value: "CARTRIDGE", label: "Cartridge Issue" },
  ],
  AIR_CONDITIONING: [
    { value: "INSTALLATION_AC", label: "Installation" },
    { value: "MALFUNCTION_AC", label: "Malfunction" },
  ],
  ELECTRICITY: [
    { value: "POWER_DOWN", label: "Power Down" },
    { value: "LIGHT_PROBLEM", label: "Light Problem" },
  ],
  OTHER: [{ value: "OTHER", label: "Other" }],
};

export default function CreateTicketPage() {
  const router = useRouter();

  const [form, setForm] = useState<CreateTicketForm>({
    title: "",
    description: "",
    equipmentName: "",
    location: "",
    problemCategory: "OTHER",
    problemSubcategory: "OTHER",
    priority: "MEDIUM",
  });

  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [validation, setValidation] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!form.title.trim()) {
      errors.title = "Title is required";
    } else if (form.title.trim().length < 5) {
      errors.title = "Title must be at least 5 characters";
    }

    if (!form.description.trim()) {
      errors.description = "Description is required";
    } else if (form.description.trim().length < 10) {
      errors.description = "Description must be at least 10 characters";
    }

    if (!form.equipmentName.trim()) {
      errors.equipmentName = "Equipment name is required";
    }

    if (!form.location.trim()) {
      errors.location = "Location is required";
    }

    setValidation(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear validation error when user starts typing
    if (validation[name]) {
      setValidation((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleFilesSelected = (selectedFiles: File[]) => {
    setFiles(selectedFiles);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("equipmentName", form.equipmentName);
      formData.append("location", form.location);
      formData.append("problemCategory", form.problemCategory);
      formData.append("problemSubcategory", form.problemSubcategory);
      formData.append("priority", form.priority);

      // Add files if any
      files.forEach((file) => {
        formData.append("files", file);
      });

      const response = await apiClient.post("/api/tickets", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess("Ticket created successfully!");
      setTimeout(() => {
        router.push(`/it/repairs/${response.data.id}`);
      }, 500);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create ticket");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const subcategoryOptions =
    PROBLEM_SUBCATEGORIES[form.problemCategory] || PROBLEM_SUBCATEGORIES.OTHER;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <ITSidebar />

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
                Create Repair Ticket
              </h1>
              <p className="text-gray-600 mt-1">
                Report a new issue or request for repair
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
                    label="Title"
                    name="title"
                    type="text"
                    placeholder="Brief description of the issue"
                    value={form.title}
                    onChange={handleInputChange}
                    error={validation.title}
                    required
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="description"
                      placeholder="Detailed description of the problem"
                      value={form.description}
                      onChange={handleInputChange}
                      rows={5}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        validation.description
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {validation.description && (
                      <p className="text-red-500 text-sm mt-1">
                        {validation.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Equipment & Location */}
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  Equipment & Location
                </h2>
                <div className="space-y-4">
                  <InputField
                    label="Equipment Name"
                    name="equipmentName"
                    type="text"
                    placeholder="e.g., Computer, Printer, Phone"
                    value={form.equipmentName}
                    onChange={handleInputChange}
                    error={validation.equipmentName}
                    required
                  />

                  <InputField
                    label="Location"
                    name="location"
                    type="text"
                    placeholder="e.g., Office Room 201"
                    value={form.location}
                    onChange={handleInputChange}
                    error={validation.location}
                    required
                  />
                </div>
              </div>

              {/* Problem Classification */}
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  Problem Classification
                </h2>
                <div className="space-y-4">
                  <SelectField
                    label="Category"
                    name="problemCategory"
                    value={form.problemCategory}
                    onChange={handleInputChange}
                    options={PROBLEM_CATEGORIES}
                  />

                  <SelectField
                    label="Subcategory"
                    name="problemSubcategory"
                    value={form.problemSubcategory}
                    onChange={handleInputChange}
                    options={subcategoryOptions}
                  />

                  <SelectField
                    label="Priority"
                    name="priority"
                    value={form.priority}
                    onChange={handleInputChange}
                    options={[
                      { value: "LOW", label: "Low" },
                      { value: "MEDIUM", label: "Medium" },
                      { value: "HIGH", label: "High" },
                    ]}
                  />
                </div>
              </div>

              {/* File Upload */}
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  Attachments
                </h2>
                <FileUpload
                  maxFiles={5}
                  maxSizeMB={10}
                  onFilesSelected={handleFilesSelected}
                />
                {files.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Selected files:
                    </p>
                    <ul className="space-y-1">
                      {files.map((file, idx) => (
                        <li key={idx} className="text-sm text-gray-600">
                          📎 {file.name} ({(file.size / 1024).toFixed(2)} KB)
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
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
                  {isSubmitting ? "Creating..." : "Create Ticket"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </main>
    </div>
  );
}
