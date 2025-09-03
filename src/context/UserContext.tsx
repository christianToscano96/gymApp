import React, { createContext, useContext, useState } from "react";

export type UserType = {
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

interface UserContextProps {
  user: UserType | null;
  setUser: (user: UserType | null) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Leer usuario de localStorage al iniciar
  const [user, setUser] = useState<UserType | null>(() => {
    try {
      const token = localStorage.getItem("token") || undefined;
      const role = localStorage.getItem("role") as "administrator" | "user" | undefined;
      const name = localStorage.getItem("name") || undefined;
      const email = localStorage.getItem("email") || undefined;
      const phone = localStorage.getItem("phone") || undefined;
      if (token && role) {
        return { token, role, name, email, phone };
      }
      return null;
    } catch {
      return null;
    }
  });

  const logout = () => {
  setUser(null);
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("name");
  localStorage.removeItem("email");
  localStorage.removeItem("phone");
  localStorage.removeItem("status");
  localStorage.removeItem("membership");
  localStorage.removeItem("lastVisit");
  localStorage.removeItem("avatar");
  localStorage.removeItem("joinDate");
  localStorage.removeItem("dueDate");
  localStorage.removeItem("qrCode");
  };

  // Actualizar localStorage al cambiar el usuario
  React.useEffect(() => {
    if (user) {
      if (user.token) localStorage.setItem("token", user.token);
      if (user.role) localStorage.setItem("role", user.role);
      if (user.name) localStorage.setItem("name", user.name);
      if (user.email) localStorage.setItem("email", user.email);
      if (user.phone) localStorage.setItem("phone", user.phone);
    }
  }, [user]);
  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser debe usarse dentro de UserProvider");
  }
  return context;
};
