import React, { useState, useEffect } from "react";
import { Button, Card, Badge } from "flowbite-react";
import {
  ArrowLeft,
  Edit3,
  Calendar,
  User,
  FileText,
  Briefcase,
  File as FileIcon,
  Image as ImageIcon,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import api from "../../server/api";

interface Projeto {
  id: string;
  titulo: string;
  categoria: string;
  descricao: string;
  cliente?: string;
  responsavel?: string;
  prazo?: string;
  ImagemProjeto?: { id: string; url: string }[];
}

export default function Detail() {
  const { id } = useParams();
  const [projeto, setProjeto] = useState<Projeto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProject() {
      try {
        const response = await api.get(`/project/${id}`);
        setProjeto(response.data);
      } catch (error) {
        console.error("Erro ao carregar", error);
      } finally {
        setLoading(false);
      }
    }
    loadProject();
  }, [id]);

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

  // ATUALIZADO: Agora aceita PDF como capa também
  const getCapaUrl = () => {
    if (projeto?.ImagemProjeto && projeto.ImagemProjeto.length > 0) {
      // Pega o primeiro arquivo que não seja DOC/WORD (PDF ou Imagem servem)
      const img = projeto.ImagemProjeto.find(
        (i) =>
          !i.url.endsWith(".doc") &&
          !i.url.endsWith(".docx") &&
          !i.url.endsWith(".odt")
      );
      if (img) return `http://localhost:3333/files/${img.url}`;
    }
    return null;
  };

  const capa = getCapaUrl();
  // Verifica se a capa encontrada é um PDF
  const isCapaPdf = capa?.toLowerCase().endsWith(".pdf");

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-gray-800 flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-5xl">
        <Link
          to="/dashboard"
          className="inline-flex items-center text-[#588157] hover:text-[#344e41] mb-6 transition-colors font-medium"
        >
          <ArrowLeft size={20} className="mr-2" /> Voltar para Dashboard
        </Link>

        {loading ? (
          <Skeleton height={400} />
        ) : projeto ? (
          <Card className="shadow-xl border-none overflow-hidden p-0 bg-white">
            {/* --- ÁREA DA CAPA --- */}
            {capa ? (
              // Se for PDF, mostra o visualizador (iframe)
              isCapaPdf ? (
                <div className="h-96 w-full relative bg-gray-100">
                  <iframe
                    src={`${capa}#toolbar=0`}
                    className="w-full h-full border-none"
                    title="Capa PDF"
                  />
                  {/* Overlay parcial para titulo */}
                  <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/80 to-transparent p-6 pointer-events-none">
                    <Badge
                      color={getStatusColor(projeto.categoria)}
                      className="mb-2 w-fit"
                    >
                      {projeto.categoria}
                    </Badge>
                    <h1 className="text-4xl font-bold text-white drop-shadow-md">
                      {projeto.titulo}
                    </h1>
                  </div>
                </div>
              ) : (
                // Se for Imagem, mostra normal
                <div className="h-72 w-full relative group">
                  <img
                    src={capa}
                    alt="Capa"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  <div className="absolute bottom-6 left-8 text-white">
                    <Badge
                      color={getStatusColor(projeto.categoria)}
                      className="mb-3 w-fit px-3 py-1 text-sm"
                    >
                      {projeto.categoria}
                    </Badge>
                    <h1 className="text-5xl font-bold drop-shadow-lg">
                      {projeto.titulo}
                    </h1>
                  </div>
                </div>
              )
            ) : (
              // Sem capa
              <div className="bg-[#dad7cd] h-48 flex items-center justify-center border-b border-gray-200">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-[#344e41]">
                    {projeto.titulo}
                  </h1>
                  <Badge
                    color={getStatusColor(projeto.categoria)}
                    className="mt-3 mx-auto w-fit text-sm"
                  >
                    {projeto.categoria}
                  </Badge>
                </div>
              </div>
            )}

            <div className="p-8">
              {/* GRID DE INFORMAÇÕES */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
                    <User size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase">
                      Cliente
                    </p>
                    <p className="text-lg font-bold text-gray-800">
                      {projeto.cliente || "Não informado"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="p-3 bg-purple-100 text-purple-600 rounded-full">
                    <Briefcase size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase">
                      Responsável
                    </p>
                    <p className="text-lg font-bold text-gray-800">
                      {projeto.responsavel || "Não informado"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="p-3 bg-orange-100 text-orange-600 rounded-full">
                    <Calendar size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase">
                      Previsão Entrega
                    </p>
                    <p className="text-lg font-bold text-gray-800">
                      {projeto.prazo
                        ? new Date(projeto.prazo).toLocaleDateString("pt-BR")
                        : "A definir"}
                    </p>
                  </div>
                </div>
              </div>

              {/* ESCOPO */}
              <div className="mb-10">
                <h3 className="text-xl font-bold text-[#344e41] mb-4 flex items-center gap-2">
                  <FileText size={24} className="text-[#588157]" /> Escopo do
                  Projeto
                </h3>
                <div className="text-gray-700 leading-relaxed whitespace-pre-line bg-gray-50 p-6 border border-gray-200 rounded-xl">
                  {projeto.descricao || "Sem descrição."}
                </div>
              </div>

              {/* GALERIA */}
              {projeto.ImagemProjeto && projeto.ImagemProjeto.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-[#344e41] mb-4 flex items-center gap-2">
                    <ImageIcon size={24} className="text-[#588157]" /> Arquivos
                    e Imagens
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {projeto.ImagemProjeto.map((file) => {
                      // Verifica tipo
                      const isPdf = file.url.endsWith(".pdf");
                      const isDoc =
                        file.url.endsWith(".doc") ||
                        file.url.endsWith(".docx") ||
                        file.url.endsWith(".odt");
                      const fileName = file.url.split("/").pop() || "Arquivo";

                      return (
                        <a
                          key={file.id}
                          href={`http://localhost:3333/files/${file.url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group relative h-32 border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all flex flex-col items-center justify-center bg-white text-center p-0 text-decoration-none"
                        >
                          {isPdf ? (
                            // Preview pequeno do PDF na galeria
                            <iframe
                              src={`http://localhost:3333/files/${file.url}#toolbar=0&scrollbar=0`}
                              className="w-full h-full pointer-events-none border-none scale-110"
                            />
                          ) : isDoc ? (
                            <div className="flex flex-col items-center p-2">
                              <FileIcon
                                size={40}
                                className="text-[#588157] mb-2"
                              />
                              <span className="text-[11px] text-gray-600 line-clamp-2 break-all font-medium px-2">
                                {fileName}
                              </span>
                            </div>
                          ) : (
                            <img
                              src={`http://localhost:3333/files/${file.url}`}
                              alt="Galeria"
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          )}
                          {/* Efeito Hover para indicar clique */}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none"></div>
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-6 border-t border-gray-100">
                <Link to={`/dashboard/edit/${projeto.id}`}>
                  <Button className="bg-[#588157] hover:!bg-[#3a5a40] border-none shadow-md px-6 py-1">
                    <Edit3 size={18} className="mr-2" /> Editar Projeto
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        ) : (
          <p className="text-center text-gray-500 mt-10">
            Carregando detalhes...
          </p>
        )}
      </div>
    </div>
  );
}
