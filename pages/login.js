import { useState } from 'react';
import { createClient } from '../lib/supabaseClient';

const supabase = createClient();

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    else window.location.href = '/inicio';
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-azul to-laranja">
      <div className="p-8 bg-white shadow-2xl rounded-xl w-96">
        <img src="/logo-onticamente.png" alt="Logo" className="mb-4 mx-auto h-40" />
        <h2 className="text-2xl font-bold mb-4 text-center text-azul">Login Onticamente</h2>
        {error && <p className="text-red-500 mb-2 text-center">{error}</p>}
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded mb-3 focus:outline-none focus:ring-2 focus:ring-azul"
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-azul"
          />
          <button
            type="submit"
            className="w-full bg-azul text-white p-3 rounded font-semibold hover:bg-laranja transition-colors"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
