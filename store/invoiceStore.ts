import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type InvoiceStatus = 'draft' | 'issued' | 'pending' | 'paid' | 'overdue';

export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string | number;
  clientName: string;
  clientEmail: string;
  clientAddress?: string;
  issueDate: string;
  dueDate: string;
  status: InvoiceStatus;
  items: InvoiceLineItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  totalAmount: number;
  notes?: string;
  automationLogs?: {
    remindersSent: number;
    lastReminderDate?: string;
    nextScheduledReminder?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceSettings {
  nextInvoiceNumber: number;
  numberPrefix: string;
  companyName: string;
  companyEmail: string;
  companyAddress: string;
  companyPhone: string;
  defaultTaxRate: number;
}

interface InvoiceState {
  invoices: Invoice[];
  settings: InvoiceSettings;
  isLoading: boolean;
  
  // Actions
  fetchInvoices: () => Promise<void>;
  createInvoice: (invoiceData: Partial<Invoice>) => Promise<Invoice>;
  updateInvoice: (id: string, updates: Partial<Invoice>) => Promise<void>;
  deleteInvoice: (id: string) => Promise<void>;
  getInvoiceById: (id: string) => Invoice | undefined;
  updateSettings: (settings: Partial<InvoiceSettings>) => Promise<void>;
}

// Mock Data
const MOCK_INVOICES: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'ORR-2026-0001',
    clientId: 'c1',
    clientName: 'Acme Corp',
    clientEmail: 'billing@acme.com',
    issueDate: '2026-04-01',
    dueDate: '2026-04-15',
    status: 'paid',
    items: [
      { id: 'i1', description: 'Monthly Consultation - April', quantity: 1, price: 1500, total: 1500 }
    ],
    subtotal: 1500,
    taxRate: 20,
    taxAmount: 300,
    totalAmount: 1800,
    automationLogs: {
      remindersSent: 0,
    },
    createdAt: '2026-04-01T10:00:00Z',
    updatedAt: '2026-04-05T14:30:00Z'
  },
  {
    id: '2',
    invoiceNumber: 'ORR-2026-0002',
    clientId: 'c2',
    clientName: 'Global Tech',
    clientEmail: 'finance@globaltech.io',
    issueDate: '2026-04-10',
    dueDate: '2026-04-24',
    status: 'pending',
    items: [
      { id: 'i2', description: 'Quarterly Infrastructure Audit', quantity: 1, price: 4500, total: 4500 },
      { id: 'i3', description: 'Cloud Resource Optimization', quantity: 10, price: 50, total: 500 }
    ],
    subtotal: 5000,
    taxRate: 20,
    taxAmount: 1000,
    totalAmount: 6000,
    automationLogs: {
      remindersSent: 1,
      lastReminderDate: '2026-04-15T09:00:00Z',
      nextScheduledReminder: '2026-04-22T09:00:00Z',
    },
    createdAt: '2026-04-10T09:00:00Z',
    updatedAt: '2026-04-10T09:00:00Z'
  },
  {
    id: '3',
    invoiceNumber: 'ORR-2026-0003',
    clientId: 'c3',
    clientName: 'Nexus Systems',
    clientEmail: 'accounts@nexus.sys',
    issueDate: '2026-03-15',
    dueDate: '2026-03-29',
    status: 'overdue',
    items: [
      { id: 'i4', description: 'Security Compliance Review', quantity: 1, price: 2500, total: 2500 }
    ],
    subtotal: 2500,
    taxRate: 20,
    taxAmount: 500,
    totalAmount: 3000,
    automationLogs: {
      remindersSent: 3,
      lastReminderDate: '2026-04-20T10:00:00Z',
    },
    createdAt: '2026-03-15T11:00:00Z',
    updatedAt: '2026-03-15T11:00:00Z'
  },
  {
    id: '4',
    invoiceNumber: 'ORR-2026-0004',
    clientId: 'c1',
    clientName: 'Acme Corp',
    clientEmail: 'billing@acme.com',
    issueDate: '2026-04-20',
    dueDate: '2026-05-04',
    status: 'issued',
    items: [
      { id: 'i5', description: 'Ad-hoc Technical Support', quantity: 5, price: 200, total: 1000 }
    ],
    subtotal: 1000,
    taxRate: 20,
    taxAmount: 200,
    totalAmount: 1200,
    automationLogs: {
      remindersSent: 0,
    },
    createdAt: '2026-04-20T15:00:00Z',
    updatedAt: '2026-04-20T15:00:00Z'
  }
];

export const useInvoiceStore = create<InvoiceState>()(
  persist(
    (set, get) => ({
      invoices: MOCK_INVOICES,
      settings: {
        nextInvoiceNumber: 3,
        numberPrefix: 'ORR-2026-',
        companyName: 'ORR Solutions',
        companyEmail: 'finance@orr.solutions',
        companyAddress: '123 Innovation Drive, London, UK',
        companyPhone: '+44 20 7946 0000',
        defaultTaxRate: 20
      },
      isLoading: false,

      fetchInvoices: async () => {
        set({ isLoading: true });
        // Simulating API call
        await new Promise(resolve => setTimeout(resolve, 800));
        set({ isLoading: false });
      },

      createInvoice: async (invoiceData) => {
        const { settings, invoices } = get();
        const nextNum = settings.nextInvoiceNumber;
        const invoiceNumber = `${settings.numberPrefix}${String(nextNum).padStart(4, '0')}`;
        
        const newInvoice: Invoice = {
          id: Math.random().toString(36).substr(2, 9),
          invoiceNumber,
          clientId: invoiceData.clientId || '',
          clientName: invoiceData.clientName || '',
          clientEmail: invoiceData.clientEmail || '',
          clientAddress: invoiceData.clientAddress || '',
          issueDate: invoiceData.issueDate || new Date().toISOString().split('T')[0],
          dueDate: invoiceData.dueDate || '',
          status: (invoiceData.status as InvoiceStatus) || 'draft',
          items: invoiceData.items || [],
          subtotal: invoiceData.subtotal || 0,
          taxRate: invoiceData.taxRate || settings.defaultTaxRate,
          taxAmount: invoiceData.taxAmount || 0,
          totalAmount: invoiceData.totalAmount || 0,
          notes: invoiceData.notes || '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set({ 
          invoices: [newInvoice, ...invoices],
          settings: { ...settings, nextInvoiceNumber: nextNum + 1 }
        });
        
        return newInvoice;
      },

      updateInvoice: async (id, updates) => {
        const { invoices } = get();
        set({
          invoices: invoices.map(inv => 
            inv.id === id ? { ...inv, ...updates, updatedAt: new Date().toISOString() } : inv
          )
        });
      },

      deleteInvoice: async (id) => {
        const { invoices } = get();
        set({ invoices: invoices.filter(inv => inv.id !== id) });
      },

      getInvoiceById: (id) => {
        return get().invoices.find(inv => inv.id === id);
      },

      updateSettings: async (newSettings) => {
        set(state => ({
          settings: { ...state.settings, ...newSettings }
        }));
      }
    }),
    {
      name: 'invoice-storage',
    }
  )
);
