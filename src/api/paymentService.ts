import type { Payments } from "@/preview/interfaces/preview.interfaces";

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

export const fetchPayments = async () => {
  return fetchWithErrorHandling("/api/payments", undefined, "Error al obtener pagos");
};
