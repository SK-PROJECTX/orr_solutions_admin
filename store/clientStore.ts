import { create } from 'zustand';
import { clientAPI } from '@/app/services';

interface Client {
  id: string;
  name: string;
  company: string;
}

interface ClientStore {
  clients: Client[];
  isLoading: boolean;
  error: string | null;
  fetchClients: () => Promise<void>;
}

export const useClientStore = create<ClientStore>((set) => ({
  clients: [],
  isLoading: false,
  error: null,

  fetchClients: async () => {
    set({ isLoading: true });
    try {
      const response = await clientAPI.listClients({}) as any;
      const data = Array.isArray(response) ? response : (response.results || response.data || []);
      
      const mappedClients = data.map((c: any) => ({
        id: c.id.toString(),
        name: c.full_name || c.name || 'Unknown',
        company: c.company || 'N/A'
      }));
      
      set({ clients: mappedClients, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch clients', isLoading: false });
    }
  },
}));
