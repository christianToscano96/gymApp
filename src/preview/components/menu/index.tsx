import { Button } from "@/components/ui/button";
import { Users, UserCheck, TrendingUp, QrCode, CreditCard } from "lucide-react";
import { useNavigate, useLocation } from "react-router";

const Menu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <div className="mt-10 flex flex-row overflow-x-auto whitespace-nowrap gap-2 md:gap-5 px-2 md:pl-10 w-full scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent ">
      <Button
        variant={
          location.pathname.includes("/preview/dashboard")
            ? "default"
            : "secondary"
        }
        className="cursor-pointer mb-2 md:mb-4 flex items-center justify-start min-w-max"
        onClick={() => navigate("/preview/dashboard")}
      >
        <TrendingUp className="mr-1" />
        Dashboard
      </Button>
      <Button
        variant={
          location.pathname.includes("/preview/users") ? "default" : "secondary"
        }
        className="cursor-pointer mb-2 md:mb-4 flex items-center justify-start min-w-max"
        onClick={() => navigate("/preview/users")}
      >
        <Users className="mr-1" />
        Usuarios
      </Button>
      <Button
        variant={
          location.pathname.includes("/preview/qr-access-control")
            ? "default"
            : "secondary"
        }
        className="cursor-pointer mb-2 md:mb-4 flex items-center justify-start min-w-max"
        onClick={() => navigate("/preview/qr-access-control")}
      >
        <QrCode className="mr-1" />
        Acceso Qr
      </Button>
      <Button
        variant={
          location.pathname.includes("/preview/payments")
            ? "default"
            : "secondary"
        }
        className="cursor-pointer mb-2 md:mb-0 flex items-center justify-start min-w-max"
        onClick={() => navigate("/preview/payments")}
      >
        <CreditCard className="mr-1" />
        Pagos
      </Button>
    </div>
  );
};

export default Menu;
