"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { User, Calendar, BookOpen, MapPin, Phone, Mail, ShieldCheck, Award } from "lucide-react";

export default function StudentProfilePage() {
  const { student } = useAuth();

  if (!student) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
          <User className="text-[#0d3b2e]" size={26} />
          Student Official Profile
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Registered academic record at Imam Gazzali Academy. This information is read-only.
        </p>
      </div>

      {/* Main Profile Card */}
      <div className="bg-white rounded-3xl border border-[#e8dfc8] shadow-sm overflow-hidden">
        {/* Top Banner with Photo & Badges */}
        <div className="bg-gradient-to-r from-[#07261d] via-[#0d3b2e] to-[#165342] p-8 text-white flex flex-col sm:flex-row items-center gap-6 relative">
          <div className="w-28 h-28 rounded-2xl bg-white/10 backdrop-blur-md border-2 border-[#b38e44] overflow-hidden flex items-center justify-center shrink-0 shadow-xl">
            {student.photo_url ? (
              <img src={student.photo_url} alt={student.full_name} className="w-full h-full object-cover" />
            ) : (
              <User size={56} className="text-[#d4af37]" />
            )}
          </div>

          <div className="text-center sm:text-left space-y-1.5 flex-1">
            <span className="text-[10px] font-bold tracking-widest uppercase text-[#d4af37] bg-white/10 px-2.5 py-0.5 rounded-full border border-white/10">
              OFFICIAL ACADEMIC RECORD
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">{student.full_name}</h2>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-1 text-xs text-emerald-200">
              <span className="font-mono bg-[#b38e44]/30 text-white font-bold px-2.5 py-1 rounded-md border border-[#b38e44]/50">
                {student.admission_number}
              </span>
              <span>•</span>
              <span className="font-semibold text-white">{student.class_name}</span>
              <span>•</span>
              <span>Batch {student.admission_year}</span>
            </div>
          </div>
        </div>

        {/* Profile Details Sections */}
        <div className="p-8 space-y-8">
          {/* Section 1: Academic & Identification */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#b38e44] border-b pb-2 flex items-center gap-2">
              <Award size={16} />
              <span>Academic & Credential Identification</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 text-xs">
              <div className="p-4 rounded-2xl bg-[#fdfbf7] border border-gray-200/80 space-y-1">
                <span className="text-gray-400 font-semibold block">Admission Number</span>
                <span className="font-mono font-bold text-sm text-[#0d3b2e]">{student.admission_number}</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#fdfbf7] border border-gray-200/80 space-y-1">
                <span className="text-gray-400 font-semibold block">Date of Birth</span>
                <span className="font-bold text-sm text-gray-900">{student.date_of_birth}</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#fdfbf7] border border-gray-200/80 space-y-1">
                <span className="text-gray-400 font-semibold block">Class Cohort</span>
                <span className="font-bold text-sm text-gray-900">{student.class_name}</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#fdfbf7] border border-gray-200/80 space-y-1">
                <span className="text-gray-400 font-semibold block">Admission Year</span>
                <span className="font-bold text-sm text-gray-900">{student.admission_year}</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#fdfbf7] border border-gray-200/80 space-y-1">
                <span className="text-gray-400 font-semibold block">Enrollment Status</span>
                <span className="font-bold text-sm text-emerald-800">{student.status || "Active"}</span>
              </div>
            </div>
          </div>

          {/* Section 2: Personal & Contact Information */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#b38e44] border-b pb-2 flex items-center gap-2">
              <User size={16} />
              <span>Personal & Contact Information</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
              {student.father_name && (
                <div className="p-4 rounded-2xl bg-[#fdfbf7] border border-gray-200/80 space-y-1">
                  <span className="text-gray-400 font-semibold block">Father's Name</span>
                  <span className="font-bold text-sm text-gray-900">{student.father_name}</span>
                </div>
              )}

              {student.place && (
                <div className="p-4 rounded-2xl bg-[#fdfbf7] border border-gray-200/80 space-y-1">
                  <span className="text-gray-400 font-semibold block">Place / Hometown</span>
                  <span className="font-bold text-sm text-gray-900">{student.place}</span>
                </div>
              )}

              {student.guardian_contact && (
                <div className="p-4 rounded-2xl bg-[#fdfbf7] border border-gray-200/80 space-y-1">
                  <span className="text-gray-400 font-semibold block">Guardian Contact Number</span>
                  <span className="font-mono font-bold text-sm text-gray-900">{student.guardian_contact}</span>
                </div>
              )}

              {student.alt_phone && (
                <div className="p-4 rounded-2xl bg-[#fdfbf7] border border-gray-200/80 space-y-1">
                  <span className="text-gray-400 font-semibold block">Alternative Phone Number</span>
                  <span className="font-mono font-bold text-sm text-gray-900">{student.alt_phone}</span>
                </div>
              )}

              {student.email && (
                <div className="p-4 rounded-2xl bg-[#fdfbf7] border border-gray-200/80 space-y-1 sm:col-span-2">
                  <span className="text-gray-400 font-semibold block">Email Address</span>
                  <span className="font-medium text-sm text-gray-900">{student.email}</span>
                </div>
              )}
            </div>
          </div>

          {/* Verification disclaimer */}
          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 flex items-start gap-3 text-xs text-amber-900">
            <ShieldCheck size={18} className="text-[#b38e44] shrink-0 mt-0.5" />
            <p>
              To request any updates to your registered information or contact phone number, please contact the Imam Gazzali Academy Administrative Office with appropriate supporting documentation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
