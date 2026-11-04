"use client";

import React, { useState, useEffect } from "react";
import apiClient from "@/services/api";
import { toast } from "react-toastify";
import {
  FileDown,
  Download,
  Search,
  X,
  FileText,
  Calendar,
  AlertCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  FileCheck,
} from "lucide-react";

interface AcademicFormItem {
  id: number;
  title: string;
  description: string | null;
  file_url: string;
  file_name: string;
  file_size: number | null;
  file_type: string;
  createdAt: string;
  download_url?: string;
}

export default function AcademicFormsPage() {
  const [forms, setForms] = useState<AcademicFormItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  const fetchForms = async (pageNumber = 1, searchQuery = "") => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get("/academic-forms", {
        params: {
          page: pageNumber,
          limit: 12,
          search: searchQuery || undefined,
        },
      });

      if (res.data?.success) {
        const rows = res.data.data?.rows || [];
        setForms(rows);
        setTotalPages(res.data.data?.totalPages || 1);
        setTotalItems(res.data.data?.total || rows.length);
        setPage(pageNumber);
      } else {
        setError(res.data?.message || "Failed to load academic forms.");
      }
    } catch (err: any) {
      console.error("Error fetching academic forms:", err);
      setError(
        err.response?.data?.message ||
        err.message ||
        "Could not load academic forms. Please check your network connection."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForms(page, search);
  }, [page]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchForms(1, search);
  };

  const handleClearSearch = () => {
    setSearch("");
    fetchForms(1, "");
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes || isNaN(bytes)) return null;
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFormatBadge = (fileType: string) => {
    const ft = (fileType || "").toLowerCase();
    if (ft === "pdf") {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-red-100/70 text-red-700 border border-red-200">
          PDF
        </span>
      );
    }
    if (ft === "doc" || ft === "docx") {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100/70 text-blue-700 border border-blue-200">
          DOCX
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-700 border border-gray-200">
        {ft.toUpperCase()}
      </span>
    );
  };

  const handleDownload = async (item: AcademicFormItem) => {
    setDownloadingId(item.id);
    const loadingToast = toast.loading(`Preparing "${item.title}" for download...`);

    try {
      // Use direct streaming endpoint with blob handling to retain original filename
      const response = await apiClient.get(`/academic-forms/${item.id}/download`, {
        responseType: "blob",
      });

      const extension = (item.file_name.split(".").pop() || item.file_type || "pdf").toLowerCase();
      let mimeType = "application/octet-stream";
      if (extension === "pdf") mimeType = "application/pdf";
      if (extension === "doc") mimeType = "application/msword";
      if (extension === "docx") {
        mimeType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      }

      const blob = new Blob([response.data], { type: mimeType });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", item.file_name || `Academic_Form_${item.id}.${extension}`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      toast.update(loadingToast, {
        render: `"${item.title}" downloaded successfully!`,
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (err: any) {
      console.error("Download failed:", err);
      let errorMsg = "Failed to download form. Please try again.";

      if (err.response?.data instanceof Blob) {
        try {
          const text = await err.response.data.text();
          const json = JSON.parse(text);
          errorMsg = json.message || errorMsg;
        } catch {
          // Keep default message
        }
      } else if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      }

      toast.update(loadingToast, {
        render: errorMsg,
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
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
          <FileDown className="text-[#0d3b2e]" size={26} />
          Academic Forms Download
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Download blank student forms and applications to print, fill, and submit to the academy office.
        </p>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-[#e8dfc8] shadow-xs">
        <form
          onSubmit={handleSearchSubmit}
          className="flex flex-col sm:flex-row items-center justify-between gap-3"
        >
          <div className="relative w-full sm:max-w-md">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search forms by title or keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#0d3b2e]/20 focus:border-[#0d3b2e] transition-all"
            />
            {search && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-[#0d3b2e] hover:bg-[#0d3b2e]/90 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => fetchForms(1, search)}
              title="Refresh"
              className="p-2 border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer"
            >
              <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </form>
      </div>

      {/* Error State */}
      {error && !loading && (
        <div className="p-6 rounded-2xl bg-red-50/70 border border-red-200 text-center space-y-3">
          <AlertCircle size={32} className="mx-auto text-red-500" />
          <h3 className="text-sm font-bold text-red-800">Unable to load forms</h3>
          <p className="text-xs text-red-600 max-w-md mx-auto">{error}</p>
          <button
            onClick={() => fetchForms(page, search)}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-700 transition-colors cursor-pointer"
          >
            <RefreshCw size={13} />
            <span>Try Again</span>
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="p-16 text-center text-xs text-gray-500 bg-white rounded-3xl border border-[#e8dfc8]">
          <div className="w-8 h-8 border-4 border-[#0d3b2e] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <span>Retrieving downloadable academic forms...</span>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && forms.length === 0 && (
        <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-[#e8dfc8] space-y-2">
          <FileText size={40} className="mx-auto text-gray-300" />
          <h3 className="font-bold text-gray-800 text-sm">No Academic Forms Found</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            {search
              ? `No forms matched your search "${search}". Try searching for another keyword.`
              : "There are currently no downloadable forms published. Please check back later or contact the academy office."}
          </p>
          {search && (
            <button
              onClick={handleClearSearch}
              className="mt-2 text-xs font-semibold text-[#0d3b2e] hover:underline cursor-pointer"
            >
              Clear search filter
            </button>
          )}
        </div>
      )}

      {/* Forms Grid */}
      {!loading && !error && forms.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {forms.map((item) => {
            const sizeStr = formatFileSize(item.file_size);
            const dateStr = item.createdAt
              ? new Date(item.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
              : null;

            const isDownloading = downloadingId === item.id;

            return (
              <div
                key={item.id}
                className="flex flex-col justify-between p-5 rounded-2xl bg-white border border-[#e8dfc8] shadow-xs hover:border-[#b38e44] hover:shadow-md transition-all group"
              >
                {/* Top section: Badges & Date */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      {getFormatBadge(item.file_type)}
                      {/* {sizeStr && (
                        <span className="text-[11px] text-gray-500 font-mono bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                          {sizeStr}
                        </span>
                      )} */}
                    </div>
                    {dateStr && (
                      <span className="text-[11px] text-gray-400 flex items-center gap-1">
                        <Calendar size={11} />
                        {dateStr}
                      </span>
                    )}
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-gray-900 group-hover:text-[#0d3b2e] transition-colors leading-snug">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-xs text-gray-500 mt-1.5 line-clamp-3 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Bottom section: File name & Download button */}
                <div className="pt-4 mt-4 border-t border-gray-100 space-y-2.5">
                  <div className="flex items-center gap-1.5 text-[11px] text-gray-400 font-mono truncate">
                    <FileCheck size={13} className="shrink-0 text-emerald-600" />
                    <span className="truncate">{item.file_name}</span>
                  </div>

                  <button
                    onClick={() => handleDownload(item)}
                    disabled={isDownloading}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#0d3b2e] hover:bg-[#0d3b2e]/90 text-white transition-all shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    <Download size={14} className={isDownloading ? "animate-bounce" : ""} />
                    <span>{isDownloading ? "Downloading..." : "Download"}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {!loading && !error && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-[#e8dfc8] shadow-xs text-xs text-gray-600">
          <div className="text-center sm:text-left">
            Showing page <span className="font-bold text-gray-900">{page}</span> of{" "}
            <span className="font-bold text-gray-900">{totalPages}</span> ({totalItems} total forms)
          </div>
          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="inline-flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-30 transition-colors cursor-pointer"
            >
              <ChevronLeft size={14} />
              <span>Previous</span>
            </button>
            <span className="px-2 font-bold text-gray-800">Page {page}</span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
              className="inline-flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-30 transition-colors cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
