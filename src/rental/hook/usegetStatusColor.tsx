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
  | string;

export const useGetStatusColor = (status: Status) => {
  return useMemo(() => {
    switch (status) {
      case "paid":
      case "occupied":
      case "active":
        return "bg-primary text-primary-foreground";
      case "pending":
      case "vacant":
        return "bg-secondary text-secondary-foreground";
      case "expired":
      case "maintenance":
      case "inactive":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  }, [status]);
};
