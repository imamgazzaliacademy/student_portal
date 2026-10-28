"use client";

import React from "react";
import {
  X,
  Bell,
  Download,
  Calendar,
  FileText,
  Clock,
  Sparkles,
  Inbox,
  ExternalLink,
} from "lucide-react";
import { useNotifications } from "@/context/NotificationContext";

export default function NotificationDrawer() {
  const { announcements, loading, isOpen, closeNotifications } = useNotifications();

  return (
    <>
      {/* Backdrop Overlay */}
      <div
        className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-xs transition-opacity duration-300 ease-in-out ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeNotifications}
        aria-hidden="true"
      />

      {/* Right-Side Slide-Over Sidebar */}
      <aside
        className={`fixed inset-y-0 right-0 z-50 w-full sm:w-[420px] md:w-[460px] bg-white shadow-2xl border-l border-[#e8dfc8] flex flex-col transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Student Announcements"
      >
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-[#07261d] via-[#0d3b2e] to-[#165342] text-white flex items-center justify-between border-b border-[#b38e44]/40 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-[#b38e44]/50 flex items-center justify-center text-[#d4af37] shadow-inner">
              <Bell size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-white">Announcements</h2>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#b38e44]/30 text-[#fdfbf7] border border-[#b38e44]/50">
                  {announcements.length} {announcements.length === 1 ? "Notice" : "Notices"}
                </span>
              </div>
              <p className="text-[11px] text-emerald-200">
                Official notices and updates for students
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeNotifications}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-white/40"
            aria-label="Close announcements"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-[#fdfbf7]">
          {loading ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-8 h-8 border-3 border-[#0d3b2e] border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-semibold text-gray-500">Checking for announcements...</p>
            </div>
          ) : announcements.length === 0 ? (
            <div className="py-16 px-6 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-[#0d3b2e]/10 text-[#0d3b2e] flex items-center justify-center mx-auto border border-[#0d3b2e]/20">
                <Inbox size={26} />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-sm text-gray-900">No Announcements Right Now</h3>
                <p className="text-xs text-gray-500 max-w-xs mx-auto leading-relaxed">
                  When new institutional announcements, schedules, or exam circulars are released for students, they will appear here.
                </p>
              </div>
            </div>
          ) : (
            announcements.map((item) => (
              <div
                key={item.id}
                className="p-4 sm:p-5 rounded-2xl bg-white border border-[#e8dfc8] hover:border-[#b38e44] shadow-xs hover:shadow-md transition-all space-y-3 group"
              >
                {/* Notice Header */}
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Notice
                  </span>
                  {item.createdAt && (
                    <span className="text-[11px] text-gray-400 flex items-center gap-1 font-medium">
                      <Clock size={12} />
                      {new Date(item.createdAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-sm sm:text-base font-bold text-gray-900 leading-snug group-hover:text-[#0d3b2e] transition-colors">
                  {item.title}
                </h3>

                {/* Content */}
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                  {item.content}
                </p>

                {/* Attachment Section */}
                {item.attachment_url && (
                  <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2 text-xs text-gray-600 truncate min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-emerald-50 text-[#0d3b2e] border border-emerald-200 flex items-center justify-center shrink-0">
                        <FileText size={14} />
                      </div>
                      <span className="font-semibold truncate text-gray-800 text-[11px]">
                        {item.attachment_name || "Attachment Document"}
                      </span>
                    </div>

                    <a
                      href={item.attachment_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-[#0d3b2e] hover:bg-[#07261d] active:scale-95 shadow-xs transition-all shrink-0 cursor-pointer"
                    >
                      <Download size={13} />
                      <span>{item.download_link_text || "Download File"}</span>
                    </a>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-white border-t border-[#e8dfc8] text-center shrink-0">
          <p className="text-[11px] text-gray-400">
            Imam Gazzali Academy • Official Student Portal
          </p>
        </div>
      </aside>
    </>
  );
}
