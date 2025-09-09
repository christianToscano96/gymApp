import React from "react";
import { useGetStatusColor } from "../../preview/hook/usegetStatusColor";

export interface BadgeProps {
  children: React.ReactNode;
  color?:
    | "primary"
    | "secondary"
    | "success"
    | "danger"
    | "warning"
    | "info"
    | "light"
    | "dark"
    | "destructive";

  status?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const colorClasses: Record<NonNullable<BadgeProps["color"]>, string> = {
  primary: "bg-blue-500 text-white",
  secondary: "bg-gray-500 text-white",
  success: "bg-green-500 text-white",
  danger: "bg-red-500 text-white",
  warning: "bg-yellow-400 text-gray-900",
  info: "bg-cyan-500 text-white",
  light: "bg-gray-100 text-gray-800",
  dark: "bg-gray-900 text-white",
  destructive: "bg-red-600 text-white",
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  color = "primary",
  status,
  className = "",
  size = "md",
}) => {
  const statusColorClass = useGetStatusColor(status ?? "");
  const colorClass = status ? statusColorClass : colorClasses[color];
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-2 text-base",
  };
  return (
    <div
      className={`mt-2 flex items-center justify-center rounded-full font-semibold shadow-sm ring-1 ring-black/5 ${sizeClasses[size]} ${colorClass} ${className}`}
    >
      {children}
    </div>
  );
};

export default Badge;
