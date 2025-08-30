import React, { useState } from "react";
import type { Tenant } from "@/rental/interfaces/rental.interfaces";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { getTenant } from "@/fake/fake-data-rental";
import { useQuery } from "@tanstack/react-query";

interface AddTenantFormProps {
  onSubmit: (tenant: Omit<Tenant, "id">) => void;
  id: string | "";
}

const initialState: Omit<Tenant, "id"> = {
  name: "",
  apartment: "",
  rent: 0,
  status: "pending",
  phone: "",
  email: "",
  dueDate: "",
  avatar: "",
};

export const AddTenantForm: React.FC<AddTenantFormProps> = ({
  onSubmit,
  id,
}) => {
  const { data: tenant, isLoading } = useQuery({
    queryKey: ["tenant", id],
    queryFn: () => getTenant(id as string),
    enabled: !!id,
  });
  const [form, setForm] = useState<Omit<Tenant, "id">>(tenant || initialState);

  console.log(tenant);

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
      <div>
        <Label className="block text-sm font-medium text-gray-700">
          Departamento
        </Label>
        <Input
          type="text"
          name="apartment"
          value={form.apartment}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>
      <div>
        <Label className="block text-sm font-medium text-gray-700">Renta</Label>
        <Input
          type="number"
          name="rent"
          value={form.rent}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>
      <div>
        <Label className="block text-sm font-medium text-gray-700">
          Estado
        </Label>
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="paid">Pagado</option>
          <option value="pending">Pendiente</option>
          <option value="expired">Vencido</option>
        </select>
      </div>
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
