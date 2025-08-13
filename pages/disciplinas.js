import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { createClient } from '../lib/supabaseClient';
import Layout from '../components/Layout';
import Link from 'next/link';

const supabase = createClient();

export default function Disciplinas() {
  const router = useRouter();
  const [disciplinas, setDisciplinas] = useState([]);
  const [nome, setNome] = useState('');
  const [professor, setProfessor] = useState('');
  const [semestre, setSemestre] = useState('');
  const [observacoes, setObservacoes] = useState('');

  // Edit modal state
  const [isEditing, setIsEditing] = useState(false);
  const [editingDisciplina, setEditingDisciplina] = useState(null);
  const [editNome, setEditNome] = useState('');
  const [editProfessor, setEditProfessor] = useState('');
  const [editSemestre, setEditSemestre] = useState('');
  const [editObservacoes, setEditObservacoes] = useState('');

  useEffect(() => {
    fetchDisciplinas();
  }, []);

  const fetchDisciplinas = async () => {
    const { data, error } = await supabase
      .from('disciplinas')
      .select('*')
      .eq('arquivada', false)
      .order('id', { ascending: false });

    if (!error) setDisciplinas(data);
    else console.error(error);
  };

  const addDisciplina = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('disciplinas').insert([
      { nome, professor, semestre, observacoes }
    ]);
    if (error) {
      console.error(error);
      alert('Erro ao cadastrar: ' + error.message);
      return;
    }
    setNome('');
    setProfessor('');
    setSemestre('');
    setObservacoes('');
    fetchDisciplinas();
  };

  const archiveDisciplina = async (id) => {
    const { error } = await supabase.from('disciplinas').update({ arquivada: true }).eq('id', id);
    if (error) {
      console.error(error);
      alert('Erro ao arquivar: ' + error.message);
    } else {
      fetchDisciplinas();
    }
  };

  const deleteDisciplina = async (id) => {
    const { error } = await supabase.from('disciplinas').delete().eq('id', id);
    if (error) {
      console.error(error);
      alert('Erro ao excluir: ' + error.message);
    } else {
      fetchDisciplinas();
    }
  };

  const openEdit = (d) => {
    setEditingDisciplina(d);
    setEditNome(d.nome || '');
    setEditProfessor(d.professor || '');
    setEditSemestre(d.semestre || '');
    setEditObservacoes(d.observacoes || '');
    setIsEditing(true);
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    if (!editingDisciplina) return;
    const { error } = await supabase
      .from('disciplinas')
      .update({
        nome: editNome,
        professor: editProfessor,
        semestre: editSemestre,
        observacoes: editObservacoes
      })
      .eq('id', editingDisciplina.id);
    if (error) {
      console.error(error);
      alert('Erro ao editar: ' + error.message);
      return;
    }
    setIsEditing(false);
    setEditingDisciplina(null);
    fetchDisciplinas();
  };

  const acessarDisciplina = (id) => {
    router.push(`/lousa/${id}`);
  };

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-azul">Gerenciar Disciplinas</h1>
        <Link href="/disciplinas_arquivadas" className="bg-amarelo text-white px-4 py-2 rounded hover:bg-azul transition">
          Disciplinas Arquivadas
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <form onSubmit={addDisciplina} className="bg-white p-6 rounded-xl shadow-md border-l-4 border-azul">
          <h2 className="text-lg font-bold mb-4 text-azul">Cadastrar Nova Disciplina</h2>
          <input
            type="text"
            placeholder="Nome da disciplina *"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full p-2 border rounded mb-3"
            required
          />
          <input
            type="text"
            placeholder="Professor"
            value={professor}
            onChange={(e) => setProfessor(e.target.value)}
            className="w-full p-2 border rounded mb-3"
          />
          <input
            type="text"
            placeholder="Semestre (ex: 2025/1)"
            value={semestre}
            onChange={(e) => setSemestre(e.target.value)}
            className="w-full p-2 border rounded mb-3"
          />
          <textarea
            placeholder="Observações"
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            className="w-full p-2 border rounded mb-3"
          />
          <button type="submit" className="w-full bg-azul text-white p-2 rounded font-semibold hover:bg-laranja transition">
            Cadastrar
          </button>
        </form>

        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-laranja">
          <h2 className="text-lg font-bold mb-4 text-azul">Disciplinas Cadastradas</h2>

          {disciplinas.length === 0 && (
            <p className="text-gray-600">Nenhuma disciplina cadastrada.</p>
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
                      onClick={() => acessarDisciplina(d.id)}
                      className="bg-azul text-white px-3 py-1 rounded hover:bg-laranja transition"
                    >
                      Acessar
                    </button>
                    <button
                      onClick={() => openEdit(d)}
                      className="bg-verde text-white px-3 py-1 rounded hover:bg-azul transition"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => archiveDisciplina(d.id)}
                      className="bg-amarelo text-white px-3 py-1 rounded hover:bg-azul transition"
                    >
                      Arquivar
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
      </div>

      {/* Modal de edição simples */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-lg">
          <h2 className="text-xl font-bold text-azul mb-4">Editar Disciplina</h2>
            <form onSubmit={saveEdit}>
              <input
                type="text"
                placeholder="Nome da disciplina *"
                value={editNome}
                onChange={(e) => setEditNome(e.target.value)}
                className="w-full p-2 border rounded mb-3"
                required
              />
              <input
                type="text"
                placeholder="Professor"
                value={editProfessor}
                onChange={(e) => setEditProfessor(e.target.value)}
                className="w-full p-2 border rounded mb-3"
              />
              <input
                type="text"
                placeholder="Semestre (ex: 2025/1)"
                value={editSemestre}
                onChange={(e) => setEditSemestre(e.target.value)}
                className="w-full p-2 border rounded mb-3"
              />
              <textarea
                placeholder="Observações"
                value={editObservacoes}
                onChange={(e) => setEditObservacoes(e.target.value)}
                className="w-full p-2 border rounded mb-3"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => { setIsEditing(false); setEditingDisciplina(null); }}
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-azul text-white hover:bg-laranja"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
