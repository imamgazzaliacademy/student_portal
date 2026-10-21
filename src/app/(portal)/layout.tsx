"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import {
  LayoutDashboard,
  User,
  Ticket,
  FileSpreadsheet,
  LogOut,
  Menu,
  X,
  GraduationCap,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { student, isAuthenticated, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdfbf7]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-[#0d3b2e] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-gray-500">Loading your student portal...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const navLinks = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "My Profile", href: "/profile", icon: User },
    { name: "Hall Tickets", href: "/hall-tickets", icon: Ticket },
    { name: "Mark Lists & Results", href: "/results", icon: FileSpreadsheet },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfbf7] text-[#1a1a1a] overflow-x-hidden">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#e8dfc8] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Portal Badge */}
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-2">
              <img src="/fullLogo.png" alt="WMO IGA" className="h-9 hidden sm:block object-contain" />
              <img src="/logo.png" alt="WMO IGA" className="h-8 sm:hidden object-contain" />
            </Link>
            <span className="hidden md:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#0d3b2e]/10 text-[#0d3b2e] border border-[#0d3b2e]/20">
              Student Portal
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isActive
                      ? "bg-[#0d3b2e] text-white shadow-sm"
                      : "text-gray-600 hover:text-[#0d3b2e] hover:bg-gray-100/70"
                  }`}
                >
                  <Icon size={15} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right: Student Chip & Logout */}
          <div className="flex items-center gap-3">
            <Link
              href="/profile"
              className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full bg-gray-50 border border-gray-200 hover:border-[#b38e44] transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-300 overflow-hidden flex items-center justify-center text-xs font-bold text-emerald-950 shrink-0">
                {student?.photo_url ? (
                  <img src={student.photo_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  student?.full_name?.charAt(0) || "S"
                )}
              </div>
              <div className="hidden sm:block text-left text-xs leading-tight">
                <div className="font-bold text-gray-900 truncate max-w-[120px]">{student?.full_name}</div>
                <div className="font-mono text-[10px] text-[#b38e44] font-semibold">{student?.admission_number}</div>
              </div>
            </Link>

            <button
              onClick={logout}
              title="Sign Out"
              className="p-2 text-gray-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors hidden sm:flex items-center gap-1 text-xs font-semibold"
            >
              <LogOut size={16} />
              <span className="hidden md:inline">Logout</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-[#0d3b2e] rounded-xl hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#e8dfc8] bg-white px-4 py-3 space-y-1 shadow-lg animate-in slide-in-from-top-2">
            <div className="p-3 mb-2 rounded-xl bg-gray-50 border flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 overflow-hidden flex items-center justify-center font-bold text-sm text-emerald-900 shrink-0">
                {student?.photo_url ? (
                  <img src={student.photo_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  student?.full_name?.charAt(0) || "S"
                )}
              </div>
              <div>
                <div className="font-bold text-sm text-gray-900">{student?.full_name}</div>
                <div className="text-xs text-gray-500 font-mono">{student?.admission_number}</div>
              </div>
            </div>

            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                    isActive ? "bg-[#0d3b2e] text-white" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={16} />
                    <span>{item.name}</span>
                  </div>
                  <ChevronRight size={14} className="opacity-40" />
                </Link>
              );
            })}

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                logout();
              }}
              className="w-full mt-2 px-3 py-2.5 rounded-xl text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 flex items-center justify-center gap-2 transition-colors"
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto min-w-0 overflow-x-hidden px-3 sm:px-6 lg:px-8 py-4 sm:py-8">{children}</main>

      {/* Portal Footer */}
      <footer className="border-t border-[#e8dfc8] bg-white/60 py-6 text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <p className="font-semibold text-gray-700">WMO Imam Gazzali Academy • Student Academic Services</p>
          <p>Koolivayal, Panamaram, Wayanad, Kerala - 670721</p>
        </div>
      </footer>
    </div>
  );
}
