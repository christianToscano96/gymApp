import React, { useState } from "react";
import { useAvatarResize } from "@/hook/useAvatarResize";
import type { User } from "@/preview/interfaces/preview.interfaces";
import { Input } from "@/components/ui/input";
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
  // Sincroniza el formulario cuando cambia el id (modo edición/creación)
  React.useEffect(() => {
    if (id && user) {
      setForm({
        ...user,
      });
      setAvatar(user.avatar || "");
    } else if (!id) {
      setForm(initialState);
      setAvatar("");
    }
    // eslint-disable-next-line
  }, [user, id]);

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
    setForm((prev) => ({
      ...prev,
      [name]: name === "rent" ? Number(value) : value,
    }));
  };

  // ...eliminado: handleAvatarChange, ahora se usa el hook...

  // Función para guardar el usuario modificado
  const saveUser = async () => {
    if (!id) return;
    try {
  await updateUser(id, { ...form, avatar, _id: id });
      toast.success("Usuario actualizado correctamente");
    } catch (error) {
      toast.error("Error al actualizar usuario");
      console.error("Error al actualizar usuario:", error);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (id) {
      await saveUser();
      if (onClose) onClose();
    } else {
      try {
        // Normalizar los valores para que coincidan con el modelo de la BD
        const normalizedRole = ["administrator", "user", "staff"].includes(
          form.role
        )
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
        // Obtener los últimos 4 dígitos del dni para la contraseña
        await createUser({
          ...form,
          avatar,
          role: normalizedRole as "administrator" | "user" | "staff",
          status: normalizedStatus as "activo" | "vencido" | "pendiente",
          membership: normalizedMembership,
          password: form.dni ? form.dni.slice(-4) : "",
        });
        toast.success("Usuario creado correctamente");
        setForm(initialState);
        setAvatar("");
        if (onClose) onClose();
      } catch (error) {
        toast.error("Error al crear usuario");
        console.error("Error al crear usuario:", error);
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white p-6  space-y-4"
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
      </div>

      {id === undefined || id === null ? (
        <div className="mt-1">
          <Label className="block text-sm font-medium text-gray-700">
            Estado
          </Label>
          <Select
            options={[
              { label: "Activo", value: "Activo" },
              { label: "Pendiente", value: "Pendiente" },
              { label: "Vencido", value: "Vencido" },
            ]}
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
        </div>
      ) : (
        <div className="flex items-center justify-start gap-5 mt-5">
          <div>
            <Label className="block text-sm font-medium text-gray-700">
              Estado
            </Label>
            <Badge status={form.status}>{form.status}</Badge>
          </div>
        </div>
      )}

      <div>
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
      </div>
      <div>
        <Label className="block text-sm font-medium text-gray-700">Email</Label>
        <Input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>
      {form.role !== "administrator" && (
        <>
          <div>
            <Label className="block text-sm font-medium text-gray-700">
              DNI
            </Label>
            <Input
              type="text"
              name="dni"
              value={form.dni}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <Label className="block text-sm font-medium text-gray-700">
              Fecha de Ingreso
            </Label>
            <Input
              type="date"
              name="joinDate"
              value={form.joinDate || ""}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
        </>
      )}
      <Button type="submit" className="w-full py-2 px-4 transition mt-4">
        {id ? "Actualizar usuario" : "Crear usuario"}
      </Button>
    </form>
  );
};
