
// Hooks TanStack Query
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export interface Staff {
  _id?: string;
  name: string;
  email: string;
  password: string;
  role: string;
  avatar?: string;
  phone?: string;
  status?: string;
}
// API base
const API_URL = '/api/staff';

// Métodos fetch
export const fetchAllStaff = async (): Promise<Staff[]> => {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error('Error al obtener staff');
  return res.json();
};

export const fetchStaffById = async (id: string): Promise<Staff> => {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) throw new Error('Error al obtener staff');
  return res.json();
};

export const createStaff = async (staffData: Staff): Promise<Staff> => {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(staffData),
  });
  if (!res.ok) throw new Error('Error al crear staff');
  return res.json();
};

export const updateStaff = async (id: string, staffData: Staff): Promise<Staff> => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(staffData),
  });
  if (!res.ok) throw new Error('Error al modificar staff');
  return res.json();
};



export function useStaffList() {
  return useQuery({
    queryKey: ['staff'],
    queryFn: fetchAllStaff,
  });
}

export function useStaff(id: string) {
  return useQuery({
    queryKey: ['staff', id],
    queryFn: () => fetchStaffById(id),
    enabled: !!id,
  });
}

export function useCreateStaff() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createStaff,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
    },
  });
}

export function useUpdateStaff() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, staffData }: { id: string; staffData: Staff }) => updateStaff(id, staffData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
    },
  });
}


export const deleteStaff = async (id: string): Promise<void> => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Error al eliminar staff');
};

export function useDeleteStaff() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteStaff,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
    },
  });
}


