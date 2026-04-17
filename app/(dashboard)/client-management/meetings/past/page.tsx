"use client";

import { useState, useEffect } from "react";
import { Calendar, CheckCircle, User, FileText, Loader, Eye } from "lucide-react";
import { meetingAPI } from "@/app/services";
import type { MeetingListItem } from "@/app/services/types";
import Pagination from "@/app/components/common/Pagination";
import { useLanguageStore } from "@/store/languageStore";

export default function PastMeetingsPage() {
  const { t } = useLanguageStore();
  const [allMeetings, setAllMeetings] = useState<MeetingListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(7);

  useEffect(() => {
    fetchPastMeetings();
  }, []);

  const fetchPastMeetings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await meetingAPI.listMeetings({ status: 'completed' }) as any;
      console.log('Past meetings API response:', response);
      const meetingsData = Array.isArray(response) ? response : (response.results || response.data || []);
      console.log('Processed meetings data:', meetingsData);
      setAllMeetings(Array.isArray(meetingsData) ? meetingsData : []);
    } catch (err: any) {
      console.error("Failed to fetch past meetings:", err);
      setError(err.message || t('consultations.error_loading_past'));
      setAllMeetings([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return t('consultations.no_content');
    const date = new Date(dateString);
    const { language } = useLanguageStore.getState();
    return date.toLocaleString(language === 'en' ? "en-US" : "it-IT", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getMeetingTypeColor = (type: string) => {
    const colors = {
      discovery: "bg-blue-500/20 text-blue-300 border-blue-500/30",
      follow_up: "bg-green-500/20 text-green-300 border-green-500/30",
      consultation: "bg-purple-500/20 text-purple-300 border-purple-500/30",
      review: "bg-orange-500/20 text-orange-300 border-orange-500/30"
    };
    return colors[type as keyof typeof colors] || "bg-gray-500/20 text-gray-300 border-gray-500/30";
  };

  return (
    <div className="min-h-screen text-white relative overflow-hidden star">
      <div className="absolute inset-0 bg-[url('/stars.svg')] opacity-20 pointer-events-none" />

      <div className="relative z-10 p-4 md:p-8">
        <div className="bg-card backdrop-blur-sm rounded-2xl p-4 md:p-8 border border-white/10">
          <div className="mb-8">
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">{t('meetings.past_title')}</h1>
            <p className="text-gray-400">{t('meetings.past_subtitle')}</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="animate-spin" size={32} />
            </div>
          ) : (() => {
            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const paginatedMeetings = allMeetings.slice(startIndex, endIndex);

            return allMeetings.length === 0 ? (
              <div className="bg-white/5 border border-white/10 rounded-xl p-12 text-center">
                <CheckCircle size={48} className="mx-auto text-green-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">{t('meetings.no_past')}</h3>
                <p className="text-gray-400">{t('meetings.no_past_desc')}</p>
                {error && (
                  <p className="text-red-400 text-sm mt-2">{error}</p>
                )}
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <p className="text-sm text-gray-400">
                    {t('consultations.showing_meetings')} {paginatedMeetings.length} {t('consultations.of')} {allMeetings.length} {t('sidebar.client_meetings').toLowerCase()}
                  </p>
                </div>

                <div className="grid gap-4 mb-8">
                  {paginatedMeetings.map((meeting) => (
                    <div key={meeting.id} className="bg-gradient-to-r from-white/10 to-white/5 rounded-xl border border-white/10 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-white">{meeting.client_name}</h3>
                            <span className={`text-xs px-2 py-1 rounded border ${getMeetingTypeColor(meeting.meeting_type)}`}>
                              {t(`consultations.${meeting.meeting_type}` as any) || meeting.meeting_type.replace('_', ' ').toUpperCase()}
                            </span>
                            <span className="text-xs px-2 py-1 rounded border bg-green-500/20 text-green-300 border-green-500/30">
                              {t('dashboard.completed').toUpperCase()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-400 mb-1">{meeting.client_company}</p>
                          {meeting.host_name && (
                            <p className="text-sm text-black">{t('meetings.host')}: {meeting.host_name}</p>
                          )}
                        </div>
                        <CheckCircle className="text-green-400" size={24} />
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="text-xs text-gray-400 mb-1 block">{t('meetings.meeting_date')}</label>
                          <p className="text-sm text-white">{formatDateTime(meeting.confirmed_datetime || meeting.requested_datetime)}</p>
                        </div>
                        <div>
                          <label className="text-xs text-gray-400 mb-1 block">{t('meetings.duration')}</label>
                          <p className="text-sm text-white">{meeting.duration_minutes} {t('meetings.minutes')}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-white/10">
                        <div className="text-xs text-black">
                          {t('meetings.completed_on')} {formatDateTime(meeting.confirmed_datetime || meeting.created_at)}
                        </div>
                        <div className="flex items-center gap-3">
                          <button className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors">
                            <FileText size={14} />
                            {t('meetings.view_notes')}
                          </button>
                          <button className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors">
                            <Eye size={14} />
                            {t('tickets.view_details')}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {allMeetings.length > itemsPerPage && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(allMeetings.length / itemsPerPage)}
                    totalItems={allMeetings.length}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setCurrentPage}
                    onItemsPerPageChange={(newItemsPerPage) => {
                      setItemsPerPage(newItemsPerPage);
                      setCurrentPage(1);
                    }}
                  />
                )}
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
