import { useGoogleAuth } from "../auth/googleAuthProvider";
import { useToday } from "../providers/todayProvider";

export default function Header() {

  const { logout } = useGoogleAuth();
  const today = useToday();

  return (
    <div className="relative bg-slate-800 text-white">
      <div className="flex flex-row items-center">
      <div className="flex-1 px-2">{today.toDateString()}</div>
        <button onClick={logout} className="py-2 px-2 hover:bg-slate-700">Logout</button>
      </div>
    </div>
  );
}