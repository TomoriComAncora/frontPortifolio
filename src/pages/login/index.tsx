import logoImg from "../../assets/logo.jpeg";
import { Link } from "react-router";
import { Container } from "../../components/container";

import { Input } from "../../components/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router";

const schema = z.object({
  email: z
    .string()
    .email("Insira um email válido")
    .nonempty("O campo é obrigatório"),
  senha: z.string().nonempty("O campo senha é obrigatório"),
});

type FormData = z.infer<typeof schema>;

export function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  async function onSubmit(data: FormData) {
    console.log(data);
    await login(data.email, data.senha);
    navigate("/dashboard");
  }

  return (
    <Container>
      <div className="w-full min-h-screen flex justify-center items-center flex-col gap-4">
        <Link to={"/"} className="mb-6 max-w-sm w-3xs">
          <img src={logoImg} alt="Logo do site" className="w-full" />
        </Link>

        <form
          className="bg-secundary w-full max-w-xl rounded-lg p-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="mb-3">
            <Input
              type="email"
              placeholder="Digite seu email"
              name="email"
              error={errors.email?.message}
              register={register}
            />
          </div>
          <div className="mb-3">
            <Input
              type="password"
              placeholder="Digite sua senha"
              name="senha"
              error={errors.senha?.message}
              register={register}
            />
          </div>

          <button
            type="submit"
            className="bg-zinc-500 w-full rounded-lg text-white h-10 font-medium cursor-pointer"
          >
            enviar
          </button>
        </form>
        <Link to={"/register"}>Não possui uma conta? Cadastre-se.</Link>
      </div>
    </Container>
  );
}
