import { useNavigate, Outlet, useLocation } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import Menu from "../components/menu";
import Avatar from "@/components/ui/avatar";
import { HoverCardUI } from "@/components/ui/hover-card";
import { useCurrentUser } from "@/hook/useCurrentUser";
import { Bell, Settings, LogOut } from "lucide-react";
import { Toaster } from "sonner";

export default function GymLayout() {
  const location = useLocation();
  const isProfilePreview =
    /^\/preview\/(?!users$|dashboard$|qr-access-control$|payments$)[\w-]+$/.test(
      location.pathname
    );

  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { data: currentUser, isLoading } = useCurrentUser();
  const onLogout = () => {
    localStorage.clear();
    queryClient.removeQueries({ queryKey: ["user"] });
    navigate("/auth", { replace: true });
  };
  return (
    <div className="flex-col h-screen bg-background">
      <Toaster position="top-center" richColors />

      {/* Header */}
      <header className="flex justify-between border-b p-4 items-center pl-10 pr-10">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-primary" />
          Gymnacio
        </div>

        <div className="text-lg flex items-center gap-4">
          <Bell />
          <HoverCardUI
            trigger={
              <div className="flex items-center gap-2 cursor-pointer mr-5">
                {isLoading ? (
                  <Avatar alt="Cargando..." />
                ) : (
                  <Avatar
                    src={currentUser?.avatar}
                    alt={currentUser?.name}
                    size="sm"
                  />
                )}
              </div>
            }
          >
            <div className="flex flex-col items-center gap-2">
              <div
                className="w-full flex items-center gap-2 px-3 py-2 rounded cursor-pointer  transition"
                onClick={() => navigate(`/preview/${currentUser?._id}`)}
              >
                <Settings className="h-4 w-4" />
                <span>Mi Perfil</span>
              </div>
              <div
                className="w-full flex items-center gap-2 px-3 py-2 rounded cursor-pointer  transition"
                onClick={onLogout}
              >
                <LogOut className="h-4 w-4" />
                Logout
              </div>
            </div>
          </HoverCardUI>
        </div>
      </header>

      <div className="flex flex-col ">
        {/* menu */}
        {!isProfilePreview && <Menu currentUser={currentUser} />}

        {/* Content Area */}
        <div className="flex-1 mt-2 ml-10 mr-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
