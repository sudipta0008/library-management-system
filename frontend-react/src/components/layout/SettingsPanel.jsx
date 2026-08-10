import { X, Moon, Sun, Bell } from "lucide-react";

import { useTheme } from "../../context/ThemeContext";

export default function SettingsPanel({
  open,
  onClose,
}) {
  const {
    theme,
    toggleTheme,
  } = useTheme();

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100]">

      {/* Overlay */}
      <button
        type="button"
        aria-label="Close settings"
        onClick={onClose}
        className="absolute inset-0 bg-black/30"
      />

      {/* Panel */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md border-l border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-950">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5 dark:border-gray-800">

          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Settings
            </h2>

            <p className="text-sm text-gray-500">
              Manage your LibraryOS preferences.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X size={20} />
          </button>

        </div>

        {/* Settings */}
        <div className="space-y-4 p-6">

          {/* Theme */}
          <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-3">

                <div className="rounded-lg bg-gray-100 p-2 dark:bg-gray-800">
                  {theme === "dark" ? (
                    <Moon size={18} />
                  ) : (
                    <Sun size={18} />
                  )}
                </div>

                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Appearance
                  </p>

                  <p className="text-sm text-gray-500">
                    {theme === "dark"
                      ? "Dark mode"
                      : "Light mode"}
                  </p>
                </div>

              </div>

              <button
                type="button"
                onClick={toggleTheme}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Change
              </button>

            </div>

          </div>

          {/* Notifications */}
          <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">

            <div className="flex items-center gap-3">

              <div className="rounded-lg bg-blue-100 p-2 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                <Bell size={18} />
              </div>

              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  Notifications
                </p>

                <p className="text-sm text-gray-500">
                  Library alerts are enabled.
                </p>
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}