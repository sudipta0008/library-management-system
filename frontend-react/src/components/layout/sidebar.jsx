import { NavLink } from "react-router-dom";

import {
  LayoutDashboard,
  BookOpen,
  Users,
  Repeat,
  BarChart3,
  ClipboardList,
  Settings,
} from "lucide-react";

const menu = [
  {
    title: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Books",
    path: "/books",
    icon: BookOpen,
  },
  {
    title: "Members",
    path: "/members",
    icon: Users,
  },
  {
    title: "Loans",
    path: "/loans",
    icon: Repeat,
  },
  {
    title: "Reports",
    path: "/reports",
    icon: BarChart3,
  },
  {
    title: "Audit Logs",
    path: "/audit",
    icon: ClipboardList,
  },
];

export default function Sidebar() {
  return (
    <div className="flex h-full flex-col">

      {/* Logo */}
      <div className="border-b border-gray-200 p-5 dark:border-gray-800">

        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          📚 LibraryOS
        </h1>

        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Management Console
        </p>

      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 overflow-y-auto p-3">

        {menu.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                }`
              }
            >
              <Icon size={19} />

              <span>{item.title}</span>
            </NavLink>
          );
        })}

      </nav>

      {/* Settings */}
      <div className="border-t border-gray-200 p-3 dark:border-gray-800">

        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          <Settings size={19} />

          Settings
        </button>

      </div>

    </div>
  );
}