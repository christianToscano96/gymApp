import { useQuery } from '@tanstack/react-query';

const fetchAccessLogs = async () => {
  const res = await fetch('/api/access-logs');
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
  const res = await fetch('/api/access-logs', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
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
