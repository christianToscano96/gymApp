import { useMemo } from "react";

type Status =
  | "paid"
  | "occupied"
  | "active"
  | "pending"
  | "vacant"
  | "expired"
  | "maintenance"
  | "inactive"
  | "Activo"
  | "Vencido"
  | "Basico"
  | "Premium"
  | "Permitido"
  | "Denegado"
  | "Pendiente"
  | "Pagado"
  | string;

export const useGetStatusColor = (status: Status) => {
  return useMemo(() => {
    switch (status) {
      case "paid":
      case "occupied":
      case "active":
      case "Activo":
      case "Permitido":
      case "Pagado":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
      case "Pendiente":
      case "vacant":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "Basico":
        return "bg-secondary text-secondary-foreground";
      case "expired":
      case "maintenance":
      case "inactive":
      case "Vencido":
      case "Denegado":
        return "bg-red-100 text-red-800 border-red-200";
      case "Premium":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-muted text-muted-foreground";
    }
  }, [status]);
};
