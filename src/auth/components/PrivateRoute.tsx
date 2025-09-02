import { Navigate } from "react-router";
import { useUser } from "@/context/UserContext";

interface Props {
  requiredRole?: "admin" | "user";
  children: React.ReactNode;
}
const PrivateRoute = ({ requiredRole, children }: Props) => {
  const { user } = useUser();
  if (!user) return <Navigate to="/auth" />;
  if (requiredRole && user.role !== requiredRole) {
    // Redirige según el rol
    return (
      <Navigate to={user.role === "admin" ? "/preview" : "/user-preview"} />
    );
  }
  return <>{children}</>;
};

export default PrivateRoute;
