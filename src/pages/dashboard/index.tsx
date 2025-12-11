// import { useContext } from "react";
// import { AuthContext } from "../../contexts/AuthContext";
import { Container } from "../../components/container";
import { Button } from "flowbite-react"
import { Link } from "react-router";

export function Dashboard() {
  // const { user } = useContext(AuthContext);
  return (
    <Container>
      <div className="w-full mx-auto flex justify-between items-center">
        <h1 className="font-bold text-left mt-6 text-3xl mb-4">Meus projetos</h1>
        <Button color="green" className="font-bold cursor-pointerpm">
          <Link to={"/dashboard/new"}>Adicionar projeto</Link>
        </Button>
      </div>

      <main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <section className="w-full bg-secundary rounded-lg">
          <img
            className="w-full rounded-t-lg mb-2 max-h-72 hover:scale-102 transition-all"
            src="https://ventramelidecor.com.br/wp-content/uploads/2024/05/casa-moderna-linhas-retas.jpg"
            alt="casa"
          />
          <p className="font-bold mt-1 mb-2 px-2">Casa moderna</p>
          <div className="flex flex-col px-2">
            <span className="text-zinc-800 mb-4">
              Data: 11/2025 | Categoria: Render
            </span>
          </div>
        </section>
        <section className="w-full bg-secundary rounded-lg">
          <img
            className="w-full rounded-t-lg mb-2 max-h-72 hover:scale-102 transition-all"
            src="https://ventramelidecor.com.br/wp-content/uploads/2024/05/casa-moderna-linhas-retas.jpg"
            alt="casa"
          />
          <p className="font-bold mt-1 mb-2 px-2">Casa moderna</p>
          <div className="flex flex-col px-2">
            <span className="text-zinc-800 mb-4">
              Data: 11/2025 | Categoria: Render
            </span>
          </div>
        </section>
        <section className="w-full bg-secundary rounded-lg">
          <img
            className="w-full rounded-t-lg mb-2 max-h-72 hover:scale-102 transition-all"
            src="https://ventramelidecor.com.br/wp-content/uploads/2024/05/casa-moderna-linhas-retas.jpg"
            alt="casa"
          />
          <p className="font-bold mt-1 mb-2 px-2">Casa moderna</p>
          <div className="flex flex-col px-2">
            <span className="text-zinc-800 mb-4">
              Data: 11/2025 | Categoria: Render
            </span>
          </div>
        </section>
      </main>
    </Container>
  );
}
