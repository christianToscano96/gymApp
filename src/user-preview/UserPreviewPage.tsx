"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CalendarDays,
  Mail,
  Phone,
  QrCode,
  RefreshCw,
  User,
} from "lucide-react";
import { mockUserData } from "@/fake/fake-data-user-profile";

export default function UserPreviewPage() {
  const [isRenewing, setIsRenewing] = useState(false);
  const { logout } = useUser();

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
    const dueDate = new Date(mockUserData.dueDate);
    const today = new Date();
    const daysUntilExpiry = Math.ceil(
      (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysUntilExpiry <= 30;
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="mx-auto max-w-md space-y-6">
        {/* Header with Avatar and Name */}
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <Avatar
                src={mockUserData.avatar || "/placeholder.svg"}
                alt={mockUserData.name}
              />
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  {mockUserData.name}
                </h1>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <Badge
                    status={
                      mockUserData.membershipStatus === "active"
                        ? "default"
                        : "secondary"
                    }
                    className="bg-primary text-primary-foreground"
                  >
                    {mockUserData.membershipType}
                  </Badge>
                  {isExpiringSoon() && (
                    <Badge status="destructive" className="animate-pulse">
                      Próximo a vencer
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-5 w-5 text-primary" />
              Información Personal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium text-foreground">
                  {mockUserData.email}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Teléfono</p>
                <p className="font-medium text-foreground">
                  {mockUserData.phone}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">
                  Fecha de ingreso
                </p>
                <p className="font-medium text-foreground">
                  {formatDate(mockUserData.joinDate)}
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
                  {formatDate(mockUserData.dueDate)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

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
                <img
                  src={`/qr-code-for-gym-access-.png?height=200&width=200&query=QR code for gym access ${mockUserData.qrCode}`}
                  alt="QR Code de acceso al gimnasio"
                  className="h-48 w-48"
                />
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Código de miembro
                </p>
                <p className="font-mono text-sm font-medium text-foreground bg-muted px-2 py-1 rounded">
                  {mockUserData.qrCode}
                </p>
              </div>
              <p className="text-xs text-muted-foreground text-center max-w-sm">
                Presenta este código QR en la entrada del gimnasio para acceder
                a las instalaciones
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Renewal Button */}
        <Card className="border-primary/20">
          <CardContent className="pt-6 space-y-4">
            <Button
              onClick={handleRenewMembership}
              disabled={isRenewing}
              className="w-full h-12 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isRenewing ? (
                <>
                  <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                  Procesando...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-5 w-5" />
                  Renovar Membresía
                </>
              )}
            </Button>
            <Button
              onClick={logout}
              variant="destructive"
              className="w-full h-12 text-lg font-semibold flex items-center justify-center gap-2"
            >
              <LogOut className="mr-2 h-5 w-5" />
              Cerrar sesión
            </Button>
            <p className="text-xs text-muted-foreground text-center mt-3">
              Renueva tu membresía para continuar disfrutando de todos los
              beneficios
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
