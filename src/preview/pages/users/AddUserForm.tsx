import React, { useState } from "react";
import type { User } from "@/preview/interfaces/preview.interfaces";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getUser } from "@/fake/fake-data-gym";
import { useQuery } from "@tanstack/react-query";
import Badge from "@/components/ui/badge";

interface AddUserFormProps {
  onSubmit: (user: Omit<User, "id">) => void;
  id: string | "";
}

const initialState: Omit<User, "id"> = {
  name: "",
  status: "Activo",
  phone: "",
  email: "",
  avatar: "",
  membership: "Básico",
  lastVisit: "",
  dueDate: "",
  joinDate: "",
  qrCode: "",
  role: "user",
  password: "",
};

export const AddUserForm: React.FC<AddUserFormProps> = ({ onSubmit, id }) => {
  const { data: user, isLoading } = useQuery({
    queryKey: ["user", id],
    queryFn: () => getUser(id as string),
    enabled: !!id,
  });

  const [form, setForm] = useState<Omit<User, "id">>(initialState);

  React.useEffect(() => {
    if (user && JSON.stringify(user) !== JSON.stringify(form)) {
      setForm(user);
    } else if (!user && JSON.stringify(form) !== JSON.stringify(initialState)) {
      setForm(initialState);
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "rent" ? Number(value) : value,
    }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
    setForm(initialState);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white p-6  space-y-4"
    >
      <div className="flex flex-col items-center">
        <label htmlFor="avatar" className="cursor-pointer">
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300 flex items-center justify-center bg-gray-100">
            {form.avatar ? (
              <img
                src={form.avatar}
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

      {id ? (
        <div className="flex items-center justify-start gap-5 mt-5">
          <div>
            <Label className="block text-sm font-medium text-gray-700">
              Estado
            </Label>
            <Badge status={form.status}>{form.status}</Badge>
          </div>
          <div>
            <Label className="block text-sm font-medium text-gray-700">
              Membership
            </Label>
            <Badge status={form.membership}>{form.membership}</Badge>
          </div>
        </div>
      ) : (
        <div>
          {" "}
          <Label className="block text-sm font-medium text-gray-700">
            Estado
          </Label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="activo">Activo</option>
            <option value="pendiente">Pendiente</option>
            <option value="vencido">Vencido</option>
          </select>
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
      <div>
        <Label className="block text-sm font-medium text-gray-700">
          Fecha de vencimiento
        </Label>
        <Input
          type="date"
          name="dueDate"
          value={form.dueDate}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>
      <Button type="submit" className="w-full py-2 px-4 transition mt-4">
        submit
      </Button>
    </form>
  );
};
