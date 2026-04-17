"use client";

import {
    Clock,
    Link,
    MessageCircle,
    Share,
    Users,
    Plus
} from "lucide-react";
import { useLanguageStore } from "@/store/languageStore";

function ProjectManagementPage() {
  const { t, language } = useLanguageStore();

  return (
    <div>
      <div className="min-h-screen text-white relative overflow-hidden star">
        <div className="absolute inset-0 bg-[url('/stars.svg')] opacity-20 pointer-events-none" />

        <div className="relative z-10 p-4 md:p-8">
          <div className="bg-card backdrop-blur-sm rounded-2xl p-4 md:p-8 flex flex-col gap-6 md:gap-8 border border-white/10 shadow-2xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tight italic">
                  {t('project_mgmt.title')}
                </h1>
                <p className="text-gray-500 text-[10px] md:text-sm mt-1 uppercase tracking-[0.2em] font-bold">
                  {t('project_mgmt.subtitle')}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-gray-400 text-[10px] md:text-xs uppercase tracking-widest font-black">
                  {t('project_mgmt.team_members')}
                </p>
                <div className="bg-primary/20 aspect-square text-primary border border-primary/20 rounded-xl flex items-center justify-center cursor-pointer h-10 w-10 hover:bg-primary hover:text-white transition-all duration-300">
                    <Share size={18} />
                </div>
              </div>
            </div>

            <hr className="border-white/10" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
                <div className="relative flex-1 sm:min-w-[240px]">
                  <input
                    className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 transition-all"
                    type="text"
                    placeholder={t('project_mgmt.search_placeholder')}
                  />
                </div>
                <input
                  className="bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 transition-all font-mono"
                  type="date"
                />
              </div>
            </div>

            <div className="flex gap-6 overflow-x-auto pb-6 no-scrollbar">
              {/* To Do Column */}
              <div className="rounded-2xl bg-white/5 h-fit min-w-[300px] md:min-w-[350px] flex-1 border border-white/10 overflow-hidden shadow-xl">
                <div className="p-4 bg-white/10 border-b border-white/10 flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-[0.2em] text-white">{t('project_mgmt.board.todo')}</span>
                  <span className="bg-primary/20 text-primary text-[10px] font-black px-2 py-0.5 rounded-full border border-primary/20">4</span>
                </div>
                <div className="p-4 flex flex-col gap-4">
                  <button className="border-2 border-dashed border-white/10 flex items-center justify-center p-3 rounded-xl text-gray-500 hover:border-primary/50 hover:text-primary transition-all duration-300 group">
                    <Plus size={20} className="group-hover:scale-125 transition-transform" />
                  </button>
                  
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex flex-col gap-4 bg-white/5 p-4 rounded-2xl border border-white/5 hover:border-white/20 transition-all duration-300 group cursor-pointer shadow-lg hover:shadow-primary/5">
                      <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                              <p className="text-sm font-black text-white uppercase tracking-tight group-hover:text-primary transition-colors">Webdev Architecture</p>
                              <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1"> 
                                <Users size={12} className="text-gray-600"/> Cisco Infrastructure
                              </div>
                          </div>
                      </div>
                      <div className="flex items-center justify-between mt-2 pt-4 border-t border-white/5">
                          <div className="flex gap-4">
                              <div className="flex items-center gap-1.5 text-[10px] font-mono text-gray-400"><Link size={12}/> <span>7</span></div>
                              <div className="flex items-center gap-1.5 text-[10px] font-mono text-gray-400"><MessageCircle size={12}/> <span>8</span></div>
                          </div>
                          <div className="flex items-center gap-2 text-[10px] font-black text-orange-400 bg-orange-400/10 px-2 py-1 rounded-lg border border-orange-400/20">
                            <Clock size={12} /> 12 DAYS
                          </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* In Progress Column */}
              <div className="rounded-2xl bg-white/5 h-fit min-w-[300px] md:min-w-[350px] flex-1 border border-white/10 overflow-hidden shadow-xl">
                <div className="p-4 bg-white/10 border-b border-white/10 flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-[0.2em] text-white">{t('project_mgmt.board.in_progress')}</span>
                  <span className="bg-blue-500/20 text-blue-400 text-[10px] font-black px-2 py-0.5 rounded-full border border-blue-500/20">1</span>
                </div>
                <div className="p-4 flex flex-col gap-4">
                   <button className="border-2 border-dashed border-white/10 flex items-center justify-center p-3 rounded-xl text-gray-500 hover:border-blue-500/50 hover:text-blue-400 transition-all duration-300 group">
                    <Plus size={20} className="group-hover:scale-125 transition-transform" />
                  </button>

                  <div className="flex flex-col gap-4 bg-white/5 p-4 rounded-2xl border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 group cursor-pointer shadow-lg shadow-blue-500/5">
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-black text-white uppercase tracking-tight group-hover:text-blue-400 transition-colors">API Integration</p>
                            <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1"> 
                              <Users size={12} className="text-gray-600"/> Backend Team
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between mt-2 pt-4 border-t border-white/5">
                        <div className="flex gap-4">
                            <div className="flex items-center gap-1.5 text-[10px] font-mono text-gray-400"><Link size={12}/> <span>12</span></div>
                            <div className="flex items-center gap-1.5 text-[10px] font-mono text-gray-400"><MessageCircle size={12}/> <span>24</span></div>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-black text-blue-400 bg-blue-500/10 px-2 py-1 rounded-lg border border-blue-500/20">
                          <Clock size={12} /> 3 DAYS
                        </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Completed Column */}
              <div className="rounded-2xl bg-white/5 h-fit min-w-[300px] md:min-w-[350px] flex-1 border border-white/10 overflow-hidden shadow-xl opacity-60">
                 <div className="p-4 bg-white/10 border-b border-white/10 flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-[0.2em] text-white">COMPLETED</span>
                  <span className="bg-green-500/20 text-green-400 text-[10px] font-black px-2 py-0.5 rounded-full border border-green-500/20">0</span>
                </div>
                <div className="p-12 text-center">
                   <p className="text-[10px] text-gray-600 uppercase tracking-widest font-black italic">{t('payment_mgmt.empty')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectManagementPage;
