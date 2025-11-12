import { Link } from "react-router";
import Logo from "../../assets/logo.png";
import { CircleUserRound, LogIn } from "lucide-react";

export function Header() {
  const singed = false;
  const loginAuth = false;

  return (
    <div className="w-full flex items-center justify-center h-16 bg-primary">
      <header>
        <Link to={"/"}>
          <img src={Logo} alt="Logo do sistema" className="w-52"/>
        </Link>
        <Link to={"/dashboard"}>
          <CircleUserRound />
        </Link>
      </header>
    </div>
  );
}
