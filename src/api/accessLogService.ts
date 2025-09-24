import { useQuery } from '@tanstack/react-query';


const getToken = () => localStorage.getItem('token');

const fetchAccessLogs = async () => {
  const token = getToken();
  const res = await fetch('/api/access-logs', {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  });
  if (!res.ok) throw new Error('Error al obtener accesos');
  return res.json();
};

export const useAccessLogs = () => {
  return useQuery({
    queryKey: ['accessLogs'],
    queryFn: fetchAccessLogs,
  });
};
import { useMutation } from '@tanstack/react-query';

const postAccessLog = async (userId: string, status: 'permitido' | 'denegado', name: string, avatar: string) => {
  const token = getToken();
  const res = await fetch('/api/access-logs', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify({ userId, status, name, avatar }),
  });
  if (!res.ok) throw new Error('Error al guardar el acceso');
  return res.json();
};

export const useLogUserAccess = () => {
  return useMutation({
    mutationFn: ({ userId, status, name, avatar }: { userId: string; status: 'permitido' | 'denegado'; name: string; avatar: string }) =>
      postAccessLog(userId, status, name, avatar),
  });
};
