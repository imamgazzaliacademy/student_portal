"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";
import { User, Calendar, ArrowRight, ShieldCheck, GraduationCap } from "lucide-react";
import Link from "next/link";

export default function StudentLoginPage() {
  const [admissionNumber, setAdmissionNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const msg = sessionStorage.getItem("student_session_expired_msg");
      if (msg) {
        toast.warning(msg);
        sessionStorage.removeItem("student_session_expired_msg");
      }
      if (localStorage.getItem("studentToken")) {
        router.push("/dashboard");
      }
    }
  }, [router]);

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
    <div className="min-h-screen flex flex-col justify-between bg-neutral-50 text-neutral-900">
      {/* Top Banner / Navigation */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-neutral-200 bg-white">
        <div className="flex items-center gap-3">
          <img src="/fullLogo.png" alt="WMO Imam Gazzali Academy" className="h-9 hidden sm:block object-contain" />
          <img src="/logo.png" alt="WMO IGA" className="h-8 sm:hidden object-contain" />
        </div>

        <a
          href="https://wmoiga.com"
          className="text-xs font-semibold text-neutral-600 hover:text-neutral-900 transition-colors flex items-center gap-1.5"
        >
          <span>Main Website</span>
          <ArrowRight size={13} />
        </a>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-neutral-200 overflow-hidden">
          {/* Header - Minimal Black and White */}
          <div className="bg-neutral-900 p-8 text-white text-center">
            <div className="w-12 h-12 rounded-xl bg-neutral-800 border border-neutral-700 flex items-center justify-center mx-auto mb-3 text-white">
              <GraduationCap size={26} />
            </div>

            <h1 className="text-lg font-bold tracking-tight">Student Academic Portal</h1>
            <p className="text-xs text-neutral-400 mt-1">
              Imam Gazzali Academy • Examination Services
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="p-8 space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Admission Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-3 text-neutral-400">
                  <User size={16} />
                </div>
                <input
                  type="text"
                  required
                  autoCapitalize="characters"
                  value={admissionNumber}
                  onChange={(e) => setAdmissionNumber(e.target.value.toUpperCase())}
                  placeholder="e.g. IGA0012022"
                  className="w-full pl-10 pr-4 py-2.5 text-sm font-medium border border-neutral-300 rounded-lg focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900 outline-none transition-all placeholder:text-neutral-400 font-mono"
                />
              </div>
              <p className="text-[11px] text-neutral-500 mt-1">Found on your Academy ID card or registration document</p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-3 text-neutral-400">
                  <Calendar size={16} />
                </div>
                <input
                  type="date"
                  required
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm font-medium border border-neutral-300 rounded-lg focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900 outline-none transition-all text-neutral-900"
                />
              </div>
              <p className="text-[11px] text-neutral-500 mt-1">Acts as your confidential student login password</p>
            </div>

            {/* Login Button - Clean Solid Black Button (NO GRADIENTS) */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 px-4 rounded-lg font-semibold text-xs text-white bg-neutral-900 hover:bg-black transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shadow-xs"
              >
                {submitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Student Portal</span>
                    <ArrowRight size={14} />
                  </>
                )}
              </button>
            </div>

            {/* Security note */}
            <div className="pt-4 border-t border-neutral-100 flex items-center gap-2 text-[11px] text-neutral-500 justify-center">
              <ShieldCheck size={14} className="text-neutral-700" />
              <span>Protected student session • 256-bit SSL encrypted</span>
            </div>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-xs text-neutral-500 border-t border-neutral-200 bg-white">
        © {new Date().getFullYear()} WMO Imam Gazzali Academy. All rights reserved.
      </footer>
    </div>
  );
}
