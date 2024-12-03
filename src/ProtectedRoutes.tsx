import { Navigate, Outlet } from "react-router-dom";
import useCheckAuth from "./hooks/api/auth/useCheckAuth";

function ProtectedRoutes() {
  const { user, isLoading } = useCheckAuth();

  if (isLoading)
    return (
      <div className="loading text-4xl text-center mt-20"> Loading...</div>
    );
  return user?.isAuthenticated ? <Outlet /> : <Navigate to="/auth" replace />;
}

export default ProtectedRoutes;
