# Quick Start Guide - Frontend Development

## 🚀 Start Development Server

```bash
cd apps/web
npm run dev
```

Open [http://localhost:3000/login](http://localhost:3000/login)

## 📁 Project Structure Quick Reference

```
apps/web/src/
├── app/                  # Pages & routes
├── components/          # Reusable UI components
├── hooks/               # Custom React hooks
├── lib/                 # Utilities & API client
└── types/               # TypeScript definitions
```

## 🔑 Key Files & Components

### API Integration

- **`lib/api.ts`**: Axios client with auth interceptors
- **`hooks/useAuth.ts`**: Authentication management
- **`hooks/useTickets.ts`**: Ticket data operations
- **`hooks/useWebSocket.ts`**: Real-time updates

### Pages

- **`app/(auth)/login/`**: Login page
- **`app/(dashboard)/dashboard/`**: Dashboard overview
- **`app/(dashboard)/tickets/`**: Tickets list & detail

### Components

- **`components/tickets/`**: Ticket-specific components
- **`components/shared/`**: Shared UI components
- **`components/ui/`**: shadcn/ui base components

## 📋 Development Workflow

### 1. Creating a New Feature

**Example: Adding a new component**

```typescript
// components/tickets/TicketForm.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TicketFormProps {
  onSubmit: (data: any) => void;
}

export function TicketForm({ onSubmit }: TicketFormProps) {
  const [title, setTitle] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Ticket title"
      />
      <Button type="submit">Create</Button>
    </form>
  );
}
```

### 2. Using Custom Hooks

```typescript
"use client";

import { useTickets } from "@/hooks/useTickets";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";

export function MyComponent() {
  const {
    data: tickets,
    isLoading,
    error,
  } = useTickets({
    page: 1,
    status: "pending",
  });

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error as Error} />;

  return (
    <div>
      {tickets?.data.map((ticket) => (
        <div key={ticket.id}>{ticket.ticketNumber}</div>
      ))}
    </div>
  );
}
```

### 3. Adding API Endpoints

```typescript
// In lib/api.ts

export const departmentApi = {
  getAll: () => api.get("/departments"),
  getOne: (id: string) => api.get(`/departments/${id}`),
  create: (data: any) => api.post("/departments", data),
  update: (id: string, data: any) => api.put(`/departments/${id}`, data),
};
```

### 4. Creating Custom Hooks

```typescript
// hooks/useDepartments.ts

import { useQuery } from "@tanstack/react-query";
import { departmentApi } from "@/lib/api";

export function useDepartments() {
  return useQuery({
    queryKey: ["departments"],
    queryFn: () => departmentApi.getAll(),
  });
}
```

## 🎨 Adding UI Components

### Using shadcn/ui

```bash
# Install a new component
npx shadcn@latest add select --yes

# Then use it
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
```

## 🧪 Testing Features

### Test in Browser

1. Open DevTools (F12)
2. Check Network tab for API calls
3. Check Console for errors
4. Use React DevTools to inspect state

### Test API Integration

```typescript
// In console
const token = localStorage.getItem("access_token");
console.log("Token:", token);

// Check fetch
fetch("http://localhost:3000/api/v1/tickets", {
  headers: { Authorization: `Bearer ${token}` },
});
```

## 🔄 Environment Variables

Edit `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
NEXT_PUBLIC_WS_URL=http://localhost:3001
```

## 🐛 Debugging Tips

### Check TypeScript Errors

```bash
npx tsc --noEmit
```

### Clear Cache

```bash
rm -rf .next
npm run build
```

### Enable Debug Logging

```typescript
// Add to any component
useEffect(() => {
  console.log("Component mounted", props);
}, [props]);
```

## 📦 Adding Dependencies

```bash
# Add new package
npm install package-name

# Add dev dependency
npm install --save-dev package-name

# Update all
npm update
```

## 🚢 Build & Deploy

### Production Build

```bash
npm run build  # Creates .next folder
npm start      # Runs production server
```

### Deploy to Vercel

```bash
npm install -g vercel
vercel         # Follow prompts
```

## 🎯 Common Tasks

### Add New Page

```bash
# Create folder and page.tsx
mkdir -p app/(dashboard)/new-feature
echo "export default function Page() { return <div>Feature</div> }" > app/(dashboard)/new-feature/page.tsx
```

### Add New Component

```bash
mkdir -p components/my-feature
touch components/my-feature/MyComponent.tsx
```

### Add New Hook

```bash
touch hooks/useMyHook.ts
```

## 📞 Still Need Help?

- Check `frontend.prompt.md` for detailed specifications
- Check `AI_RULES.md` for coding standards
- Check `README.md` for full documentation
- Review existing components for patterns

---

**Happy Coding! 🎉**
