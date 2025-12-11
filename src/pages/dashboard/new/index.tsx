import { Container } from "../../../components/container";
import { Input } from "../../../components/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextArea } from "../../../components/textArea";
import React, { useState, useRef } from "react";
import { Upload, Trash2 } from "lucide-react";
import { Button } from "flowbite-react";

const schema = z.object({
  titulo: z
    .string()
    .nonempty("Este campo é obrigatório")
    .min(4, "O título do projeto"),
  descricao: z.string().nonempty("Este campo é obrigatório"),
  categoria: z.string().nonempty("este campo é obrigatório"),
  cliente: z.string(),
  prazo: z.date().optional(),
});

type FormData = z.infer<typeof schema>;

export function New() {
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

  function handleGaleriaChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    const maxSize = 5 * 1024 * 1024;

    const validFiles = files.filter((f) => f.size <= maxSize);
    if (validFiles.length !== files.length) {
      alert("Imagens forma ignoradas, > 5MB");
    }

    const readers = validFiles.map((file) => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error("Falha ao ler arquivo"));
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers)
      .then((dataUrls) => {
        setGaleriaFiles((prev) => [...prev, ...validFiles]);
        setGaleriaPreviews((prev) => [...prev, ...dataUrls]);
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

  return (
    <div>
      <Container>
        <h1 className="text-2xl my-3 font-bold">Novo projeto</h1>
        <div className="w-full p-3 flex flex-col sm:flex-row items-center gap-2">
          {/* absolute top-20 right-50 */}
            {imagePreview ? (
              <div className="w-full h-32 flex items-center justify-center relative">
                <img
                  src={imagePreview}
                  alt="Preview da imagem"
                  className="rounded-lg w-full h-32 object-cover"
                />
                <button
                  type="button"
                  onClick={removerCapa}
                  className="absolute opacity-20 cursor-pointer hover:opacity-100"
                >
                  <Trash2 color="#fff"/>
                </button>
              </div>
            ) : (
              <div
                className="w-full h-32 flex flex-col items-center justify-center border-2 border-dashed rounded-md p-2"
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
          
          <div className="border-2 w-1/2 rounded-lg overflow-hidden flex gap-1">
            <div
              className="border-2 border-dashed ronded-md p-6 flex flex-col items-center cursor-pointer"
              onClick={() => galeriaInputRef.current?.click()}
            >
              <Upload className="h-6 w-6 mx-auto text-gray-400 mb-1" />
              <p className="text-gray-500">Adicionar imagens</p>
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
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {galeriaPreviews.map((src, idx) => (
                  <div key={idx} className="relative group">
                    <img
                      src={src}
                      alt={`Imagem ${idx + 1}`}
                      className="h-24 w-full object-cover rounded-md border"
                    />
                    <button
                      type="button"
                      onClick={() => removerItemGaleria(idx)}
                      className="absolute top-8 right-3 px-2 py-1 text-xs text-white rounded opacity-0 group-hover:opacity-100 transition cursor-pointer"
                    >
                      <Trash2 />
                    </button>
                  </div>
                ))}
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
            type="date"
            name="prazo"
            register={register}
            error={errors.prazo?.message}
            placeholder=""
          ></Input>
        </div>

        <div className="flex justify-center mt-7">
          <Button color="green" className="w-3xs">
            Green
          </Button>
        </div>
      </Container>
    </div>
  );
}
