"use client";

import { useState } from "react";
import { CheckCircle, LogOut, UserRoundCog, X } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { User } from "../preview/interfaces/preview.interfaces";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Mail, Phone, QrCode, RefreshCw } from "lucide-react";

export default function UserPreviewPage() {
  const [isRenewing, setIsRenewing] = useState(false);
  const [viewProfile, setViewProfile] = useState(false);

  const queryClient = useQueryClient();
  const user = queryClient.getQueryData(["user"]) as User | undefined;
  const logout = () => {
    queryClient.removeQueries({ queryKey: ["user"] });
    localStorage.clear();
    window.location.href = "/auth";
  };

  const handleRenewMembership = async () => {
    setIsRenewing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsRenewing(false);
    // In a real app, you would handle the renewal logic here
    alert("¡Membresía renovada exitosamente!");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const isExpiringSoon = () => {
    if (!user || !user.dueDate) return false;
    const dueDate = new Date(user.dueDate);
    const today = new Date();
    const daysUntilExpiry = Math.ceil(
      (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysUntilExpiry <= 30;
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="text-lg">No hay datos de usuario disponibles.</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="mx-auto max-w-md space-y-4">
        {/* Header with Avatar and Name */}
        <div className="flex items-center gap-4 p-6 bg-white rounded-3xl border border-gray-200  backdrop-blur-sm">
          <Avatar
            src={user.avatar || "/placeholder.svg"}
            alt={user.name}
            onClick={() => setViewProfile(!viewProfile)}
          />

          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900 mb-1">
              {user.name}
            </h1>
            <div className="flex items-center gap-2">
              {user.status === "activo" && (
                <Badge
                  size="lg"
                  status="active"
                  className="flex items-center gap-1"
                >
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-xs font-medium text-green-600">
                    Activo
                  </span>
                </Badge>
              )}
              {isExpiringSoon() && (
                <Badge status="destructive">Próximo a vencer</Badge>
              )}
            </div>
          </div>
        </div>
        {viewProfile && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <UserRoundCog className="h-5 w-5 text-primary" />
                Información Personal
                <div className="ml-auto cursor-pointer hover:text-red-500 justify-end">
                  <X onClick={() => setViewProfile(false)} />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium text-foreground">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Teléfono</p>
                  <p className="font-medium text-foreground">{user.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Fecha de ingreso
                  </p>
                  <p className="font-medium text-foreground">
                    {user.joinDate ? formatDate(user.joinDate) : "-"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Vencimiento</p>
                  <p
                    className={`font-medium ${
                      isExpiringSoon() ? "text-destructive" : "text-foreground"
                    }`}
                  >
                    {user.dueDate ? formatDate(user.dueDate) : "-"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* QR Code for Access */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <QrCode className="h-5 w-5 text-primary" />
              Código de Acceso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center space-y-4">
              <div className="p-4 bg-white rounded-xl border-2 border-border shadow-sm">
                {user.qrImage ? (
                  <img
                    src={user.qrImage}
                    alt="QR Code de acceso al gimnasio"
                    className="h-48 w-48"
                  />
                ) : (
                  <span className="text-muted-foreground">No disponible</span>
                )}
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Código de miembro
                </p>
                <p className="font-mono text-sm font-medium text-foreground bg-muted px-2 py-1 rounded">
                  {user.qrCode || "-"}
                </p>
              </div>
              <p className="text-xs text-muted-foreground text-center max-w-sm">
                Presenta este código QR en la entrada del gimnasio para acceder
                a las instalaciones
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-4 border-black shadow-2xl bg-gradient-to-br from-black via-gray-900 to-black rounded-3xl overflow-hidden">
          <CardContent className="pt-8 pb-8">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-black text-white mb-3">
                ¿Listo para continuar?
              </h3>
              <p className="text-gray-300 font-semibold text-lg">
                Renueva tu membresía y mantén el acceso
              </p>
            </div>

            <Button
              onClick={handleRenewMembership}
              disabled={isRenewing}
              className="w-full h-16 text-sm font-black bg-gradient-to-r from-white to-gray-100 text-black hover:from-gray-100 hover:to-white shadow-2xl transform transition-all duration-300 hover:scale-[1.02] hover:shadow-3xl rounded-2xl border-2 border-white/20"
            >
              {isRenewing ? (
                <>
                  <RefreshCw className="mr-3 h-6 w-6 animate-spin" />
                  PROCESANDO RENOVACIÓN...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-3 h-6 w-6" />
                  🚀 RENOVAR MEMBRESÍA AHORA
                </>
              )}
            </Button>
            <p className="text-xs text-muted-foreground text-center mt-4">
              Renueva tu membresía para continuar disfrutando de todos los
              beneficios
            </p>
          </CardContent>
        </Card>

        {/* Renewal Button */}
        <div className="border-primary/20 mt-4 mb-6">
          <Button
            onClick={logout}
            variant="destructive"
            className="w-full h-12 text-lg font-semibold flex items-center justify-center gap-2"
          >
            <LogOut className="mr-2 h-5 w-5" />
            Cerrar sesión
          </Button>
        </div>
      </div>
    </div>
  );
}
