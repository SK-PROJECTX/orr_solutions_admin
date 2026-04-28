import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type FileType = 'pdf' | 'docx' | 'xlsx' | 'pptx' | 'zip' | 'image' | 'video' | 'archive' | 'other';
export type Visibility = 'client' | 'internal';
export type ScanStatus = 'scanning' | 'passed' | 'failed' | 'skipped';

export interface AuditLog {
  id: string;
  action: 'upload' | 'download' | 'visibility_change' | 'unlock' | 'delete' | 'version_add' | 'metadata_update';
  docId: string;
  docTitle: string;
  performedBy: string;
  timestamp: string;
  details: string;
}

export interface DocumentVersion {
  id: string;
  versionNumber: number;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  uploadedAt: string;
  uploadedBy: string; // Admin Name
  hash: string; // For integrity
}

export interface DocumentAccessRule {
  type: 'immediate' | 'payment_linked' | 'invoice_linked' | 'date_linked';
  linkedId?: string; // Invoice ID or Payment ID
  description: string;
}

export interface Document {
  id: string;
  title: string;
  description: string;
  client: string;
  project: string;
  category: string;
  type: FileType;
  visibility: Visibility;
  scanStatus: ScanStatus;
  currentVersion: number;
  versions: DocumentVersion[];
  accessRule: DocumentAccessRule;
  createdAt: string;
  updatedAt: string;
  lastAccessedAt?: string;
  accessCount: number;
  feedback?: {
    id: string;
    author: string;
    content: string;
    createdAt: string;
  }[];
}

interface VaultStore {
  documents: Document[];
  auditLogs: AuditLog[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchDocuments: () => Promise<void>;
  uploadDocument: (doc: Omit<Document, 'id' | 'createdAt' | 'updatedAt' | 'accessCount' | 'versions' | 'currentVersion' | 'scanStatus'>, file: File) => Promise<void>;
  updateDocumentMetadata: (id: string, updates: Partial<Document>) => Promise<void>;
  uploadNewVersion: (id: string, file: File, uploadedBy: string) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;
  toggleVisibility: (id: string) => Promise<void>;
  addFeedback: (docId: string, author: string, content: string) => Promise<void>;
  batchUpdate: (ids: string[], updates: Partial<Document>) => Promise<void>;
  addAuditLog: (log: Omit<AuditLog, 'id' | 'timestamp'>) => void;
}

export const useVaultStore = create<VaultStore>()(
  persist(
    (set, get) => ({
      documents: [
        {
          id: 'DOC-001',
          title: 'Q1 Financial Strategy',
          description: 'Comprehensive financial roadmap for the upcoming quarter.',
          client: 'Acme Corp',
          project: 'Strategic Growth 2024',
          category: 'Finance',
          type: 'pdf',
          visibility: 'client',
          scanStatus: 'passed',
          currentVersion: 1,
          versions: [
            {
              id: 'V1',
              versionNumber: 1,
              fileName: 'q1_strategy_v1.pdf',
              fileUrl: '#',
              fileSize: 2400000,
              uploadedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
              uploadedBy: 'Admin Sarah',
              hash: 'sha256-abc123'
            }
          ],
          accessRule: {
            type: 'payment_linked',
            linkedId: 'PAY-882',
            description: 'Unlocked upon payment of Q1 Advisory Fee'
          },
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
          updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
          accessCount: 12,
          feedback: [
            { id: 'f1', author: 'John Doe (Client)', content: 'Excellent breakdown of the tax implications.', createdAt: new Date().toISOString() }
          ]
        },
        {
          id: 'DOC-002',
          title: 'Internal Compliance Audit',
          description: 'Internal working file for regulatory compliance check.',
          client: 'ORR Internal',
          project: 'Ops Compliance',
          category: 'Legal',
          type: 'xlsx',
          visibility: 'internal',
          scanStatus: 'passed',
          currentVersion: 2,
          versions: [
            {
              id: 'V1',
              versionNumber: 1,
              fileName: 'audit_draft.xlsx',
              fileUrl: '#',
              fileSize: 1200000,
              uploadedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
              uploadedBy: 'Admin Mike',
              hash: 'sha256-def456'
            },
            {
              id: 'V2',
              versionNumber: 2,
              fileName: 'audit_final.xlsx',
              fileUrl: '#',
              fileSize: 1300000,
              uploadedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
              uploadedBy: 'Admin Mike',
              hash: 'sha256-ghi789'
            }
          ],
          accessRule: {
            type: 'immediate',
            description: 'Internal access only'
          },
          createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
          updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
          accessCount: 5
        }
      ],
      auditLogs: [],
      isLoading: false,
      error: null,

      fetchDocuments: async () => {
        set({ isLoading: true });
        // Simulation
        setTimeout(() => set({ isLoading: false }), 500);
      },

      uploadDocument: async (docData, file) => {
        set({ isLoading: true });
        const newDoc: Document = {
          ...docData,
          id: `DOC-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          accessCount: 0,
          currentVersion: 1,
          scanStatus: 'scanning',
          versions: [
            {
              id: 'V1',
              versionNumber: 1,
              fileName: file.name,
              fileUrl: URL.createObjectURL(file),
              fileSize: file.size,
              uploadedAt: new Date().toISOString(),
              uploadedBy: 'Current Admin',
              hash: 'pending'
            }
          ]
        };

        set(state => ({ documents: [newDoc, ...state.documents] }));
        
        // Mock malware scan
        setTimeout(() => {
          set(state => ({
            documents: state.documents.map(d => 
              d.id === newDoc.id ? { ...d, scanStatus: 'passed' } : d
            )
          }));
        }, 3000);

        get().addAuditLog({
          action: 'upload',
          docId: newDoc.id,
          docTitle: newDoc.title,
          performedBy: 'Current Admin',
          details: `Initial upload: ${file.name}`
        });

        set({ isLoading: false });
      },

      updateDocumentMetadata: async (id, updates) => {
        const doc = get().documents.find(d => d.id === id);
        set(state => ({
          documents: state.documents.map(d => 
            d.id === id ? { ...d, ...updates, updatedAt: new Date().toISOString() } : d
          )
        }));
        
        if (doc) {
          get().addAuditLog({
            action: 'metadata_update',
            docId: id,
            docTitle: doc.title,
            performedBy: 'Current Admin',
            details: `Updated fields: ${Object.keys(updates).join(', ')}`
          });
        }
      },

      uploadNewVersion: async (id, file, uploadedBy) => {
        const doc = get().documents.find(d => d.id === id);
        set(state => ({
          documents: state.documents.map(d => {
            if (d.id === id) {
              const newVersionNumber = d.currentVersion + 1;
              const newVersion: DocumentVersion = {
                id: `V${newVersionNumber}`,
                versionNumber: newVersionNumber,
                fileName: file.name,
                fileUrl: URL.createObjectURL(file),
                fileSize: file.size,
                uploadedAt: new Date().toISOString(),
                uploadedBy,
                hash: 'pending'
              };
              return {
                ...d,
                currentVersion: newVersionNumber,
                versions: [newVersion, ...d.versions],
                updatedAt: new Date().toISOString()
              };
            }
            return d;
          })
        }));

        if (doc) {
          get().addAuditLog({
            action: 'version_add',
            docId: id,
            docTitle: doc.title,
            performedBy: uploadedBy,
            details: `Uploaded version ${doc.currentVersion + 1}: ${file.name}`
          });
        }
      },

      deleteDocument: async (id) => {
        const doc = get().documents.find(d => d.id === id);
        set(state => ({
          documents: state.documents.filter(d => d.id !== id)
        }));
        if (doc) {
           get().addAuditLog({
              action: 'delete',
              docId: id,
              docTitle: doc.title,
              performedBy: 'Current Admin',
              details: 'Document permanently removed'
           });
        }
      },

      toggleVisibility: async (id) => {
        const doc = get().documents.find(d => d.id === id);
        const newVisibility = doc?.visibility === 'client' ? 'internal' : 'client';
        set(state => ({
          documents: state.documents.map(d => 
            d.id === id ? { ...d, visibility: newVisibility } : d
          )
        }));
        if (doc) {
           get().addAuditLog({
              action: 'visibility_change',
              docId: id,
              docTitle: doc.title,
              performedBy: 'Current Admin',
              details: `Visibility toggled to ${newVisibility}`
           });
        }
      },

      addFeedback: async (docId, author, content) => {
        set(state => ({
          documents: state.documents.map(d => 
            d.id === docId ? { 
              ...d, 
              feedback: [...(d.feedback || []), { id: Date.now().toString(), author, content, createdAt: new Date().toISOString() }] 
            } : d
          )
        }));
      },

      batchUpdate: async (ids, updates) => {
        set(state => ({
          documents: state.documents.map(d => 
            ids.includes(d.id) ? { ...d, ...updates, updatedAt: new Date().toISOString() } : d
          )
        }));
      },

      addAuditLog: (logData) => {
        const newLog: AuditLog = {
          ...logData,
          id: `LOG-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
          timestamp: new Date().toISOString()
        };
        set(state => ({ auditLogs: [newLog, ...state.auditLogs] }));
      }
    }),
    {
      name: 'vault-storage',
    }
  )
);
