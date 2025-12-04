import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  Badge,
  TextInput,
  Avatar,
  Pagination,
} from "flowbite-react";
import {
  Plus,
  Search,
  Building,
  User,
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

import api from "../../../server/api";
import { DeleteProjectModal } from "../../../components/delete/DeletarProjeto";

interface Projeto {
  id: string;
  titulo: string;
  categoria: string;
  descricao: string;
  imagemCapa?: string;
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

  // --- CORES PERSONALIZADAS PARA STATUS ---
  const getStatusColor = (status: string) => {
    // O Flowbite tem cores padrão, mas podemos forçar classes CSS se quisermos.
    // Vamos usar os padrões que combinam mais:
    switch (status) {
      case "Finalizado":
        return "success"; // Verde padrão
      case "Em Obra":
        return "warning"; // Amarelo
      case "Cancelado":
        return "failure"; // Vermelho
      default:
        return "indigo"; // Azulzinho neutro para os demais
    }
  };

  const renderPreview = (projeto: Projeto) => {
    let previewUrl = projeto.imagemCapa;

    if (
      (!previewUrl || previewUrl.includes("placeholder")) &&
      projeto.ImagemProjeto &&
      projeto.ImagemProjeto.length > 0
    ) {
      previewUrl = `http://localhost:3333/files/${projeto.ImagemProjeto[0].url}`;
    }

    if (previewUrl && !previewUrl.includes("placeholder")) {
      if (
        previewUrl.toLowerCase().endsWith(".pdf") ||
        previewUrl.toLowerCase().endsWith(".doc") ||
        previewUrl.toLowerCase().endsWith(".odt")
      ) {
        return (
          <div className="h-full w-full flex flex-col items-center justify-center bg-arq-light/30 text-arq-main">
            <FileText size={48} />
            <span className="text-xs mt-2 font-medium">Documento</span>
          </div>
        );
      }
      return (
        <img
          src={previewUrl}
          alt="Preview"
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
        />
      );
    }

    return (
      <div className="h-full w-full flex items-center justify-center bg-arq-light/30 text-arq-sage">
        <ImageIcon size={48} />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] pb-10">
      <nav className="border-b border-arq-sage/30 bg-white px-4 py-2.5 shadow-sm sticky top-0 z-10">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-7xl">
          <a href="#" className="flex items-center gap-2">
            <div className="h-8 w-8 flex items-center justify-center rounded bg-arq-main text-white">
              <Building size={20} />
            </div>
            <span className="self-center whitespace-nowrap text-xl font-bold text-arq-deep">
              ArqManager
            </span>
          </a>
          <div className="flex items-center md:order-2 gap-3 cursor-pointer hover:bg-arq-light/20 p-2 rounded-lg transition-colors">
            <Avatar rounded />
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-arq-deep">Meus Projetos</h1>
            <p className="text-arq-dark mt-1">
              {filteredProjects.length} projetos encontrados
            </p>
          </div>
          {/* BOTÃO NOVO PROJETO ESTILIZADO */}
          <Button className="bg-arq-main hover:!bg-arq-dark border-none shadow-md transition-all">
            <Plus className="mr-2 h-5 w-5" /> Novo Projeto
          </Button>
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
                  className="shadow-md hover:shadow-xl transition-all duration-300 border-arq-sage/30 overflow-hidden"
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
                      to={`/projetos/${projeto.id}`}
                      className="hover:text-arq-main transition-colors"
                    >
                      <h5 className="text-2xl font-bold tracking-tight text-arq-deep flex items-center gap-2">
                        <FolderOpen size={20} className="text-arq-sage" />
                        {projeto.titulo}
                      </h5>
                    </Link>
                    <p className="font-normal text-gray-500 flex items-center gap-2 text-xs mt-1">
                      <Calendar size={12} /> Atualizado recentemente
                    </p>
                  </div>

                  {/* PREVIEW */}
                  <div className="h-32 w-full rounded-md overflow-hidden border border-arq-light relative">
                    {renderPreview(projeto)}
                  </div>

                  <div className="flex gap-2 mt-4 pt-4 border-t border-arq-light">
                    <Link
                      to={`/dashboard/edit/${projeto.id}`}
                      className="flex-1"
                    >
                      {/* BOTÃO EDITAR: Outline com a cor da marca */}
                      <Button
                        color="gray"
                        className="w-full border border-arq-sage text-arq-dark hover:bg-arq-light/20 hover:text-arq-deep transition-colors shadow-sm"
                      >
                        <Edit3 size={16} className="mr-2" /> Editar
                      </Button>
                    </Link>
                    <Button
                      color="gray"
                      className="border border-arq-sage text-arq-sage hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors shadow-sm"
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
                  onPageChange={onPageChange}
                  showIcons
                  previousLabel="Anterior"
                  nextLabel="Próxima"
                  className="text-arq-main"
                />
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-arq-sage">
            <h3 className="text-lg font-medium text-arq-deep">
              Nenhum projeto encontrado
            </h3>
          </div>
        )}
      </main>

      <DeleteProjectModal
        isOpen={!!projectToDelete}
        onClose={() => setProjectToDelete(null)}
        onSuccess={() =>
          setProjetos((old) => old.filter((p) => p.id !== projectToDelete?.id))
        }
        projectId={projectToDelete?.id}
        projectName={projectToDelete?.nome || ""}
      />
    </div>
  );
}
