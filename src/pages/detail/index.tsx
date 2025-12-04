import React, { useState, useEffect } from "react";
import { Button, Card, Badge, Avatar } from "flowbite-react";
import {
  ArrowLeft,
  Edit3,
  Calendar,
  User,
  FileText,
  CheckCircle,
  Briefcase,
  File as FileIcon,
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

export default function DetalhesProjeto() {
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
    if (["Finalizado"].includes(status)) return "success";
    if (["Em Obra", "Executivo"].includes(status)) return "warning";
    return "info";
  };

  // Função para pegar a primeira imagem como capa
  const getCapaUrl = () => {
    if (projeto?.ImagemProjeto && projeto.ImagemProjeto.length > 0) {
      // Pega a primeira que seja imagem (jpg, png)
      const img = projeto.ImagemProjeto.find(
        (i) => !i.url.includes(".pdf") && !i.url.includes(".doc")
      );
      if (img) return `http://localhost:3333/files/${img.url}`;
    }
    return null; // Sem capa
  };

  const capa = getCapaUrl();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-5xl">
        <Link
          to="/"
          className="inline-flex items-center text-gray-500 hover:text-blue-600 mb-6 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" /> Voltar para Dashboard
        </Link>

        {loading ? (
          <Skeleton height={400} />
        ) : projeto ? (
          <Card className="shadow-lg border-gray-100 overflow-hidden p-0">
            {/* --- 1. BANNER / CAPA DO PROJETO --- */}
            {capa ? (
              <div className="h-64 w-full relative group">
                <img
                  src={capa}
                  alt="Capa"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-6 text-white">
                  <Badge
                    color={getStatusColor(projeto.categoria)}
                    className="mb-2 w-fit"
                  >
                    {projeto.categoria}
                  </Badge>
                  <h1 className="text-4xl font-bold shadow-black drop-shadow-md">
                    {projeto.titulo}
                  </h1>
                </div>
              </div>
            ) : (
              <div className="bg-gray-100 h-32 flex items-center justify-center border-b">
                <div className="text-center">
                  <h1 className="text-3xl font-bold text-gray-800">
                    {projeto.titulo}
                  </h1>
                  <Badge
                    color={getStatusColor(projeto.categoria)}
                    className="mt-2 mx-auto w-fit"
                  >
                    {projeto.categoria}
                  </Badge>
                </div>
              </div>
            )}

            <div className="p-6">
              {/* --- 2. GRID DE INFORMAÇÕES (CLIENTE, ARQUITETO, PRAZO) --- */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-full shadow-sm text-blue-600">
                    <User size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase">
                      Cliente
                    </p>
                    <p className="font-semibold text-gray-800">
                      {projeto.cliente || "Não informado"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-full shadow-sm text-purple-600">
                    <Briefcase size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase">
                      Responsável
                    </p>
                    <p className="font-semibold text-gray-800">
                      {projeto.responsavel || "Não informado"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-full shadow-sm text-orange-600">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase">
                      Previsão Entrega
                    </p>
                    <p className="font-semibold text-gray-800">
                      {projeto.prazo
                        ? new Date(projeto.prazo).toLocaleDateString("pt-BR")
                        : "A definir"}
                    </p>
                  </div>
                </div>
              </div>

              {/* --- 3. ESCOPO / DESCRIÇÃO --- */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
                  <FileText size={20} /> Escopo do Projeto
                </h3>
                <div className="text-gray-600 leading-relaxed whitespace-pre-line bg-white p-4 border rounded-lg">
                  {projeto.descricao || "Sem descrição."}
                </div>
              </div>

              {/* --- 4. GALERIA DE ARQUIVOS --- */}
              {projeto.ImagemProjeto && projeto.ImagemProjeto.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-3">
                    Arquivos e Imagens
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {projeto.ImagemProjeto.map((file) => {
                      const isDoc =
                        file.url.includes(".pdf") ||
                        file.url.includes(".doc") ||
                        file.url.includes(".odt");
                      return (
                        <a
                          key={file.id}
                          href={`http://localhost:3333/files/${file.url}`}
                          target="_blank"
                          className="group relative h-28 border rounded-lg overflow-hidden hover:shadow-md transition-all flex flex-col items-center justify-center bg-gray-50 text-center p-2 text-decoration-none"
                        >
                          {isDoc ? (
                            <>
                              <FileIcon
                                size={32}
                                className="text-blue-500 mb-1"
                              />
                              <span className="text-[10px] text-gray-500 line-clamp-2 break-all">
                                {file.url}
                              </span>
                            </>
                          ) : (
                            <img
                              src={`http://localhost:3333/files/${file.url}`}
                              alt="Galeria"
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          )}
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-4 border-t border-gray-100">
                <Link to={`/dashboard/edit/${projeto.id}`}>
                  <Button color="blue" size="lg" className="shadow-md">
                    <Edit3 size={18} className="mr-2" /> Editar Projeto
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        ) : (
          <p className="text-center">Projeto não encontrado.</p>
        )}
      </div>
    </div>
  );
}
