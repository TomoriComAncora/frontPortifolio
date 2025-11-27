import logoImg from "../../assets/logo.jpeg";
import { Link } from "react-router";
import { Container } from "../../components/container";

import { Input } from "../../components/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  name: z
    .string()
    .nonempty("O campo nome é obrigatório")
    .min(3, "O campo nome deve ter mais de 2 caracteres"),
  email: z
    .string()
    .email("Insira um email válido")
    .nonempty("O campo é obrigatório"),
  password: z
    .string()
    .nonempty("O campo senha é obrigatório")
    .min(4, "A senha deve ter mais de 4 caracteres"),
});

type FormData = z.infer<typeof schema>;

export function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  function onSubmit(data: FormData) {
    console.log(data);
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
              type="text"
              placeholder="Digite seu nome"
              name="name"
              error={errors.name?.message}
              register={register}
            />
          </div>
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
              name="password"
              error={errors.password?.message}
              register={register}
            />
          </div>
          <button
            type="submit"
            className="bg-zinc-500 w-full rounded-lg text-white h-10 font-medium cursor-pointer mb-3"
          >
            Cadastrar
          </button>
          <span className="flex justify-center mb-2">Ou</span>
          <button className="bg-zinc-500 w-2/5 rounded-lg text-white h-10 font-medium cursor-pointer mb-3 flex justify-around items-center mx-auto hover:scale-105 transition-all shadow-[0px_10px_11px_0px_rgba(168,157,157,0.56)]">
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Logo google"
              className="w-5 h-5"
            />
            <span>Log in with Google</span>
          </button>
        </form>
        <Link to={"/login"}>Já possui uma conta? Faça o login!</Link>
      </div>
    </Container>
  );
}
