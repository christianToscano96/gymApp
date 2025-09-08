import React, { useState, useEffect } from "react";
import { useAvatarResize } from "@/hook/useAvatarResize";
import type { Staff } from "../../../api/staffService";
import {
  useCreateStaff,
  useUpdateStaff,
  useStaff,
} from "../../../api/staffService";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Select } from "@/components/ui/select";

interface AddStaffFormProps {
  staffId?: string;
  onSuccess?: () => void;
}

const initialState: Staff = {
  name: "",
  email: "",
  password: "",
  role: "",
  status: "activo",
  phone: "",
  avatar: undefined,
};

const AddStaffFrom: React.FC<AddStaffFormProps> = ({ staffId, onSuccess }) => {
  const [form, setForm] = useState<Staff>(initialState);
  const { avatar, setAvatar, handleAvatarChange } = useAvatarResize();
  const { data: staffData, isLoading, isError } = useStaff(staffId || "");
  const createMutation = useCreateStaff();
  const updateMutation = useUpdateStaff();

  useEffect(() => {
    if (staffData) {
      setForm({ ...staffData, password: "" }); // No mostrar password
      setAvatar(staffData.avatar || "");
    }
  }, [staffData, setAvatar]);

  // Loading y error feedback
  if (isLoading) {
    return (
      <div className="max-w-md mx-auto bg-white p-6 space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-12 w-full mt-4" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-md mx-auto bg-white p-6 space-y-4 text-center text-red-500">
        Error al obtener el staff. Por favor, intenta de nuevo.
      </div>
    );
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (staffId) {
      updateMutation.mutate({ id: staffId, staffData: form }, { onSuccess });
    } else {
      createMutation.mutate(form, { onSuccess });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 space-y-4 ">
      {/* Avatar */}
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
      {/* Nombre */}
      <div>
        <Label className="block text-sm font-medium text-gray-700">
          Nombre
        </Label>
        <Input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>
      {/* Teléfono */}
      <div>
        <Label className="block text-sm font-medium text-gray-700">
          Teléfono
        </Label>
        <Input
          type="text"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>
      {/* Email */}
      <div>
        <Label className="block text-sm font-medium text-gray-700">Email</Label>
        <Input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>
      {/* Contraseña */}
      <div>
        <Label className="block text-sm font-medium text-gray-700">
          Contraseña
        </Label>
        <Input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required={!staffId}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>
      {/* Rol */}
      <div>
        <Label className="block text-sm font-medium text-gray-700">Rol</Label>
        <Select
          options={[
            { label: "Admin", value: "admin" },
            { label: "Staff", value: "staff" },
          ]}
          value={form.role}
          onChange={(value) => setForm((prev) => ({ ...prev, role: value }))}
          placeholder="Selecciona un rol"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>
      {/* Estado */}
      <div>
        <Label className="block text-sm font-medium text-gray-700">
          Estado
        </Label>
        <Select
          options={[
            { label: "Activo", value: "activo" },
            { label: "Inactivo", value: "inactivo" },
          ]}
          value={form.status}
          onChange={(value) => setForm((prev) => ({ ...prev, status: value }))}
          placeholder="Selecciona estado"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>
      <Button
        type="submit"
        className="w-full py-2 px-4 transition mt-4"
        disabled={
          createMutation.status === "pending" ||
          updateMutation.status === "pending"
        }
      >
        {staffId ? "Guardar cambios" : "Crear"}
      </Button>
      {(createMutation.isError || updateMutation.isError) && (
        <div className="text-red-600 text-center mt-2">
          {(createMutation.error as Error)?.message ||
            (updateMutation.error as Error)?.message}
        </div>
      )}
      {(createMutation.isSuccess || updateMutation.isSuccess) && (
        <div className="text-green-600 text-center mt-2">
          Staff guardado correctamente
        </div>
      )}
    </form>
  );
};

export default AddStaffFrom;
