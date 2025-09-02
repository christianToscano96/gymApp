import { sleep } from '@/lib/sleep';

// ! Auth


// Fake user store
const users: Array<{
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  token: string;
}> = [
  {
    id: 'A1-00001',
    name: 'Admin Gym',
    email: 'admin@gym.com',
    password: 'admin',
    token: 'admin-token-123456',
    role: 'admin',
  },
  {
    id: 'U1-12345',
    name: 'Christian Toscano',
    email: 'user@user.com',
    password: 'user123',
    token: 'token-1234567890',
    role: 'user',
  },
];

export const loginUser = async ({ email, password }: { email: string; password: string }) => {
  await sleep(1200);
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) throw new Error('Credenciales incorrectas');
  return { id: user.id, name: user.name, email: user.email, token: user.token, role: user.role };
};

export const registerUser = async ({ name, email, password, role }: { name: string; email: string; password: string; role: 'admin' | 'user' }) => {
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
