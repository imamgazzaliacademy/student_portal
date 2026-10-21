"use client";

import React, { useState, useEffect } from "react";
import apiClient from "@/services/api";
import { toast } from "react-toastify";
import {
  Ticket,
  Calendar,
  CheckCircle,
  Clock,
  Download,
  AlertCircle,
  BookOpen,
  Eye,
  X,
  ShieldAlert,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function HallTicketsPage() {
  const { student } = useAuth();
  const [examinations, setExaminations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  // Preview modal state
  const [previewExam, setPreviewExam] = useState<any | null>(null);

  const fetchHallTickets = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get("/hall_tickets");
      if (res.data?.data) {
        setExaminations(res.data.data);
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to load hall tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHallTickets();
  }, []);

  const handleDownload = async (examId: number, examName: string) => {
    setDownloadingId(examId);
    const loadingToast = toast.loading("Generating your authenticated Hall Ticket PDF...");
    try {
      const response = await apiClient.get(`/hall_ticket/${examId}/pdf`, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `HallTicket_${student?.admission_number}_${examName.replace(/\s+/g, "_")}.pdf`
      );
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);

      toast.update(loadingToast, {
        render: "Hall Ticket downloaded successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (err: any) {
      console.error("Hall ticket download failed:", err);
      // In blob responses, read json error if returned
      let msg = "Failed to download hall ticket";
      if (err.response?.data instanceof Blob) {
        try {
          const text = await err.response.data.text();
          const json = JSON.parse(text);
          msg = json.message || msg;
        } catch (e) {
          // ignore
        }
      } else {
        msg = err.response?.data?.message || msg;
      }

      toast.update(loadingToast, {
        render: msg,
        type: "error",
        isLoading: false,
        autoClose: 4000,
      });
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
          <Ticket className="text-[#0d3b2e]" size={26} />
          Semester Examination Hall Tickets
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Review your examination clearance statuses (No-Due Clearance & Exam Fee Payment) and download official hall tickets.
        </p>
      </div>

      {/* List of Examinations */}
      {loading ? (
        <div className="p-16 text-center text-xs text-gray-500 bg-white rounded-3xl border border-[#e8dfc8]">
          <div className="w-8 h-8 border-4 border-[#0d3b2e] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <span>Retrieving examination schedules and clearances...</span>
        </div>
      ) : examinations.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-[#e8dfc8] space-y-2">
          <Ticket size={40} className="mx-auto text-gray-300" />
          <h3 className="font-bold text-gray-800 text-sm">No Examination Hall Tickets Available</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            Examinations scheduled for class {student?.class_name} will automatically appear here once announced by the administration.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {examinations.map((exam) => (
            <div
              key={exam.examination_id}
              className="p-6 rounded-3xl bg-white border border-[#e8dfc8] shadow-xs hover:border-[#b38e44] transition-all space-y-5"
            >
              {/* Top Row: Examination Title & Dates */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-gray-900">{exam.examination_name}</h3>
                    <span className="font-mono text-[11px] font-bold bg-[#b38e44]/15 text-[#8c6e30] px-2 py-0.5 rounded border border-[#b38e44]/30">
                      {exam.academic_year}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                    <span>Class: <strong className="text-gray-700">{exam.class_name}</strong></span>
                    {exam.semester && (
                      <>
                        <span>•</span>
                        <span>{exam.semester}</span>
                      </>
                    )}
                    {(exam.start_date || exam.end_date) && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar size={13} />
                          {exam.start_date || "TBA"} to {exam.end_date || "TBA"}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Overall download action or blocked status */}
                <div>
                  {exam.can_download ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setPreviewExam(exam)}
                        className="px-3.5 py-2 text-xs font-bold text-[#0d3b2e] bg-[#0d3b2e]/10 hover:bg-[#0d3b2e]/20 border border-[#0d3b2e]/20 rounded-xl flex items-center gap-1.5 transition-colors"
                      >
                        <Eye size={14} />
                        <span>Preview Ticket</span>
                      </button>

                      <button
                        disabled={downloadingId === exam.examination_id}
                        onClick={() => handleDownload(exam.examination_id, exam.examination_name)}
                        className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-[#0d3b2e] to-[#8c6e30] hover:from-[#07261d] hover:to-[#6d5523] rounded-xl shadow-sm hover:shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50"
                      >
                        <Download size={14} />
                        <span>{downloadingId === exam.examination_id ? "Generating..." : "Download Hall Ticket (PDF)"}</span>
                      </button>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 text-xs font-medium">
                      <Clock size={15} className="text-amber-600 shrink-0" />
                      <span>Requirements Pending</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Status Grid & Scheduled Subjects */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* No Due Clearance */}
                <div className="p-4 rounded-2xl bg-[#fdfbf7] border border-gray-200 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                    No-Due Clearance Status
                  </span>
                  <div className="flex items-center gap-2">
                    {exam.no_due_status === "Approved" ? (
                      <span className="inline-flex items-center gap-1 font-bold text-emerald-800 text-xs">
                        <CheckCircle size={14} className="text-emerald-600" />
                        Approved & Cleared
                      </span>
                    ) : exam.no_due_status === "Rejected" ? (
                      <span className="font-bold text-red-600 text-xs">Rejected</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 font-bold text-amber-700 text-xs">
                        <Clock size={14} className="text-amber-600" />
                        Pending Approval
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-500">Issued by Library, Hostel & Academic Office</p>
                </div>

                {/* Exam Fee Payment */}
                <div className="p-4 rounded-2xl bg-[#fdfbf7] border border-gray-200 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                    Examination Fee Payment
                  </span>
                  <div className="flex items-center gap-2">
                    {exam.fee_status === "Paid" ? (
                      <span className="inline-flex items-center gap-1 font-bold text-emerald-800 text-xs">
                        <CheckCircle size={14} className="text-emerald-600" />
                        Paid & Verified
                      </span>
                    ) : exam.fee_status === "Rejected" ? (
                      <span className="font-bold text-red-600 text-xs">Payment Rejected</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 font-bold text-amber-700 text-xs">
                        <Clock size={14} className="text-amber-600" />
                        Pending Payment Verification
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-500">Confirmed by Accounts Department</p>
                </div>

                {/* Hall Ticket Availability */}
                <div className="p-4 rounded-2xl bg-[#fdfbf7] border border-gray-200 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                    Hall Ticket Availability
                  </span>
                  <div className="flex items-center gap-2">
                    {exam.is_hall_ticket_published ? (
                      <span className="inline-flex items-center gap-1 font-bold text-emerald-800 text-xs">
                        <CheckCircle size={14} className="text-emerald-600" />
                        Released by Administration
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 font-bold text-gray-500 text-xs">
                        <Clock size={14} />
                        Not Yet Released
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-500">Controller of Examinations publication</p>
                </div>
              </div>

              {/* Requirement pending banner */}
              {!exam.can_download && exam.blocked_reason && (
                <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 flex items-center gap-2.5">
                  <AlertCircle size={16} className="text-amber-600 shrink-0" />
                  <span>
                    <strong>Requirement Pending:</strong> {exam.blocked_reason}
                  </span>
                </div>
              )}

              {/* Subjects Preview Collapsible */}
              {exam.subjects && exam.subjects.length > 0 && (
                <div className="pt-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                    Scheduled Subjects ({exam.subjects.length})
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {exam.subjects.map((s: any) => (
                      <span
                        key={s.id}
                        className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 text-xs font-medium border border-gray-200 flex items-center gap-1"
                      >
                        {s.code && <strong className="font-mono text-[10px] text-gray-500">{s.code}</strong>}
                        <span>{s.name}</span>
                        <span className="text-gray-400 text-[10px]">({s.max_marks} M)</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Hall Ticket Preview Modal */}
      {previewExam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border overflow-hidden my-6 animate-in fade-in zoom-in-95">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#07261d] to-[#0d3b2e] text-white">
              <h3 className="font-bold text-sm">Hall Ticket Preview — {previewExam.examination_name}</h3>
              <button onClick={() => setPreviewExam(null)} className="p-1.5 text-gray-300 hover:text-white rounded-lg">
                <X size={18} />
              </button>
            </div>

            {/* Ticket Preview Card */}
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-xs">
              {/* Institution Header */}
              <div className="text-center space-y-1 border-b pb-4">
                <img src="/fullLogo.png" alt="WMO IGA" className="h-10 mx-auto object-contain mb-2" />
                <h2 className="text-base font-extrabold text-[#0d3b2e]">WMO IMAM GAZZALI ACADEMY</h2>
                <p className="text-gray-500 text-[11px]">Koolivayal, Panamaram, Wayanad, Kerala - 670721</p>
                <div className="font-bold text-[#b38e44] uppercase tracking-wider text-xs pt-1">
                  SEMESTER EXAMINATION HALL TICKET — {previewExam.academic_year}
                </div>
              </div>

              {/* Student & Exam Info */}
              <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-2xl bg-gray-50 border">
                <div className="w-20 h-24 rounded-xl border-2 border-[#b38e44] bg-white overflow-hidden shrink-0 flex items-center justify-center">
                  {student?.photo_url ? (
                    <img src={student.photo_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs text-gray-400">Photo</span>
                  )}
                </div>

                <div className="space-y-1.5 flex-1">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-gray-400 block text-[10px]">Candidate Name</span>
                      <strong className="text-gray-900 text-sm">{student?.full_name}</strong>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px]">Admission Number</span>
                      <strong className="font-mono text-[#0d3b2e] text-sm">{student?.admission_number}</strong>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px]">Class / Batch</span>
                      <span className="font-medium text-gray-800">{student?.class_name} ({student?.admission_year})</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px]">Date of Birth</span>
                      <span className="font-medium text-gray-800">{student?.date_of_birth}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Subjects Table */}
              <div className="border rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0d3b2e] text-white font-semibold">
                    <tr>
                      <th className="py-2.5 px-3 w-10">Sl</th>
                      <th className="py-2.5 px-3">Subject Code</th>
                      <th className="py-2.5 px-3">Subject Title</th>
                      <th className="py-2.5 px-3 text-center">Max Marks</th>
                      <th className="py-2.5 px-3 text-center">Invigilator Sign</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {previewExam.subjects?.map((s: any, idx: number) => (
                      <tr key={s.id} className="hover:bg-gray-50">
                        <td className="py-2 px-3 text-gray-400">{idx + 1}</td>
                        <td className="py-2 px-3 font-mono font-medium">{s.code || "-"}</td>
                        <td className="py-2 px-3 font-semibold text-gray-900">{s.name}</td>
                        <td className="py-2 px-3 text-center font-bold text-gray-700">{s.max_marks}</td>
                        <td className="py-2 px-3 text-center text-gray-300">_________________</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Instructions */}
              <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/80 text-[11px] text-gray-600 space-y-1">
                <strong className="text-amber-900 block font-bold">Important Instructions:</strong>
                <p>1. Must carry this printed Hall Ticket along with valid Academy ID card into the examination hall.</p>
                <p>2. Electronic gadgets, mobile phones, smart watches, and unauthorized material are strictly barred.</p>
                <p>3. Report to the examination room at least 15 minutes before the scheduled time.</p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-4 border-t bg-gray-50">
              <button
                type="button"
                onClick={() => setPreviewExam(null)}
                className="px-4 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-100"
              >
                Close Preview
              </button>
              <button
                onClick={() => {
                  handleDownload(previewExam.examination_id, previewExam.examination_name);
                  setPreviewExam(null);
                }}
                className="px-5 py-2 text-xs font-bold text-white bg-[#0d3b2e] hover:bg-[#07261d] rounded-xl shadow-sm flex items-center gap-1.5"
              >
                <Download size={14} />
                <span>Download Official PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
