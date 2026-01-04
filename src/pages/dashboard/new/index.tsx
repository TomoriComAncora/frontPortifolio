import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, Trash2, FileText, X, ArrowLeft } from "lucide-react";
import { Button, Label, HelperText } from "flowbite-react"; // Removi Select
import toast from "react-hot-toast";

import api from "../../../server/api";
import { Container } from "../../../components/container";
import { Input } from "../../../components/input"; 
import { TextArea } from "../../../components/textArea";

const schema = z.object({
  titulo: z.string().min(1, "O título é obrigatório"),
  descricao: z
    .string()
    .min(10, "A descrição deve ter pelo menos 10 caracteres"),
  categoria: z.string().min(1, "A categoria é obrigatória"),
  cliente: z.string().optional(),
  prazo: z.string().optional(),
});

type FormDataProps = z.infer<typeof schema>;

export function New() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [imagemCapa, setImagemCapa] = useState<File | null>(null);
  const [capaPreview, setCapaPreview] = useState<string | null>(null);

  const [galeriaFiles, setGaleriaFiles] = useState<File[]>([]);
  const [galeriaPreviews, setGaleriaPreviews] = useState<
    { url: string; name: string }[]
  >([]);

  const capaInputRef = useRef<HTMLInputElement>(null);
  const galeriaInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataProps>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  function handleCapaChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImagemCapa(file);
      setCapaPreview(URL.createObjectURL(file));
    }
  }

  function handleGaleriaChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      if (galeriaFiles.length + filesArray.length > 10) {
        toast.error("Limite de 10 arquivos atingido.");
        return;
      }
      setGaleriaFiles((prev) => [...prev, ...filesArray]);
      const newPreviews = filesArray.map((file) => ({
        url: URL.createObjectURL(file),
        name: file.name,
      }));
      setGaleriaPreviews((prev) => [...prev, ...newPreviews]);
    }
  }

  function removerCapa() {
    setImagemCapa(null);
    setCapaPreview(null);
  }

  function removerItemGaleria(index: number) {
    setGaleriaFiles((prev) => prev.filter((_, i) => i !== index));
    setGaleriaPreviews((prev) => prev.filter((_, i) => i !== index));
  }

  async function onSubmit(data: FormDataProps) {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("titulo", data.titulo);
      formData.append("descricao", data.descricao);
      formData.append("categoria", data.categoria);

      if (data.cliente) formData.append("cliente", data.cliente);
      if (data.prazo) formData.append("prazo", data.prazo);
      if (imagemCapa) formData.append("capa", imagemCapa);

      galeriaFiles.forEach((file) => {
        formData.append("imagens", file);
      });

      await api.post("/project", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Projeto cadastrado com sucesso!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao cadastrar projeto.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Container>
      <div className="flex items-center gap-4 mb-6 mt-4">
        <Link
          to="/dashboard"
          className="bg-gray-200 p-2 rounded-full hover:bg-gray-300 transition"
        >
          <ArrowLeft size={20} className="text-zinc-900" />
        </Link>
        <h1 className="text-2xl font-bold">Novo projeto</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="pb-10">
        <div className="w-full mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div
              className="w-full h-40 rounded-lg border-2 border-dashed border-zinc-400 bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors relative overflow-hidden"
              onClick={() => capaInputRef.current?.click()}
            >
              {capaPreview ? (
                <>
                  <img
                    src={capaPreview}
                    alt="Capa"
                    className="w-full h-full object-cover"
                  />
                  <div
                    className="absolute top-2 right-2 bg-red-500 rounded-full p-1 cursor-pointer hover:bg-red-600 hover:scale-105"
                    onClick={(e) => {
                      e.stopPropagation();
                      removerCapa();
                    }}
                  >
                    <Trash2 size={16} color="#fff" />
                  </div>
                </>
              ) : (
                <>
                  <Upload className="mb-2 text-zinc-500" size={32} />
                  <span className="text-zinc-500 text-sm font-medium">
                    Imagem de Capa
                  </span>
                </>
              )}
              <input
                type="file"
                ref={capaInputRef}
                accept="image/*"
                className="hidden"
                onChange={handleCapaChange}
              />
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-2">
            <div
              className="w-full h-40 rounded-lg border-2 border-dashed border-zinc-400 bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => galeriaInputRef.current?.click()}
            >
              <Upload className="mb-2 text-zinc-500" size={32} />
              <span className="text-zinc-500 text-sm font-medium">
                Adicionar Galeria (Img/PDF/Doc)
              </span>
              <input
                type="file"
                ref={galeriaInputRef}
                accept="image/*,.pdf,.doc,.docx,.odt"
                multiple
                className="hidden"
                onChange={handleGaleriaChange}
              />
            </div>
          </div>
        </div>

        {/* PREVIEWS */}
        {galeriaPreviews.length > 0 && (
          <div className="mb-6 p-2 bg-gray-50 rounded-lg border border-gray-200 overflow-x-auto flex gap-4">
            {galeriaPreviews.map((item, index) => {
              const isDoc =
                item.name.endsWith(".pdf") ||
                item.name.endsWith(".doc") ||
                item.name.endsWith(".docx") ||
                item.name.endsWith(".odt");
              return (
                <div
                  key={index}
                  className="relative w-24 h-24 flex-shrink-0 border rounded-lg bg-white flex items-center justify-center overflow-hidden group"
                >
                  {isDoc ? (
                    <div className="flex flex-col items-center text-center p-1">
                      <FileText size={24} className="text-blue-500 mb-1" />
                      <span className="text-[9px] leading-tight line-clamp-2 text-zinc-600">
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
                    onClick={() => removerItemGaleria(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-80 hover:opacity-100 hover:scale-105 transition"
                  >
                    <X size={12} />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* INPUTS DE TEXTO */}
        <div className="mb-3">
          <Input
            type="text"
            name="titulo"
            placeholder="Título do Projeto"
            register={register}
            error={errors.titulo?.message}
          />
        </div>

        <div className="mb-3">
          <TextArea
            name="descricao"
            placeholder="Descreva o escopo e detalhes do projeto..."
            register={register}
            error={errors.descricao?.message}
          />
        </div>

        <div className="mb-3 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            name="categoria"
            placeholder="Categoria (ex: Residencial, Comercial)"
            register={register}
            type="text"
            error={errors.categoria?.message}
          />

          <Input
            name="cliente"
            placeholder="Nome do Cliente"
            register={register}
            type="text"
            error={errors.cliente?.message}
          />
        </div>

        <div className="mb-6">
          <Input
            name="prazo"
            placeholder="Data de Entrega"
            type="date"
            register={register}
            error={errors.prazo?.message}
          />
        </div>

        <Button
          type="submit"
          className="w-full !bg-[#588157] enabled:hover:!bg-[#3a5a40] border-none"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Cadastrando..." : "Cadastrar Projeto"}
        </Button>
      </form>
    </Container>
  );
}
