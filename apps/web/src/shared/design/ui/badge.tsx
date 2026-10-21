// src/shared/design/ui/badge.tsx
import * as React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "success" | "warning" | "error";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variantClasses = {
    default: "bg-primary text-white",
    secondary: "bg-secondary text-white",
    success: "bg-success text-white",
    warning: "bg-warning text-white",
    error: "bg-error text-white",
  };

  return (
    <div
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${variantClasses[variant]} ${className || ""}`}
      {...props}
    />
  );
}

export { Badge };
