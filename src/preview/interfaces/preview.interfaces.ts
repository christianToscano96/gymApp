export interface User {
  _id: string
  name: string
  phone: string
  email: string
  status: "Activo" | "Vencido" | "Pendiente"
  lastVisit: string
  avatar?: string
  joinDate: string,
  dueDate: string,
  qrCode: string,
  qrImage?: string,
  role: string,
  password: string,
  dni: string,
  paymentMethod?: string,
  amount?: number
}

export interface AccessLogs  {
  id: string,
  user: string,
  timestamp: string,
  status: "permitido" | "denegado",
  date: string,
  membership: "Básico" | "Premium"
}


export interface Payments {
  id: number,
  user: string,
  amount: number,
  date: string,
  status: "Pagado" | "Pendiente" | "Vencido",
  method: "Tarjeta" | "Efectivo" | "Transferencia",
  concept: string,
  dueDate: string,
}
export interface Staff {
  id: string
  name: string
  role: string
  phone: string
  email: string
  status: "active" | "inactive"
  avatar?: string
}

