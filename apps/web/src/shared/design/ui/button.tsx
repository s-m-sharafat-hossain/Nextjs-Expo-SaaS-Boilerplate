// src/shared/design/ui/button.tsx
import * as React from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "link" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
    
    const variantClasses = {
      default: "bg-primary-600 text-white hover:bg-primary-700 focus-visible:ring-primary-500",
      secondary: "bg-secondary-600 text-white hover:bg-secondary-700 focus-visible:ring-secondary-500",
      outline: "border border-gray-300 bg-white hover:bg-gray-50 text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800 dark:text-gray-100",
      ghost: "hover:bg-gray-100 text-gray-900 dark:hover:bg-gray-800 dark:text-gray-100",
      link: "text-primary-600 underline-offset-4 hover:underline dark:text-primary-400",
    };
    
    const sizeClasses = {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3",
      lg: "h-11 rounded-md px-8",
      icon: "h-10 w-10",
    };

    return (
      <button
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className || ""}`}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
