import { useState } from "react";
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
  QrCode,
  CheckCircle,
  XCircle,
  Search,
  Camera,
  Clock,
} from "lucide-react";
import Avatar from "@/components/ui/avatar";
import { accessLogs } from "@/fake/fake-data-gym";

const QrAccessControl = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [scannedUser, setScannedUser] = useState<any>(null);

  const filteredLogs = accessLogs.filter((log) =>
    log.user.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const simulateQRScan = () => {
    // Simulate scanning a QR code
    const mockUser = {
      name: "María González",
      membership: "Premium",
      status: "Activo",
      lastPayment: "2024-01-01",
      photo: "/portrait-thoughtful-woman.png",
    };
    setScannedUser(mockUser);
  };

  const handleAccess = (allowed: boolean) => {
    if (scannedUser) {
      // Here you would typically save the access log
      console.log(
        `Access ${allowed ? "granted" : "denied"} for ${scannedUser.name}`
      );
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
            <div className="flex items-center justify-center h-48 bg-muted rounded-lg border-2 border-dashed">
              <div className="text-center">
                <Camera className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">
                  Coloca el código QR frente a la cámara
                </p>
                <Button
                  onClick={simulateQRScan}
                  className="flex items-center justify-center gap-2"
                  size="lg"
                >
                  <QrCode className="h-4 w-4" />
                  Simular Escaneo
                </Button>
              </div>
            </div>

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
                      onClick={() => handleAccess(true)}
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
                  <TableHead>Membresía</TableHead>
                  <TableHead>Hora</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar src={log.avatar} alt={log.user} />
                        <span className="font-medium">{log.user}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge status={log.membership}>{log.membership}</Badge>
                    </TableCell>
                    <TableCell>{log.timestamp}</TableCell>
                    <TableCell>
                      {new Date(log.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {" "}
                      <Badge status={log.accessStatus}>
                        {log.accessStatus}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default QrAccessControl;
