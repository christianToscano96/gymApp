import { sleep } from '@/lib/sleep';

// ! Auth

// Recibe email y password para simular login de admin o usuario
export const loginUser = async ({ email, password }: { email: string; password: string }) => {
  await sleep(1200);
  // Simulación: si el email es admin, es admin, si no, usuario normal
  if (email === 'admin@gym.com' && password === 'admin') {
    return {
      id: 'A1-00001',
      name: 'Admin Gym',
      email: 'admin@gym.com',
      token: 'admin-token-123456',
      role: 'admin',
    };
  }
  // Usuario normal
  return {
    id: 'U1-12345',
    name: 'Christian Toscano',
    email: 'user@user.com',
    token: 'token-1234567890',
    role: 'user',
  };
};


export const checkAuth = async (token: string) => {
  await sleep(500);

  if (token === 'admin-token-123456') {
    return {
      id: 'A1-00001',
      name: 'Admin Gym',
      email: 'admin@gym.com',
      role: 'admin',
    };
  }
  if (token === 'token-1234567890') {
    return {
      id: 'U1-12345',
      name: 'Christian Toscano',
      email: 'christian.toscano@gmail.com',
      role: 'user',
    };
  }
  throw new Error('Invalid token');
};
