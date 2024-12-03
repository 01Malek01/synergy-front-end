import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import Auth from "./pages/Auth/Auth";
import ProtectedRoutes from "./ProtectedRoutes";
import useCheckAuth from "./hooks/api/auth/useCheckAuth";
import Profile from "./pages/Profile/Profile";
import UserProfile from "./pages/userProfile/UserProfile";

export default function AppRoutes() {
  const { user } = useCheckAuth();
  return (
    <Routes>
      <Route
        path="/auth"
        element={user?.isAuthenticated ? <Navigate to="/" replace /> : <Auth />}
      />
      <Route element={<ProtectedRoutes />}>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/users/:id/profile" element={<UserProfile />} />
        <Route path="*" element={<Home />} />
      </Route>
    </Routes>
  );
}
