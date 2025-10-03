import type { Payments } from "@/features/preview/interfaces/preview.interfaces";

// Obtener token del usuario desde localStorage (ajusta si lo guardas en otro lado)
function getAuthToken() {
  try {
    const userStr = localStorage.getItem('user-storage');
    if (!userStr) return null;
    const userObj = JSON.parse(userStr)?.state?.user;
    return userObj?.token || null;
  } catch {
    return null;
  }
}

// Utilidad para fetch con manejo de errores
async function fetchWithErrorHandling(url: string, options?: RequestInit, defaultErrorMsg = "Error en la petición") {
  const token = getAuthToken();
  const mergedOptions = {
    ...options,
    headers: {
      ...(options?.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };
  const res = await fetch(url, mergedOptions);
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


export const createPayment = async (payment: Omit<Payments, "id">) => {
  return fetchWithErrorHandling("/api/payments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payment),
  }, "Error al registrar pago");
};

// Permitir campos extra para el caso de userId, expirationDate y expirationType
export const createPaymentWithUser = async (payment: Omit<Payments, "id"> & { userId: string, expirationDate: string, expirationType?: "1" | "15" | "monthly" }) => {
  return fetchWithErrorHandling("/api/payments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payment),
  }, "Error al registrar pago");
};

// Actualizar pago y dueDate del usuario
export const updatePaymentWithUser = async (
  id: string,
  payment: Partial<Payments> & { userId: string; expirationDate: string; expirationType?: "1" | "15" | "monthly" }
) => {
  return fetchWithErrorHandling(`/api/payments/${id}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payment),
    },
    "Error al actualizar pago"
  );
};

export const fetchPayments = async () => {
  return fetchWithErrorHandling("/api/payments", undefined, "Error al obtener pagos");
};
