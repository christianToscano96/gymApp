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
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
      case "vacant":
        return "bg-orange-100 text-orange-800 border-orange-200";
      //return "bg-secondary text-secondary-foreground";
      case "expired":
      case "maintenance":
      case "inactive":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-muted text-muted-foreground";
    }
  }, [status]);
};
