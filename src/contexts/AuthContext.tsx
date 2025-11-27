import { createContext, useEffect, useState, type ReactNode } from "react";
import api from "../server/api";

interface User {
  id: string;
  nome: string;
  email: string;
}

interface LoginResponse {
  token: string;
}

interface AuthContextData {
  user: User | null;
  signed: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get<User>("/me");
        setUser(res.data);
      } catch {
        logout();
      }
      setLoading(false);
    }
    loadUser();
  }, []);

  async function login(email: string, senha: string) {
    const res = await api.post<LoginResponse>("/session", { email, senha });
    console.log("Resposta do login: ", res.data)

    localStorage.setItem("token", res.data.token);

    const profile = await api.get<User>("/me");
    setUser(profile.data);
  }

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ user, signed: !!user, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
