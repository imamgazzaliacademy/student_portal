"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";
import { Lock, User, Calendar, ArrowRight, ShieldCheck, GraduationCap } from "lucide-react";
import Link from "next/link";

export default function StudentLoginPage() {
  const [admissionNumber, setAdmissionNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!admissionNumber.trim()) {
      toast.error("Please enter your Admission Number");
      return;
    }
    if (!dateOfBirth) {
      toast.error("Please select or enter your Date of Birth");
      return;
    }

    setSubmitting(true);
    try {
      await login(admissionNumber, dateOfBirth);
      toast.success("Welcome back! Login successful.");
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Login error:", err);
      const msg = err.response?.data?.message || "Invalid admission number or date of birth";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-b from-[#f7f5ed] via-[#fdfbf7] to-[#f4f0e4] text-[#1a1a1a]">
      {/* Top Banner / Navigation */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-[#e8dfc8] bg-white/70 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <img src="/fullLogo.png" alt="WMO Imam Gazzali Academy" className="h-10 hidden sm:block object-contain" />
          <img src="/logo.png" alt="WMO IGA" className="h-9 sm:hidden object-contain" />
        </div>

        <a
          href="https://wmoiga.com"
          className="text-xs font-semibold text-[#8c6e30] hover:text-[#0d3b2e] transition-colors flex items-center gap-1"
        >
          <span>Main Website</span>
          <ArrowRight size={14} />
        </a>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-[#ede3cc] overflow-hidden">
          {/* Accent Header */}
          <div className="bg-gradient-to-br from-[#07261d] via-[#0d3b2e] to-[#165342] p-8 text-white text-center relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-[#b38e44]/15 blur-2xl" />
            <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-[#b38e44]/10 blur-xl" />

            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-[#b38e44]/40 flex items-center justify-center mx-auto mb-4 text-[#d4af37] shadow-lg">
              <GraduationCap size={32} />
            </div>

            <h1 className="text-xl font-bold tracking-tight text-[#fdfcf9]">Student Academic Portal</h1>
            <p className="text-xs text-[#cbd5e1] mt-1">
              WMO Imam Gazzali Academy, Koolivayal
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="p-8 space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Admission Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-3 text-gray-400">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  required
                  autoCapitalize="characters"
                  value={admissionNumber}
                  onChange={(e) => setAdmissionNumber(e.target.value.toUpperCase())}
                  placeholder="e.g. IGA0012022"
                  className="w-full pl-10 pr-4 py-2.5 text-sm font-medium border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0d3b2e] focus:border-[#0d3b2e] outline-none transition-all placeholder:text-gray-400 font-mono"
                />
              </div>
              <p className="text-[11px] text-gray-500 mt-1">Found on your Academy ID card or registration receipt</p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-3 text-gray-400">
                  <Calendar size={18} />
                </div>
                <input
                  type="date"
                  required
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm font-medium border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0d3b2e] focus:border-[#0d3b2e] outline-none transition-all text-gray-800"
                />
              </div>
              <p className="text-[11px] text-gray-500 mt-1">Acts as your confidential student login password</p>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#0d3b2e] to-[#8c6e30] hover:from-[#07261d] hover:to-[#6d5523] shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Student Portal</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>

            {/* Security note */}
            <div className="pt-4 border-t border-gray-100 flex items-center gap-2 text-[11px] text-gray-500 justify-center">
              <ShieldCheck size={14} className="text-emerald-700" />
              <span>Protected student session • 256-bit SSL encrypted</span>
            </div>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-xs text-gray-500 border-t border-[#e8dfc8] bg-white/50">
        © {new Date().getFullYear()} WMO Imam Gazzali Academy. All rights reserved.
      </footer>
    </div>
  );
}
