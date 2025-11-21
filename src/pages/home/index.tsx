import { Container } from "../../components/container";

export function Home() {
  return (
    <Container>
      <section className="p-4 rounded-lg w-full mx-auto flex justify-center items-center gap-2 bg-secundary">
        <input
          type="text"
          placeholder="Pesquise o nome do projeto aqui"
          className="w-full border-primary rounded-lg h-9 px-3 outline-none"
        />
        <button className="bg-buttons h-9 px-8 rounded-lg text-white font-bold text-lg">
          Buscar
        </button>
      </section>
      <h1 className="font-bold text-left mt-6 text-3xl mb-4">Projetos</h1>

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
            <strong className="font-medium mb-2">
              Arquiteto(a): Ana Clara
            </strong>
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
            <strong className="font-medium mb-2">
              Arquiteto(a): Ana Clara
            </strong>
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
            <strong className="font-medium mb-2">
              Arquiteto(a): Ana Clara
            </strong>
          </div>
        </section>
      </main>
    </Container>
  );
}
