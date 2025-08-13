import { useState, useEffect } from 'react';
import { createClient } from '../lib/supabaseClient';
import Layout from '../components/Layout';

const supabase = createClient();

export default function DisciplinasArquivadas() {
  const [disciplinas, setDisciplinas] = useState([]);

  useEffect(() => {
    fetchDisciplinas();
  }, []);

  const fetchDisciplinas = async () => {
    const { data, error } = await supabase
      .from('disciplinas')
      .select('*')
      .eq('arquivada', true)
      .order('id', { ascending: false });

    if (!error) setDisciplinas(data);
  };

  const restoreDisciplina = async (id) => {
    await supabase.from('disciplinas').update({ arquivada: false }).eq('id', id);
    fetchDisciplinas();
  };

  const deleteDisciplina = async (id) => {
    await supabase.from('disciplinas').delete().eq('id', id);
    fetchDisciplinas();
  };

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-6 text-azul">Disciplinas Arquivadas</h1>

      <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-verde">
        {disciplinas.length === 0 && (
          <p className="text-gray-600">Nenhuma disciplina arquivada.</p>
        )}

        <ul className="space-y-3">
          {disciplinas.map((d) => (
            <li
              key={d.id}
              className="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow transition border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-azul">{d.nome}</h3>
                  <div className="text-sm text-gray-600 space-x-2 mt-1">
                    {d.professor && (
                      <span className="inline-block bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                        Prof: {d.professor}
                      </span>
                    )}
                    {d.semestre && (
                      <span className="inline-block bg-green-100 text-green-700 px-2 py-0.5 rounded">
                        {d.semestre}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => restoreDisciplina(d.id)}
                    className="bg-verde text-white px-3 py-1 rounded hover:bg-azul transition"
                  >
                    Restaurar
                  </button>
                  <button
                    onClick={() => deleteDisciplina(d.id)}
                    className="bg-laranja text-white px-3 py-1 rounded hover:bg-red-600 transition"
                  >
                    Excluir
                  </button>
                </div>
              </div>

              {d.observacoes && (
                <p className="text-gray-700 text-sm mt-2">{d.observacoes}</p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
}
