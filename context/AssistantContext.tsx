import { createContext, useContext, useState, useMemo, ReactNode } from 'react';

type AssistantState = 'idle' | 'listening' | 'thinking' | 'speaking';
type Message = { id: string; role: 'user' | 'assistant' | 'system'; content: string; created_at: string; };

type AssistantContextType = {
  isOpen: boolean;
  setOpen: (v: boolean) => void;
  state: AssistantState;
  setState: (s: AssistantState) => void;
  messages: Message[];
  addMessage: (m: Message) => void;
  ask: (prompt: string) => Promise<void>;
};

const AssistantContext = createContext<AssistantContextType | null>(null);

export function AssistantProvider({ children }: { children: ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const [state, setState] = useState<AssistantState>('idle');
  const [messages, setMessages] = useState<Message[]>([]);

  const addMessage = (m: Message) => setMessages(prev => [...prev, m]);

  const ask = async (prompt: string) => {
    setState('thinking');
    addMessage({ id: crypto.randomUUID(), role: 'user', content: prompt, created_at: new Date().toISOString() });

    const reply = { id: crypto.randomUUID(), role: 'assistant', content: 'Resposta simulada do Colibri.', created_at: new Date().toISOString() };
    await new Promise(r => setTimeout(r, 600));
    addMessage(reply);
    setState('idle');
  };

  const value = useMemo(() => ({ isOpen, setOpen, state, setState, messages, addMessage, ask }), [isOpen, state, messages]);

  return <AssistantContext.Provider value={value}>{children}</AssistantContext.Provider>;
}

export const useAssistant = () => {
  const ctx = useContext(AssistantContext);
  if (!ctx) throw new Error('useAssistant must be used within AssistantProvider');
  return ctx;
};