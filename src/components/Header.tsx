import { useGoogleAuth } from "../auth/googleAuthProvider";
import { useToday } from "../providers/todayProvider";

export default function Header() {

  const { logout } = useGoogleAuth();
  const today = useToday();

  return (
    <div className="relative bg-slate-600 text-white">
      <div className="flex flex-row items-center">
        <div className="flex-1 font-bold px-4">
          <img src={process.env.PUBLIC_URL + '/icon-512.png'} alt="App Icon" className="h-6 inline-block mr-2"></img>
          {today.toDateString()}
        </div>
        <button onClick={logout} className="py-2 px-2 hover:bg-slate-600">Logout</button>
      </div>
    </div>
  );
}