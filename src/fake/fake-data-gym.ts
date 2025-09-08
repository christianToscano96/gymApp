import { sleep } from "@/lib/sleep";
import type { AccessLogs, User,Payments } from "@/preview/interfaces/preview.interfaces"


export const mockUsers: User[] = [
  {
    id: "a1b2c3d4-0001-0000-0000-000000000001",
    name: "María González",
    email: "maria@email.com",
    phone: "+34 666 123 456",
    membership: "Premium",
    status: "Activo",
    lastVisit: "2024-01-15",
    joinDate: "2023-06-15",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
    dueDate: "2024-09-30",
    qrCode: "QR-MGZ-0001",
  role: "user",
    password: "password123"
  },
  {
    id: "a1b2c3d4-0002-0000-0000-000000000002",
    name: "Carlos Ruiz",
    email: "carlos@email.com",
    phone: "+34 666 789 012",
    membership: "Básico",
    status: "Activo",
    lastVisit: "2024-01-14",
    joinDate: "2023-08-20",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
    dueDate: "2024-10-15",
    qrCode: "QR-CRZ-0002",
  role: "user",
    password: "password123"
  },
  {
    id: "a1b2c3d4-0003-0000-0000-000000000003",
    name: "Ana López",
    email: "ana@email.com",
    phone: "+34 666 345 678",
    membership: "Premium",
    status: "Vencido",
    lastVisit: "2024-01-10",
    joinDate: "2023-03-10",
    avatar: "https://randomuser.me/api/portraits/women/3.jpg",
    dueDate: "2024-08-31",
    qrCode: "QR-ALZ-0003",
  role: "user",
    password: "password123"
  },
  {
    id: 'a1b2c3d4-0003-0000-0000-000000000005',
    name: "Pedro Martín",
    email: "pedro@email.com",
    phone: "+34 666 901 234",
    membership: "Básico",
    status: "Activo",
    lastVisit: "2024-01-15",
    joinDate: "2023-11-05",
    dueDate: "2024-12-01",
    qrCode: "QR-PMN-0005",
  role: "user",
    password: "password123"
  },
]
// Mock data
export const accessLogs: AccessLogs[] = [
  {
    id: '0003',
    user: "María González",
    timestamp: "10:30 AM",
    date: "2024-01-15",
    accessStatus: "Permitido",
    membership: "Premium",
  },
  {
    id: '0002',
    user: "Carlos Ruiz",
    timestamp: "10:15 AM",
    date: "2024-01-15",
    accessStatus: "Permitido",
    membership: "Básico",
  },
  {
    id: '0003',
    user: "Ana López",
    timestamp: "09:45 AM",
    date: "2024-01-15",
    accessStatus: "Denegado",
    membership: "Premium",
  },
  {
    id: '5',
    user: "Pedro Martín",
    timestamp: "09:30 AM",
    date: "2024-01-15",
    accessStatus: "Permitido",
    membership: "Básico",
  },
]





export const stats = {
    totalMembers: 1247,
    activeToday: 89,
    monthlyRevenue: 45680,
    membershipExpiring: 23,
  }

export const peakHoursData = [
  { name: "6:00-9:00", value: 20, color: "#60a5fa" }, // azul claro
  { name: "9:00-12:00", value: 13, color: "#34d399" }, // verde menta
  { name: "12:00-14:00", value: 18, color: "#fbbf24" }, // amarillo
  { name: "14:00-18:00", value: 17, color: "#f472b6" }, // rosa
  { name: "18:00-21:00", value: 25, color: "#6366f1" }, // violeta
  { name: "21:00-23:00", value: 7, color: "#f87171" }, // rojo coral
]


export const payments: Payments[] = [
  {
    id: 1,
    user: "María González",
    amount: 45,
    date: "2024-01-15",
    status: "Pagado",
    method: "Tarjeta",
    concept: "Mensualidad Enero",
    dueDate: "2024-01-31",
  },
  {
    id: 2,
    user: "Carlos Ruiz",
    amount: 35,
    date: "2024-01-14",
    status: "Pagado",
    method: "Efectivo",
    concept: "Mensualidad Enero",
    dueDate: "2024-01-31",
  },
  {
    id: 3,
    user: "Ana López",
    amount: 45,
    date: "2024-01-10",
    status: "Vencido",
    method: "Transferencia",
    concept: "Mensualidad Enero",
    dueDate: "2024-01-10",
  },
  {
    id: 4,
    user: "Pedro Martín",
    amount: 35,
    date: "2024-01-12",
    status: "Pendiente",
    method: "Tarjeta",
    concept: "Mensualidad Enero",
    dueDate: "2024-01-20",
  },
]


const fakeUser = {
  records: { "default": mockUsers } as Record<string, User[]>,
  getUser: (id: string) => {
    const all = Object.values(fakeUser.records).flat();
    return all.find((user) => user.id === id);
  },
  getUsers: () => {
    return Object.values(fakeUser.records);
  }
};

export const getUsers = async (): Promise<User[]> => {
  await sleep(500);
  return Object.values(fakeUser.records).flat();
};

export const getUser = async (id: string): Promise<User | undefined> => {
  await sleep(500);
  return fakeUser.getUser(id);
};