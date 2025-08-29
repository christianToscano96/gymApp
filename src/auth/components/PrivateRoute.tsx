import { Navigate } from "react-router";

interface Props {
  isAuthenticated: boolean;
  children: React.ReactNode;
}
const PrivateRoute = ({ isAuthenticated, children }: Props) => {
  return <div>{isAuthenticated ? children : <Navigate to="/login" />}</div>;
};

export default PrivateRoute;
