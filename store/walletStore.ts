import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TransactionType = 'credit' | 'debit' | 'refund';
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
        await new Promise(resolve => setTimeout(resolve, 800));
        set({ isLoading: false });
      },

      adjustBalance: async (userId, amount, type, description, referenceId) => {
        const { wallets, transactions } = get();
        const timestamp = new Date().toISOString();
        const transactionId = `tx_${Math.random().toString(36).substr(2, 9)}`;
        
        const walletIndex = wallets.findIndex(w => w.userId === userId);
        if (walletIndex === -1) return;

        const updatedWallets = [...wallets];
        const currentWallet = updatedWallets[walletIndex];
        
        if (type === 'credit') {
          currentWallet.balance += amount;
        } else {
          currentWallet.balance -= amount;
        }
        currentWallet.lastUpdated = timestamp;

        const newTransaction: WalletTransaction = {
          id: transactionId,
          userId,
          userName: currentWallet.userName,
          type,
          amount,
          currency: currentWallet.currency,
          description,
          status: 'completed',
          timestamp,
          referenceId
        };

        set({
          wallets: updatedWallets,
          transactions: [newTransaction, ...transactions]
        });
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
