"use client";

import { useState, useEffect } from "react";
import { useAvatarResize } from "@/hook/useAvatarResize";
import { CheckCircle, LogOut, UserRoundCog, X, Pencil } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useUserStore } from "@/hook/useUserStore";
import { updateUser } from "@/api/userService";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, QrCode, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast, Toaster } from "sonner";

export default function UserPreviewPage() {
  const [isRenewing, setIsRenewing] = useState(false);
  const [viewProfile, setViewProfile] = useState(false);

  // Local state for editable fields
  const [editName, setEditName] = useState("");
  const [editDni, setEditDni] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const { avatar, setAvatar, handleAvatarChange } = useAvatarResize();

  const queryClient = useQueryClient();
  const user = useUserStore((state) => state.user);
  const logout = () => {
    queryClient.removeQueries({ queryKey: ["user"] });
    localStorage.clear();
    useUserStore.getState().logout();
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

  const isExpiringSoon = () => {
    if (!user || !user.dueDate) return false;
    const dueDate = new Date(user.dueDate);
    const today = new Date();
    const daysUntilExpiry = Math.ceil(
      (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  };

  const isMembershipExpired = () => {
    if (!user || !user.dueDate) return false;
    const dueDate = new Date(user.dueDate);
    const today = new Date();
    // Si la fecha de vencimiento es hoy o ya pasó
    return dueDate < today || dueDate.toDateString() === today.toDateString();
  };

  useEffect(() => {
    if (!user) {
      window.location.replace("/auth");
    } else {
      setEditName(user.name || "");
      setEditDni(user.dni || "");
      setEditEmail(user.email || "");
      setEditPhone(user.phone || "");
      setAvatar(user.avatar || "");
    }
    // eslint-disable-next-line
  }, [user]);

  const setUser = useUserStore((state) => state.setUser);

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);

    try {
      const updatedUser = {
        ...user,
        name: editName,
        dni: editDni,
        email: editEmail,
        phone: editPhone,
        avatar: avatar || user.avatar || "",
      };
      const res = await updateUser(user._id, updatedUser);
      setUser(res); // Actualiza el usuario logeado en el store
      setViewProfile(false);
      toast.success("Usuario actualizado correctamente");
    } catch (err) {
      toast.error("Error al actualizar usuario: " + (err as Error).message);
    } finally {
      setIsSaving(false);
    }
  };
  if (!user) {
    return null;
  }
  return (
    <div className="min-h-screen p-4 md:p-6">
      <Toaster position="top-center" richColors />
      <div className="mx-auto max-w-md space-y-4">
        {!viewProfile && (
          <div className="flex flex-col items-center gap-4 p-6 bg-white rounded-3xl border border-gray-200 backdrop-blur-sm relative">
            <div className="flex items-center w-full justify-center relative ml-10">
              <Avatar
                src={avatar || user.avatar || "/placeholder.svg"}
                alt={user.name}
                size="lg"
              />
              <button
                className="ml-2 bg-gray-100 hover:bg-gray-200 rounded-full p-2 shadow transition"
                onClick={() => setViewProfile(!viewProfile)}
                aria-label="Editar información personal"
                type="button"
                style={{ position: "static", transform: "none" }}
              >
                <Pencil className="h-5 w-5 text-gray-600" />
              </button>
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-1 flex items-center gap-2 text-center">
              {user.name}
            </h1>
            <div className="w-full flex flex-col items-center gap-2 justify-center">
              {isMembershipExpired() && (
                <Badge
                  status="destructive"
                  className="w-full ml-2 flex justify-center"
                >
                  Vencido
                </Badge>
              )}
              {user.status === "Activo" && !isMembershipExpired() && (
                <Badge
                  size="lg"
                  status="active"
                  className="w-full flex items-center justify-center gap-1"
                >
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-xs font-medium text-green-600">
                    Activo
                  </span>
                </Badge>
              )}
              {isExpiringSoon() && !isMembershipExpired() && (
                <Badge
                  status="destructive"
                  className="w-full flex justify-center"
                >
                  Próximo a vencer
                </Badge>
              )}
            </div>
          </div>
        )}

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
              <div className="flex flex-col items-center gap-2">
                <label className="block text-sm font-medium text-gray-700">
                  Avatar
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
                />
                {avatar && (
                  <img
                    src={avatar}
                    alt="Nuevo avatar"
                    className="w-20 h-20 rounded-full object-cover mt-2"
                  />
                )}
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <span className="h-4 w-4 text-muted-foreground font-bold">
                  👤
                </span>
                <div>
                  <p className="text-sm text-muted-foreground">Nombre</p>
                  <Input
                    type="text"
                    className="w-full block"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <span className="h-4 w-4 text-muted-foreground font-bold">
                  🆔
                </span>
                <div className="w-full">
                  <p className="text-sm text-muted-foreground">DNI</p>
                  <Input
                    type="text"
                    className="w-full block"
                    value={editDni}
                    onChange={(e) => setEditDni(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div className="w-full">
                  <p className="text-sm text-muted-foreground">Email</p>
                  <Input
                    type="email"
                    className="w-full block"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div className="w-full">
                  <p className="text-sm text-muted-foreground">Teléfono</p>
                  <Input
                    type="tel"
                    className="w-full block"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex justify-center w-full">
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="mt-2"
                  size="lg"
                >
                  {isSaving ? "Guardando..." : "Guardar cambios"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* QR Code for Access (solo si no está vencido) */}
        {!isMembershipExpired() && (
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
                  Presenta este código QR en la entrada del gimnasio para
                  acceder a las instalaciones
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Card de renovación solo si está vencido */}
        {isMembershipExpired() && (
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
        )}

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
