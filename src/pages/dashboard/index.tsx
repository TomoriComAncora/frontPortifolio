import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";


export function Dashboard() {
  const {user} = useContext(AuthContext)
  return (
    <div>
      <h1>Dashboard</h1>
      <h1>{user?.id}: {user?.nome} | {user?.email}</h1>
    </div>
  );
}
