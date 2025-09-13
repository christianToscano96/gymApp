import React from "react";
import { useNavigate } from "react-router";
import { ChevronLeftIcon } from "lucide-react";
import { useCurrentUser } from "@/hook/useCurrentUser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAvatarResize } from "@/hook/useAvatarResize";
import Badge from "@/components/ui/badge";

interface ProfilePreviewProps {
  id: string;
}

const ProfilePreview: React.FC<ProfilePreviewProps> = ({ id }) => {
  const { data: user } = useCurrentUser();

  // Formatear fechas si existen y son válidas
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString("es-MX", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  const { setAvatar, handleAvatarChange } = useAvatarResize();

  const { avatar, status, name, email, phone, role, lastVisit } = user || {
    status: "",
    name: "",
    email: "",
    phone: "",
    role: "",
  };

  const navigate = useNavigate();
  if (!user) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-screen">
      <div className="w-full max-w-lg mx-auto">
        <Button
          variant="link"
          className="self-start mb-4 flex items-center gap-2 text-gray-600 hover:text-blue-600 transition"
          onClick={() => navigate("/preview/users")}
          aria-label="Volver a usuarios"
        >
          <ChevronLeftIcon className="w-6 h-6" />
          <span>Volver</span>
        </Button>
      </div>
      <form className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-lg flex flex-col items-center border border-gray-200">
        <div className="flex flex-col items-center">
          <label htmlFor="avatar" className="cursor-pointer">
            <div className="relative w-24 h-24 flex items-center justify-center">
              <div className="rounded-full overflow-hidden border-2 border-gray-300 bg-gray-100 w-24 h-24 flex items-center justify-center">
                {avatar ? (
                  <img
                    src={avatar}
                    alt="Avatar"
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <span className="text-gray-400">Avatar</span>
                )}
              </div>
              <span
                className={`absolute bottom-0 right-0 translate-x-1/2 w-5 h-5 rounded-full border-2 border-white ${
                  status === "Activo" ? "bg-green-500" : "bg-red-400"
                }`}
              ></span>
            </div>
            <Input
              id="avatar"
              name="avatar"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </label>
        </div>

        <div className="w-full flex flex-col gap-4">
          <label className="text-gray-700 font-semibold">
            Nombre
            <input
              type="text"
              className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              defaultValue={name}
            />
          </label>
          <label className="text-gray-700 font-semibold">
            Email
            <input
              type="email"
              className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              defaultValue={email}
            />
          </label>
          <label className="text-gray-700 font-semibold">
            Teléfono
            <input
              type="text"
              className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              defaultValue={phone}
            />
          </label>
          <label className="text-gray-700 font-semibold">
            Estado
            <span className="block text-base font-bold text-gray-700 mt-2">
              <Badge status={status}>{status}</Badge>
            </span>
          </label>
        </div>
        <div className="w-full grid grid-cols-2 gap-4 mt-8">
          <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-700 font-semibold">
            <span className="block text-xs text-gray-400">Última visita</span>
            <span className="block text-base font-bold text-gray-700 mt-2">
              {formatDate(lastVisit)}
            </span>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-700 font-semibold">
            <span className="block text-xs text-gray-400">Rol</span>
            <span className="block text-base font-bold text-gray-700 mt-2">
              {role}
            </span>
          </div>
        </div>
        <Button type="submit" className="mt-8 w-full">
          Guardar cambios
        </Button>
      </form>
    </div>
  );
};

export default ProfilePreview;
