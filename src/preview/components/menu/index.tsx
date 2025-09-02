import { Button } from "@/components/ui/button";
import { Users, UserCheck, TrendingUp, QrCode, CreditCard } from "lucide-react";
import { useNavigate, useLocation } from "react-router";

const Menu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <div className="mt-10 flex justify-start gap-5 pl-10">
      <Button
        variant={
          location.pathname.includes("/preview/dashboard")
            ? "default"
            : "secondary"
        }
        className={` cursor-pointer mb-4 flex items-center justify-start`}
        onClick={() => navigate("/preview/dashboard")}
      >
        <TrendingUp className="mr-1" />
        Dashboard
      </Button>
      <Button
        variant={
          location.pathname.includes("/preview/users") ? "default" : "secondary"
        }
        className={` cursor-pointer mb-4 flex items-center justify-start`}
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
        className={` cursor-pointer mb-4 flex items-center justify-start`}
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
        className={` cursor-pointer flex items-center justify-start`}
        onClick={() => navigate("/preview/payments")}
      >
        <CreditCard className="mr-1" />
        Pagos
      </Button>
      <Button
        variant={
          location.pathname.includes("/preview/staff") ? "default" : "secondary"
        }
        className={` cursor-pointer flex items-center justify-start`}
        onClick={() => navigate("/preview/staff")}
      >
        <UserCheck className="mr-1" />
        Instructores
      </Button>
    </div>
  );
};

export default Menu;
