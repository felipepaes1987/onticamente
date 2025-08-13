import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '../../lib/supabaseClient';
import Layout from '../../components/Layout';

const supabase = createClient();

export default function Biblioteca() {
  const [livros, setLivros] = useState([]);

  useEffect(() => {
    fetchLivros();
  }, []);

  const fetchLivros = async () => {
    const { data, error } = await supabase.from('livros').select('*').order('id', { ascending: false });
    if (error) console.error('Erro ao buscar livros:', error);
    else setLivros(data);
  };

  const deleteLivro = async (id) => {
    const { error } = await supabase.from('livros').delete().eq('id', id);
    if (error) console.error('Erro ao excluir livro:', error);
    else fetchLivros();
  };

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-azul">Biblioteca</h1>
        <Link href="/biblioteca/cadastrar" className="bg-azul text-white px-4 py-2 rounded hover:bg-laranja transition">
          Cadastrar Livro
        </Link>
      </div>

      {livros.length === 0 ? (
        <p className="text-gray-600">Nenhum livro cadastrado.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {livros.map((livro) => (
            <div key={livro.id} className="bg-white p-4 rounded shadow border-l-4 border-laranja">
              <h2 className="text-lg font-semibold text-azul">{livro.titulo}</h2>
              {livro.autor && <p className="text-sm text-gray-600">Autor: {livro.autor}</p>}
              {livro.descricao && <p className="text-gray-700 text-sm mt-2">{livro.descricao}</p>}
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => deleteLivro(livro.id)}
                  className="bg-laranja text-white px-3 py-1 rounded hover:bg-red-500 transition"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}
