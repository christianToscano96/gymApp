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
  // El rol siempre será 'user'
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [dni, setDni] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("efectivo");
  const [error, setError] = useState("");
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [paymentProofError, setPaymentProofError] = useState("");
  const [paymentProofPreview, setPaymentProofPreview] = useState<string | null>(
    null
  );
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [showSuccess, setShowSuccess] = useState(false);

  const [loading, setLoading] = useState(false);
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const handlePaymentProofChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentProofError("");
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Solo aceptar imágenes o PDF
      if (
        !file.type.match(/^image\/(jpeg|png|jpg|gif)$/) &&
        file.type !== "application/pdf"
      ) {
        setPaymentProofError("Solo se permiten imágenes o archivos PDF");
        setPaymentProof(null);
        setPaymentProofPreview(null);
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        setPaymentProofError("El archivo no debe superar los 5MB");
        setPaymentProof(null);
        setPaymentProofPreview(null);
        return;
      }
      setPaymentProof(file);
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          setPaymentProofPreview(ev.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else if (file.type === "application/pdf") {
        setPaymentProofPreview("pdf");
      } else {
        setPaymentProofPreview(null);
      }
    } else {
      setPaymentProof(null);
      setPaymentProofPreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !phone || !dni) {
      setError("Todos los campos son obligatorios");
      return;
    }
    if (dni.length !== 8) {
      setError("El DNI debe tener exactamente 8 caracteres");
      return;
    }
    if (paymentMethod === "transferencia" && !paymentProof) {
      setPaymentProofError("Debes subir el comprobante de pago");
      return;
    }
    setError("");
    setPaymentProofError("");
    setLoading(true);
    try {
      let status = "activo";
      if (paymentMethod === "efectivo" || paymentMethod === "transferencia") {
        status = "pendiente";
      }
      let response;
      if (paymentMethod === "transferencia" && paymentProof) {
        // Enviar como FormData si hay comprobante
        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("role", "user");
        formData.append("phone", phone);
        formData.append("paymentMethod", paymentMethod);
        formData.append("status", status);
        formData.append("dni", dni);
        formData.append("dueDate", "");
        formData.append("paymentProof", paymentProof);
        response = await fetch("http://localhost:5050/api/auth/register", {
          method: "POST",
          body: formData,
        });
      } else {
        response = await fetch("http://localhost:5050/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
            role: "user",
            phone,
            paymentMethod,
            status,
            dni,
            dueDate: "",
          }),
        });
      }
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
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", "user");
      queryClient.setQueryData(["user"], {
        name: data?.user?.name || name,
        email: data?.user?.email || email,
        role: "user",
        token: data.token,
        phone: data?.user?.phone || phone,
        status: data?.user?.status || status,
        paymentMethod: data?.user?.paymentMethod || paymentMethod,
      });

      setShowSuccess(true);
      setTimeout(() => {
        navigate("/user-preview", { replace: true });
      }, 2000);
      if (onRegister) {
        onRegister({ name, email, password, role: "user", status });
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
        <CardContent className="flex p-0 justify-center align-center">
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
                <Label htmlFor="dni">DNI</Label>
                <Input
                  id="dni"
                  type="text"
                  placeholder="Tu DNI"
                  required
                  value={dni}
                  onChange={(e) => setDni(e.target.value)}
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
                <Label>Método de pago</Label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="efectivo"
                      checked={paymentMethod === "efectivo"}
                      onChange={() => setPaymentMethod("efectivo")}
                    />
                    Efectivo
                  </label>
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="transferencia"
                      checked={paymentMethod === "transferencia"}
                      onChange={() => setPaymentMethod("transferencia")}
                    />
                    Transferencia
                  </label>
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="qr"
                      checked={paymentMethod === "qr"}
                      onChange={() => setPaymentMethod("qr")}
                    />
                    Pago con QR
                  </label>
                </div>
                {paymentMethod === "efectivo" && (
                  <div className="text-yellow-700 bg-yellow-100 border border-yellow-300 rounded px-3 py-2 mt-2 text-sm">
                    Con este método deberás dirigirte a la administración para
                    dar de alta el usuario
                  </div>
                )}
                {paymentMethod === "transferencia" && (
                  <div className="flex flex-col gap-2 mt-2">
                    <label className="text-sm font-medium">
                      Comprobante de pago (PDF o imagen)
                    </label>
                    <div className="flex items-center gap-3">
                      <label
                        htmlFor="paymentProof"
                        className="flex px-4 py-2 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700 transition-colors items-center gap-2"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l7.07-7.07a4 4 0 00-5.657-5.657l-7.07 7.07a6 6 0 108.485 8.485L19 13"
                          />
                        </svg>
                        Adjuntar archivo
                        <input
                          id="paymentProof"
                          type="file"
                          accept="image/*,application/pdf"
                          onChange={handlePaymentProofChange}
                          className="hidden"
                          multiple={false}
                        />
                      </label>

                      <span className="text-xs text-gray-400 ml-2">
                        (PDF o imagen, máx. 5MB)
                      </span>
                    </div>
                    {/* Vista previa del archivo */}
                    {paymentProofPreview && (
                      <div className="mt-2">
                        {paymentProofPreview === "pdf" ? (
                          <div className="flex items-center gap-2 text-blue-700">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4v16m8-8H4"
                              />
                            </svg>
                            <span className="text-xs">
                              Archivo PDF seleccionado
                            </span>
                          </div>
                        ) : (
                          <img
                            src={paymentProofPreview}
                            alt="Vista previa comprobante"
                            className="max-h-32 rounded border mt-1"
                          />
                        )}
                      </div>
                    )}
                    {paymentProofError && (
                      <div className="text-yellow-700 bg-yellow-100 border border-yellow-300 rounded px-3 py-2 text-sm">
                        {paymentProofError}
                      </div>
                    )}
                    <span className="text-xs text-gray-600">
                      {paymentProof
                        ? paymentProof.name
                        : "Ningún archivo seleccionado"}
                    </span>
                  </div>
                )}
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
