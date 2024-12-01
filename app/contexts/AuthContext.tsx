"use client";

import React, { createContext, useState, useContext, useEffect } from "react";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    address: string
  ) => Promise<void>;
  logout: () => void;
  isLoading: boolean; // 로딩 상태 추가
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가

  useEffect(() => {
    const checkStoredUser = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          if (!parsedUser.role) {
            parsedUser.role = parsedUser.email === "admin@admin.com" ? "admin" : "user";
          }
          setUser(parsedUser);
        }
      } catch (error) {
        console.error("Error checking stored user:", error);
      } finally {
        // 로딩 상태 종료
        setIsLoading(false);
      }
    };

    checkStoredUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true); // 로그인 시 로딩 상태 시작
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const userData = await response.json();

      userData.role = userData.email === "admin@admin.com" ? "admin" : "user";

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false); // 로그인 완료 시 로딩 상태 종료
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    address: string
  ) => {
    try {
      if (!process.env.NEXT_PUBLIC_API_URL) {
        throw new Error("API URL is not defined");
      }
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password, address }),
        }
      );

      if (!response.ok) {
        throw new Error("Registration failed");
      }

      const userData = await response.json();
      // 기본적으로 새로 가입한 사용자는 'user' 역할
      userData.role = "user";

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};