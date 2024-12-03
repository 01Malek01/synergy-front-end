import useCheckAuth from "@/hooks/api/auth/useCheckAuth";
import {
  useState,
  createContext,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { AuthContextType } from "types";
const AuthContext = createContext<AuthContextType | null>(null);
function AuthContextProvider({ children }: { children: ReactNode }) {
  const {
    user: authUser,
    isLoading: isAuthLoading,
    isSuccess,
  } = useCheckAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthContextType["user"] | null>(null);

  useEffect(() => {
    if (!isAuthLoading && isSuccess) {
      setIsAuthenticated(true);
      setUser(authUser);
    }
  }, [authUser, user, isAuthLoading, isSuccess]);
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        user,
        setUser,
        isAuthLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined || !context) {
    throw new Error("useAuth must be used within a AuthContextProvider");
  }
  return context;
};

export default AuthContextProvider;
