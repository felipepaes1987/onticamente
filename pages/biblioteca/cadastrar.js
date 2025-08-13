import { useState } from 'react';
import { useRouter } from 'next/router';
import { createClient } from '../../lib/supabaseClient';
import Layout from '../../components/Layout';

const supabase = createClient();

export default function CadastrarLivro() {
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [descricao, setDescricao] = useState('');
  const router = useRouter();

  const addLivro = async (e) => {
    e.preventDefault();
    await supabase.from('livros').insert([{ titulo, autor, descricao }]);
    router.push('/biblioteca');
  };

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-6 text-azul">Cadastrar Livro</h1>
      <form onSubmit={addLivro} className="bg-white p-6 rounded shadow-md max-w-md">
        <input
          type="text"
          placeholder="Título *"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
          className="w-full p-2 border rounded mb-3"
        />
        <input
          type="text"
          placeholder="Autor"
          value={autor}
          onChange={(e) => setAutor(e.target.value)}
          className="w-full p-2 border rounded mb-3"
        />
        <textarea
          placeholder="Descrição"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          className="w-full p-2 border rounded mb-3"
        />
        <button type="submit" className="w-full bg-azul text-white p-2 rounded hover:bg-laranja transition">
          Salvar
        </button>
      </form>
    </Layout>
  );
}
