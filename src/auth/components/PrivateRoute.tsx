import { Navigate } from "react-router";
import { useUser } from "@/context/UserContext";

interface Props {
  requiredRole?: "administrator" | "user";
  children: React.ReactNode;
}
const PrivateRoute = ({ requiredRole, children }: Props) => {
  const { user } = useUser();
  if (!user) return <Navigate to="/auth" />;
  // Log visual para depuración
  console.log("Role actual:", user.role);
  if (requiredRole && user.role !== requiredRole) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-lg text-red-500 mb-4">No tienes permisos para acceder a esta página.</p>
        <p className="text-sm text-muted-foreground mb-2">Role actual: <b>{user.role}</b></p>
        <Navigate to={user.role === "administrator" ? "/preview" : "/user-preview"} />
      </div>
    );
  }
  return (
    <>
      <div className="fixed top-2 right-2 bg-gray-100 text-xs px-2 py-1 rounded shadow z-50">Role actual: <b>{user.role}</b></div>
      {children}
    </>
  );
};

export default PrivateRoute;
