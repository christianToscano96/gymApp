// React
import { useEffect, useState } from "react";
import type { AccessLogs, User } from "@/preview/interfaces/preview.interfaces";
import ZxingQrScanner from "@/preview/components/ZxingQrScanner";
import Avatar from "@/components/ui/avatar";
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
import { fetchUsers, fetchUserByQrCode } from "@/api/userService";
import { useLogUserAccess, useAccessLogs } from "@/api/accessLogService";
import { toast } from "sonner";

interface ScannedUser {
  name: string;
  status: string;
  lastPayment: string;
  photo: string;
}

const QrAccessControl = () => {
  const [showScanner, setShowScanner] = useState(true);
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

  useEffect(() => {
    fetchUsers().then((data: User[]) => {
      const onlyUsers = data.filter(
        (user) => user.role !== "administrator" && user.role !== "staff"
      );
      setUsers(onlyUsers);
    });
  }, []);

  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = today.getMonth() + 1;
  const dd = today.getDate();

  const filteredAccessLogs = Array.isArray(accessLogs)
    ? accessLogs.filter((log) => {
        const logDate = new Date(log.timestamp || log.date);
        const isToday =
          logDate.getFullYear() === yyyy &&
          logDate.getMonth() + 1 === mm &&
          logDate.getDate() === dd;
        const matchesSearch =
          log.name && log.name.toLowerCase().includes(searchTerm.toLowerCase());
        return isToday && matchesSearch;
      })
    : [];

  const handleScan = async (decodedText: string) => {
    try {
      const user = await fetchUserByQrCode(decodedText);
      setScannedUser({
        name: user.name,
        status: user.status,
        lastPayment: user.dueDate,
        photo: user.avatar,
      });
      setShowScanner(false);
      toast.success("Usuario encontrado");
    } catch {
      setScannedUser(null);
      setShowScanner(true);
      toast.error("El código QR no existe o el usuario no fue encontrado.");
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
              refetchAccessLogs();
              setTimeout(() => {
                setScannedUser(null);
                setShowScanner(true);
              }, 1000);
            },
            onError: () => {
              toast.error("Error al guardar el acceso");
              setTimeout(() => {
                setScannedUser(null);
                setShowScanner(true);
              }, 1000);
            },
          }
        );
      } else {
        setTimeout(() => {
          setScannedUser(null);
          setShowScanner(true);
        }, 1000);
      }
    }
  };
  const logsToday = Array.isArray(accessLogs)
    ? (accessLogs as AccessLogs[]).filter((log) => {
        const logDate = new Date(log.timestamp || log.date);
        return (
          logDate.getFullYear() === yyyy &&
          logDate.getMonth() + 1 === mm &&
          logDate.getDate() === dd
        );
      })
    : [];

  const totalAccess = logsToday.filter(
    (log) => log.status?.toLowerCase() === "permitido"
  ).length;
  const deniedAccess = logsToday.filter(
    (log) => log.status?.toLowerCase() === "denegado"
  ).length;

  const hourCounts: Record<string, number> = {};
  logsToday.forEach((log) => {
    const hour = new Date(log.timestamp || log.date).getHours();
    hourCounts[hour] = (hourCounts[hour] || 0) + 1;
  });
  const peakHour = Object.entries(hourCounts).sort((a, b) => b[1] - a[1])[0];
  const peakHourStr = peakHour
    ? `${String(peakHour[0]).padStart(2, "0")}:00 - ${String(
        Number(peakHour[0]) + 1
      ).padStart(2, "0")}:00`
    : "--";

  const hoursWithAccess = Object.keys(hourCounts).length || 1;
  const avgPerHour = logsToday.length / hoursWithAccess;

  return (
    <main className="w-full min-h-screen bg-white flex flex-col pb-24 px-0 sm:px-4">
      <div className="flex flex-col gap-4 pt-4 lg:grid lg:grid-cols-2 lg:px-0">
        {/* QR Scanner */}
        <Card className="shadow-sm rounded-none sm:rounded-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <QrCode className="h-6 w-6 sm:h-5 sm:w-5" />
              Lector QR
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Escanea el código QR del miembro
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 px-2 sm:px-6">
            {showScanner && !scannedUser && (
              <div className="flex flex-col items-center justify-center min-h-44 bg-muted rounded-xl border-2 border-dashed p-3 w-full">
                <ZxingQrScanner
                  onScan={handleScan}
                  stopScanning={!showScanner}
                  videoStyle={{
                    width: "100%",
                    borderRadius: 16,
                    maxHeight: 220,
                  }}
                />
              </div>
            )}

            {scannedUser && (
              <Card className="border-primary bg-white shadow-md">
                <CardContent className="pt-4 pb-2">
                  <div className="flex flex-col items-center gap-2 mb-4">
                    <Avatar
                      src={scannedUser.photo}
                      alt={scannedUser.name}
                      className="w-20 h-20 border-2 border-primary"
                    />
                    <h3 className="font-semibold text-lg text-center">
                      {scannedUser.name}
                    </h3>
                    <div className="flex flex-col items-center gap-1 mt-1">
                      <p className="text-xs text-muted-foreground">
                        Último pago:{" "}
                        {new Date(scannedUser.lastPayment).toLocaleDateString()}
                      </p>
                      <Badge
                        status={scannedUser.status}
                        className="text-xs px-2 py-1"
                      >
                        {scannedUser.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 mt-2">
                    <Button
                      onClick={() => {
                        handleAccess(true);
                        toast.success("Acceso permitido");
                      }}
                      className="w-full py-4 text-base rounded-xl"
                    >
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Permitir Acceso
                    </Button>
                    <Button
                      onClick={() => handleAccess(false)}
                      variant="destructive"
                      className="w-full py-4 text-base rounded-xl"
                    >
                      <XCircle className="h-5 w-5 mr-2" />
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
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Clock className="h-6 w-6 sm:h-5 sm:w-5" />
              Estadísticas de Hoy
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Resumen de accesos del día
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-2 sm:p-4 bg-primary/5 rounded-lg">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Total de Accesos
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-primary">
                    {logsLoading ? "..." : totalAccess}
                  </p>
                </div>
                <CheckCircle className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
              </div>
              <div className="flex items-center justify-between p-2 sm:p-4 bg-destructive/5 rounded-lg">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Accesos Denegados
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-destructive">
                    {logsLoading ? "..." : deniedAccess}
                  </p>
                </div>
                <XCircle className="h-7 w-7 sm:h-8 sm:w-8 text-destructive" />
              </div>
              <div className="grid grid-cols-2 gap-2 sm:gap-4">
                <div className="text-center p-2 sm:p-3 bg-muted rounded-lg">
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Hora Pico
                  </p>
                  <p className="font-semibold text-sm sm:text-base">
                    {logsLoading ? "..." : peakHourStr}
                  </p>
                </div>
                <div className="text-center p-2 sm:p-3 bg-muted rounded-lg">
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Promedio/Hora
                  </p>
                  <p className="font-semibold text-sm sm:text-base">
                    {logsLoading ? "..." : avgPerHour.toFixed(1)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Access Logs */}
      <Card className="mt-6 px-0 sm:px-0 shadow-sm rounded-none sm:rounded-xl">
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-base sm:text-lg">
                Registro de Accesos
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Historial de entradas y salidas
              </CardDescription>
            </div>
            <div className="relative w-full sm:max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar usuario..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-base py-2 w-full"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-2 sm:px-6">
          <div className="rounded-md overflow-x-auto">
            <Table className="min-w-[340px] sm:min-w-0 text-xs">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs sm:text-sm">Usuario</TableHead>
                  <TableHead className="text-xs sm:text-sm">Estado</TableHead>
                  <TableHead className="text-xs sm:text-sm">Hora</TableHead>
                  <TableHead className="text-xs sm:text-sm">Fecha</TableHead>
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
                {filteredAccessLogs.length === 0 &&
                  !logsLoading &&
                  !logsError && (
                    <TableRow>
                      <TableCell colSpan={4}>
                        No se encontraron resultados
                      </TableCell>
                    </TableRow>
                  )}
                {filteredAccessLogs
                  .sort((a, b) => {
                    const dateA = new Date(a.timestamp || a.date).getTime();
                    const dateB = new Date(b.timestamp || b.date).getTime();
                    return dateB - dateA;
                  })
                  .map(
                    (log: {
                      _id: string;
                      name?: string;
                      avatar?: string;
                      status: string;
                      timestamp: string;
                    }) => (
                      <TableRow key={log._id}>
                        <TableCell className="pl-2 sm:pl-4">
                          <div className="flex items-center gap-2 sm:space-x-3">
                            <Avatar
                              src={log.avatar}
                              alt={log.name}
                              className="w-8 h-8"
                            />
                            <span className="font-medium text-xs sm:text-sm">
                              {log.name || "-"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="flex">
                          <Badge
                            status={log.status}
                            className="text-xs sm:text-sm"
                          >
                            {log.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm">
                          {log.timestamp
                            ? new Date(log.timestamp).toLocaleTimeString()
                            : "-"}
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm">
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
