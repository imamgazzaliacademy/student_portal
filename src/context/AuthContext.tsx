"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import apiClient from "@/services/api";
import { useRouter } from "next/navigation";

interface StudentInfo {
  id: number;
  admission_number: string;
  full_name: string;
  class_name: string;
  admission_year: number;
  photo_url?: string | null;
  date_of_birth?: string;
  father_name?: string | null;
  place?: string | null;
  guardian_contact?: string | null;
  alt_phone?: string | null;
  email?: string | null;
  status?: string;
}

interface AuthContextType {
  student: StudentInfo | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (admissionNumber: string, dateOfBirth: string) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [student, setStudent] = useState<StudentInfo | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchProfile = async () => {
    try {
      const res = await apiClient.get("/profile");
      if (res.data?.data) {
        setStudent(res.data.data);
        localStorage.setItem("studentData", JSON.stringify(res.data.data));
      }
    } catch (err) {
      console.error("Failed to fetch student profile", err);
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("studentToken");
    const storedStudent = localStorage.getItem("studentData");

    if (storedToken) {
      setToken(storedToken);
      if (storedStudent) {
        try {
          setStudent(JSON.parse(storedStudent));
        } catch (e) {
          // ignore
        }
      }
      fetchProfile().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (admissionNumber: string, dateOfBirth: string) => {
    const res = await apiClient.post("/login", {
      admission_number: admissionNumber.trim().toUpperCase(),
      date_of_birth: dateOfBirth.trim(),
    });

    const { token: receivedToken, student: receivedStudent } = res.data.data;

    localStorage.setItem("studentToken", receivedToken);
    localStorage.setItem("studentData", JSON.stringify(receivedStudent));

    setToken(receivedToken);
    setStudent(receivedStudent);

    // Fetch complete profile in background
    fetchProfile();
  };

  const logout = () => {
    localStorage.removeItem("studentToken");
    localStorage.removeItem("studentData");
    setToken(null);
    setStudent(null);
    router.push("/login");
  };

  const refreshProfile = async () => {
    await fetchProfile();
  };

  return (
    <AuthContext.Provider
      value={{
        student,
        token,
        isAuthenticated: Boolean(token),
        loading,
        login,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
