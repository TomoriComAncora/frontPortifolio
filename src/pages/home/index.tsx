import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  FolderOpen,
  Calendar,
  Image as ImageIcon,
  FileText,
} from "lucide-react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import { Container } from "../../components/container";
import api from "../../server/api";

// Interface igual à que usamos na Dashboard
interface Projeto {
  id: string;
  titulo: string;
  categoria: string;
  descricao: string;
  imagemCapa?: string;
  prazo?: string; // Para mostrar a data se tiver
  responsavel?: string; // Para mostrar o arquiteto
  ImagemProjeto?: { id: string; url: string }[];
}

export function Home() {
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Busca os projetos ao carregar a página
  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await api.get("/project"); // Rota no singular conforme arrumamos

        if (Array.isArray(response.data)) {
          setProjetos(response.data);
        } else if (
          response.data.projetos &&
          Array.isArray(response.data.projetos)
        ) {
          setProjetos(response.data.projetos);
        } else {
          setProjetos([]);
        }
      } catch (error) {
        console.error("Erro ao buscar projetos:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  // Filtra pelo nome
  const filteredProjects = projetos.filter((p) =>
    (p.titulo || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Função auxiliar para pegar a URL da imagem de capa
  const getCapaUrl = (projeto: Projeto) => {
    let url = projeto.imagemCapa;

    // Se não tiver capa definida, tenta a primeira imagem da galeria
    if (
      (!url || url.includes("placeholder")) &&
      projeto.ImagemProjeto &&
      projeto.ImagemProjeto.length > 0
    ) {
      url = `http://localhost:3333/files/${projeto.ImagemProjeto[0].url}`;
    }

    // Verifica se é válida e não é documento
    if (url && !url.includes("placeholder")) {
      if (
        url.endsWith(".pdf") ||
        url.endsWith(".doc") ||
        url.endsWith(".odt")
      ) {
        return null;       }
      return url;
    }
    return null;
  };

  return (
    <Container>
      {/* BARRA DE BUSCA */}
      <section className="p-4 rounded-lg w-full mx-auto flex justify-center items-center gap-2 bg-white shadow-sm mt-4 border border-gray-200">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search size={20} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Pesquise o nome do projeto..."
            className="w-full border-gray-300 rounded-lg h-10 pl-10 pr-4 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="bg-zinc-800 hover:bg-zinc-700 h-10 px-8 rounded-lg text-white font-bold transition-colors">
          Buscar
        </button>
      </section>

      <h1 className="font-bold text-left mt-8 text-3xl mb-6 text-zinc-800">
        Projetos Recentes
      </h1>

      {/* GRID DE PROJETOS */}
      <main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 pb-10">
        {loading ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="w-full bg-white rounded-lg shadow h-72">
              <Skeleton height={192} className="rounded-t-lg" />
              <div className="p-4">
                <Skeleton width={`60%`} height={20} className="mb-2" />
                <Skeleton width={`40%`} height={15} />
              </div>
            </div>
          ))
        ) : filteredProjects.length > 0 ? (
          filteredProjects.map((projeto) => {
            const capa = getCapaUrl(projeto);

            return (
              <Link to={`/project/${projeto.id}`} key={projeto.id}>
                <section className="w-full bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 h-full flex flex-col">
                  {/* ÁREA DA IMAGEM */}
                  <div className="w-full h-48 bg-gray-200 rounded-t-lg overflow-hidden relative group">
                    {capa ? (
                      <img
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        src={capa}
                        alt={projeto.titulo}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-100">
                        <ImageIcon size={48} />
                        <span className="text-xs mt-2">Sem imagem de capa</span>
                      </div>
                    )}
                    {/* Badge de Categoria */}
                    <span className="absolute bottom-2 right-2 bg-white/90 text-zinc-800 text-xs font-bold px-2 py-1 rounded shadow-sm">
                      {projeto.categoria || "Geral"}
                    </span>
                  </div>

                  {/* INFORMAÇÕES */}
                  <div className="p-4 flex flex-col flex-1">
                    <p
                      className="font-bold text-lg text-zinc-900 mb-1 line-clamp-1"
                      title={projeto.titulo}
                    >
                      {projeto.titulo}
                    </p>

                    <div className="mt-auto">
                      <div className="flex items-center gap-2 text-sm text-zinc-500 mb-1">
                        <Calendar size={14} />
                        <span>
                          {projeto.prazo
                            ? new Date(projeto.prazo).toLocaleDateString(
                                "pt-BR"
                              )
                            : "Data a definir"}
                        </span>
                      </div>

                      <strong className="text-sm font-medium text-zinc-700 block">
                        Arquiteto(a):{" "}
                        <span className="font-normal">
                          {projeto.responsavel || "Não informado"}
                        </span>
                      </strong>
                    </div>
                  </div>
                </section>
              </Link>
            );
          })
        ) : (
          <div className="col-span-full text-center py-10 text-gray-500">
            <FolderOpen size={48} className="mx-auto mb-2 text-gray-300" />
            <p>Nenhum projeto encontrado com esse nome.</p>
          </div>
        )}
      </main>
    </Container>
  );
}
