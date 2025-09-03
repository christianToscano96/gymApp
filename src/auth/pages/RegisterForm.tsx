import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SuccessAlert } from "@/components/ui/success-alert";
import placeholderImage from "@/assets/placeholder.svg";

interface RegisterFormProps {
  onRegister?: (data: {
    name: string;
    email: string;
    password: string;
    role: string;
    status: string;
  }) => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegister }) => {
  // Asegura que el rol sea 'user' si el checkbox no está seleccionado
  const handleRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRole(e.target.checked ? "administrator" : "user");
  };
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [showSuccess, setShowSuccess] = useState(false);

  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !phone) {
      setError("Todos los campos son obligatorios");
      return;
    }
    setError("");
    setLoading(true);
    try {
      // Asegura que el rol siempre se envíe en minúsculas
      const safeRole = role.toLowerCase();
      const response = await fetch("http://localhost:5050/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, role: safeRole, phone, status: "activo" }),
      });
      if (!response.ok) {
        let errorMsg = "Error al registrar";
        try {
          const errorData = await response.json();
          errorMsg = errorData.error || errorData.message || errorMsg;
        } catch {
          // Si la respuesta no es JSON, mantener el mensaje genérico
        }
        throw new Error(errorMsg);
      }
      const data = await response.json();
      // Si la respuesta no contiene usuario o rol, igual redirecciona según el rol enviado
      const userRole = data?.user?.role || role;
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", userRole);
      queryClient.setQueryData(["user"], {
        name: data?.user?.name || name,
        email: data?.user?.email || email,
        role: userRole,
        token: data.token,
        phone: data?.user?.phone || phone,
        status: data?.user?.status || "activo",
      });

      setShowSuccess(true);
      setTimeout(() => {
        if (userRole === "administrator") {
          navigate("/preview", { replace: true });
        } else {
          navigate("/user-preview", { replace: true });
        }
      }, 2000);
      if (onRegister) {
  onRegister({ name, email, password, role: userRole, status: "activo" });
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "Error al registrar");
      } else {
        setError("Error al registrar");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6")}>
      {showSuccess && (
        <SuccessAlert
          description="usuario creado correctamente"
          onClose={() => setShowSuccess(false)}
        />
      )}
      <Card className="overflow-hidden p-0 w-full max-w-3xl shadow-lg">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Crea tu cuenta</h1>
                <p className="text-balance text-muted-foreground">
                  Regístrate para acceder a GymApp
                </p>
              </div>
              {error && (
                <SuccessAlert
                  description={error}
                  onClose={() => setError("")}
                  variant="destructive"
                />
              )}
              <div className="grid gap-2">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Tu nombre"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="ejemplo@email.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Contraseña"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  type="text"
                  placeholder="Tu teléfono"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={role === "administrator"}
                    onChange={handleRoleChange}
                  />
                  Registrarse como administrador
                </label>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Registrando..." : "Registrarse"}
              </Button>
              <div className="text-center text-sm">
                ¿Ya tienes una cuenta?{" "}
                <Link to="/auth" className="underline underline-offset-4">
                  Inicia sesión
                </Link>
              </div>
            </div>
          </form>
          <div className="relative hidden bg-muted md:block">
            <img
              src={placeholderImage}
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        Al registrarte, aceptas nuestros <a href="#">Términos de Servicio</a> y{" "}
        <a href="#">Política de Privacidad</a>.
      </div>
    </div>
  );
};

export default RegisterForm;
