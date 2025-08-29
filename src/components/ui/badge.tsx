import React from "react";
import { useGetStatusColor } from "../../rental/hook/usegetStatusColor";

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
    | "dark";
  /**
   * Si se provee status, se usará el hook useGetStatusColor para determinar la clase de color.
   */
  status?: string;
  className?: string;
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
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  color = "primary",
  status,
  className = "",
}) => {
  // Siempre llamar el hook, pero solo usar el resultado si status está definido
  const statusColorClass = useGetStatusColor(status ?? "");
  const colorClass = status ? statusColorClass : colorClasses[color];
  return (
    <div
      className={` p-2 w-20  mt-2 flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold shadow-sm ring-1 ring-black/5 ${colorClass} ${className}`}
    >
      {children}
    </div>
  );
};

export default Badge;
