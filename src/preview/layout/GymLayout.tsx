import React from "react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { Link, useNavigate, Outlet } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import Menu from "../components/menu";
import Avatar from "@/components/ui/avatar";
import { useCurrentUser } from "@/hook/useCurrentUser";
import Profile from "@/components/ui/Profile";

import { Bell, Settings } from "lucide-react";
import { Toaster } from "sonner";

export default function GymLayout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { data: currentUser, isLoading } = useCurrentUser();
  const [profileOpen, setProfileOpen] = React.useState(false);
  const onLogout = () => {
    localStorage.clear();
    queryClient.removeQueries({ queryKey: ["user"] });
    navigate("/auth", { replace: true });
  };

  return (
    <div className="flex-col h-screen bg-background">
      <Toaster position="top-center" richColors />

      {/* Header */}
      <header className="flex justify-between border-b p-2 items-center pl-10 pr-10">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-primary" />
          <Link to="/" className="font-semibold">
            Gymnacio
          </Link>
        </div>

        <div className="text-lg flex items-center gap-4">
          <Bell />
          <Settings />
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setProfileOpen(true)}
          >
            {isLoading ? (
              <Avatar alt="Cargando..." />
            ) : (
              <Avatar src={currentUser?.avatar} alt={currentUser?.name} />
            )}
          </div>
          {/* Modal Profile */}
          <Profile isOpen={profileOpen} onClose={() => setProfileOpen(false)} />
          <div className="">
            <Button
              variant="ghost"
              size="sm"
              className="w-full cursor-pointer"
              onClick={onLogout}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-col ">
        {/* menu */}
        <Menu />

        {/* Content Area */}
        <div className="flex-1 mt-2 ml-10 mr-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
