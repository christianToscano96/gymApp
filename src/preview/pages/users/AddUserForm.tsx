import React, { useState } from "react";
import { useCurrentUser } from "@/hook/useCurrentUser";
import { useAvatarResize } from "@/hook/useAvatarResize";
import type { User } from "@/preview/interfaces/preview.interfaces";
import { Input } from "@/components/ui/input";
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
  membership: "Básico",
  lastVisit: "",
  avatar: "",
  joinDate: "",
  dueDate: "",
  qrCode: "",
  role: "user",
  password: "",
  dni: "",
};

export const AddUserForm: React.FC<AddUserFormProps> = ({ id, onClose }) => {
  // Obtener usuario actual
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
  const { avatar, setAvatar, handleAvatarChange } = useAvatarResize();
  const [expirationType, setExpirationType] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

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

  function getRoleOptions(userRole?: string) {
    if (userRole === "staff") {
      return ALL_ROLE_OPTIONS.filter(
        (opt) => opt.value === "user" || opt.value === "trainer"
      );
    }
    return ALL_ROLE_OPTIONS;
  }

  const ROLE_OPTIONS = getRoleOptions(currentUser?.role);
  const EXPIRATION_OPTIONS = [
    { label: "1 día", value: "1" },
    { label: "15 días", value: "15" },
    { label: "Mensual", value: "monthly" },
  ];

  React.useEffect(() => {
    if (id && user) {
      setForm({
        ...user,
        joinDate: user.joinDate
          ? new Date(user.joinDate).toISOString().slice(0, 10)
          : "",
        dueDate: user.dueDate
          ? new Date(user.dueDate).toISOString().slice(0, 10)
          : "",
      });
      setAvatar(user.avatar || "");
      if (user.joinDate && user.dueDate) {
        const join = new Date(user.joinDate);
        const due = new Date(user.dueDate);
        const diffDays = Math.round(
          (due.getTime() - join.getTime()) / (1000 * 60 * 60 * 24)
        );
        if (Math.abs(diffDays - 15) < 2) {
          setExpirationType("15");
        } else if (Math.abs(diffDays - 1) < 2) {
          setExpirationType("1");
        } else {
          setExpirationType("monthly");
        }
      }
    } else if (!id) {
      setForm(initialState);
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
    if (
      form.joinDate &&
      new Date(form.joinDate) < new Date(new Date().toISOString().slice(0, 10))
    ) {
      newErrors.joinDate = "La fecha de inicio no puede ser anterior a hoy.";
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
        const normalizedMembership =
          typeof form.membership === "string" &&
          !["Básico", "Premium"].includes(form.membership)
            ? form.membership
            : "";
        let safePassword = "gymapp123";
        if (form.dni && form.dni.length >= 6) {
          safePassword = form.dni.slice(-6);
        } else if (form.dni && form.dni.length > 0) {
          safePassword = form.dni
            .repeat(Math.ceil(6 / form.dni.length))
            .slice(0, 6);
        }
        await createUser({
          ...form,
          avatar,
          role: normalizedRole as "administrator" | "user" | "staff",
          status: normalizedStatus as "activo" | "vencido" | "pendiente",
          membership: normalizedMembership,
          password: safePassword,
          joinDate: normalizedJoinDate,
          dueDate,
        });
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
      className="max-w-md mx-auto bg-white p-2 space-y-4"
    >
      <div className="flex flex-col items-center">
        <label htmlFor="avatar" className="cursor-pointer">
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300 flex items-center justify-center bg-gray-100">
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
      <div>
        <Label className="block text-sm font-medium text-gray-700">
          Nombre
        </Label>
        <Input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
        {errors.name && (
          <div className="text-red-500 text-xs mt-1">{errors.name}</div>
        )}
      </div>

      {id === undefined || id === null ? (
        <>
          <div className="mt-1">
            <Label className="block text-sm font-medium text-gray-700">
              Rol
            </Label>
            <Select
              options={ROLE_OPTIONS}
              value={form.role}
              onChange={(value) =>
                setForm((prev) => ({
                  ...prev,
                  role: value as "administrator" | "user" | "staff" | "trainer",
                }))
              }
              placeholder="Selecciona rol"
              className="w-full"
            />
            {errors.role && (
              <div className="text-red-500 text-xs mt-1">{errors.role}</div>
            )}
          </div>
          <div className="mt-1">
            <Label className="block text-sm font-medium text-gray-700">
              Estado
            </Label>
            <Select
              options={STATUS_OPTIONS}
              value={form.status}
              onChange={(value) =>
                setForm((prev) => ({
                  ...prev,
                  status: value as "Activo" | "Pendiente" | "Vencido",
                }))
              }
              placeholder="Selecciona estado"
              className="w-full"
            />
            {errors.status && (
              <div className="text-red-500 text-xs mt-1">{errors.status}</div>
            )}
          </div>
        </>
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

      <div className="flex gap-4">
        <div className="flex-1">
          <Label className="block text-sm font-medium text-gray-700">
            Teléfono
          </Label>
          <Input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
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
              <Label className="block text-sm font-medium text-gray-700">
                Tipo de Vencimiento
              </Label>
              <Select
                options={EXPIRATION_OPTIONS}
                value={expirationType}
                onChange={(value) => {
                  setExpirationType(value);
                  setForm((prev) => {
                    const dueDate = prev.joinDate
                      ? calculateExpiration(prev.joinDate, value)
                      : "";
                    return { ...prev, dueDate };
                  });
                }}
                placeholder="Selecciona una opción"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              {errors.expirationType && (
                <div className="text-red-500 text-xs mt-1">
                  {errors.expirationType}
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
      <Button type="submit" className="w-full py-2 px-4 transition mt-4">
        {id ? "Actualizar usuario" : "Crear usuario"}
      </Button>
    </form>
  );
};
