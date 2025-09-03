
// Importa loginUser desde api/authService
export { loginUser } from "@/api/authService";

export const registerUser = async ({ name, email, password, role }: { name: string; email: string; password: string; role: 'administrator' | 'user' }) => {
  await sleep(1200);
  if (users.some(u => u.email === email)) throw new Error('El correo ya está registrado');
  const id = 'U' + Math.random().toString(36).slice(2, 8);
  const token = 'token-' + Math.random().toString(36).slice(2, 12);
  const newUser = { id, name, email, password, role, token };
  users.push(newUser);
  return { id, name, email, token, role };
};


export const checkAuth = async (token: string) => {
  await sleep(500);
  const user = users.find(u => u.token === token);
  if (!user) throw new Error('Invalid token');
  return { id: user.id, name: user.name, email: user.email, role: user.role };
};
