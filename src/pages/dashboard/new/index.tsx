import { Container } from "../../../components/container";
import { Input } from "../../../components/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextArea } from "../../../components/textArea";
import React, { useState, useRef } from "react";
import { Upload, Trash2 } from "lucide-react";
import { Button } from "flowbite-react";
import api from "../../../server/api";
import { useNavigate } from "react-router";

const schema = z.object({
  titulo: z
    .string()
    .nonempty("Este campo é obrigatório")
    .min(4, "O título do projeto"),
  descricao: z.string().nonempty("Este campo é obrigatório"),
  categoria: z.string().nonempty("este campo é obrigatório"),
  cliente: z.string(),
  prazo: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export function New() {
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const capaInputRef = useRef<HTMLInputElement>(null);

  const [galeriaFiles, setGaleriaFiles] = useState<File[]>([]);
  const [galeriaPreviews, setGaleriaPreviews] = useState<string[]>([]);
  const galeriaInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        console.log("Imagem excede 5MB");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };

      reader.readAsDataURL(file);
    }
  }

  const MAX_IMAGES = 10;

  function handleGaleriaChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    const maxSize = 5 * 1024 * 1024;

    const validFiles = files.filter((f) => f.size <= maxSize);
    if (validFiles.length !== files.length) {
      alert("Imagens forma ignoradas, > 5MB");
    }

    const verQntdDeSlot = MAX_IMAGES - galeriaFiles.length;
    if (verQntdDeSlot <= 0) {
      alert("Você já atingiu o limite de 10 imagens.");
      e.target.value = "";
      return;
    }

    const toAdd = validFiles.slice(0, verQntdDeSlot);

    const readers = toAdd.map((file) => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error("Falha ao ler arquivo"));
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers)
      .then((dataUrls) => {
        setGaleriaFiles((prev) => [...prev, ...toAdd]);
        setGaleriaPreviews((prev) => [...prev, ...dataUrls]);
        e.target.value = "";
        const skipped = validFiles.length - toAdd.length;
        if (skipped > 0)
          alert(
            `Limite de ${MAX_IMAGES} imagens. ${skipped} não foram adicionadas.`
          );
      })
      .catch(() => {
        alert("Falha ao ler imagens.");
      });
  }

  function removerItemGaleria(index: number) {
    setGaleriaFiles((prev) => prev.filter((_, i) => i !== index));
    setGaleriaPreviews((prev) => prev.filter((_, i) => i !== index));
  }

  function removerCapa() {
    setImageFile(null);
    setImagePreview(null);
  }

  async function onSubmit(data: FormData) {
    console.log("Dados: ", data);
    console.log("Imagem da capa: ", imageFile);
    console.log("Imagens da galeria: ", galeriaFiles);

    try {
      const formData = new FormData();

      formData.append("titulo", data.titulo);
      formData.append("descricao", data.descricao);
      formData.append("categoria", data.categoria);
      if (data.cliente) formData.append("cliente", data.cliente);
      if (data.prazo) formData.append("prazo", data.prazo);

      if (imageFile) formData.append("capa", imageFile);
      galeriaFiles.forEach((file) => formData.append("imagens", file));

      const token = localStorage.getItem("token");

      const create = await api.post("/project", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      navigate("/");
      console.log(`Projeto: ${create.data}`);
    } catch (err) {
      console.log("ERRO: ", err);
    }
  }

  return (
    <div>
      <Container>
        <h1 className="text-2xl my-3 font-bold">Novo projeto</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="w-full p-3 flex flex-col md:flex-row items-start gap-3">
            {imagePreview ? (
              <div className="w-full md:w-3/4 h-32 flex items-center justify-center relative">
                <img
                  src={imagePreview}
                  alt="Preview da imagem"
                  className="rounded-lg w-full h-32 object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    type="button"
                    onClick={removerCapa}
                    className="opacity-10 cursor-pointer hover:opacity-100"
                  >
                    <Trash2 color="#fff" />
                  </button>
                </div>
              </div>
            ) : (
              <div
                className="w-full md:w-3/4 h-32 flex flex-col items-center justify-center border-2 border-dashed rounded-md p-2"
                onClick={() => capaInputRef.current?.click()}
              >
                <Upload className="h-8 w-8 mx-auto text-gray-400 my-2 cursor-pointer" />
                <label htmlFor="file" className="text-gray-500">
                  Clique para selecionar um arquivo
                </label>
                <input
                  type="file"
                  ref={capaInputRef}
                  name="file"
                  id="file"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={handleImageChange}
                  required
                  className="hidden"
                />
              </div>
            )}

            <div className="w-full md:w1/4 h-32 border-2 rounded-lg overflow-hidden flex gap-1">
              <div
                className="ronded-md p-2 m-1 flex flex-col items-center justify-center cursor-pointer border border-dashed rounded-lg"
                onClick={() => galeriaInputRef.current?.click()}
              >
                <Upload className="h-6 w-6 mx-auto text-gray-400 mb-1" />
                <p className="text-gray-500 text-center">Adicionar imagens</p>
              </div>
              <input
                type="file"
                ref={galeriaInputRef}
                accept="image/jpeg,image/jpg,image/png"
                multiple
                onChange={handleGaleriaChange}
                className="hidden"
              />

              {galeriaPreviews.length > 0 && (
                <div className="m-2 max-h-28 overflow-x-auto overflow-y-hidden">
                  <div className="grid grid-flow-col auto-cols-[7rem] gap-3">
                    {galeriaPreviews.map((src, idx) => (
                      <div
                        key={idx}
                        className="relative group shrink-0 w-28 h-28"
                      >
                        <img
                          src={src}
                          alt={`Imagem ${idx + 1}`}
                          className="absolute inset-0 w-full h-full object-cover rounded-md border"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => removerItemGaleria(idx)}
                            className="p-1 rounded-full text-xs text-white opacity-10 group-hover:opacity-100 transition cursor-pointer"
                          >
                            <Trash2 />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="mb-3">
            <Input
              type="text"
              name="titulo"
              placeholder="Escolha o título do seu projeto"
              register={register}
              error={errors.titulo?.message}
            ></Input>
          </div>
          <div className="mb-3">
            <TextArea
              name="descricao"
              placeholder="Fale um pouco sobre seu projeto"
              register={register}
              error={errors.descricao?.message}
              rows={4}
            ></TextArea>
          </div>
          <div className="mb-3 w-full flex justify-center gap-2.5">
            <Input
              name="categoria"
              placeholder="Categoria do projeto"
              register={register}
              type="text"
              error={errors.categoria?.message}
            ></Input>
            <Input
              name="cliente"
              placeholder="Cliente"
              register={register}
              type="text"
              error={errors.cliente?.message}
            ></Input>
            <Input
              name="prazo"
              placeholder=""
              type="date"
              register={register}
              error={errors.prazo?.message}
            ></Input>
          </div>

          <div className="flex justify-center mt-7">
            <Button
              color="green"
              className="w-3xs cursor-pointer"
              type="submit"
            >
              Cadastrar
            </Button>
          </div>
        </form>
      </Container>
    </div>
  );
}
