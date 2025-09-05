import { Navigate } from "react-router";
import { useUserStore } from "@/hook/useUserStore";

interface Props {
  requiredRole?: "administrator" | "user";
  children: React.ReactNode;
}
const PrivateRoute = ({ requiredRole, children }: Props) => {
  const user = useUserStore((state) => state.user);
  if (!user) return <Navigate to="/auth" />;
  if (requiredRole && user?.role !== requiredRole) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-lg text-red-500 mb-4">
          No tienes permisos para acceder a esta página.
        </p>
        <p className="text-sm text-muted-foreground mb-2"></p>
        <Navigate
          to={user?.role === "administrator" ? "/preview" : "/user-preview"}
        />
      </div>
    );
  }
  return <>{children}</>;
};

export default PrivateRoute;
