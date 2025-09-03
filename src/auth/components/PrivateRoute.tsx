import { Navigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
  requiredRole?: "administrator" | "user";
  children: React.ReactNode;
}
const PrivateRoute = ({ requiredRole, children }: Props) => {
  const queryClient = useQueryClient();
  type UserType = {
    id?: string;
    name?: string;
    phone?: string;
    email?: string;
    status?: "Activo" | "Vencido";
    membership?: "Básico" | "Premium";
    lastVisit?: string;
    avatar?: string;
    joinDate?: string;
    dueDate?: string;
    qrCode?: string;
    role?: "administrator" | "user";
    password?: string;
    token?: string;
  };
  const user = queryClient.getQueryData(["user"]) as UserType | undefined;
  if (!user) return <Navigate to="/auth" />;
  if (requiredRole && user?.role !== requiredRole) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-lg text-red-500 mb-4">
          No tienes permisos para acceder a esta página.
        </p>
        <p className="text-sm text-muted-foreground mb-2">
          Role actual: <b>{user?.role}</b>
        </p>
        <Navigate
          to={user?.role === "administrator" ? "/preview" : "/user-preview"}
        />
      </div>
    );
  }
  return (
    <>
      <div className="fixed top-2 right-2 bg-gray-100 text-xs px-2 py-1 rounded shadow z-50">
        Role actual: <b>{user?.role}</b>
      </div>
      {children}
    </>
  );
};

export default PrivateRoute;
