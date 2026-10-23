"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/context/NotificationContext";
import Link from "next/link";
import {
  User,
  Ticket,
  FileSpreadsheet,
  Award,
  Calendar,
  CheckCircle,
  Clock,
  ArrowRight,
  Download,
  AlertCircle,
  GraduationCap,
  Megaphone,
} from "lucide-react";
import apiClient from "@/services/api";

export default function StudentDashboardPage() {
  const { student } = useAuth();
  const { openNotifications } = useNotifications();
  const [hallTickets, setHallTickets] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [htRes, resRes, annRes] = await Promise.allSettled([
          apiClient.get("/hall_tickets"),
          apiClient.get("/results"),
          apiClient.get("/announcements"),
        ]);

        if (htRes.status === "fulfilled" && htRes.value.data?.data) {
          setHallTickets(htRes.value.data.data);
        }
        if (resRes.status === "fulfilled" && resRes.value.data?.data) {
          setResults(resRes.value.data.data);
        }
        if (annRes.status === "fulfilled" && Array.isArray(annRes.value.data?.data)) {
          // Strictly display only Student Portal announcements
          const studentNotices = annRes.value.data.data.filter(
            (item: any) => item.category === "Student Portal"
          );
          setAnnouncements(studentNotices);
        }
      } catch (err) {
        console.error("Dashboard data error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#07261d] via-[#0d3b2e] to-[#165342] text-white p-5 sm:p-8 shadow-xl overflow-hidden border border-[#b38e44]/30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#b38e44]/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-5">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white/10 backdrop-blur-md border-2 border-[#b38e44] overflow-hidden flex items-center justify-center shrink-0 shadow-lg">
              {student?.photo_url ? (
                <img
                  src={student.photo_url}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={44} className="text-[#d4af37]" />
              )}
            </div>

            <div className="space-y-1">
              <div className="text-[11px] font-bold tracking-widest uppercase text-[#d4af37]">
                Authenticated Student
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-white">
                {student?.full_name}
              </h1>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3 pt-1 text-xs text-emerald-200">
                <span className="font-mono bg-[#b38e44]/25 text-[#fdfbf7] px-2.5 py-0.5 rounded font-bold border border-[#b38e44]/40">
                  {student?.admission_number}
                </span>
                <span>•</span>
                <span className="font-semibold text-white">
                  {student?.class_name}
                </span>
                <span>•</span>
                {student?.admission_year && (
                  <span className="text-emerald-100">
                    Batch {student?.admission_year}/
                    {String(student?.admission_year + 1).slice(-2)}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <Link
              href="/profile"
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all flex items-center gap-1.5 backdrop-blur-sm"
            >
              <span>View Profile</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Link
          href="/hall-tickets"
          className="group p-6 rounded-2xl bg-white border border-[#e8dfc8] hover:border-[#b38e44] shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-[#b38e44] border border-amber-200 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Ticket size={24} />
            </div>
            <div>
              <h3 className="font-bold text-base text-gray-900 group-hover:text-[#0d3b2e] transition-colors">
                Examination Hall Tickets
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                View eligibility clearance, No-Due status, and download
                authenticated PDF hall tickets.
              </p>
            </div>
          </div>
          <div className="pt-4 flex items-center text-xs font-bold text-[#b38e44] group-hover:translate-x-1 transition-transform">
            <span>Access Hall Tickets</span>
            <ArrowRight size={14} className="ml-1" />
          </div>
        </Link>

        <Link
          href="/results"
          className="group p-6 rounded-2xl bg-white border border-[#e8dfc8] hover:border-[#b38e44] shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#0d3b2e] border border-emerald-200 flex items-center justify-center group-hover:scale-105 transition-transform">
              <FileSpreadsheet size={24} />
            </div>
            <div>
              <h3 className="font-bold text-base text-gray-900 group-hover:text-[#0d3b2e] transition-colors">
                Mark Lists & Results
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Check semester examination marks, percentage, subject results,
                class ranks, and download official mark sheets.
              </p>
            </div>
          </div>
          <div className="pt-4 flex items-center text-xs font-bold text-[#0d3b2e] group-hover:translate-x-1 transition-transform">
            <span>View Published Results</span>
            <ArrowRight size={14} className="ml-1" />
          </div>
        </Link>

        <Link
          href="/profile"
          className="group p-6 rounded-2xl bg-white border border-[#e8dfc8] hover:border-[#b38e44] shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center group-hover:scale-105 transition-transform">
              <User size={24} />
            </div>
            <div>
              <h3 className="font-bold text-base text-gray-900 group-hover:text-blue-900 transition-colors">
                My Student Profile
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Review your registered academic credentials, contact info, date
                of birth, and official details.
              </p>
            </div>
          </div>
          <div className="pt-4 flex items-center text-xs font-bold text-blue-700 group-hover:translate-x-1 transition-transform">
            <span>View Full Details</span>
            <ArrowRight size={14} className="ml-1" />
          </div>
        </Link>
      </div>

      {/* Student Announcements Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Megaphone className="text-[#0d3b2e]" size={20} />
            Student Announcements
          </h2>
          {announcements.length > 0 && (
            <button
              type="button"
              onClick={openNotifications}
              className="text-xs font-bold text-[#b38e44] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View in Notifications ({announcements.length})</span>
              <ArrowRight size={13} />
            </button>
          )}
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-gray-500 bg-white rounded-2xl border border-[#e8dfc8]">
            <div className="w-6 h-6 border-2 border-[#0d3b2e] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <span>Checking student notices...</span>
          </div>
        ) : announcements.length === 0 ? (
          <div className="p-6 text-center bg-white rounded-2xl border border-dashed border-[#e8dfc8] text-gray-500">
            <p className="text-xs font-semibold text-gray-800">
              No new announcements at this time
            </p>
            <p className="text-[11px] text-gray-400 mt-0.5">
              Official institutional announcements and circulars for students will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {announcements.slice(0, 4).map((ann: any) => (
              <div
                key={ann.id}
                className="p-5 rounded-2xl bg-white border border-[#e8dfc8] shadow-xs space-y-3 hover:border-[#b38e44] transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                      Student Portal
                    </span>
                    {ann.createdAt && (
                      <span className="text-xs text-gray-400">
                        {new Date(ann.createdAt).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-sm text-gray-900 leading-snug">
                    {ann.title}
                  </h3>
                  <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed whitespace-pre-line">
                    {ann.content}
                  </p>
                </div>

                {ann.attachment_url && (
                  <div className="pt-2.5 border-t border-gray-100 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-gray-500 truncate max-w-[150px]">
                      {ann.attachment_name || "Attachment"}
                    </span>
                    <a
                      href={ann.attachment_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-[#0d3b2e] hover:bg-[#07261d] transition-colors shrink-0"
                    >
                      <Download size={13} />
                      <span>{ann.download_link_text || "Download File"}</span>
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Active Examination Cycles & Eligibility Overview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Award className="text-[#0d3b2e]" size={20} />
            Active Examination Cycles
          </h2>
          <Link
            href="/hall-tickets"
            className="text-xs font-bold text-[#b38e44] hover:underline"
          >
            View All Examinations →
          </Link>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-gray-500 bg-white rounded-2xl border">
            Checking academic examination records...
          </div>
        ) : hallTickets.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-[#e8dfc8] text-gray-500">
            <GraduationCap size={36} className="mx-auto mb-2 text-gray-300" />
            <p className="text-sm font-semibold text-gray-800">
              No active examinations currently scheduled
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Examination schedules and hall ticket release notices will appear
              here once published.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hallTickets.map((ht: any) => (
              <div
                key={ht.examination_id}
                className="p-5 rounded-2xl bg-white border border-[#e8dfc8] shadow-xs space-y-4 hover:border-[#b38e44] transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="font-bold text-sm text-gray-900">
                      {ht.examination_name}
                    </h4>
                    <p className="text-xs text-gray-500">
                      Academic Year: {ht.academic_year}{" "}
                      {ht.semester ? `• ${ht.semester}` : ""}
                    </p>
                  </div>

                  {ht.can_download ? (
                    <span className="inline-flex items-center gap-1 font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 text-xs">
                      <CheckCircle size={13} />
                      Ready to Download
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 text-xs">
                      <Clock size={13} />
                      Pending Clearance
                    </span>
                  )}
                </div>

                {/* Eligibility requirements status */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-gray-50/80 border">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">
                      No-Due Clearance
                    </span>
                    <span
                      className={`font-semibold ${
                        ht.no_due_status === "Approved"
                          ? "text-emerald-700 font-bold"
                          : "text-amber-700"
                      }`}
                    >
                      {ht.no_due_status}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-gray-50/80 border">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">
                      Examination Fee
                    </span>
                    <span
                      className={`font-semibold ${
                        ht.fee_status === "Paid"
                          ? "text-emerald-700 font-bold"
                          : "text-amber-700"
                      }`}
                    >
                      {ht.fee_status}
                    </span>
                  </div>
                </div>

                {/* Blocked reason banner if not downloadable */}
                {!ht.can_download && ht.blocked_reason && (
                  <div className="text-xs text-amber-800 bg-amber-50/70 p-2.5 rounded-xl border border-amber-200 flex items-start gap-2">
                    <AlertCircle
                      size={15}
                      className="text-amber-600 shrink-0 mt-0.5"
                    />
                    <span>{ht.blocked_reason}</span>
                  </div>
                )}

                <div className="pt-1 flex items-center justify-between border-t border-gray-100">
                  <span className="text-xs text-gray-500">
                    {ht.subjects?.length || 0} scheduled subjects
                  </span>
                  <Link
                    href="/hall-tickets"
                    className="text-xs font-bold text-[#0d3b2e] hover:underline flex items-center gap-1"
                  >
                    <span>View Hall Ticket</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
