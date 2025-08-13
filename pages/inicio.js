import Layout from '../components/Layout';

export default function Inicio() {
  return (
    <Layout>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-azul to-laranja p-6 rounded-xl shadow-lg text-white">
          <h2 className="text-xl font-bold mb-2">Últimas Disciplinas</h2>
          <p className="text-sm">Acesse rapidamente as disciplinas estudadas recentemente.</p>
        </div>
        <div className="bg-gradient-to-br from-verde to-amarelo p-6 rounded-xl shadow-lg text-white">
          <h2 className="text-xl font-bold mb-2">Biblioteca</h2>
          <p className="text-sm">Gerencie e acesse seus livros da Ontopsicologia.</p>
        </div>
      </div>
    </Layout>
  );
}
