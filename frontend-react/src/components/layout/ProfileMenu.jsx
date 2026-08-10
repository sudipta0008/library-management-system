import {
  LogOut,
  Settings,
  UserCircle,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

export default function ProfileMenu({
  onSettings,
  onClose,
}) {
  const { admin, logout } = useAuth();

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    onClose();
    navigate("/login", {
      replace: true,
    });
  };

  return (
    <div className="absolute right-0 top-12 z-50 w-72 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-900">

      {/* Admin */}
      <div className="border-b border-gray-200 p-4 dark:border-gray-800">

        <div className="flex items-center gap-3">

          <div className="rounded-full bg-blue-100 p-2 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
            <UserCircle size={28} />
          </div>

          <div className="min-w-0">
            <p className="truncate font-semibold text-gray-900 dark:text-white">
              {admin?.name || "Admin"}
            </p>

            <p className="truncate text-xs text-gray-500">
              {admin?.email || ""}
            </p>

            <p className="mt-1 text-xs font-medium text-blue-600">
              Administrator
            </p>
          </div>

        </div>

      </div>

      {/* Settings */}
      <button
        type="button"
        onClick={() => {
          onSettings();
          onClose();
        }}
        className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
      >
        <Settings size={18} />
        Settings
      </button>

      {/* Logout */}
      <button
        type="button"
        onClick={handleLogout}
        className="flex w-full items-center gap-3 border-t border-gray-200 px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 dark:border-gray-800 dark:hover:bg-red-950/30"
      >
        <LogOut size={18} />
        Sign Out
      </button>

    </div>
  );
}