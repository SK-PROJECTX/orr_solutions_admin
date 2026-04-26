import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthService } from '@/lib/auth';

export type TransactionType = 'credit' | 'debit' | 'refund';
// ... (omitting types for brevity in TargetContent matching)
// Wait, I need to match the original content exactly.
// I'll just match the fetchData part.

export type TransactionStatus = 'pending' | 'completed' | 'failed';

export interface WalletTransaction {
  id: string;
  userId: string | number;
  userName: string;
  type: TransactionType;
  amount: number;
  currency: string;
  description: string;
  status: TransactionStatus;
  timestamp: string;
  referenceId?: string; // e.g., Invoice ID or Stripe Session ID
  metadata?: {
    vaultUnlockEvent?: boolean;
    insufficientBalance?: boolean;
    automationTriggered?: boolean;
    ipAddress?: string;
  };
}

export interface SystemEvent {
  id: string;
  type: 'vault_unlock' | 'auto_settlement' | 'manual_adjustment' | 'dispute_raised';
  description: string;
  timestamp: string;
  userId: string | number;
  userName: string;
  referenceId?: string;
}

export interface UserWallet {
  userId: string | number;
  userName: string;
  userEmail: string;
  balance: number;
  currency: string;
  lastUpdated: string;
}

interface WalletState {
  wallets: UserWallet[];
  transactions: WalletTransaction[];
  systemEvents: SystemEvent[];
  isLoading: boolean;
  
  // Actions
  fetchData: () => Promise<void>;
  adjustBalance: (userId: string | number, amount: number, type: TransactionType, description: string, referenceId?: string) => Promise<void>;
  processRefund: (transactionId: string) => Promise<void>;
  triggerAutomation: (userId: string | number, type: SystemEvent['type'], description: string, referenceId?: string) => void;
  exportTransactions: () => string; // Returns CSV content
}

// Mock Data
const MOCK_WALLETS: UserWallet[] = [
  {
    userId: 'c1',
    userName: 'Acme Corp',
    userEmail: 'billing@acme.com',
    balance: 5000,
    currency: 'USD',
    lastUpdated: '2026-04-20T10:00:00Z'
  },
  {
    userId: 'c2',
    userName: 'Global Tech',
    userEmail: 'finance@globaltech.io',
    balance: 1250.50,
    currency: 'USD',
    lastUpdated: '2026-04-21T09:00:00Z'
  },
  {
    userId: 'c3',
    userName: 'Nexus Systems',
    userEmail: 'accounts@nexus.sys',
    balance: 0,
    currency: 'USD',
    lastUpdated: '2026-03-15T11:00:00Z'
  }
];

const MOCK_TRANSACTIONS: WalletTransaction[] = [
  {
    id: 'tx1',
    userId: 'c1',
    userName: 'Acme Corp',
    type: 'credit',
    amount: 5000,
    currency: 'USD',
    description: 'Manual wallet top-up',
    status: 'completed',
    timestamp: '2026-04-20T10:00:00Z'
  },
  {
    id: 'tx2',
    userId: 'c2',
    userName: 'Global Tech',
    type: 'debit',
    amount: 750,
    currency: 'USD',
    description: 'Payment for Invoice ORR-2026-0002',
    status: 'completed',
    timestamp: '2026-04-21T09:00:00Z',
    referenceId: '2'
  }
];

export const useWalletStore = create<WalletState>()(
  persist(
    (set, get) => ({
      wallets: MOCK_WALLETS,
      transactions: MOCK_TRANSACTIONS,
      systemEvents: [
        {
          id: 'ev1',
          type: 'vault_unlock',
          description: 'Document Vault unlocked for Acme Corp post-payment',
          timestamp: '2026-04-20T10:05:00Z',
          userId: 'c1',
          userName: 'Acme Corp'
        }
      ],
      isLoading: false,

      fetchData: async () => {
        set({ isLoading: true });
        try {
          const auth = AuthService.getInstance();
          const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://orr-backend.orr.solutions';
          
          // Fetch Wallets
          const walletsRes = await auth.makeAuthenticatedRequest(`${baseUrl}/admin-portal/v1/wallet-logs/wallets/`);
          const walletsRaw = await walletsRes.json();
          const walletsDataRaw = walletsRaw.data || walletsRaw || [];
          
          const mappedWallets = (Array.isArray(walletsDataRaw) ? walletsDataRaw : []).map((w: any) => {
            let name = w.userName;
            if (!name || name.toUpperCase() === 'N/A') {
              name = w.userEmail.split('@')[0];
            }
            return {
              ...w,
              userName: name
            };
          });

          // Fetch Transactions
          const txRes = await auth.makeAuthenticatedRequest(`${baseUrl}/admin-portal/v1/wallet-logs/transactions/`);
          const txRaw = await txRes.json();
          const txData = txRaw.data || txRaw || {};
          
          // Map backend fields to frontend store
          const mappedTransactions = (txData.transactions || []).map((t: any) => ({
            id: t.id?.toString() || Math.random().toString(),
            userId: t.user || 0,
            userName: t.client_name || 'Client',
            type: t.amount < 0 ? 'debit' : 'credit', // Corrected logic: negative is debit, positive is credit
            amount: Math.abs(parseFloat(t.amount)),
            currency: t.currency || 'USD',
            description: t.billing_title || 'Wallet Transaction',
            status: ['paid', 'succeeded', 'complete', 'completed'].includes(t.status?.toLowerCase()) ? 'completed' : 'pending',
            timestamp: t.transaction_date || t.created_at,
            referenceId: t.reference_id
          }));

          // Fetch Audit Trail for System Events
          const auditRes = await auth.makeAuthenticatedRequest(`${baseUrl}/admin-portal/v1/wallet-logs/audit-trail/`);
          const auditRaw = await auditRes.json();
          const auditData = auditRaw.data || auditRaw || {};

          // Map backend activities to system events
          const mappedEvents = (auditData.recent_activities || []).map((ev: any) => ({
            id: `ev_${ev.transaction_id}`,
            type: ['paid', 'succeeded', 'complete', 'completed'].includes(ev.status?.toLowerCase()) ? 'auto_settlement' : 'manual_adjustment',
            description: `Transaction ${ev.transaction_id} for ${ev.plan || 'Service'}`,
            timestamp: ev.timestamp,
            userId: ev.user_id || 0,
            userName: ev.user,
            referenceId: ev.transaction_id
          }));

          set({ 
            wallets: mappedWallets, 
            transactions: mappedTransactions,
            systemEvents: mappedEvents,
            isLoading: false 
          });
        } catch (error) {
          console.error("Error fetching wallet data:", error);
          set({ isLoading: false });
        }
      },

      adjustBalance: async (userId, amount, type, description, referenceId) => {
        set({ isLoading: true });
        try {
          const auth = AuthService.getInstance();
          const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://orr-backend.orr.solutions';
          
          await auth.makeAuthenticatedRequest(`${baseUrl}/admin-portal/v1/wallet-logs/adjust-balance/`, {
            method: 'POST',
            body: JSON.stringify({
              user_id: userId,
              amount: amount,
              type: type,
              description: description,
              reference_id: referenceId
            })
          });

          // Refresh data to show the new balance and transaction
          await get().fetchData();
        } catch (error) {
          console.error("Error adjusting balance:", error);
          set({ isLoading: false });
        }
      },

      processRefund: async (transactionId) => {
        const { transactions } = get();
        const tx = transactions.find(t => t.id === transactionId);
        if (!tx || tx.type !== 'debit') return;

        await get().adjustBalance(
          tx.userId,
          tx.amount,
          'refund',
          `Refund for transaction ${tx.id}`,
          tx.referenceId
        );

        set({
          transactions: get().transactions.map(t => 
            t.id === transactionId ? { ...t, status: 'failed', description: `${t.description} (Refunded)` } : t
          )
        });
      },

      triggerAutomation: (userId, type, description, referenceId) => {
        const { systemEvents, wallets } = get();
        const userName = wallets.find(w => w.userId === userId)?.userName || 'System';
        const newEvent: SystemEvent = {
          id: `ev_${Math.random().toString(36).substr(2, 9)}`,
          type,
          description,
          timestamp: new Date().toISOString(),
          userId,
          userName,
          referenceId
        };
        set({ systemEvents: [newEvent, ...systemEvents] });
      },

      exportTransactions: () => {
        const { transactions } = get();
        const headers = ['ID', 'User', 'Type', 'Amount', 'Status', 'Timestamp', 'Reference'];
        const rows = transactions.map(t => [
          t.id,
          t.userName,
          t.type,
          t.amount,
          t.status,
          t.timestamp,
          t.referenceId || ''
        ]);
        
        return [headers, ...rows].map(row => row.join(',')).join('\n');
      }
    }),
    {
      name: 'wallet-storage',
    }
  )
);
