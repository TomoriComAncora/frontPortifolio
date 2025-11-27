import { useContext, type ReactNode } from "react";
import { Navigate } from "react-router";
import { AuthContext } from "../contexts/AuthContext";

export function PrivateRoute({ children }: { children: ReactNode }) {
  const { signed, loading } = useContext(AuthContext);
  if (loading) return <p>Carregando...</p>;

  return signed ? children : <Navigate to="/login" />;
}
