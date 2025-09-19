import React, { useState } from "react";
import { useCurrentUser } from "@/hook/useCurrentUser";
import { useAvatarResize } from "@/hook/useAvatarResize";
import type { User } from "@/preview/interfaces/preview.interfaces";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarPicker } from "@/components/ui/calendar-picker";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import Badge from "@/components/ui/badge";
import { fetchUserById } from "@/api/userService";
import { updateUser, createUser } from "@/api/userService";
import { toast } from "sonner";
import { Select } from "@/components/ui/select";

interface AddUserFormProps {
  id?: string | "";
  onClose?: () => void;
}

const initialState: Omit<User, "_id"> = {
  name: "",
  phone: "",
  email: "",
  status: "Activo",
  lastVisit: "",
  avatar: "",
  joinDate: "",
  dueDate: "",
  qrCode: "",
  role: "user",
  password: "",
  dni: "",
  paymentMethod: "",
  amount: 0,
};
const PAYMENT_METHODS = [
  { label: "Transferencia", value: "transferencia" },
  { label: "Efectivo", value: "efectivo" },
  { label: "Pago QR", value: "qr" },
];
const STATUS_OPTIONS = [
  { label: "Activo", value: "Activo" },
  { label: "Pendiente", value: "Pendiente" },
  { label: "Vencido", value: "Vencido" },
];

const ALL_ROLE_OPTIONS = [
  { label: "Administrador", value: "administrator" },
  { label: "Usuario", value: "user" },
  { label: "Personal", value: "staff" },
  { label: "Entrenador", value: "trainer" },
];
const EXPIRATION_OPTIONS = [
  { label: "1 día", value: "1" },
  { label: "15 días", value: "15" },
  { label: "Mensual", value: "monthly" },
];

export const AddUserForm: React.FC<AddUserFormProps> = ({ id, onClose }) => {
  const { data: currentUser } = useCurrentUser();
  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user", id],
    queryFn: () => fetchUserById(id as string),
    enabled: !!id,
  });

  const [form, setForm] = useState<Omit<User, "_id">>(initialState);
  // Actualiza amount automáticamente según expirationType, pero permite edición manual
  const [expirationType, setExpirationType] = useState("");
  React.useEffect(() => {
    if (!expirationType) return;
    let defaultAmount = 0;
    if (expirationType === "1") defaultAmount = 1;
    else if (expirationType === "15") defaultAmount = 15;
    else if (expirationType === "monthly") defaultAmount = 30;
    setForm((prev) => {
      if (
        !prev.amount ||
        prev.amount === 0 ||
        prev.amount === 1 ||
        prev.amount === 15 ||
        prev.amount === 30
      ) {
        return { ...prev, amount: defaultAmount };
      }
      return prev;
    });
  }, [expirationType]);
  const { avatar, setAvatar, handleAvatarChange } = useAvatarResize();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  function getRoleOptions(userRole?: string) {
    if (userRole === "staff") {
      return ALL_ROLE_OPTIONS.filter(
        (opt) => opt.value === "user" || opt.value === "trainer"
      );
    }
    return ALL_ROLE_OPTIONS;
  }

  const ROLE_OPTIONS = getRoleOptions(currentUser?.role);

  React.useEffect(() => {
    function getLocalDate() {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, "0");
      const dd = String(today.getDate()).padStart(2, "0");
      return `${yyyy}-${mm}-${dd}`;
    }

    if (id && user) {
      const joinDate = user.joinDate
        ? new Date(user.joinDate).toISOString().slice(0, 10)
        : "";
      const dueDate = user.dueDate
        ? new Date(user.dueDate).toISOString().slice(0, 10)
        : "";
      setForm({
        ...user,
        joinDate,
        dueDate,
        paymentMethod: user.paymentMethod || "",
        amount: user.amount || "",
      });
      setAvatar(user.avatar || "");

      // Calcular tipo de expiración si hay fechas
      if (joinDate && dueDate) {
        const join = new Date(joinDate);
        const due = new Date(dueDate);
        const diffDays = Math.round(
          (due.getTime() - join.getTime()) / (1000 * 60 * 60 * 24)
        );
        if (Math.abs(diffDays - 15) < 2) setExpirationType("15");
        else if (Math.abs(diffDays - 1) < 2) setExpirationType("1");
        else setExpirationType("monthly");
      }
    } else if (!id) {
      setForm({
        ...initialState,
        joinDate: getLocalDate(),
      });
      setAvatar("");
      setExpirationType("");
    }
  }, [user, id, setAvatar]);

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto bg-white p-6 space-y-4">
        <div className="flex flex-col items-center">
          <Skeleton className="w-24 h-24 rounded-full" />
        </div>
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-12 w-full mt-4" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto bg-white p-6 space-y-4 text-center text-red-500">
        Error al obtener el usuario. Por favor, intenta de nuevo.
      </div>
    );
  }

  const validateField = (name: string, value: string) => {
    let error = "";
    if (name === "name" && !value) error = "El nombre es requerido.";
    if (name === "phone" && !value) error = "El teléfono es requerido.";
    if (name === "email" && !value) error = "El email es requerido.";
    if (name === "dni" && !value) error = "El DNI es requerido.";
    if (name === "role" && !value) error = "El rol es requerido.";
    if (name === "status" && !value) error = "El estado es requerido.";
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const newForm = {
        ...prev,
        [name]: name === "rent" ? Number(value) : value,
      };
      if (name === "joinDate" && expirationType) {
        newForm.dueDate = calculateExpiration(value, expirationType);
      }
      return newForm;
    });
    validateField(name, value);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const saveUser = async () => {
    if (!id) return;
    try {
      const normalizedJoinDate = form.joinDate
        ? new Date(form.joinDate).toISOString().slice(0, 10)
        : "";
      const normalizedDueDate = form.dueDate
        ? new Date(form.dueDate).toISOString().slice(0, 10)
        : "";
      await updateUser(id, {
        ...form,
        avatar,
        _id: id,
        joinDate: normalizedJoinDate,
        dueDate: normalizedDueDate,
        amount: typeof form.amount === "number" ? form.amount : 0,
      });
      toast.success("Usuario actualizado correctamente");
    } catch (error) {
      toast.error("Error al actualizar usuario");
      console.error("Error al actualizar usuario:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};
    if (!form.name) newErrors.name = "El nombre es requerido.";
    if (!form.phone) newErrors.phone = "El teléfono es requerido.";
    if (!form.email) newErrors.email = "El email es requerido.";
    if (!form.dni) newErrors.dni = "El DNI es requerido.";
    if (!form.role) newErrors.role = "El rol es requerido.";
    if (!form.status) newErrors.status = "El estado es requerido.";
    if (form.role === "user" && !form.paymentMethod)
      newErrors.paymentMethod = "El método de pago es requerido.";
    if (
      !form.joinDate &&
      !["administrator", "staff", "trainer"].includes(form.role)
    )
      newErrors.joinDate = "La fecha de ingreso es requerida.";
    if (
      !expirationType &&
      !["administrator", "staff", "trainer"].includes(form.role)
    )
      newErrors.expirationType = "El tipo de vencimiento es requerido.";
    if (form.joinDate) {
      const [y, m, d] = form.joinDate.split("-").map(Number);
      const join = new Date(y, m - 1, d);
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      if (join < now) {
        newErrors.joinDate = "La fecha de inicio no puede ser anterior a hoy.";
      }
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      toast.error("Por favor completa todos los campos requeridos.");
      return;
    }

    const normalizedJoinDate = form.joinDate
      ? new Date(form.joinDate).toISOString().slice(0, 10)
      : "";
    let dueDate = "";
    if (normalizedJoinDate && expirationType) {
      dueDate = calculateExpiration(normalizedJoinDate, expirationType);
    } else if (form.dueDate) {
      dueDate = new Date(form.dueDate).toISOString().slice(0, 10);
    } else {
      dueDate = "";
    }

    if (id) {
      await saveUser();
      if (onClose) onClose();
    } else {
      try {
        const normalizedRole = [
          "administrator",
          "user",
          "staff",
          "trainer",
        ].includes(form.role)
          ? form.role
          : "user";
        const normalizedStatus =
          form.status === "Activo"
            ? "activo"
            : form.status === "Vencido"
            ? "vencido"
            : form.status === "Pendiente"
            ? "pendiente"
            : "activo";

        let safePassword = "gymapp123";
        if (form.dni && form.dni.length >= 6) {
          safePassword = form.dni.slice(-6);
        } else if (form.dni && form.dni.length > 0) {
          safePassword = form.dni
            .repeat(Math.ceil(6 / form.dni.length))
            .slice(0, 6);
        }
        // No enviar qrCode ni qrImage si el rol no es "user"
        let userPayload;
        if (normalizedRole === "user") {
          userPayload = {
            ...form,
            avatar,
            role: normalizedRole as
              | "administrator"
              | "user"
              | "staff"
              | "trainer",
            status: normalizedStatus as "activo" | "vencido" | "pendiente",
            password: safePassword,
            joinDate: normalizedJoinDate,
            dueDate,
            paymentMethod: form.paymentMethod || "",
            amount: typeof form.amount === "number" ? form.amount : 0,
          };
        } else {
          userPayload = {
            name: form.name,
            email: form.email,
            password: safePassword,
            phone: form.phone,
            dni: form.dni,
            role: normalizedRole as
              | "administrator"
              | "user"
              | "staff"
              | "trainer",
            joinDate: normalizedJoinDate,
            dueDate,
            lastVisit: form.lastVisit,
            status: normalizedStatus as "activo" | "vencido" | "pendiente",
            avatar,
          };
        }
        await createUser(userPayload);
        toast.success("Usuario creado correctamente");
        setForm(initialState);
        setAvatar("");
        if (onClose) onClose();
      } catch (error) {
        let errorMsg = "Error al crear usuario";
        if (error instanceof Error) {
          errorMsg = error.message;
        }
        if (errorMsg.toLowerCase().includes("email ya registrado")) {
          setErrors((prev) => ({
            ...prev,
            email: "El email ya está registrado.",
          }));
        }
        console.log(errorMsg);
        console.error("Error al crear usuario:", errorMsg);
      }
    }
  };

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
  return (
    <form
      onSubmit={handleSubmit}
      className="w-full h-full bg-white p-0 sm:p-6 md:p-8 space-y-3 md:space-y-4 overflow-auto"
    >
      {(id || typeof window === "undefined" || window.innerWidth >= 640) && (
        <div className="flex flex-col items-center mb-2">
          <label htmlFor="avatar" className="cursor-pointer">
            <div className="w-20 h-20 xs:w-24 xs:h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-2 border-gray-300 flex items-center justify-center bg-gray-100">
              {avatar ? (
                <img
                  src={avatar}
                  alt="Avatar"
                  className="object-cover w-full h-full"
                />
              ) : (
                <span className="text-gray-400">Avatar</span>
              )}
            </div>
            <Input
              id="avatar"
              name="avatar"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </label>
        </div>
      )}
      <div>
        <Label className="block text-sm font-medium text-gray-700">
          Nombre
        </Label>
        <Input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          onBlur={handleBlur}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
        {errors.name && (
          <div className="text-red-500 text-xs mt-1">{errors.name}</div>
        )}
      </div>

      {id === undefined || id === null ? (
        <div className="flex flex-col gap-2 sm:gap-4 sm:flex-row">
          <div className="flex-1 mt-1">
            <Label className="block text-sm font-medium text-gray-700">
              Rol
            </Label>
            <Select
              options={ROLE_OPTIONS}
              value={form.role}
              onChange={(value) => {
                setForm((prev) => ({
                  ...prev,
                  role: value as "administrator" | "user" | "staff",
                }));
                validateField("role", value);
              }}
              placeholder="Selecciona rol"
              className="w-full"
            />
            {errors.role && (
              <div className="text-red-500 text-xs mt-1">{errors.role}</div>
            )}
          </div>
          <div className="flex-1 mt-1">
            <Label className="block text-sm font-medium text-gray-700">
              Estado
            </Label>
            <Select
              options={STATUS_OPTIONS}
              value={form.status}
              onChange={(value) => {
                setForm((prev) => ({
                  ...prev,
                  status: value as "Activo" | "Pendiente" | "Vencido",
                }));
                validateField("status", value);
              }}
              placeholder="Selecciona estado"
              className="w-full"
            />
            {errors.status && (
              <div className="text-red-500 text-xs mt-1">{errors.status}</div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-start gap-5 mt-5">
          <div>
            <Label className="block text-sm font-medium text-gray-700">
              Rol
            </Label>
            <Badge status={form.role}>{form.role}</Badge>
          </div>
          <div>
            <Label className="block text-sm font-medium text-gray-700">
              Estado
            </Label>
            <Badge status={form.status}>{form.status}</Badge>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2 sm:gap-4 sm:flex-row">
        <div className="flex-1">
          <Label className="block text-sm font-medium text-gray-700">
            Teléfono
          </Label>
          <Input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
          {errors.phone && (
            <div className="text-red-500 text-xs mt-1">{errors.phone}</div>
          )}
        </div>
        <div className="flex-1">
          <Label className="block text-sm font-medium text-gray-700">
            Email
          </Label>
          <Input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            onBlur={handleBlur}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
          {errors.email && (
            <div className="text-red-500 text-xs mt-1">{errors.email}</div>
          )}
        </div>
      </div>
      <div>
        <Label className="block text-sm font-medium text-gray-700">DNI</Label>
        <Input
          type="text"
          name="dni"
          value={form.dni}
          onChange={handleChange}
          onBlur={handleBlur}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
        {errors.dni && (
          <div className="text-red-500 text-xs mt-1">{errors.dni}</div>
        )}
      </div>
      {!["administrator", "staff", "trainer"].includes(form.role) && (
        <>
          <div>
            <Label className="block text-sm font-medium text-gray-700">
              Fecha de Ingreso
            </Label>
            <CalendarPicker
              value={form.joinDate}
              onChange={(date) => {
                setForm((prev) => {
                  const newForm = { ...prev, joinDate: date };
                  if (expirationType) {
                    newForm.dueDate = calculateExpiration(date, expirationType);
                  }
                  return newForm;
                });
              }}
            />
            {errors.joinDate && (
              <div className="text-red-500 text-xs mt-1">{errors.joinDate}</div>
            )}
          </div>
          {form.joinDate && (
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Vencimiento
              </Label>
              <div className="flex flex-col gap-2 sm:flex-row sm:gap-4 mt-1">
                {EXPIRATION_OPTIONS.map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center gap-1 cursor-pointer select-none"
                  >
                    <Checkbox
                      checked={expirationType === option.value}
                      onCheckedChange={() => {
                        setExpirationType(option.value);
                        setForm((prev) => {
                          const dueDate = prev.joinDate
                            ? calculateExpiration(prev.joinDate, option.value)
                            : "";
                          return { ...prev, dueDate };
                        });
                      }}
                      id={`expiration-type-${option.value}`}
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
              {errors.expirationType && (
                <div className="text-red-500 text-xs mt-1">
                  {errors.expirationType}
                </div>
              )}
              {/* Show amount when expirationType is selected */}
              {expirationType && (
                <div className="mt-2">
                  <Label className="block text-sm font-medium text-gray-700 mb-1">
                    Monto
                  </Label>
                  <Input
                    type="number"
                    min={0}
                    value={form.amount}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        amount: Number(e.target.value),
                      }))
                    }
                    className="w-32 text-lg font-semibold"
                  />
                </div>
              )}
            </div>
          )}

          {id && (
            <div>
              <Label className="block text-sm font-medium text-gray-700">
                Fecha de Vencimiento
              </Label>
              <div className="mt-1 block w-full ">{form.dueDate}</div>
            </div>
          )}
        </>
      )}
      {form.role === "user" && (
        <div>
          <Label className="block text-sm font-medium text-gray-700 mb-1">
            Método de pago
          </Label>
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-4 mt-1">
            {PAYMENT_METHODS.map((method) => (
              <label
                key={method.value}
                className="flex items-center gap-1 cursor-pointer select-none"
              >
                <Checkbox
                  checked={form.paymentMethod === method.value}
                  onCheckedChange={() =>
                    setForm((prev) => ({
                      ...prev,
                      paymentMethod: method.value,
                    }))
                  }
                  id={`payment-method-${method.value}`}
                />
                <span>{method.label}</span>
                {errors.paymentMethod && (
                  <div className="text-red-500 text-xs mt-1">
                    {errors.paymentMethod}
                  </div>
                )}
              </label>
            ))}
          </div>
        </div>
      )}
      <Button
        type="submit"
        className="w-full py-2 px-4 transition mt-3 md:mt-4"
      >
        {id ? "Actualizar usuario" : "Crear usuario"}
      </Button>
    </form>
  );
};
