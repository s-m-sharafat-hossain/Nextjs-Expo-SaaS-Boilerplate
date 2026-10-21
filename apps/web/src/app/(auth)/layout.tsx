// src/app/(auth)/layout.tsx
import { ThemeToggle } from "@/shared/components/ThemeToggle";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      {children}
    </div>
  );
}
