import { sleep } from "@/lib/sleep";
import type { Apartment, Staff, Tenant } from "@/rental/interfaces/rental.interfaces"





export const mockTenants: Tenant[] = [
  {
  id: "b7e2c1a4-8f2e-4c1a-9e2a-1f2e3c4b5a6d",
    name: "María González",
    apartment: "Apt 101",
    rent: 1200,
    status: "paid",
    phone: "+1 234-567-8901",
    email: "maria@email.com",
    dueDate: "2024-01-01",
    avatar: "https://static.vecteezy.com/system/resources/thumbnails/027/951/137/small_2x/stylish-spectacles-guy-3d-avatar-character-illustrations-png.png"
  },
  {
  id: "c3d4e5f6-7a8b-4c9d-8e7f-6a5b4c3d2e1f",
    name: "Carlos Rodríguez",
    apartment: "Apt 205",
    rent: 1500,
    status: "pending",
    phone: "+1 234-567-8902",
    email: "carlos@email.com",
    dueDate: "2024-01-05",
  },
  {
  id: "e1f2a3b4-c5d6-4e7f-8a9b-0c1d2e3f4a5b",
    name: "Ana Martínez",
    apartment: "Apt 302",
    rent: 1800,
    status: "expired",
    phone: "+1 234-567-8903",
    email: "ana@email.com",
    dueDate: "2023-12-28",
  },
  {
  id: "f6e5d4c3-b2a1-4c5d-8e7f-9a0b1c2d3e4f",
    name: "Luis Fernández",
    apartment: "Apt 404",
    rent: 2000,
    status: "paid",
    phone: "+1 234-567-8905",
    email: "luis@email.com",
    dueDate: "2024-02-01",
  },
  {
  id: "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
    name: "Sofía Ramírez",
    apartment: "Apt 505",
    rent: 1700,
    status: "pending",
    phone: "+1 234-567-8906",
    email: "sofia@email.com",
    dueDate: "2024-02-10",
  },
  {
  id: "d4c3b2a1-f6e5-4d7c-8b9a-0f1e2d3c4b5a",
    name: "Miguel Torres",
    apartment: "Apt 606",
    rent: 2100,
    status: "expired",
    phone: "+1 234-567-8907",
    email: "miguel@email.com",
    dueDate: "2024-01-20",
  },
]
 const mockApartments: Apartment[] = [
  {
    id: "b7e2c1a4-8f2e-4c1a-9e2a-1f2e3c4b5a6d",
    number: "Apt 101",
    address: "123 Main St",
    rent: 1200,
    status: "occupied",
    tenant: "María González",
    image: "https://img.freepik.com/free-photo/cozy-living-room-modern-apartment_181624-60384.jpg",
    bedrooms: 2,
    bathrooms: 1,
    area: 85,
  },
  {
    id: "c3d4e5f6-7a8b-4c9d-8e7f-6a5b4c3d2e1f",
    number: "Apt 205",
    address: "123 Main St",
    rent: 1500,
    status: "occupied",
    tenant: "Carlos Rodríguez",
    image: "https://cdn.theblueground.com/website/static/img/hero-img.ce764c5892d231d9f1c8.jpg",
    bedrooms: 2,
    bathrooms: 2,
    area: 95,
  },
  {
    id: "e1f2a3b4-c5d6-4e7f-8a9b-0c1d2e3f4a5b",
    number: "Apt 302",
    address: "123 Main St",
    rent: 1800,
    status: "occupied",
    tenant: "Ana Martínez",
    image: "https://www.shutterstock.com/image-photo/interior-living-room-green-houseplants-600nw-2290526749.jpg",
    bedrooms: 3,
    bathrooms: 2,
    area: 120,
  },
  {
    id: "f6e5d4c3-b2a1-4c5d-8e7f-9a0b1c2d3e4f",
    number: "Apt 404",
    address: "123 Main St",
    rent: 2000,
    status: "vacant",
    tenant: "Cris Tompson",
    image: "https://media.istockphoto.com/id/1365649825/photo/stylish-micro-apartment-for-one.jpg?s=612x612&w=0&k=20&c=B84a7PkFLhZGTG0GPDOxBs2yDjBvy2NHaqZw5_Vp878=",
    bedrooms: 3,
    bathrooms: 2,
    area: 130,
  },
]

export const mockStaff: Staff[] = [
  {
    id: "1",
    name: "Juan Pérez",
    role: "Administrador",
    phone: "+1 234-567-8904",
    email: "juan@company.com",
    status: "active",
  },
  {
    id: "2",
    name: "Laura Silva",
    role: "Mantenimiento",
    phone: "+1 234-567-8905",
    email: "laura@company.com",
    status: "active",
  },
  {
    id: "3",
    name: "Roberto López",
    role: "Seguridad",
    phone: "+1 234-567-8906",
    email: "roberto@company.com",
    status: "inactive",
  },
]

 const fakeDepartments =  {
  records: {  "default": mockApartments } as Record<string, Apartment[]>,
  getDepartment: (id: string) => {
  const all = Object.values(fakeDepartments.records).flat();
  return all.find((apartment) => apartment.id === id);
},
  getDepartments: () => {
    return Object.values(fakeDepartments.records);
  }
};

export const getDepartments = async (): Promise<Apartment[]> => {
  await sleep(500);
  return Object.values(fakeDepartments.records).flat();
};

export const getDepartment = async (id: string): Promise<Apartment | undefined> => {
  await sleep(500);
  return fakeDepartments.getDepartment(id);
};