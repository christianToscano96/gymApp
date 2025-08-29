import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users, Building2, UserCheck } from "lucide-react";
import { useNavigate, useLocation } from "react-router";

const Menu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <ScrollArea className="h-[calc(100vh-120px)]">
      <div className="space-y-4 p-4">
        <div className="space-y-1">
          <Button
            variant={
              location.pathname.includes("/rental/tenant")
                ? "default"
                : "secondary"
            }
            className={`w-full cursor-pointer mb-4 flex items-center justify-start`}
            onClick={() => navigate("/rental/tenant")}
          >
            <Users className="mr-2" />
            Tenant
          </Button>
          <Button
            variant={
              location.pathname.includes("/rental/departments")
                ? "default"
                : "secondary"
            }
            className={`w-full cursor-pointer mb-4 flex items-center justify-start`}
            onClick={() => navigate("/rental/departments")}
          >
            <Building2 className="mr-2" />
            Departments
          </Button>
          <Button
            variant={
              location.pathname.includes("/rental/staff")
                ? "default"
                : "secondary"
            }
            className={`w-full cursor-pointer flex items-center justify-start`}
            onClick={() => navigate("/rental/staff")}
          >
            <UserCheck className="mr-2" />
            Staff
          </Button>
        </div>
      </div>
    </ScrollArea>
  );
};

export default Menu;
