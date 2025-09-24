import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

interface UserPaymentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { paymentMethod: string; amount: number }) => void;
  initialPaymentMethod?: string;
  initialAmount?: number;
}

const paymentOptions = [
  { label: "Efectivo", value: "efectivo" },
  { label: "Transferencia", value: "transferencia" },
  { label: "Mercado Pago", value: "mercado_pago" },
];

export const UserPaymentForm: React.FC<UserPaymentFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialPaymentMethod = "",
  initialAmount = 0,
}) => {
  const [paymentMethod, setPaymentMethod] = useState(initialPaymentMethod);
  const [amount, setAmount] = useState(initialAmount);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSubmit({ paymentMethod, amount });
    setIsSubmitting(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Actualizar método de pago</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Método de pago</label>
              <Select
                options={paymentOptions}
                value={paymentMethod}
                onChange={setPaymentMethod}
                placeholder="Selecciona un método"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Monto</label>
              <Input
                type="number"
                min={0}
                value={amount}
                onChange={e => setAmount(Number(e.target.value))}
                className="w-full"
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting || !paymentMethod || amount <= 0}>
              {isSubmitting ? "Guardando..." : "Guardar"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};
