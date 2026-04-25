import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthService } from '@/lib/auth';

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

export interface InvoiceStats {
  totalPaid: number;
  totalOutstanding: number;
  overdueCount: number;
  totalInvoices: number;
  paymentSuccessRate: number;
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
  statistics: InvoiceStats;
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

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://orr-backend.orr.solutions';

export const useInvoiceStore = create<InvoiceState>()(
  persist(
    (set, get) => ({
      invoices: [],
      statistics: {
        totalPaid: 0,
        totalOutstanding: 0,
        overdueCount: 0,
        totalInvoices: 0,
        paymentSuccessRate: 0
      },
      settings: {
        nextInvoiceNumber: 0,
        numberPrefix: 'ORR-',
        companyName: 'ORR Solutions',
        companyEmail: 'finance@orr.solutions',
        companyAddress: '123 Innovation Drive, London, UK',
        companyPhone: '+44 20 7946 0000',
        defaultTaxRate: 20
      },
      isLoading: false,

      fetchInvoices: async () => {
        set({ isLoading: true });
        try {
          const auth = AuthService.getInstance();
          const response = await auth.makeAuthenticatedRequest(`${baseUrl}/admin-portal/v1/invoicing/overview/`);
          const result = await response.json();
          const data = result.data || result || {};
          
          const stats = data.invoice_statistics || {};
          const statistics: InvoiceStats = {
            totalPaid: stats.total_revenue || 0,
            totalOutstanding: (data.overdue_invoices || []).reduce((sum: number, inv: any) => sum + (inv.amount || 0), 0),
            overdueCount: (data.overdue_invoices || []).length,
            totalInvoices: stats.total_invoices || 0,
            paymentSuccessRate: stats.payment_success_rate || 0
          };
          
          // Map backend recent_invoices to frontend Invoice interface
          const mappedInvoices: Invoice[] = (data.recent_invoices || []).map((inv: any) => {
            let status = inv.status.toLowerCase() as InvoiceStatus;
            if (['succeeded', 'complete'].includes(status)) {
              status = 'paid';
            }

            return {
              id: inv.invoice_id,
              invoiceNumber: inv.invoice_id, // Backend uses Stripe invoice ID
              clientId: 0, // Placeholder
              clientName: inv.client_name,
              clientEmail: inv.client_email,
              issueDate: inv.billing_date,
              dueDate: (new Date(new Date(inv.billing_date).getTime() + 30*24*60*60*1000)).toISOString().split('T')[0],
              status,
              items: [{ id: '1', description: inv.plan, quantity: 1, price: inv.amount, total: inv.amount }],
              subtotal: inv.amount,
              taxRate: 20,
              taxAmount: inv.amount * 0.2,
              totalAmount: inv.amount, // Use the amount directly from backend
              createdAt: inv.created_date,
              updatedAt: inv.created_date,
              hosted_invoice_url: inv.hosted_invoice_url,
              invoice_pdf: inv.invoice_pdf
            };
          });

          set({ 
            invoices: mappedInvoices, 
            statistics,
            isLoading: false 
          });
        } catch (error) {
          console.error('Failed to fetch invoices:', error);
          set({ isLoading: false });
        }
      },

      createInvoice: async (invoiceData) => {
        set({ isLoading: true });
        try {
          const auth = AuthService.getInstance();
          const response = await auth.makeAuthenticatedRequest(`${baseUrl}/admin-portal/v1/invoicing/generate/`, {
            method: 'POST',
            body: JSON.stringify({
              client_id: invoiceData.clientId,
              amount: invoiceData.totalAmount || invoiceData.subtotal,
              description: invoiceData.items?.[0]?.description || 'Custom Service',
              plan: invoiceData.items?.[0]?.description || 'Custom',
              due_date: invoiceData.dueDate
            })
          });
          
          const result = await response.json();
          const data = result.data || result || {};
          const inv = data.invoice_details;
          
          if (!inv) {
            console.error('Invoice details missing in response:', result);
            const errorMessage = result.message || data.error || data.message || 'Failed to generate invoice details';
            throw new Error(errorMessage);
          }
          
          const newInvoice: Invoice = {
            id: inv.invoice_id,
            invoiceNumber: inv.invoice_id,
            clientId: invoiceData.clientId || 0,
            clientName: inv.client_name,
            clientEmail: inv.client_email,
            issueDate: inv.billing_date,
            dueDate: inv.due_date,
            status: (inv.status || 'pending').toLowerCase() as InvoiceStatus,
            items: invoiceData.items || [],
            subtotal: inv.amount,
            taxRate: 20,
            taxAmount: inv.amount * 0.2,
            totalAmount: inv.amount, // Changed: assuming backend amount is already total or subtotal (standardizing)
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };

          set(state => ({ 
            invoices: [newInvoice, ...state.invoices],
            isLoading: false 
          }));
          
          return newInvoice;
        } catch (error) {
          console.error('Failed to create invoice:', error);
          set({ isLoading: false });
          throw error;
        }
      },

      updateInvoice: async (id, updates) => {
        // Implement action if needed
      },

      deleteInvoice: async (id) => {
        // Implement action if needed
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
