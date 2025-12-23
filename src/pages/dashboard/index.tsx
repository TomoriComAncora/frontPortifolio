import { Container } from "../../components/container";
import { Button } from "flowbite-react";
import { Link } from "react-router";
import { useEffect, useState } from "react";
import api from "../../server/api";
import { Pencil, Trash2 } from "lucide-react";

interface UsuarioProps {
  id: string;
  nome: string;
}

interface ProjetoProps {
  id: string;
  titulo: string;
  categoria: string;
  createdAt: string;
  imagemCapa: string;
  usuario: UsuarioProps;
}

export function Dashboard() {
  const [projetos, setProjetos] = useState<ProjetoProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarProjetos() {
      try {
        const res = await api.get("/project");
        setProjetos(res.data.projetos);
        console.log(res.data.projetos);
      } catch (err) {
        console.log("Erro ao carregar", err);
      } finally {
        setLoading(false);
      }
    }

    carregarProjetos();
  }, []);

  return (
    <Container>
      <div className="w-full mx-auto flex justify-between items-center">
        <h1 className="font-bold text-left mt-6 text-3xl mb-4">
          Meus projetos
        </h1>
        <Button color="green" className="font-bold cursor-pointerpm">
          <Link to={"/dashboard/new"}>Adicionar projeto</Link>
        </Button>
      </div>

      <main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading && <p>Carregando projetos...</p>}
        {!loading &&
          projetos.map((projeto) => (
            <section
              className="w-full bg-secundary rounded-lg relative"
              key={projeto.id}
            >
              <Trash2
                size={34}
                color="#fff"
                className="absolute top-2 left-2 border-2 border-white rounded-full p-1.5 h-10 w-11 bg-black opacity-10 cursor-pointer hover:opacity-100 transition-all"
                onClick={() => console.log("Teste botão delete")}
              />
              <Link to={`/dashboard/${projeto.id}`}>
                <Pencil
                  className="absolute top-2 right-2 border-2 border-white rounded-full p-1.5 h-10 w-11 bg-black opacity-10 cursor-pointer hover:opacity-100 transition-all"
                  size={34}
                  color="#fff"
                />
              </Link>
              <img
                className="w-full rounded-t-lg mb-2 h-56 object-cover"
                src={`http://localhost:3333/files/${projeto.imagemCapa}`}
                alt={projeto.titulo}
              />
              <p className="font-bold mt-1 mb-2 px-2">{projeto.titulo}</p>
              <div className="flex flex-col px-2">
                <span className="text-zinc-800 mb-4">
                  Data:{" "}
                  {new Date(projeto.createdAt).toLocaleDateString("pt-BR")} |
                  Categoria: {projeto.categoria}
                </span>
              </div>
            </section>
          ))}
      </main>
    </Container>
  );
}
