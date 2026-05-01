"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
   FileText,
   Zap,
   Save,
   Share2,
   History,
   MessageSquare,
   Maximize2,
   ChevronLeft,
   MoreVertical,
   Layers,
   Activity,
   Download,
   Globe,
   Lock,
   Plus,
   Loader2,
   CheckCircle2,
   Sparkles,
   ArrowRight,
   Bold,
   Italic,
   Underline,
   AlignLeft,
   AlignCenter,
   AlignRight,
   Type,
   Image as ImageIcon,
   Table as TableIcon,
   Grid3X3,
   Presentation,
   Type as FontIcon,
   Search,
   PlusCircle,
   X,
   FileCode,
   FileSpreadsheet,
   PlaySquare,
   DownloadCloud,
   MoreHorizontal,
   UserPlus,
   Folder,
   FolderPlus,
   ChevronDown,
   ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { useLanguageStore } from '@/store/languageStore';

interface DocumentAsset {
   id: string;
   title: string;
   type: 'doc' | 'sheet' | 'slide';
   lastEdited: string;
   progress: number;
   content: string;
   folderId: string | null;
}

export default function DocumentStudioPage() {
   const { t } = useLanguageStore();
   const [activeDocument, setActiveDocument] = useState<DocumentAsset | null>(null);
   const [isSaving, setIsSaving] = useState(false);
   const [font, setFont] = useState('Inter');
   const [fontSize, setFontSize] = useState('14');
   const [isBold, setIsBold] = useState(false);
   const [isItalic, setIsItalic] = useState(false);
   const [showNewMenu, setShowNewMenu] = useState(false);
   const [showShareModal, setShowShareModal] = useState(false);
   const [showDownloadMenu, setShowDownloadMenu] = useState(false);
   const [sharedClients, setSharedClients] = useState<string[]>([]);
   const [pages, setPages] = useState([1]);
   const [isFullScreen, setIsFullScreen] = useState(false);
   const [drafts, setDrafts] = useState<DocumentAsset[]>([
      { id: '1', title: 'Q2 Strategy Report', type: 'doc', lastEdited: '10m ago', progress: 85, content: 'Strategic alignment for Q2 focuses on infrastructure scaling and AI integration layers...', folderId: 'f1' },
      { id: '2', title: 'Client Budget Projection', type: 'sheet', lastEdited: '2h ago', progress: 40, content: '', folderId: 'f2' },
      { id: '3', title: 'Infrastructure Audit V2', type: 'doc', lastEdited: 'Yesterday', progress: 100, content: 'Audit results indicate a 40% improvement in latency across all primary nodes.', folderId: 'f1' },
      { id: '4', title: 'Investor Pitch Deck', type: 'slide', lastEdited: '3h ago', progress: 60, content: '', folderId: null }
   ]);

   const [folders, setFolders] = useState([
      { id: 'f1', name: 'Strategic Reports', isOpen: true },
      { id: 'f2', name: 'Finance & Budgets', isOpen: false }
   ]);

   const handleSave = () => {
      setIsSaving(true);
      setTimeout(() => setIsSaving(false), 2000);
   };

   const createNewDocument = (type: 'doc' | 'sheet' | 'slide', folderId: string | null = null) => {
      const id = Math.random().toString(36).substr(2, 9);
      const titles = { doc: 'Untitled Document', sheet: 'Untitled Spreadsheet', slide: 'Untitled Presentation' };
      const newDoc: DocumentAsset = { 
         id, 
         title: titles[type], 
         type, 
         content: '', 
         lastEdited: 'Just now', 
         progress: 0, 
         folderId 
      };
      setDrafts(prev => [newDoc, ...prev]);
      setActiveDocument(newDoc);
      setShowNewMenu(false);
   };

   const createFolder = () => {
      const newFolder = {
         id: 'f' + Math.random().toString(36).substr(2, 5),
         name: 'New Folder',
         isOpen: true
      };
      setFolders(prev => [...prev, newFolder]);
   };

   const toggleFolder = (id: string) => {
      setFolders(prev => prev.map(f => f.id === id ? { ...f, isOpen: !f.isOpen } : f));
   };

   const clients = [
      { id: 1, name: 'Alex Thompson', company: 'Global Tech' },
      { id: 2, name: 'Sarah Chen', company: 'Innovate AI' },
      { id: 3, name: 'Marcus Miller', company: 'Nexus Systems' },
      { id: 4, name: 'Elena Rodriguez', company: 'Starlight Media' }
   ];

   const toggleShareClient = (name: string) => {
      setSharedClients(prev =>
         prev.includes(name) ? prev.filter(c => c !== name) : [...prev, name]
      );
   };

   // Toolbar Component
   const Toolbar = () => (
      <div className="h-12 border-b border-white/5 bg-white/5 backdrop-blur-md flex items-center px-4 gap-1 z-30 sticky top-0">
         <div className="flex items-center gap-2 border-r border-white/10 pr-4 mr-2">
            <select
               value={font}
               onChange={(e) => setFont(e.target.value)}
               className="bg-transparent text-[10px] font-black uppercase focus:outline-none text-white cursor-pointer hover:bg-white/5 px-2 py-1 rounded"
            >
               <option className="bg-slate-900">Inter</option>
               <option className="bg-slate-900">Roboto</option>
               <option className="bg-slate-900">Outfit</option>
               <option className="bg-slate-900">Mono</option>
            </select>
            <div className="h-4 w-px bg-white/10" />
            <select
               value={fontSize}
               onChange={(e) => setFontSize(e.target.value)}
               className="bg-transparent text-[10px] font-black uppercase focus:outline-none text-white cursor-pointer hover:bg-white/5 px-2 py-1 rounded w-12"
            >
               <option className="bg-slate-900">10</option>
               <option className="bg-slate-900">12</option>
               <option className="bg-slate-900">14</option>
               <option className="bg-slate-900">16</option>
               <option className="bg-slate-900">20</option>
            </select>
         </div>

         <div className="flex items-center gap-0.5 border-r border-white/10 pr-4 mr-2">
            <button
               onClick={() => setIsBold(!isBold)}
               className={`p-1.5 rounded-lg transition-all ${isBold ? 'bg-primary text-slate-900' : 'text-slate-400 hover:bg-white/5'}`}
            >
               <Bold size={16} />
            </button>
            <button
               onClick={() => setIsItalic(!isItalic)}
               className={`p-1.5 rounded-lg transition-all ${isItalic ? 'bg-primary text-slate-900' : 'text-slate-400 hover:bg-white/5'}`}
            >
               <Italic size={16} />
            </button>
            <button className="p-1.5 rounded-lg text-slate-400 hover:bg-white/5 transition-all">
               <Underline size={16} />
            </button>
         </div>

         <div className="flex items-center gap-0.5 border-r border-white/10 pr-4 mr-2">
            <button className="p-1.5 rounded-lg text-slate-400 hover:bg-white/5 transition-all"><AlignLeft size={16} /></button>
            <button className="p-1.5 rounded-lg text-slate-400 hover:bg-white/5 transition-all"><AlignCenter size={16} /></button>
            <button className="p-1.5 rounded-lg text-slate-400 hover:bg-white/5 transition-all"><AlignRight size={16} /></button>
         </div>

         <div className="flex items-center gap-0.5">
            <button className="p-1.5 rounded-lg text-slate-400 hover:bg-white/5 transition-all flex items-center gap-2 pr-3">
               <ImageIcon size={16} />
               <span className="text-[10px] font-black uppercase tracking-widest">Image</span>
            </button>
            <button className="p-1.5 rounded-lg text-slate-400 hover:bg-white/5 transition-all flex items-center gap-2 pr-3">
               <TableIcon size={16} />
               <span className="text-[10px] font-black uppercase tracking-widest">Table</span>
            </button>
         </div>

         <div className="flex-1" />

         <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/20 text-primary rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-primary/20 transition-all"
         >
            <Save size={14} /> Save Changes
         </button>
      </div>
   );

   // Editor Components
   const DocEditor = () => (
      <div className="flex-1 bg-[#010409] p-12 overflow-y-auto scrollbar-hide flex flex-col items-center gap-12">
         {pages.map((pageNumber) => (
            <div
               key={pageNumber}
               className="w-full max-w-[850px] bg-white/[0.03] border border-white/5 shadow-2xl min-h-[1100px] p-24 relative flex-shrink-0 transition-all hover:bg-white/[0.04]"
               style={{ fontFamily: font }}
            >
               {pageNumber === 1 && (
                  <div className="space-y-8">
                     <input
                        type="text"
                        value={activeDocument?.title}
                        onChange={(e) => setActiveDocument(prev => prev ? { ...prev, title: e.target.value } : null)}
                        className={`w-full bg-transparent border-none focus:outline-none text-4xl uppercase italic tracking-tighter text-white ${isBold ? 'font-black' : 'font-normal'} ${isItalic ? 'italic' : ''}`}
                        style={{ fontSize: `${parseInt(fontSize) * 2.5}px` }}
                        placeholder="Document Title"
                     />
                     <div className="h-px bg-white/10 w-full" />
                  </div>
               )}
               <div className="relative mt-8">
                  <textarea
                     value={pageNumber === 1 ? (activeDocument?.content || '') : ''}
                     onChange={(e) => {
                        if (pageNumber === 1) {
                           const content = e.target.value;
                           setActiveDocument(prev => prev ? { ...prev, content } : null);
                        }
                     }}
                     className="w-full bg-transparent border-none focus:outline-none resize-none min-h-[500px] leading-relaxed text-slate-400 placeholder:text-slate-600 overflow-hidden"
                     style={{
                        fontSize: `${fontSize}px`,
                        fontFamily: font,
                        height: 'auto'
                     }}
                     placeholder={pageNumber === 1 ? "Start typing your document repository layer..." : "Continue typing on page " + pageNumber + "..."}
                     spellCheck={false}
                  />
               </div>

               {pageNumber === pages.length && (
                  <div className="grid grid-cols-2 gap-8 my-12 pointer-events-none border-t border-white/5 pt-12 relative z-0">
                     <div className="aspect-video bg-white/5 rounded-3xl border border-white/10 flex items-center justify-center text-slate-600 italic text-[10px] font-black uppercase tracking-widest">
                        Document Image Overlay Placeholder
                     </div>
                     <div className="aspect-video bg-white/5 rounded-3xl border border-white/10 flex items-center justify-center text-slate-600 italic text-[10px] font-black uppercase tracking-widest">
                        Asset Reference View
                     </div>
                  </div>
               )}
               <div className="absolute bottom-8 right-8 text-[9px] font-black text-slate-600 uppercase tracking-widest">
                  Page {pageNumber} of {pages.length}
               </div>
            </div>
         ))}

         <button
            onClick={() => setPages(prev => [...prev, prev.length + 1])}
            className="group flex flex-col items-center gap-4 py-12"
         >
            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 group-hover:text-primary group-hover:border-primary/50 group-hover:bg-primary/10 transition-all">
               <Plus size={24} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 group-hover:text-primary transition-colors">Append Next Architecture Page</span>
         </button>
      </div>
   );

   const SheetEditor = () => (
      <div className="flex-1 bg-[#010409] overflow-hidden flex flex-col">
         <div className="p-4 border-b border-white/5 bg-white/5">
            <input
               type="text"
               value={activeDocument?.title}
               onChange={(e) => setActiveDocument(prev => prev ? { ...prev, title: e.target.value } : null)}
               className="bg-transparent border-none focus:outline-none text-xl font-black uppercase italic tracking-tighter text-white w-full"
               placeholder="Sheet Title"
            />
         </div>
         <div className="h-8 bg-white/5 border-b border-white/10 flex items-center px-4 gap-2">
            <div className="w-10 h-6 bg-primary/10 border border-primary/20 rounded flex items-center justify-center text-[10px] font-black text-primary uppercase">fx</div>
            <input type="text" className="bg-transparent flex-1 text-[11px] font-bold text-white focus:outline-none" defaultValue="=SUM(A1:B20) / AI_ADJUSTMENT" />
         </div>
         <div className="flex-1 overflow-auto">
            <table className="w-full border-collapse">
               <thead>
                  <tr>
                     <th className="w-10 bg-white/5 border border-white/10 text-[9px] font-black text-slate-600"></th>
                     {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'].map(col => (
                        <th key={col} className="bg-white/5 border border-white/10 p-2 text-[10px] font-black text-slate-500 uppercase tracking-widest w-32">{col}</th>
                     ))}
                  </tr>
               </thead>
               <tbody>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map(row => (
                     <tr key={row}>
                        <td className="bg-white/5 border border-white/10 text-center text-[9px] font-black text-slate-600">{row}</td>
                        {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'].map(col => (
                           <td key={col} className="border border-white/5 p-3 min-w-[120px] hover:bg-primary/5 transition-colors cursor-cell group">
                              <input
                                 type="text"
                                 className="bg-transparent w-full text-xs font-medium text-slate-400 group-hover:text-white focus:outline-none"
                                 defaultValue={row === 1 ? `Header ${col}` : ''}
                              />
                           </td>
                        ))}
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
   );

   const SlideEditor = () => (
      <div className="flex-1 flex overflow-hidden bg-[#010409]">
         <div className="w-48 border-r border-white/5 bg-white/[0.02] overflow-y-auto p-4 space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
               <div key={i} className={`aspect-video rounded-xl border-2 transition-all cursor-pointer hover:border-primary/50 group relative ${i === 1 ? 'border-primary' : 'border-white/10'}`}>
                  <div className="absolute top-1 left-1 text-[8px] font-black text-slate-500">{i}</div>
                  <div className="w-full h-full bg-white/5 rounded-lg flex flex-col items-center justify-center p-2">
                     <div className="w-full h-1 bg-white/10 rounded-full mb-1" />
                     <div className="w-2/3 h-1 bg-white/10 rounded-full mb-2" />
                     <div className="grid grid-cols-2 gap-1 w-full">
                        <div className="h-4 bg-white/5 rounded" />
                        <div className="h-4 bg-white/5 rounded" />
                     </div>
                  </div>
               </div>
            ))}
            <button className="w-full aspect-video rounded-xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-2 text-slate-600 hover:text-primary hover:border-primary/50 transition-all">
               <PlusCircle size={20} />
               <span className="text-[8px] font-black uppercase tracking-widest">Add Slide</span>
            </button>
         </div>
         <div className="flex-1 p-12 overflow-y-auto flex items-center justify-center">
            <div className="w-full max-w-4xl aspect-video bg-white/[0.03] border border-white/5 rounded-[40px] shadow-2xl p-16 flex flex-col justify-center gap-8 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] rounded-full" />
               <div className="space-y-4 relative z-10">
                  <input
                     type="text"
                     value={activeDocument?.title}
                     onChange={(e) => setActiveDocument(prev => prev ? { ...prev, title: e.target.value } : null)}
                     className={`w-full bg-transparent border-none focus:outline-none text-6xl font-black italic uppercase tracking-tighter text-white ${isBold ? 'font-black' : 'font-bold'}`}
                     style={{ fontFamily: font }}
                     placeholder="Presentation Title"
                  />
                  <div className="h-1 w-32 bg-primary rounded-full" />
               </div>
               <div className="space-y-4 relative z-10">
                  <input
                     type="text"
                     value={activeDocument?.content || 'Infrastructure Architecture Phase 01'}
                     onChange={(e) => setActiveDocument(prev => prev ? { ...prev, content: e.target.value } : null)}
                     className="w-full bg-transparent border-none focus:outline-none text-2xl text-slate-400 font-medium tracking-tight"
                     placeholder="Slide Description"
                  />
                  <p className="text-sm text-slate-600 font-black uppercase tracking-[0.3em]">ORR Solutions Portfolio • 2024</p>
               </div>

               <div className="absolute bottom-12 right-12 flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400">
                     <ImageIcon size={20} />
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400">
                     <Presentation size={20} />
                  </div>
               </div>
            </div>
         </div>
      </div>
   );

   const ShareModal = () => (
      <motion.div
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         exit={{ opacity: 0 }}
         className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
      >
         <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="w-full max-w-lg bg-[#0d1117] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl"
         >
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
               <div>
                  <h3 className="text-xl font-black uppercase italic tracking-tighter">Share Asset</h3>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Manage Workspace Access</p>
               </div>
               <button onClick={() => setShowShareModal(false)} className="p-2 hover:bg-white/5 rounded-xl text-slate-500 transition-all">
                  <X size={20} />
               </button>
            </div>

            <div className="p-8 space-y-6">
               <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  <input
                     type="text"
                     placeholder="Search clients or stakeholders..."
                     className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-xs focus:outline-none focus:border-primary/50 transition-all"
                  />
               </div>

               <div className="space-y-3">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">Available Clients</p>
                  <div className="max-h-60 overflow-y-auto space-y-2 pr-2 scrollbar-hide">
                     {clients.map(client => (
                        <div key={client.id} className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between group hover:border-primary/30 transition-all">
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black text-xs uppercase">
                                 {client.name.charAt(0)}
                              </div>
                              <div>
                                 <p className="text-xs font-black uppercase tracking-tight">{client.name}</p>
                                 <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{client.company}</p>
                              </div>
                           </div>
                           <button
                              onClick={() => toggleShareClient(client.name)}
                              className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${sharedClients.includes(client.name)
                                    ? 'bg-primary text-slate-900 border-primary'
                                    : 'bg-white/5 text-slate-400 border-white/10 hover:border-primary/50'
                                 }`}
                           >
                              {sharedClients.includes(client.name) ? 'Revoke' : 'Grant Access'}
                           </button>
                        </div>
                     ))}
                  </div>
               </div>

               {sharedClients.length > 0 && (
                  <div className="p-4 bg-primary/5 border border-primary/20 rounded-2xl">
                     <p className="text-[9px] font-black uppercase tracking-widest text-primary mb-3">Active Access List</p>
                     <div className="flex flex-wrap gap-2">
                        {sharedClients.map(name => (
                           <div key={name} className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-lg text-[9px] font-black uppercase text-white flex items-center gap-2">
                              {name}
                              <button onClick={() => toggleShareClient(name)}><X size={10} /></button>
                           </div>
                        ))}
                     </div>
                  </div>
               )}
            </div>

            <div className="p-8 bg-white/[0.02] border-t border-white/5 flex gap-4">
               <button
                  onClick={() => setShowShareModal(false)}
                  className="flex-1 py-4 bg-primary text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-lemon transition-all"
               >
                  Update Permissions
               </button>
            </div>
         </motion.div>
      </motion.div>
   );

   const DownloadMenu = () => (
      <motion.div
         initial={{ opacity: 0, y: 10, scale: 0.95 }}
         animate={{ opacity: 1, y: 0, scale: 1 }}
         className="absolute right-0 top-full mt-4 w-64 bg-[#0d1117] border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-[100]"
      >
         <div className="p-4 border-b border-white/5">
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Export Formats</p>
         </div>
         <div className="p-2">
            {[
               { icon: FileText, label: 'Portable Document (PDF)', ext: '.pdf' },
               { icon: FileCode, label: 'Microsoft Word (DOCX)', ext: '.docx' },
               { icon: FileSpreadsheet, label: 'Microsoft Excel (XLSX)', ext: '.xlsx' },
               { icon: PlaySquare, label: 'Presentation (PPTX)', ext: '.pptx' },
               { icon: Globe, label: 'Web Page (HTML)', ext: '.html' }
            ].map((item, idx) => (
               <button
                  key={idx}
                  className="w-full p-3 flex items-center gap-3 hover:bg-white/5 rounded-xl text-left transition-all group"
                  onClick={() => setShowDownloadMenu(false)}
               >
                  <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 group-hover:text-primary group-hover:border-primary/30 transition-all">
                     <item.icon size={16} />
                  </div>
                  <div>
                     <p className="text-[10px] font-black uppercase tracking-tight text-slate-300 group-hover:text-white">{item.label}</p>
                     <p className="text-[8px] font-bold text-slate-600 uppercase group-hover:text-primary/70">Export as {item.ext}</p>
                  </div>
               </button>
            ))}
         </div>
      </motion.div>
   );

   return (
      <div className="h-screen bg-card text-white flex flex-col relative overflow-hidden">
         {/* Background Glows */}
         <div className="fixed inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full" />
         </div>
         
         {/* Header */}
         {!isFullScreen && (
            <header className="h-20 border-b border-white/5 backdrop-blur-xl bg-white/5 flex items-center justify-between px-8 z-20">
               <div className="flex items-center gap-6">
                  <Link href="/document-vault/all" className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-all text-slate-400">
                     <ChevronLeft size={20} />
                  </Link>
                  <div>
                     <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-primary">
                        <Sparkles size={12} /> Creation Studio
                     </div>
                     <h1 className="text-xl font-black uppercase italic tracking-tighter">
                        {activeDocument ? activeDocument.title : 'Initialize Workspace'}
                     </h1>
                  </div>
               </div>

               <div className="flex items-center gap-4">
                  {activeDocument && (
                     <>
                        <div className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-xl">
                           <div className={`w-2 h-2 rounded-full ${isSaving ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'}`} />
                           <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                              {isSaving ? 'Synchronizing...' : 'All Changes Synced'}
                           </span>
                        </div>
                     </>
                  )}
                  <button 
                     onClick={() => setShowShareModal(true)}
                     className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-all text-slate-400 flex items-center gap-2"
                  >
                     <Share2 size={20} />
                     {sharedClients.length > 0 && (
                        <span className="w-5 h-5 rounded-full bg-primary text-slate-900 text-[10px] font-black flex items-center justify-center">
                           {sharedClients.length}
                        </span>
                     )}
                  </button>
                  <div className="relative">
                     <button 
                        onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                        className={`p-3 rounded-2xl border transition-all ${showDownloadMenu ? 'bg-primary text-slate-900 border-primary shadow-[0_0_15px_rgba(205,255,0,0.3)]' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}`}
                     >
                        <Download size={20} />
                     </button>
                     <AnimatePresence>
                        {showDownloadMenu && <DownloadMenu />}
                     </AnimatePresence>
                  </div>
                  <button className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-all text-slate-400">
                     <MoreVertical size={20} />
                  </button>
               </div>
            </header>
         )}

         {/* Main Workspace */}
         <main className="flex-1 flex overflow-hidden">
            {/* Sidebar: Projects & Drafts */}
            {!isFullScreen && (
               <aside className="w-80 border-r border-white/5 bg-white/[0.02] flex flex-col z-10">
                  <div className="p-6 relative">
                     <button 
                        onClick={() => setShowNewMenu(!showNewMenu)}
                        className="w-full py-4 bg-primary/10 hover:bg-primary/20 border border-primary/20 rounded-2xl flex items-center justify-center gap-3 text-xs font-black uppercase tracking-widest transition-all group text-primary"
                     >
                        <Plus size={18} className={`transition-transform duration-300 ${showNewMenu ? 'rotate-45' : ''}`} />
                        New Repository Asset
                     </button>

                     <AnimatePresence>
                        {showNewMenu && (
                           <motion.div 
                              initial={{ opacity: 0, y: 10, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 10, scale: 0.95 }}
                              className="absolute top-full left-6 right-6 mt-4 bg-[#0d1117] border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-50"
                           >
                              <div className="p-2">
                                 {[
                                    { icon: FileText, label: 'Google Docs', type: 'doc', color: 'text-blue-400', bg: 'bg-blue-400/10' },
                                    { icon: Grid3X3, label: 'Google Sheets', type: 'sheet', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
                                    { icon: Presentation, label: 'Google Slides', type: 'slide', color: 'text-amber-400', bg: 'bg-amber-400/10' }
                                 ].map((item) => (
                                    <button 
                                       key={item.type}
                                       onClick={() => createNewDocument(item.type as any)}
                                       className="w-full p-4 flex items-center gap-4 hover:bg-white/5 rounded-xl transition-all group"
                                    >
                                       <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform`}>
                                          <item.icon size={20} />
                                       </div>
                                       <div className="text-left">
                                          <p className="text-[11px] font-black uppercase tracking-tight text-white">{item.label}</p>
                                          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Create New Session</p>
                                       </div>
                                    </button>
                                 ))}
                              </div>
                              <div className="p-4 bg-white/5 border-t border-white/5">
                                 <button className="w-full flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-white transition-colors">
                                    <PlusCircle size={12} /> More Assets
                                 </button>
                              </div>
                           </motion.div>
                        )}
                     </AnimatePresence>
                  </div>

                  <div className="flex-1 overflow-y-auto px-4 pb-8 space-y-6">
                     <div className="flex items-center justify-between px-2">
                        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] italic">Repository Structure</h3>
                        <button 
                           onClick={createFolder}
                           className="p-2 hover:bg-white/5 rounded-lg text-slate-500 hover:text-primary transition-all"
                           title="Create New Folder"
                        >
                           <FolderPlus size={14} />
                        </button>
                     </div>

                     <div className="space-y-4">
                        {/* Folders */}
                        {folders.map(folder => (
                           <div key={folder.id} className="space-y-1">
                              <button 
                                 onClick={() => toggleFolder(folder.id)}
                                 className="w-full flex items-center gap-2 p-2 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-all group"
                              >
                                 {folder.isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                 <Folder size={16} className={folder.isOpen ? 'text-primary' : 'text-slate-600'} />
                                 <span className="text-[11px] font-black uppercase tracking-tight flex-1 text-left">{folder.name}</span>
                                 <span className="text-[9px] font-bold text-slate-700">{drafts.filter(d => d.folderId === folder.id).length}</span>
                              </button>
                              
                              {folder.isOpen && (
                                 <div className="ml-4 pl-4 border-l border-white/5 space-y-2 py-1">
                                    {drafts.filter(d => d.folderId === folder.id).map(draft => (
                                       <button
                                          key={draft.id}
                                          onClick={() => setActiveDocument(draft as any)}
                                          className={`w-full p-3 rounded-xl flex items-center gap-3 transition-all border ${activeDocument?.id === draft.id
                                             ? 'bg-primary/10 border-primary/20 text-white shadow-[0_0_20px_rgba(205,255,0,0.05)]'
                                             : 'bg-transparent border-transparent text-slate-500 hover:bg-white/5 hover:text-slate-300'
                                             }`}
                                       >
                                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${draft.type === 'doc' ? 'bg-blue-500/20 text-blue-400' : draft.type === 'sheet' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                                             }`}>
                                             {draft.type === 'doc' ? <FileText size={16} /> : draft.type === 'sheet' ? <Grid3X3 size={16} /> : <Presentation size={16} />}
                                          </div>
                                          <div className="text-left flex-1 min-w-0">
                                             <p className="text-[11px] font-black uppercase truncate tracking-tight">{draft.title}</p>
                                          </div>
                                       </button>
                                    ))}
                                    {drafts.filter(d => d.folderId === folder.id).length === 0 && (
                                       <p className="text-[9px] text-slate-700 italic py-2">No assets in this container.</p>
                                    )}
                                 </div>
                              )}
                           </div>
                        ))}

                        {/* Uncategorized */}
                        <div className="space-y-1 mt-6">
                           <div className="flex items-center gap-2 p-2 text-slate-600 mb-2">
                              <Layers size={14} />
                              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Uncategorized Assets</span>
                           </div>
                           <div className="space-y-2">
                              {drafts.filter(d => !d.folderId).map(draft => (
                                 <button
                                    key={draft.id}
                                    onClick={() => setActiveDocument(draft as any)}
                                    className={`w-full p-4 rounded-2xl flex items-center gap-4 transition-all border ${activeDocument?.id === draft.id
                                       ? 'bg-primary/10 border-primary/30 text-white shadow-[0_0_20px_rgba(205,255,0,0.05)]'
                                       : 'bg-white/5 border-transparent text-slate-500 hover:bg-white/10'
                                       }`}
                                 >
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${draft.type === 'doc' ? 'bg-blue-500/20 text-blue-400' : draft.type === 'sheet' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                                       }`}>
                                       {draft.type === 'doc' ? <FileText size={20} /> : draft.type === 'sheet' ? <Grid3X3 size={20} /> : <Presentation size={20} />}
                                    </div>
                                    <div className="text-left flex-1 min-w-0">
                                       <p className={`text-sm font-black uppercase truncate ${activeDocument?.id === draft.id ? 'text-white' : 'text-slate-300'}`}>
                                          {draft.title}
                                       </p>
                                       <p className="text-[9px] font-bold uppercase tracking-widest opacity-60 mt-0.5">
                                          {draft.lastEdited}
                                       </p>
                                    </div>
                                 </button>
                              ))}
                           </div>
                        </div>
                     </div>
                  </div>
               </aside>
            )}

            {/* Editor Area */}
            <div className="flex-1 relative flex flex-col">
               <AnimatePresence mode="wait">
                  {activeDocument ? (
                     <motion.div
                        key={activeDocument.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex-1 flex flex-col overflow-hidden"
                     >
                        <Toolbar />
                        {activeDocument.type === 'doc' && <DocEditor />}
                        {activeDocument.type === 'sheet' && <SheetEditor />}
                        {activeDocument.type === 'slide' && <SlideEditor />}
                     </motion.div>
                  ) : (
                     <div className="flex-1 flex items-center justify-center bg-[#010409]">
                        <div className="text-center space-y-6 max-w-sm">
                           <div className="w-24 h-24 rounded-[40px] bg-white/5 border border-white/10 flex items-center justify-center text-slate-700 mx-auto">
                              <Layers size={48} className="opacity-20" />
                           </div>
                           <div className="space-y-2">
                              <h3 className="text-2xl font-black text-white uppercase italic">Studio Workspace</h3>
                              <p className="text-slate-500 text-sm font-medium">Select a drafting session to initialize the document architecture suite.</p>
                           </div>
                        </div>
                     </div>
                  )}
               </AnimatePresence>

               {/* Editor Footer Tools */}
               <div className="h-12 border-t border-white/5 bg-white/5 backdrop-blur-xl flex items-center justify-between px-8 text-slate-500">
                  <div className="flex items-center gap-8">
                     <button 
                        onClick={() => setIsFullScreen(!isFullScreen)}
                        className={`flex items-center gap-2 transition-colors ${isFullScreen ? 'text-primary' : 'hover:text-white'}`}
                     >
                        <Maximize2 size={14} />
                        <span className="text-[9px] font-black uppercase tracking-widest">{isFullScreen ? 'Exit Full Screen' : 'Focus Mode'}</span>
                     </button>
                     <button className="flex items-center gap-2 hover:text-white transition-colors">
                        <History size={14} />
                        <span className="text-[9px] font-black uppercase tracking-widest">Timeline</span>
                     </button>
                  </div>
                  <div className="flex items-center gap-6">
                     <p className="text-[9px] font-black uppercase tracking-widest">Drafting Infrastructure v0.4</p>
                  </div>
               </div>
            </div>

            {/* Right Panel: Intelligence */}
            {!isFullScreen && (
               <aside className="w-96 border-l border-white/5 bg-white/[0.02] flex flex-col z-10">
                  <div className="p-6 border-b border-white/5 flex items-center gap-3">
                     <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <Zap size={20} />
                     </div>
                     <div>
                        <h3 className="text-sm font-black uppercase italic tracking-tighter">Gemini Suite</h3>
                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">AI Drafting Agent</p>
                     </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-6 space-y-8">
                     <div className="bg-primary/5 border border-primary/20 rounded-[32px] p-6 space-y-4">
                        <p className="text-xs text-white leading-relaxed font-medium">
                           "I can help you structure the data in {activeDocument?.title || 'this asset'}. Should I suggest an architectural outline?"
                        </p>
                        <button className="w-full py-2 bg-primary text-slate-900 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-lemon transition-all">Generate Outline</button>
                     </div>
                  </div>

                  <div className="p-6 border-t border-white/5">
                     <div className="relative">
                        <input
                           type="text"
                           placeholder="Ask Gemini..."
                           className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-4 pr-12 text-xs text-white focus:outline-none focus:border-primary/50"
                        />
                        <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-primary text-slate-900 rounded-xl">
                           <ArrowRight size={14} />
                        </button>
                     </div>
                  </div>
               </aside>
            )}
         </main>

         {/* Modals */}
         <AnimatePresence>
            {showShareModal && <ShareModal />}
         </AnimatePresence>
      </div>
   );
}
