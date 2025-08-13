import Link from 'next/link';
import { createClient } from '../lib/supabaseClient';
import { useEffect, useState } from 'react';
import {
  Home,
  BookOpen,
  Layers,
  Book,
  Users,
  LogOut,
  Globe,
  Database,
  Bot
} from 'lucide-react';

const supabase = createClient();

export default function Layout({ children }) {
  const [isOnline, setIsOnline] = useState(true);
  const [supabaseStatus, setSupabaseStatus] = useState('Verificando...');

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  useEffect(() => {
    const updateOnlineStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    updateOnlineStatus();

    const checkSupabase = async () => {
      try {
        const { error } = await supabase.from('disciplinas').select('id').limit(1);
        setSupabaseStatus(error ? 'Offline' : 'Conectado');
      } catch {
        setSupabaseStatus('Offline');
      }
    };
    checkSupabase();
    const interval = setInterval(checkSupabase, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-1">
        <aside className="w-64 bg-azul text-white flex flex-col p-4">
          <div className="flex items-center justify-center mb-6">
            <img src="/logo-onticamente.png" alt="Logo Onticamente" className="h-40" />
          </div>
          <nav className="flex-1">
            <ul className="space-y-3">
              <li>
                <Link href="/inicio" className="flex items-center gap-2 hover:text-laranja transition">
                  <Home size={18} /> Início
                </Link>
              </li>
              <li>
                <Link href="/disciplinas" className="flex items-center gap-2 hover:text-laranja transition">
                  <Layers size={18} /> Disciplinas
                </Link>
              </li>
              <li>
                <Link href="/biblioteca" className="flex items-center gap-2 hover:text-laranja transition">
                  <BookOpen size={18} /> Biblioteca
                </Link>
              </li>
              <li>
                <Link href="/dicionario" className="flex items-center gap-2 hover:text-laranja transition">
                  <Book size={18} /> Dicionário
                </Link>
              </li>
              <li>
                <Link href="/professores" className="flex items-center gap-2 hover:text-laranja transition">
                  <Users size={18} /> Professores
                </Link>
              </li>
            </ul>
          </nav>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center bg-laranja p-2 mt-4 rounded hover:bg-amarelo transition"
          >
            <LogOut size={18} className="mr-1" /> Sair
          </button>
        </aside>
        <main className="flex-1 p-6 overflow-y-auto bg-gray-50">{children}</main>
      </div>
      <footer className="bg-white border-t p-3 flex items-center justify-between text-sm text-gray-700">
        <span>© 2025 Onticamente | Sistema criado por Felipe Paes.</span>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1"><Globe size={14}/> Internet: {isOnline ? 'Online' : 'Offline'}</span>
          <span className="flex items-center gap-1"><Database size={14}/> Supabase: {supabaseStatus}</span>
          <span className="flex items-center gap-1"><Bot size={14}/> IA: Conectada</span>
        </div>
      </footer>
    </div>
  );
}
