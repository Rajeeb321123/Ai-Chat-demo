// hook to close and open Rent Modal

// Zustand is lightweight alternative to Reducer
import { create } from 'zustand';

interface OnAiThinkingStore {
  inputTemp: string;
  initiateParticleCollapse: boolean;
  oninitiateParticleCollapse:(temp:boolean)=>void;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onInputTemp:(temp: string) => void;
}

const useAiThinking = create<OnAiThinkingStore>((set) => ({
  inputTemp:'',
  isOpen: false,
  initiateParticleCollapse: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  onInputTemp: (temp:string) => set({inputTemp:temp}),
  oninitiateParticleCollapse: (temp:boolean) => set({initiateParticleCollapse:temp})
}));


export default useAiThinking;