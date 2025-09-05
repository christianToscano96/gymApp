
import type { User } from "@/preview/interfaces/preview.interfaces";


// src/api/userService.ts
export const fetchUsers = async () => {
  const res = await fetch("/api/users");
  if (!res.ok) throw new Error("Error al obtener usuarios");
  return res.json();
};

export const fetchUserById = async (_id: string) => {
  const res = await fetch(`/api/users/${_id}`);
  if (!res.ok) throw new Error("Error al obtener usuario");
  return res.json();
};

// Actualizar usuario por id
// Crear usuario
export const createUser = async (userData: {
  name: string;
  email: string;
  password: string;
  phone: string;
  dni?: string;
  role?: "administrator" | "user" | "staff";
  joinDate: string | null;
  dueDate?: string | null;
  membership?: string; // id de Payment
  lastVisit?: string | null;
  status?: "activo" | "vencido" | "pendiente";
  avatar?: string | null;
}) => {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
  if (!res.ok) {
    let errorMsg = "Error al crear usuario";
    try {
      const errorData = await res.json();
      if (errorData?.message) errorMsg = errorData.message;
    } catch (e) {
      console.log(e)
    }
    throw new Error(errorMsg);
  }
  return res.json();
};

export const updateUser = async (id: string, userData: Omit<User, "id">) => {
  const res = await fetch(`/api/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
  if (!res.ok) {
    let errorMsg = "Error al actualizar usuario";
    try {
      const errorData = await res.json();
      if (errorData?.message) errorMsg = errorData.message;
    } catch (e) {
      console.log(e);
    }
    throw new Error(errorMsg);
  }
  return res.json();
};
