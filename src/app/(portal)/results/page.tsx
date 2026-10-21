"use client";

import React, { useState, useEffect } from "react";
import apiClient from "@/services/api";
import { toast } from "react-toastify";
import {
  FileSpreadsheet,
  Award,
  Download,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Check,
  Printer,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function StudentResultsPage() {
  const { student } = useAuth();
  const [publishedExams, setPublishedExams] = useState<any[]>([]);
  const [selectedExamId, setSelectedExamId] = useState<number | null>(null);
  const [selectedExamDetail, setSelectedExamDetail] = useState<any | null>(null);

  const [loadingExams, setLoadingExams] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  // Fetch all examinations that have published results for student
  useEffect(() => {
    const fetchPublishedExams = async () => {
      setLoadingExams(true);
      try {
        const res = await apiClient.get("/results");
        if (res.data?.data) {
          const exams = res.data.data;
          setPublishedExams(exams);
          if (exams.length > 0) {
            setSelectedExamId(exams[0].examination_id);
          }
        }
      } catch (err: any) {
        console.error("Failed to fetch published results", err);
        toast.error("Failed to load published examination list");
      } finally {
        setLoadingExams(false);
      }
    };

    fetchPublishedExams();
  }, []);

  // Fetch full details of selected examination marks and result
  useEffect(() => {
    if (!selectedExamId) {
      setSelectedExamDetail(null);
      return;
    }

    const fetchDetail = async () => {
      setLoadingDetail(true);
      try {
        const res = await apiClient.get(`/results/${selectedExamId}`);
        if (res.data?.data) {
          setSelectedExamDetail(res.data.data);
        }
      } catch (err: any) {
        console.error("Detail error", err);
        toast.error(err.response?.data?.message || "Failed to load examination marks breakdown");
        setSelectedExamDetail(null);
      } finally {
        setLoadingDetail(false);
      }
    };

    fetchDetail();
  }, [selectedExamId]);

  const handleDownloadPdf = async () => {
    if (!selectedExamId) return;
    setDownloadingPdf(true);
    const loadingToast = toast.loading("Generating your authenticated Statement of Marks PDF...");
    try {
      const response = await apiClient.get(`/results/${selectedExamId}/pdf`, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `MarkList_${student?.admission_number}_${selectedExamDetail?.examination?.academic_year || "Exam"}.pdf`
      );
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);

      toast.update(loadingToast, {
        render: "Statement of Marks downloaded successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (err: any) {
      console.error("Download error:", err);
      toast.update(loadingToast, {
        render: "Failed to download mark list PDF",
        type: "error",
        isLoading: false,
        autoClose: 4000,
      });
    } finally {
      setDownloadingPdf(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
          <FileSpreadsheet className="text-[#0d3b2e]" size={26} />
          Official Mark Lists & Examination Results
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Review your verified semester marks, percentage, subject results, class rank, and download official statements.
        </p>
      </div>

      {loadingExams ? (
        <div className="p-16 text-center text-xs text-gray-500 bg-white rounded-3xl border border-[#e8dfc8]">
          <div className="w-8 h-8 border-4 border-[#0d3b2e] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <span>Loading published examinations...</span>
        </div>
      ) : publishedExams.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-dashed border-[#e8dfc8] space-y-3">
          <Award size={48} className="mx-auto text-gray-300" />
          <h3 className="text-base font-bold text-gray-800">Results Have Not Been Published Yet</h3>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            Official examination marks and final statements will be available here once approved and released by the Academy Controller of Examinations.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Examination Dropdown / Selector Bar */}
          <div className="p-5 rounded-2xl bg-white border border-[#e8dfc8] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex-1 max-w-md space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600">
                Select Examination Cycle
              </label>
              <select
                value={selectedExamId || ""}
                onChange={(e) => setSelectedExamId(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 text-sm font-semibold border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0d3b2e] outline-none bg-white text-gray-900 shadow-xs"
              >
                {publishedExams.map((ex) => (
                  <option key={ex.examination_id} value={ex.examination_id}>
                    {ex.examination_name} ({ex.academic_year})
                  </option>
                ))}
              </select>
            </div>

            {selectedExamDetail && (
              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  disabled={downloadingPdf}
                  onClick={handleDownloadPdf}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-[#0d3b2e] to-[#8c6e30] hover:from-[#07261d] hover:to-[#6d5523] rounded-xl shadow-sm hover:shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Download size={15} />
                  <span>{downloadingPdf ? "Generating..." : "Download Official PDF"}</span>
                </button>
              </div>
            )}
          </div>

          {/* Mark Sheet Details Card */}
          {loadingDetail ? (
            <div className="p-16 text-center text-xs text-gray-500 bg-white rounded-3xl border border-[#e8dfc8]">
              <div className="w-8 h-8 border-4 border-[#0d3b2e] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <span>Fetching marks and performance analytics...</span>
            </div>
          ) : !selectedExamDetail ? (
            <div className="p-12 text-center text-gray-500 bg-white rounded-2xl border">
              Select an examination above to view results.
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-[#e8dfc8] shadow-sm overflow-hidden space-y-6 p-6 sm:p-8">
              {/* Institution Header inside Statement */}
              <div className="border-b pb-6 text-center space-y-1 relative">
                <img src="/fullLogo.png" alt="WMO IGA" className="h-10 mx-auto object-contain mb-2" />
                <h2 className="text-lg font-extrabold text-[#0d3b2e]">WMO IMAM GAZZALI ACADEMY</h2>
                <p className="text-gray-500 text-xs">Koolivayal, Panamaram, Wayanad, Kerala - 670721</p>
                <div className="text-xs font-bold text-[#b38e44] uppercase tracking-widest pt-2">
                  OFFICIAL STATEMENT OF SEMESTER MARKS
                </div>
                <div className="text-xs font-semibold text-gray-800">
                  {selectedExamDetail.examination.name} ({selectedExamDetail.examination.academic_year})
                </div>
              </div>

              {/* Student Info Box */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-[#fdfbf7] border border-gray-200 text-xs">
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Candidate Name</span>
                  <strong className="text-sm text-gray-900">{selectedExamDetail.student.full_name}</strong>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Admission Number</span>
                  <strong className="font-mono text-sm text-[#0d3b2e]">{selectedExamDetail.student.admission_number}</strong>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Class / Batch</span>
                  <span className="font-semibold text-gray-800">
                    {selectedExamDetail.student.class_name} ({selectedExamDetail.student.admission_year})
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Academic Session</span>
                  <span className="font-semibold text-gray-800">{selectedExamDetail.examination.academic_year}</span>
                </div>
              </div>

              {/* Subjects & Marks Table */}
              <div className="border rounded-2xl overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0d3b2e] text-white font-semibold">
                    <tr>
                      <th className="py-3 px-4 w-12 text-center">Sl</th>
                      <th className="py-3 px-4">Subject Code</th>
                      <th className="py-3 px-4">Subject Title</th>
                      <th className="py-3 px-4 text-center">Max Marks</th>
                      <th className="py-3 px-4 text-center">Pass Marks</th>
                      <th className="py-3 px-4 text-center">Marks Obtained</th>
                      <th className="py-3 px-4 text-center">Result</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {selectedExamDetail.subjects.map((subj: any, idx: number) => (
                      <tr key={subj.subject_id} className="hover:bg-gray-50/70 transition-colors">
                        <td className="py-3 px-4 text-center text-gray-400">{idx + 1}</td>
                        <td className="py-3 px-4 font-mono font-bold text-gray-600">{subj.code || "-"}</td>
                        <td className="py-3 px-4 font-bold text-gray-900">{subj.name}</td>
                        <td className="py-3 px-4 text-center font-semibold text-gray-600">{subj.max_marks}</td>
                        <td className="py-3 px-4 text-center font-semibold text-emerald-800">{subj.pass_marks}</td>
                        <td className="py-3 px-4 text-center font-bold text-sm">
                          {subj.is_absent ? (
                            <span className="text-red-600 font-bold">Absent</span>
                          ) : subj.marks_obtained !== null ? (
                            <span className={subj.is_passed ? "text-gray-900" : "text-red-600 font-bold"}>
                              {subj.marks_obtained}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center font-bold">
                          {subj.is_absent ? (
                            <span className="text-red-600">FAILED (AB)</span>
                          ) : subj.is_passed ? (
                            <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] border border-emerald-200">
                              <Check size={12} /> PASSED
                            </span>
                          ) : (
                            <span className="text-red-600 bg-red-50 px-2 py-0.5 rounded text-[11px] border border-red-200">
                              FAILED
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Performance Summary Banner */}
              {selectedExamDetail.result && (
                <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-50 via-amber-50 to-emerald-50 border border-emerald-200 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-[#b38e44] tracking-widest block">
                      OVERALL PERFORMANCE STATUS
                    </span>
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-2xl font-black ${
                          selectedExamDetail.result.is_complete
                            ? selectedExamDetail.result.is_passed
                              ? "text-emerald-800"
                              : "text-red-600"
                            : "text-amber-700"
                        }`}
                      >
                        {selectedExamDetail.result.is_complete
                          ? selectedExamDetail.result.is_passed
                            ? "PASSED"
                            : "FAILED"
                          : "INCOMPLETE"}
                      </span>
                      <span className="text-base font-bold text-gray-700">
                        {selectedExamDetail.result.percentage}%
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-xs">
                    <div className="p-3 bg-white/80 rounded-xl border border-gray-200 text-center">
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">Total Marks</span>
                      <strong className="text-sm text-gray-900">
                        {selectedExamDetail.result.total_marks_obtained} / {selectedExamDetail.result.total_max_marks}
                      </strong>
                    </div>

                    <div className="p-3 bg-white/80 rounded-xl border border-gray-200 text-center">
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">Percentage</span>
                      <strong className="text-sm text-emerald-900">{selectedExamDetail.result.percentage}%</strong>
                    </div>

                    <div className="p-3 bg-white/80 rounded-xl border border-gray-200 text-center col-span-2 sm:col-span-1">
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">Class Rank</span>
                      <strong className="text-sm text-[#b38e44]">
                        {selectedExamDetail.result.class_rank ? `#${selectedExamDetail.result.class_rank}` : "N/A"}
                      </strong>
                    </div>
                  </div>
                </div>
              )}

              {/* Authentication Signatures Note */}
              <div className="pt-4 border-t flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-500 gap-2">
                <span>Digitally verified and authenticated by Controller of Examinations, WMO IGA.</span>
                <span className="font-mono text-gray-400">Issue Date: {new Date().toLocaleDateString("en-GB")}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
