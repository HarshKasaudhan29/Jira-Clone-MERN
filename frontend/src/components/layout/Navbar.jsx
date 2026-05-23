import { Link } from "react-router-dom";
import { LogOut, LayoutDashboard } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="h-14 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-6 shrink-0 z-20">
      {/* Brand */}
      <Link to="/dashboard" className="flex items-center gap-2 group">
        <div className="w-7 h-7 bg-blue-600 rounded flex items-center justify-center">
          <LayoutDashboard size={14} className="text-white" />
        </div>
        <span className="text-white font-semibold text-sm tracking-wide">
          JiraClone
        </span>
      </Link>

      {/* User area */}
      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <p className="text-white text-xs font-medium leading-none">
            {user?.name}
          </p>
          <p className="text-gray-500 text-xs mt-0.5">{user?.email}</p>
        </div>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold uppercase">
          {user?.name?.[0] ?? "U"}
        </div>

        <button
          onClick={logout}
          title="Logout"
          className="p-1.5 rounded text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
