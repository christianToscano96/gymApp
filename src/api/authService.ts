
// Llama al backend real para login
export const loginUser = async ({ email, password }: { email: string; password: string }) => {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Credenciales incorrectas");
  }
  const data = await response.json();
  return data;
};
