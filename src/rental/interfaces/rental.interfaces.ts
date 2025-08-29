export interface Tenant {
  id: string
  name: string
  apartment: string
  rent: number
  status: "paid" | "pending" | "expired"
  phone: string
  email: string
  dueDate: string
  avatar?: string,
}

export interface Apartment {
  id: string
  number: string
  address: string
  rent: number
  status: "occupied" | "vacant" | "maintenance"
  tenant?: string
  image?: string
  bedrooms?: number
  bathrooms?: number
  area?: number
}

export interface Staff {
  id: string
  name: string
  role: string
  phone: string
  email: string
  status: "active" | "inactive"
}

export type MenuItem = "tenants" | "apartments" | "staff"
