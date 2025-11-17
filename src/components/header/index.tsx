import { Link } from "react-router";
import Logo from "../../assets/logo.jpeg";
import { CircleUserRound, LogIn } from "lucide-react";

export function Header() {
  const singed = true;
  const loginAuth = false;

  return (
    <div className="w-full flex items-center justify-center h-16 bg-primary drop-shadow mb-4">
      <header className="flex w-full max-w-7xl items-center justify-between px-4 mx-auto">
        <Link to={"/"}>
          <img
            src={Logo}
            alt="Logo do sistema"
            className="w-16"
          />
        </Link>
        {!loginAuth && singed && (
          <Link to={"/dashboard"}>
            <CircleUserRound />
          </Link>
        )}
        {!loginAuth && !singed && (
          <Link to={"/login"}>
            <LogIn />
          </Link>
        )}
      </header>
    </div>
  );
}
