import * as React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface SuccessAlertProps {
  title?: string;
  description?: string;
  onClose?: () => void;
  variant?: "success" | "destructive" | "danger";
}

export const SuccessAlert: React.FC<SuccessAlertProps> = ({
  title,
  description = "El usuario se ha registrado correctamente.",
  onClose,
  variant = "success",
}) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, 3500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <Alert
      className={
        variant === "destructive" || variant === "danger"
          ? "bg-red-100 border-red-400 text-red-800 relative"
          : "bg-green-100 border-green-400 text-green-800 relative"
      }
    >
      {title && <AlertTitle>{title}</AlertTitle>}
      <AlertDescription>{description}</AlertDescription>
      {onClose && (
        <button
          className={
            variant === "destructive" || variant === "danger"
              ? "absolute top-2 right-2 text-red-800 hover:text-red-600"
              : "absolute top-2 right-2 text-green-800 hover:text-green-600"
          }
          onClick={onClose}
        >
          ×
        </button>
      )}
    </Alert>
  );
};
