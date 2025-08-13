import { useAssistant } from '../../context/AssistantContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export default function ChatPanel() {
  const { isOpen, setOpen, messages, ask, state } = useAssistant();
  const [input, setInput] = useState('');

  const onSubmit = async (e: any) => {
    e.preventDefault();
    if (!input.trim()) return;
    await ask(input.trim());
    setInput('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed right-4 bottom-20 w-full max-w-md h-[70vh] bg-white shadow-2xl rounded-2xl border border-gray-200 flex flex-col z-50 overflow-hidden"
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.98 }}
        >
          <div className="flex items-center justify-between p-3 border-b">
            <h3 className="font-bold text-blue-600">Colibri Assistente</h3>
            <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-gray-800">✕</button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.map(m => (
              <div key={m.id} className={m.role === 'user' ? 'text-right' : ''}>
                <div className={`inline-block px-3 py-2 rounded-xl ${m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
                  {m.content}
                </div>
              </div>
            ))}
            {state === 'thinking' && <div className="text-gray-400 text-sm">Colibri está pensando…</div>}
          </div>
          <form onSubmit={onSubmit} className="p-3 border-t flex gap-2">
            <input
              type="text"
              className="flex-1 border rounded px-3 py-2 focus:outline-none"
              placeholder="Pergunte algo…"
              value={input}
              onChange={e => setInput(e.target.value)}
            />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-orange-500">Enviar</button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}