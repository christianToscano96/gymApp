import { useState } from "react";
import { useQuery as useQueryUsers } from "@tanstack/react-query";
import { fetchUsers } from "@/api/userService";
import type { User } from "@/preview/interfaces/preview.interfaces";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Plus,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  MoreHorizontal,
  Filter,
  Receipt,
} from "lucide-react";
import { fetchPayments } from "@/api/paymentService";
import type { Payments } from "@/preview/interfaces/preview.interfaces";
import { Avatar } from "@/components/ui/avatar";
import PaymentForm from "./PaymentForm";
import Modal from "@/components/ui/modal";

const PaymentManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const {
    data: payments = [],
    isLoading: loading,
    error,
  } = useQuery<Payments[], Error>({
    queryKey: ["payments"],
    queryFn: fetchPayments,
  });

  const [openModal, setOpenModal] = useState(false);

  const { data: users = [] } = useQueryUsers<User[], Error>({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });
  const today = new Date();
  const vencidos = users.filter(
    (u) => u.dueDate && new Date(u.dueDate) < today
  );

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.user?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.concept?.toLowerCase().includes(searchTerm.toLowerCase());
    let matchesStatus =
      statusFilter === "all" ||
      payment.status?.toLowerCase() === statusFilter.toLowerCase();
    if (statusFilter === "vencido") {
      const isVencido = vencidos.some((u) => u.name === payment.user);
      matchesStatus = isVencido;
    }
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = payments
    .filter((p) => p.status === "Pagado")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <main className="pb-20 w-full min-h-screen flex-1,0_8px_32px_rgba(17,17,26,0.05)]">
      {/* Payment Stats */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3 px-2 sm:px-0 pt-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ingresos del Mes
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              ${totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              +12% desde el mes pasado
            </p>
          </CardContent>
        </Card>
        <Card
          className="cursor-pointer hover:shadow-lg transition"
          onClick={() => setStatusFilter("pagado")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pagos Realizados
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {payments.filter((p) => p.status === "Pagado").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Total de pagos marcados como realizados
            </p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-lg transition"
          onClick={() => setStatusFilter("vencido")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pagos Vencidos
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {vencidos.length}
            </div>
            <p className="text-xs text-muted-foreground">
              {vencidos.length > 0
                ? "Haz click para ver usuarios"
                : "Sin vencidos"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros globales */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-start px-2 sm:px-0 pt-6 pb-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={
              statusFilter === "vencido"
                ? "Buscar usuario..."
                : "Buscar pagos..."
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center gap-2 bg-transparent"
            >
              <Filter className="h-4 w-4" />
              {statusFilter === "all"
                ? "Estado"
                : statusFilter === "pagado"
                ? "Pagados"
                : statusFilter === "vencido"
                ? "Vencidos"
                : "Estado"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setStatusFilter("all")}>Todos</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("pagado")}>Pagados</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("vencido")}>Vencidos</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {statusFilter === "vencido" ? (
        <Card className="mt-0 w-full mt-5">
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>Usuarios con Pagos Vencidos</CardTitle>
                <CardDescription>
                  Administra los usuarios con pagos vencidos
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md ">
              {vencidos.length === 0 ? (
                <div className="text-center py-8">No hay usuarios vencidos</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Usuario</TableHead>
                      <TableHead>Fecha Venc.</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vencidos
                      .filter((u) =>
                        u.name.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map((u) => (
                        <TableRow key={u._id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <Avatar alt={u.name} src={u.avatar} />
                              <span className="font-medium">{u.name}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-destructive">
                            {u.dueDate ? u.dueDate.slice(0, 10) : "-"}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => {
                                setSelectedUserId(u._id);
                                setOpenModal(true);
                              }}
                            >
                              Actualizar
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              )}
            </div>
            {openModal && selectedUserId && (
              <Modal
                isOpen={openModal}
                onClose={() => {
                  setOpenModal(false);
                  setSelectedUserId(null);
                }}
                title="Actualizar Pago"
              >
                <PaymentForm
                  setOpenModal={setOpenModal}
                  openModal={openModal}
                  userId={selectedUserId}
                />
              </Modal>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="mt-6 w-full">
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>Gestión de Pagos</CardTitle>
                <CardDescription>
                  Administra los pagos y transacciones
                </CardDescription>
              </div>

              <Button
                className="flex items-center gap-2"
                onClick={() => {
                  setOpenModal(true);
                  setSelectedUserId(null);
                }}
              >
                <Plus className="h-4 w-4" />
                Registrar Pago
              </Button>
              {openModal && !selectedUserId && (
                <Modal
                  isOpen={openModal}
                  onClose={() => setOpenModal(false)}
                  title="Registrar Pago"
                >
                  <PaymentForm
                    setOpenModal={setOpenModal}
                    openModal={openModal}
                  />
                </Modal>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {/* Payments Table */}
            <div className="rounded-md ">
              {loading ? (
                <div className="text-center py-8">Cargando pagos...</div>
              ) : error ? (
                <div className="text-center text-red-500 py-8">
                  {error.message}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Usuario</TableHead>
                      <TableHead>Concepto</TableHead>
                      <TableHead>Monto</TableHead>
                      <TableHead>Método</TableHead>
                      <TableHead>Fecha Venc.</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center">
                          No hay pagos para mostrar
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPayments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <Avatar alt={payment?.user} />
                              <span className="font-medium">
                                {payment.user}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>{payment.concept}</TableCell>
                          <TableCell className="font-medium">
                            ${payment.amount}
                          </TableCell>
                          <TableCell>{payment.method}</TableCell>
                          <TableCell>
                            {payment.dueDate
                              ? new Date(payment.dueDate).toLocaleDateString()
                              : "-"}
                          </TableCell>
                          <TableCell>
                            <Badge status={payment.status}>
                              {payment.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem className="flex items-center gap-2">
                                  <Receipt className="h-4 w-4" />
                                  Ver Recibo
                                </DropdownMenuItem>
                                {payment.status !== "Pagado" && (
                                  <DropdownMenuItem className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4" />
                                    Marcar como Pagado
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </main>
  );
};

export default PaymentManagement;
