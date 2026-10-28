"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import apiClient from "@/services/api";

export interface AnnouncementNotification {
  id: number;
  title: string;
  content: string;
  category: string;
  attachment_url?: string | null;
  attachment_name?: string | null;
  download_link_text?: string | null;
  createdAt?: string;
}

interface NotificationContextType {
  announcements: AnnouncementNotification[];
  loading: boolean;
  isOpen: boolean;
  openNotifications: () => void;
  closeNotifications: () => void;
  toggleNotifications: () => void;
  refetchAnnouncements: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [announcements, setAnnouncements] = useState<AnnouncementNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const fetchAnnouncements = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiClient.get("/announcements");
      if (res.data?.data && Array.isArray(res.data.data)) {
        setAnnouncements(res.data.data);
      }
    } catch (err) {
      console.error("Failed to load student announcements", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Lock body scroll when sidebar is open on small screens
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <NotificationContext.Provider
      value={{
        announcements,
        loading,
        isOpen,
        openNotifications: () => setIsOpen(true),
        closeNotifications: () => setIsOpen(false),
        toggleNotifications: () => setIsOpen((prev) => !prev),
        refetchAnnouncements: fetchAnnouncements,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
}
