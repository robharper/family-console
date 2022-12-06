import { useGoogleAuth } from "../auth/googleAuthProvider";

export default function Header() {

  const { logout } = useGoogleAuth();

  return (
    <div className="relative bg-blue-800 text-white">
      <div className="flex flex-row-reverse">
        <button onClick={logout} className="py-2 px-2 hover:bg-blue-700">Logout</button>
      </div>
    </div>
  );
}