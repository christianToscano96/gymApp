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
  | "activo"
  | "vencido"
  | "basico"
  | "premium"
  | "permitido"
  | "denegado"
  | "pendiente"
  | "pagado"
  | "destructive"
  | string;

export const useGetStatusColor = (status: Status) => {
  return useMemo(() => {
    switch (status) {
      case "paid":
      case "occupied":
      case "active":
      case "activo":
      case "permitido":
      case "pagado":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
      case "pendiente":
      case "vacant":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "basico":
        return "bg-secondary text-secondary-foreground";
      case "expired":
      case "maintenance":
      case "inactive":
      case "vencido":
      case "denegado":
      case "destructive":
        return "bg-red-100 text-red-800 border-red-200";
      case "premium":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-muted text-muted-foreground";
    }
  }, [status]);
};
