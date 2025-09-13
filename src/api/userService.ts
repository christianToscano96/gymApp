// Utilidad para fetch con manejo de errores
async function fetchWithErrorHandling(url: string, options?: RequestInit, defaultErrorMsg = "Error en la petición") {
  const res = await fetch(url, options);
  if (!res.ok) {
    let errorMsg = defaultErrorMsg;
    try {
      const errorData = await res.json();
      errorMsg = errorData?.error || errorData?.message || defaultErrorMsg;
    } catch (e) {
      // 
    }
    throw new Error(errorMsg);
  }
  return res.json();
}

export const fetchUserByQrCode = async (qrCode: string) => {
  return fetchWithErrorHandling(`/api/users/qr/${qrCode}`, undefined, "Usuario no encontrado");
};

import type { User } from "@/preview/interfaces/preview.interfaces";


// src/api/userService.ts
export const fetchUsers = async () => {
  return fetchWithErrorHandling("/api/users", undefined, "Error al obtener usuarios");
};

export const fetchUserById = async (_id: string) => {
  return fetchWithErrorHandling(`/api/users/${_id}`, undefined, "Error al obtener usuario");
};

// Crear usuario
export const createUser = async (userData: {
  name: string;
  email: string;
  password: string;
  phone: string;
  dni?: string;
  role?: "administrator" | "user" | "staff" | "trainer";
  joinDate: string | null;
  dueDate?: string | null;
  membership?: string; // id de Payment
  lastVisit?: string | null;
  status?: "activo" | "vencido" | "pendiente";
  avatar?: string | null;
}) => {
  // Solo enviar los campos requeridos por el backend
  const payload = {
    name: userData.name,
    email: userData.email,
    password: userData.password,
    role: userData.role,
    phone: userData.phone || "",
    dni: userData.dni || "",
    dueDate: userData.dueDate || null,
    avatar: userData.avatar || null,
  };
  return fetchWithErrorHandling(
    "http://localhost:5050/api/auth/register",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
    "Error al crear usuario"
  );
};

export const updateUser = async (id: string, userData: Omit<User, "id">) => {
  return fetchWithErrorHandling(
    `/api/users/${id}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    },
    "Error al actualizar usuario"
  );
};
