import React, { useState } from "react";
import {
  Label,
  TextInput,
  Textarea,
  Button,
  Card,
  HelperText,
  Select,
  Avatar,
} from "flowbite-react";
import {
  ArrowLeft,
  Save,
  Building,
  Image as ImageIcon,
  X,
  Home,
  ChevronRight,
  FileText,
  User,
  Calendar,
  Briefcase,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Importe a API corretamente (ajuste os ../ se necessário)
import api from "../../../server/api";

const novoProjetoSchema = z.object({
  nome: z.string().min(1, "O nome do projeto é obrigatório"),
  categoria: z.string(),
  descricao: z
    .string()
    .min(10, "A descrição deve ter pelo menos 10 caracteres"),
  cliente: z.string().optional(),
  responsavel: z.string().optional(),
  prazo: z.string().optional(),
});

type NovoProjetoForm = z.infer<typeof novoProjetoSchema>;

export default function New() {
  const navigate = useNavigate();
  const [novasImagens, setNovasImagens] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<
    { url: string; name: string }[]
  >([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NovoProjetoForm>({
    resolver: zodResolver(novoProjetoSchema),
    defaultValues: {
      categoria: "Estudo Preliminar", // Valor padrão
    },
  });

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
        name: file.name,
      }));
      setPreviewUrls((prev) => [...prev, ...novosPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setNovasImagens((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: NovoProjetoForm) => {
    setIsSubmitting(true);
    try {
      const dataToSend = new FormData();
      dataToSend.append("titulo", data.nome);
      dataToSend.append("categoria", data.categoria);
      dataToSend.append("descricao", data.descricao);

      if (data.cliente) dataToSend.append("cliente", data.cliente);
      if (data.responsavel) dataToSend.append("responsavel", data.responsavel);
      if (data.prazo) dataToSend.append("prazo", data.prazo);

      // A primeira imagem será a capa automaticamente no backend (ou você pode definir lógica)
      if (novasImagens.length > 0) {
        dataToSend.append("capa", novasImagens[0]); // Manda a primeira como capa
      }

      // Manda todas como galeria
      novasImagens.forEach((file) => dataToSend.append("imagens", file));

      // POST para criar
      await api.post("/project", dataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Projeto criado com sucesso!");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao criar projeto.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      {/* NAVBAR */}
      <nav className="border-b border-gray-200 bg-white px-4 py-2.5 shadow-sm">
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
        {/* BREADCRUMBS */}
        <nav className="mb-6 flex text-gray-500 text-sm items-center gap-2">
          <Link
            to="/dashboard"
            className="hover:text-[#588157] flex items-center gap-1"
          >
            <Home size={14} /> Dashboard
          </Link>
          <ChevronRight size={14} />
          <span className="font-semibold text-[#3a5a40]">Novo Projeto</span>
        </nav>

        <Card className="shadow-md border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-6 mb-2 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-[#344e41]">
                Novo Projeto
              </h1>
              <p className="text-[#3a5a40] mt-1 text-sm">
                Preencha as informações para adicionar ao portfólio.
              </p>
            </div>
            <Link
              to="/dashboard"
              className="text-[#3a5a40] hover:text-[#588157] px-4 py-2 border border-[#a3b18a] rounded-lg flex items-center gap-2 text-sm font-medium transition-colors"
            >
              <ArrowLeft size={16} /> Voltar
            </Link>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
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
                  placeholder="Ex: Casa de Praia"
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
                <Label
                  htmlFor="cliente"
                  className="font-semibold mb-2 block text-[#344e41]"
                >
                  Nome do Cliente
                </Label>
                <TextInput
                  id="cliente"
                  icon={User}
                  placeholder="Ex: João da Silva"
                  shadow
                  {...register("cliente")}
                />
              </div>
              <div>
                <Label
                  htmlFor="responsavel"
                  className="font-semibold mb-2 block text-[#344e41]"
                >
                  Arquiteto Responsável
                </Label>
                <TextInput
                  id="responsavel"
                  icon={Briefcase}
                  placeholder="Ex: Arq. Vinicius"
                  shadow
                  {...register("responsavel")}
                />
              </div>
              <div>
                <Label
                  htmlFor="prazo"
                  className="font-semibold mb-2 block text-[#344e41]"
                >
                  Previsão de Entrega
                </Label>
                <TextInput
                  id="prazo"
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
                Escopo e Detalhes
              </Label>
              <Textarea
                id="descricao"
                rows={5}
                placeholder="Descreva os detalhes do projeto..."
                className="resize-none shadow-sm"
                {...register("descricao")}
              />
              {errors.descricao && (
                <HelperText className="mt-1" color="failure">
                  {errors.descricao.message}
                </HelperText>
              )}
            </div>

            {/* GALERIA DE UPLOAD */}
            <div className="border-t border-gray-200 pt-4">
              <Label className="font-semibold mb-2 block text-[#344e41]">
                Arquivos do Projeto (Imagens, PDF, DOC)
              </Label>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                {previewUrls.length < 6 && (
                  <label className="flex flex-col items-center justify-center h-32 w-full border-2 border-[#a3b18a] border-dashed rounded-lg cursor-pointer bg-[#f3f4f6] hover:bg-[#dad7cd] transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <ImageIcon className="w-8 h-8 text-[#588157] mb-2" />
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
                  const extension = item.name.split(".").pop()?.toLowerCase();
                  const isDoc = ["pdf", "doc", "docx", "odt", "txt"].includes(
                    extension || ""
                  );

                  return (
                    <div
                      key={index}
                      className="relative h-32 w-full border border-gray-200 rounded-lg overflow-hidden group bg-white flex items-center justify-center shadow-sm"
                    >
                      {isDoc ? (
                        <div className="flex flex-col items-center text-gray-500 p-2 text-center">
                          <FileText size={32} className="mb-2 text-[#588157]" />
                          <span className="text-[10px] text-[#344e41] line-clamp-2 leading-tight">
                            {item.name}
                          </span>
                        </div>
                      ) : (
                        <img
                          src={item.url}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-3 mt-4 pt-6 border-t border-gray-200 justify-end">
              <Button color="gray" onClick={() => navigate("/dashboard")}>
                Cancelar
              </Button>

              <Button
                type="submit"
                className="bg-[#588157] hover:!bg-[#3a5a40] border-none shadow-md"
                disabled={isSubmitting} 
              >
                <Save size={18} className="mr-2" />
                {isSubmitting ? "Criando..." : "Criar Projeto"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
