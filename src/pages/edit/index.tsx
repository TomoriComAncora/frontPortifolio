import React, { useState, useEffect } from "react";
import {
  Label,
  TextInput,
  Textarea,
  Button,
  Card,
  HelperText,
  Modal,
  Select,
  Avatar,
} from "flowbite-react";
import {
  ArrowLeft,
  Save,
  AlertCircle,
  Building,
  Trash2,
  Image as ImageIcon,
  X,
  Home,
  ChevronRight,
  FileText,
  User,
  Calendar,
  Briefcase,
} from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import api from "../../server/api";
import { DeleteProjectModal } from "../../components/delete/DeletarProjeto";

const editarProjetoSchema = z.object({
  nome: z.string().min(1, "O nome do projeto é obrigatório"),
  categoria: z.string(),
  descricao: z
    .string()
    .min(10, "A descrição deve ter pelo menos 10 caracteres"),
  cliente: z.string().optional(),
  responsavel: z.string().optional(),
  prazo: z.string().optional(),
});

type EditarProjetoForm = z.infer<typeof editarProjetoSchema>;

export default function EditProject() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [openSaveModal, setOpenSaveModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [dadosParaSalvar, setDadosParaSalvar] =
    useState<EditarProjetoForm | null>(null);

  const [novasImagens, setNovasImagens] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<
    { url: string; id?: string; isNew: boolean; name?: string }[]
  >([]);

  const [imagensParaRemover, setImagensParaRemover] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditarProjetoForm>({
    resolver: zodResolver(editarProjetoSchema),
  });

  useEffect(() => {
    async function loadProject() {
      try {
        const response = await api.get(`/project/${id}`);
        const dados = response.data;

        reset({
          nome: dados.titulo,
          categoria: dados.categoria,
          descricao: dados.descricao,
          cliente: dados.cliente || "",
          responsavel: dados.responsavel || "",
          prazo: dados.prazo
            ? new Date(dados.prazo).toISOString().split("T")[0]
            : "",
        });

        if (dados.ImagemProjeto && Array.isArray(dados.ImagemProjeto)) {
          const imagensDoBanco = dados.ImagemProjeto.map((img: any) => ({
            url: `http://localhost:3333/files/${img.url}`,
            id: img.id,
            isNew: false,
            name: img.url.split("/").pop(),
          }));
          setPreviewUrls(imagensDoBanco);
        }
      } catch (error) {
        toast.error("Erro ao carregar projeto.");
      } finally {
        setIsLoading(false);
      }
    }
    if (id) loadProject();
  }, [id, reset]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      if (previewUrls.length + filesArray.length > 6) {
        toast.error("Máximo de 6 arquivos permitidos.");
        return;
      }
      setNovasImagens((prev) => [...prev, ...filesArray]);
      const novosPreviews = filesArray.map((file) => ({
        url: URL.createObjectURL(file),
        isNew: true,
        name: file.name,
      }));
      setPreviewUrls((prev) => [...prev, ...novosPreviews]);
    }
  };

  const removeImage = (index: number) => {
    const img = previewUrls[index];

    if (img.isNew) {
      // Se for nova, remove do array de upload
      let countNewBefore = 0;
      for (let i = 0; i < index; i++)
        if (previewUrls[i].isNew) countNewBefore++;
      setNovasImagens((prev) => prev.filter((_, i) => i !== countNewBefore));
    } else {
      if (img.id) {
        setImagensParaRemover((prev) => [...prev, img.id!]);
      }
    }
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFormSubmit = (data: EditarProjetoForm) => {
    setDadosParaSalvar(data);
    setOpenSaveModal(true);
  };

  const onInvalid = () => {
    toast.error("Verifique os campos obrigatórios.");
  };

  const confirmSave = async () => {
    if (!dadosParaSalvar) return;

    setIsSaving(true);
    try {
      const dataToSend = new FormData();
      dataToSend.append("titulo", dadosParaSalvar.nome);
      dataToSend.append("categoria", dadosParaSalvar.categoria);
      dataToSend.append("descricao", dadosParaSalvar.descricao);

      if (dadosParaSalvar.cliente)
        dataToSend.append("cliente", dadosParaSalvar.cliente);
      if (dadosParaSalvar.responsavel)
        dataToSend.append("responsavel", dadosParaSalvar.responsavel);
      if (dadosParaSalvar.prazo)
        dataToSend.append("prazo", dadosParaSalvar.prazo);

      novasImagens.forEach((file) => dataToSend.append("imagens", file));

      // --- ENVIAR LISTA DE REMOÇÃO ---
      if (imagensParaRemover.length > 0) {
        dataToSend.append(
          "imagensRemoveIds",
          JSON.stringify(imagensParaRemover)
        );
      }

      await api.put(`/project/${id}`, dataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setOpenSaveModal(false);
      toast.success("Projeto salvo com sucesso!");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar.");
      setOpenSaveModal(false);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      <nav className="border-b border-[#a3b18a]/30 bg-white px-4 py-2.5 shadow-sm">
        <div className="flex flex-wrap justify-between items-center mx-auto">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="mr-3 h-8 w-8 flex items-center justify-center rounded bg-[#588157] text-white">
              <Building size={20} />
            </div>
            <span className="self-center whitespace-nowrap text-xl font-semibold text-[#344e41]">
              ArqManager
            </span>
          </Link>
          <Avatar alt="User" rounded />
        </div>
      </nav>

      <div className="mx-auto max-w-5xl p-6">
        <nav className="mb-6 flex text-gray-500 text-sm items-center gap-2">
          <Link
            to="/dashboard"
            className="hover:text-[#588157] flex items-center gap-1"
          >
            <Home size={14} /> Home
          </Link>
          <ChevronRight size={14} />
          <span className="font-semibold text-[#3a5a40]">Editando Projeto</span>
        </nav>

        <Card className="shadow-md border-[#a3b18a]/30">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#dad7cd] pb-6 mb-2 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-[#344e41]">
                Editar Projeto
              </h1>
              <p className="text-[#3a5a40] mt-1 text-sm">
                Atualize as informações e arquivos do projeto.
              </p>
            </div>
            <Link
              to="/dashboard"
              className="text-[#344e41] hover:text-[#588157] px-4 py-2 border border-[#a3b18a] rounded-lg flex items-center gap-2 text-sm font-medium transition-colors"
            >
              <ArrowLeft size={16} /> Voltar
            </Link>
          </div>

          {isLoading ? (
            <div className="p-10 text-center">
              <Skeleton height={300} />
            </div>
          ) : (
            <form
              onSubmit={handleSubmit(handleFormSubmit, onInvalid)}
              className="flex flex-col gap-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label
                    htmlFor="nome"
                    className="font-semibold mb-2 block text-[#344e41]"
                  >
                    Nome do Projeto
                  </Label>
                  <TextInput
                    id="nome"
                    shadow
                    {...register("nome")}
                    color={errors.nome ? "failure" : "gray"}
                  />
                  {errors.nome && (
                    <HelperText className="mt-1" color="failure">
                      {errors.nome.message}
                    </HelperText>
                  )}
                </div>
                <div>
                  <Label
                    htmlFor="categoria"
                    className="font-semibold mb-2 block text-[#344e41]"
                  >
                    Categoria / Fase
                  </Label>
                  <Select id="categoria" shadow {...register("categoria")}>
                    <option value="Estudo Preliminar">Estudo Preliminar</option>
                    <option value="Anteprojeto">Anteprojeto</option>
                    <option value="Projeto Legal">Projeto Legal</option>
                    <option value="Projeto Executivo">Projeto Executivo</option>
                    <option value="Interiores">Interiores</option>
                    <option value="Em Obra">Em Obra</option>
                    <option value="Finalizado">Finalizado</option>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label className="font-semibold mb-2 block text-[#344e41]">
                    Nome do Cliente
                  </Label>
                  <TextInput icon={User} shadow {...register("cliente")} />
                </div>
                <div>
                  <Label className="font-semibold mb-2 block text-[#344e41]">
                    Arquiteto Responsável
                  </Label>
                  <TextInput
                    icon={Briefcase}
                    shadow
                    {...register("responsavel")}
                  />
                </div>
                <div>
                  <Label className="font-semibold mb-2 block text-[#344e41]">
                    Previsão de Entrega
                  </Label>
                  <TextInput
                    type="date"
                    icon={Calendar}
                    shadow
                    {...register("prazo")}
                  />
                </div>
              </div>

              <div>
                <Label
                  htmlFor="descricao"
                  className="font-semibold mb-2 block text-[#344e41]"
                >
                  Descrição / Observações
                </Label>
                <Textarea
                  id="descricao"
                  rows={5}
                  className="resize-none shadow-sm"
                  {...register("descricao")}
                />
              </div>

              <div className="border-t border-[#dad7cd] pt-4">
                <Label className="font-semibold mb-2 block text-[#344e41]">
                  Galeria de Arquivos (Máx 6)
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                  {previewUrls.length < 6 && (
                    <label className="flex flex-col items-center justify-center h-32 w-full border-2 border-[#a3b18a] border-dashed rounded-lg cursor-pointer bg-[#f3f4f6] hover:bg-[#dad7cd] transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <ImageIcon className="w-8 h-8 text-[#a3b18a] mb-2" />
                        <p className="text-xs text-[#3a5a40] text-center">
                          Adicionar
                        </p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*,.pdf,.doc,.docx,.odt"
                        multiple
                        onChange={handleImageChange}
                      />
                    </label>
                  )}
                  {previewUrls.map((item, index) => {
                    const extension = (item.name || item.url)
                      .split(".")
                      .pop()
                      ?.toLowerCase();
                    const isDoc = ["pdf", "doc", "docx", "odt", "txt"].includes(
                      extension || ""
                    );
                    return (
                      <div
                        key={index}
                        className="relative h-32 w-full border border-[#a3b18a]/50 rounded-lg overflow-hidden group bg-white flex items-center justify-center hover:shadow-md"
                      >
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex flex-col items-center justify-center w-full h-full text-center p-2"
                        >
                          {isDoc ? (
                            <>
                              <FileText
                                size={32}
                                className="mb-2 text-[#588157]"
                              />
                              <span className="text-[10px] text-[#344e41] line-clamp-2">
                                {item.name}
                              </span>
                            </>
                          ) : (
                            <img
                              src={item.url}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                          )}
                        </a>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            removeImage(index);
                          }}
                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        >
                          <X size={14} />
                        </button>
                        {item.isNew && (
                          <span className="absolute bottom-1 right-1 bg-[#588157] text-white text-[10px] px-1 rounded shadow-sm pointer-events-none">
                            Novo
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-3 mt-4 pt-6 border-t border-[#dad7cd] items-center justify-between">
                <Button
                  color="failure"
                  outline
                  onClick={() => setOpenDeleteModal(true)}
                >
                  <Trash2 size={18} className="mr-2" /> Excluir
                </Button>
                <div className="flex gap-3">
                  <Button
                    color="gray"
                    className="border-[#a3b18a] text-[#344e41] hover:bg-[#dad7cd]"
                    onClick={() => window.history.back()}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="!bg-[#588157] hover:!bg-[#3a5a40] border-none shadow-md text-white"
                    disabled={isSaving}
                  >
                    <Save size={18} className="mr-2" />{" "}
                    {isSaving ? "Salvando..." : "Salvar Alterações"}
                  </Button>
                </div>
              </div>
            </form>
          )}
        </Card>
      </div>

      <Modal
        show={openSaveModal}
        size="md"
        onClose={() => setOpenSaveModal(false)}
        popup
      >
        <div className="p-6 text-center">
          <AlertCircle className="mx-auto mb-4 h-14 w-14 text-[#588157] bg-[#dad7cd] rounded-full p-2" />
          <h3 className="mb-5 text-lg font-normal text-gray-600">
            Salvar alterações em <b>{dadosParaSalvar?.nome}</b>?
          </h3>
          <div className="flex justify-center gap-4">
            <Button
              className="!bg-[#588157] hover:!bg-[#3a5a40]"
              onClick={confirmSave}
              disabled={isSaving}
            >
              {isSaving ? "Salvando..." : "Sim, salvar"}
            </Button>
            <Button color="gray" onClick={() => setOpenSaveModal(false)}>
              Cancelar
            </Button>
          </div>
        </div>
      </Modal>

      <DeleteProjectModal
        isOpen={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        onSuccess={() => navigate("/dashboard")}
        projectId={id}
        projectName={dadosParaSalvar?.nome || ""}
      />
    </div>
  );
}
