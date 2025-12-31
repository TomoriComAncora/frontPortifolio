import { useState, useEffect } from "react";
import {
  Button,
  Card,
  Badge,
  TextInput,
  Pagination,
  Avatar,
} from "flowbite-react";
import {
  Plus,
  Search,
  Calendar,
  Edit3,
  Trash2,
  FolderOpen,
  FileText,
  Image as ImageIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import { Container } from "../../components/container";
import api from "../../server/api";
import { DeleteProjectModal } from "../../components/delete/DeletarProjeto";

interface Projeto {
  id: string;
  titulo: string;
  categoria: string;
  descricao: string;
  imagemCapa?: string;
  createdAt?: string;
  data?: string;
  ImagemProjeto?: { id: string; url: string }[];
}

export default function Dashboard() {
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [projectToDelete, setProjectToDelete] = useState<{
    id: string;
    nome: string;
  } | null>(null);

  async function fetchProjects() {
    try {
      setLoading(true);
      const response = await api.get("/project");

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
      setProjetos([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProjects();
  }, []);

  const filteredProjects = projetos.filter((p) =>
    (p.titulo || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProjects = filteredProjects.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const onPageChange = (page: number) => setCurrentPage(page);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Finalizado":
        return "success";
      case "Em Obra":
        return "warning";
      case "Cancelado":
        return "failure";
      default:
        return "indigo";
    }
  };

  // --- MUDANÇA AQUI: VISUALIZAÇÃO LIMPA ---
  const renderPreview = (projeto: Projeto) => {
    let fileName = null;

    if (projeto.ImagemProjeto && projeto.ImagemProjeto.length > 0) {
      fileName = projeto.ImagemProjeto[0].url;
    } else if (projeto.imagemCapa) {
      fileName = projeto.imagemCapa;
    }

    if (fileName && !fileName.includes("placeholder")) {
      const fullUrl = fileName.startsWith("http")
        ? fileName
        : `http://localhost:3333/files/${fileName}`;

      // Verifica se é um arquivo de DOCUMENTO (PDF entra aqui agora)
      const isFile =
        fullUrl.toLowerCase().endsWith(".pdf") ||
        fullUrl.toLowerCase().endsWith(".doc") ||
        fullUrl.toLowerCase().endsWith(".docx") ||
        fullUrl.toLowerCase().endsWith(".odt");

      // Se for PDF ou Doc, mostra o ícone bonito e limpo
      if (isFile) {
        return (
          <div className="h-full w-full flex flex-col items-center justify-center bg-[#dad7cd]/50 text-[#588157]">
            <FileText size={48} />
            <span className="text-xs mt-2 font-medium">Documento Anexado</span>
          </div>
        );
      }

      // Se for imagem (JPG, PNG), mostra a foto
      return (
        <img
          src={fullUrl}
          alt="Preview"
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
        />
      );
    }

    // Sem arquivo
    return (
      <div className="h-full w-full flex items-center justify-center bg-[#dad7cd]/30 text-[#a3b18a]">
        <ImageIcon size={48} />
      </div>
    );
  };

  return (
    <Container>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center my-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Meus Projetos</h1>
          <p className="text-gray-500 mt-1">
            {filteredProjects.length} projetos encontrados
          </p>
        </div>
        <Link to="/dashboard/new">
          <Button className="!bg-[#588157] hover:!bg-[#3a5a40] border-none shadow-md font-bold">
            <Plus className="mr-2 h-5 w-5" /> Adicionar projeto
          </Button>
        </Link>
      </div>

      <div className="mb-8 max-w-md">
        <TextInput
          id="search"
          type="text"
          icon={Search}
          placeholder="Buscar por projeto..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="shadow-sm"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow-md h-64">
              <Skeleton width={100} className="mb-4" /> <Skeleton count={3} />
            </div>
          ))}
        </div>
      ) : filteredProjects.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {currentProjects.map((projeto) => (
              <Card
                key={projeto.id}
                className="shadow-md hover:shadow-xl transition-all duration-300 border-gray-200 overflow-hidden"
              >
                <div className="flex justify-between items-start">
                  <Badge
                    color={getStatusColor(projeto.categoria)}
                    className="px-3 py-1"
                  >
                    {projeto.categoria || "Geral"}
                  </Badge>
                </div>

                <div className="flex flex-col gap-1 mt-2 mb-2">
                  <Link
                    to={`/project/${projeto.id}`}
                    className="hover:text-blue-600 transition-colors"
                  >
                    <h5
                      className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2 line-clamp-1"
                      title={projeto.titulo}
                    >
                      <FolderOpen size={20} className="text-gray-400" />
                      {projeto.titulo}
                    </h5>
                  </Link>
                  <p className="font-normal text-gray-500 flex items-center gap-2 text-xs mt-1">
                    <Calendar size={12} />
                    {projeto.createdAt || projeto.data
                      ? new Date(
                          projeto.createdAt || projeto.data!
                        ).toLocaleDateString("pt-BR")
                      : "Sem data"}
                  </p>
                </div>

                <div className="h-40 w-full rounded-md overflow-hidden border border-gray-100 relative">
                  {renderPreview(projeto)}
                </div>

                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                  <Link to={`/dashboard/edit/${projeto.id}`} className="flex-1">
                    <Button color="gray" className="w-full border shadow-sm">
                      <Edit3 size={16} className="mr-2" /> Editar
                    </Button>
                  </Link>
                  <Button
                    color="gray"
                    className="border shadow-sm hover:bg-red-50 hover:text-red-600"
                    onClick={() =>
                      setProjectToDelete({
                        id: projeto.id,
                        nome: projeto.titulo,
                      })
                    }
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex overflow-x-auto sm:justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(p) => setCurrentPage(p)}
                showIcons
                previousLabel="Anterior"
                nextLabel="Próxima"
              />
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
          <h3 className="text-lg font-medium text-gray-900">
            Nenhum projeto encontrado
          </h3>
        </div>
      )}

      <DeleteProjectModal
        isOpen={!!projectToDelete}
        onClose={() => setProjectToDelete(null)}
        onSuccess={() => {
          setProjetos((old) => old.filter((p) => p.id !== projectToDelete?.id));
          setProjectToDelete(null);
        }}
        projectId={projectToDelete?.id}
        projectName={projectToDelete?.nome || ""}
      />
    </Container>
  );
}
