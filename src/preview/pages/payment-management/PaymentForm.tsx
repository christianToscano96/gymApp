import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUserStore } from "@/hook/useUserStore";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchUsers } from "@/api/userService";
import type { User } from "@/preview/interfaces/preview.interfaces";
import type { Payments } from "@/preview/interfaces/preview.interfaces";
import { createPaymentWithUser } from "@/api/paymentService";


interface PaymentFormProps {
  openModal: boolean;
  setOpenModal: (open: boolean) => void;
}

const PaymentForm = ({ openModal, setOpenModal }: PaymentFormProps) => {
  const [amount, setAmount] = useState(30);
  const { user: selectedUserStore } = useUserStore();
  const [selectedUser, setSelectedUser] = useState(selectedUserStore);
  const [users, setUsers] = useState<User[]>([]);
  // Mantener el dueDate original del usuario
  const [userDueDate, setUserDueDate] = useState("");
  const [dueDate, setDueDate] = useState(""); // Nueva fecha de vencimiento calculada
  // Expiración
  const EXPIRATION_OPTIONS = [
    { label: "1 día", value: "1" },
    { label: "15 días", value: "15" },
    { label: "Mensual", value: "monthly" },
  ];
  const [expirationType, setExpirationType] = useState("");

  function calculateExpiration(startDate: string, type: string) {
    if (!startDate) return "";
    const date = new Date(startDate);
    switch (type) {
      case "1":
        date.setDate(date.getDate() + 1);
        break;
      case "15":
        date.setDate(date.getDate() + 15);
        break;
      case "monthly":
        date.setMonth(date.getMonth() + 1);
        break;
      default:
        break;
    }
    return date.toISOString().slice(0, 10);
  }

  // Concepto dinámico según vencimiento
  const getPaidMonth = () => {
    if (!dueDate) return "";
    const date = new Date(dueDate);
    const nextDate = new Date(date);
    if (expirationType === "1") nextDate.setDate(date.getDate() + 1);
    else if (expirationType === "15") nextDate.setDate(date.getDate() + 15);
    else nextDate.setMonth(date.getMonth() + 1);
    return nextDate.toLocaleString("es-ES", { month: "long", year: "numeric" });
  };
  const concept = `Mensualidad - ${getPaidMonth()}`;

  useEffect(() => {
    if (openModal) {
      fetchUsers().then(setUsers);
    }
  }, [openModal]);

  useEffect(() => {
    if (selectedUser) {
      setUserDueDate(selectedUser.dueDate);
      setDueDate(""); // Limpiar nueva fecha de vencimiento
      setExpirationType("");
    }
  }, [selectedUser]);

  // Calcular nueva fecha de vencimiento solo cuando cambia expirationType
  useEffect(() => {
    if (userDueDate && expirationType) {
      setDueDate(calculateExpiration(userDueDate, expirationType));
    } else {
      setDueDate("");
    }
  }, [expirationType, userDueDate]);

  // La nueva fecha de vencimiento solo se calcula si hay tipo de expiración
  const getNextDueDate = () => dueDate || userDueDate;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const queryClient = useQueryClient();

  const [method, setMethod] = useState<Payments["method"]>("Efectivo");
  const mutation = useMutation({
    mutationFn: async () => {
      if (!selectedUser) throw new Error("No hay usuario seleccionado");
      await createPaymentWithUser({
        user: selectedUser.name,
        amount,
        status: "Pagado",
        concept,
        method,
        dueDate: getNextDueDate(),
        date: new Date().toISOString().slice(0, 10),
        userId: selectedUser._id,
        expirationDate: getNextDueDate(),
      });
    },
    onSuccess: () => {
      toast.success("Pago registrado correctamente");
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      setOpenModal(false);
    },
    onError: (err: unknown) => {
      if (err instanceof Error) {
        setError(err.message || "Error al registrar el pago");
      } else {
        setError("Error al registrar el pago");
      }
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    mutation.mutate();
  };
  return (
    <div className="relative w-full">
      <form
        id="payment-form"
        onSubmit={handleSubmit}
        className="space-y-4 w-full p-10 pb-28"
      >
        <div className="w-full">
          <label className="block text-sm font-medium mb-1">Usuario</label>
          <select
            className="w-full border rounded px-3 py-2 mt-1"
            value={selectedUser?._id || ""}
            onChange={(e) => {
              const user = users.find((u) => u._id === e.target.value);
              if (user) setSelectedUser(user);
            }}
            required
          >
            <option value="" disabled>
              Selecciona un usuario
            </option>
            {users
              .filter((u) => u.role === "user")
              .map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name} ({user.email})
                </option>
              ))}
          </select>
        </div>
        <div className="w-full">
          <label className="block text-sm font-medium mb-1">Monto</label>
          <Input
            type="number"
            min={0}
            value={amount ?? 0}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full"
          />
        </div>
        <div className="w-full">
          <label className="block text-sm font-medium mb-1">
            Método de pago
          </label>
          <select
            className="w-full border rounded px-3 py-2 mt-1"
            value={method}
            onChange={(e) => setMethod(e.target.value as Payments["method"])}
            required
          >
            <option value="Efectivo">Efectivo</option>
            <option value="Tarjeta">Tarjeta</option>
            <option value="Transferencia">Transferencia</option>
          </select>
        </div>
        <div className="w-full">
          <label className="block text-sm font-medium mb-1">
            Tipo de Vencimiento
          </label>
          <select
            className="w-full border rounded px-3 py-2 mt-1"
            value={expirationType}
            onChange={(e) => setExpirationType(e.target.value)}
            required
          >
            <option value="" disabled>
              Selecciona una opción
            </option>
            {EXPIRATION_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div className="w-full">
          <label className="block text-sm font-medium mb-1">Concepto</label>
          <Input value={concept ?? ""} disabled className="w-full" />
          <p className="text-xs text-muted-foreground mt-1">
            Este es el mes que se está pagando
          </p>
        </div>
        <div className="w-full">
          <label className="block text-sm font-medium mb-1">
            Fecha de vencimiento actual
          </label>
          <Input
            value={userDueDate ? new Date(userDueDate).toLocaleDateString() : ""}
            disabled
            className="w-full"
          />
        </div>
        <div className="w-full">
          <label className="block text-sm font-medium mb-1">
            Nueva fecha de vencimiento
          </label>
          <Input value={getNextDueDate() ?? ""} disabled className="w-full" />
        </div>
      </form>
      <div className="absolute bottom-0 left-0 w-full bg-white border-t flex flex-col items-center gap-2 p-4 z-10 mt-35">
        {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
        {/* El toast de éxito ahora se maneja con sonner */}
        <div className="flex justify-center gap-2 w-full">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpenModal(false)}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            form="payment-form"
            className="bg-primary text-white"
            disabled={loading}
          >
            {loading ? "Guardando..." : "Confirmar Pago"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;
