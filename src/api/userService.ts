import type { User } from "@/preview/interfaces/preview.interfaces";


// Utilidad para fetch con manejo de errores
async function fetchWithErrorHandling(url: string, options?: RequestInit, defaultErrorMsg = "Error en la petición") {
  const res = await fetch(url, options);
  if (!res.ok) {
    let errorMsg = defaultErrorMsg;
    try {
      const errorData = await res.json();
      errorMsg = errorData?.error || errorData?.message || defaultErrorMsg;
    } catch (e) {
      console.log(e)
    }
    throw new Error(errorMsg);
  }
  return res.json();
}

export const fetchUserByQrCode = async (qrCode: string) => {
  return fetchWithErrorHandling(`/api/users/qr/${qrCode}`, undefined, "Usuario no encontrado");
};



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
  lastVisit?: string | null;
  status?: "activo" | "vencido" | "pendiente";
  avatar?: string | null;
  paymentMethod?: string;
  amount?: number;
}) => {
  // Solo enviar los campos requeridos por el backend
  const payload: Partial<User> = {
    name: userData.name,
    email: userData.email,
    password: userData.password,
    role: userData.role,
    phone: userData.phone || "",
    dni: userData.dni || "",
    dueDate: userData.dueDate || undefined,
    avatar: userData.avatar || undefined,
  };
  if (
    userData.role === "user" &&
    userData.paymentMethod &&
    ["efectivo", "transferencia", "qr"].includes(userData.paymentMethod)
  ) {
    payload.paymentMethod = userData.paymentMethod;
    if (typeof userData.amount === "number") {
      payload.amount = userData.amount;
    }
  }
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
  const payload: Partial<User> = { ...userData };
  if (userData.role !== "user") {
    delete payload.paymentMethod;
    delete payload.amount;
  }
  // Only send amount if it's a number
  if (userData.role === "user" && typeof userData.amount === "number") {
    payload.amount = userData.amount;
  }
  return fetchWithErrorHandling(
    `/api/users/${id}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
    "Error al actualizar usuario"
  );
};

export const updateUserLastVisit = async (id: string, lastVisit: string) => {
  const token = localStorage.getItem("token");
  return fetchWithErrorHandling(
    `/api/users/${id}/last-visit`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ lastVisit }),
    },
    "Error al actualizar la última visita"
  );
};
