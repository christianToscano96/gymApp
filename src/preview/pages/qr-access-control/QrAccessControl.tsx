import { useEffect, useState } from "react";
import QrScanner from "@/preview/components/QrScanner";
import type { User } from "@/preview/interfaces/preview.interfaces";
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
import { QrCode, CheckCircle, XCircle, Search, Clock } from "lucide-react";
import Avatar from "@/components/ui/avatar";
import { fetchUsers } from "@/api/userService";
import { useLogUserAccess } from "@/api/accessLogService";
import { useAccessLogs } from "@/api/accessLogService";
import { fetchUserByQrCode } from "@/api/userService";
import { toast } from "sonner";

interface ScannedUser {
  name: string;
  status: string;
  lastPayment: string;
  photo: string;
}

const QrAccessControl = () => {
  const {
    data: accessLogs,
    isLoading: logsLoading,
    error: logsError,
    refetch: refetchAccessLogs,
  } = useAccessLogs();
  const logAccessMutation = useLogUserAccess();
  const [searchTerm, setSearchTerm] = useState("");
  const [scannedUser, setScannedUser] = useState<ScannedUser | null>(null);

  const [users, setUsers] = useState<User[]>([]);

  console.log(accessLogs);
  useEffect(() => {
    fetchUsers().then((data: User[]) => {
      const onlyUsers = data.filter(
        (user) => user.role !== "administrator" && user.role !== "staff"
      );
      setUsers(onlyUsers);
    });
  }, []);

  useEffect(() => {
    // Ya no se filtran logs aquí
  }, [searchTerm, users]);

  // El escaneo ahora se maneja en QrScanner
  const handleScan = async (decodedText: string) => {
    try {
      const user = await fetchUserByQrCode(decodedText);
      setScannedUser({
        name: user.name,
        status: user.status,
        lastPayment: user.dueDate,
        photo: user.avatar,
      });
      toast.success("Usuario encontrado");
    } catch {
      setScannedUser(null);
    }
  };

  const handleAccess = (allowed: boolean) => {
    if (scannedUser) {
      const status = allowed ? "permitido" : "denegado";
      const user = users.find((u) => u.name === scannedUser.name);
      if (user) {
        logAccessMutation.mutate(
          {
            userId: user._id,
            status,
            name: scannedUser.name,
            avatar: scannedUser.photo,
          },
          {
            onSuccess: () => {
              toast.success(
                `Acceso ${allowed ? "permitido" : "denegado"} guardado`
              );
              refetchAccessLogs(); // Actualiza la tabla de accesos
            },
            onError: () => {
              toast.error("Error al guardar el acceso");
            },
          }
        );
      }
      setScannedUser(null);
    }
  };
  return (
    <main className="w-full min-h-screen flex-1 bg-white sm:rounded-[20px] sm:shadow-[0_4px_16px_rgba(17,17,26,0.05),0_8px_32px_rgba(17,17,26,0.05)] pb-20">
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2 px-2 sm:px-0 pt-4">
        {/* QR Scanner */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              Lector QR
            </CardTitle>
            <CardDescription>Escanea el código QR del miembro</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!scannedUser && (
              <div className="flex flex-col items-center justify-center h-44 bg-muted rounded-lg border-2 border-dashed">
                <QrScanner onScan={handleScan} />
              </div>
            )}

            {scannedUser && (
              <Card className="border-primary">
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <Avatar src={scannedUser.photo} alt={scannedUser.name} />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">
                        {scannedUser.name}
                      </h3>
                      <p className="text-muted-foreground">
                        Membresía: {scannedUser.membership}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Último pago:{" "}
                        {new Date(scannedUser.lastPayment).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      onClick={() => {
                        handleAccess(true);
                        setScannedUser(null);
                        toast.success("Acceso permitido");
                      }}
                      className="flex-1 bg-primary hover:bg-primary/90"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Permitir Acceso
                    </Button>
                    <Button
                      onClick={() => handleAccess(false)}
                      variant="destructive"
                      className="flex-1"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Denegar Acceso
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>

        {/* Today's Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Estadísticas de Hoy
            </CardTitle>
            <CardDescription>Resumen de accesos del día</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total de Accesos
                  </p>
                  <p className="text-2xl font-bold text-primary">89</p>
                </div>
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>

              <div className="flex items-center justify-between p-4 bg-destructive/5 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Accesos Denegados
                  </p>
                  <p className="text-2xl font-bold text-destructive">3</p>
                </div>
                <XCircle className="h-8 w-8 text-destructive" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Hora Pico</p>
                  <p className="font-semibold">18:00 - 20:00</p>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Promedio/Hora</p>
                  <p className="font-semibold">7.4</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>{" "}
      {/* Access Logs */}
      <Card className="mt-6 px-2 sm:px-0">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Registro de Accesos</CardTitle>
              <CardDescription>Historial de entradas y salidas</CardDescription>
            </div>
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar usuario..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Hora</TableHead>
                  <TableHead>Fecha</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logsLoading && (
                  <TableRow>
                    <TableCell colSpan={4}>Cargando...</TableCell>
                  </TableRow>
                )}
                {logsError && (
                  <TableRow>
                    <TableCell colSpan={4}>Error al cargar accesos</TableCell>
                  </TableRow>
                )}
                {accessLogs &&
                  accessLogs.map(
                    (log: {
                      _id: string;
                      name?: string;
                      avatar?: string;
                      status: string;
                      timestamp: string;
                    }) => (
                      <TableRow key={log._id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar
                              src={log.avatar}
                              alt={log.name}
                            />
                            <span className="font-medium">
                              {log.name || "-"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge status={log.status}>{log.status}</Badge>
                        </TableCell>
                        <TableCell>
                          {log.timestamp
                            ? new Date(log.timestamp).toLocaleTimeString()
                            : "-"}
                        </TableCell>
                        <TableCell>
                          {log.timestamp
                            ? new Date(log.timestamp).toLocaleDateString()
                            : "-"}
                        </TableCell>
                      </TableRow>
                    )
                  )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default QrAccessControl;
