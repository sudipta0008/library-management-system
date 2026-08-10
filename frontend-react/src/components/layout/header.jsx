import {
  Bell,
  Search,
  Moon,
  Sun,
  UserCircle,
} from "lucide-react";

import { useState } from "react";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useTheme } from "../../context/ThemeContext";

import NotificationPanel from "./NotificationPanel";
import ProfileMenu from "./ProfileMenu";
import SettingsPanel from "./SettingsPanel";

const pageTitles = {
  "/": "Dashboard",
  "/books": "Books",
  "/members": "Members",
  "/loans": "Loans",
  "/reports": "Reports",
  "/audit": "Audit Logs",
};

const searchItems = [
  {
    title: "Dashboard",
    path: "/",
    keywords: "dashboard home",
  },
  {
    title: "Books",
    path: "/books",
    keywords: "books library",
  },
  {
    title: "Members",
    path: "/members",
    keywords: "members users",
  },
  {
    title: "Loans",
    path: "/loans",
    keywords: "loans issue return",
  },
  {
    title: "Reports",
    path: "/reports",
    keywords: "reports analytics",
  },
  {
    title: "Audit Logs",
    path: "/audit",
    keywords: "audit logs history",
  },
];

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  const { theme, toggleTheme } = useTheme();

  // -----------------------------
  // Global Search
  // -----------------------------
  const [globalSearch, setGlobalSearch] =
    useState("");

  const [showSearchResults, setShowSearchResults] =
    useState(false);

  // -----------------------------
  // Notifications
  // -----------------------------
  const [showNotifications, setShowNotifications] =
    useState(false);

  // -----------------------------
  // Profile
  // -----------------------------
  const [showProfile, setShowProfile] =
    useState(false);

  // -----------------------------
  // Settings
  // -----------------------------
  const [showSettings, setShowSettings] =
    useState(false);

  // -----------------------------
  // Notifications Data
  // -----------------------------
  const [notifications, setNotifications] =
    useState([
      {
        id: 1,
        type: "warning",
        title: "Overdue books",
        message:
          "Some books are currently overdue.",
        read: false,
      },
      {
        id: 2,
        type: "warning",
        title: "Pending fines",
        message:
          "There are unpaid fines in the system.",
        read: false,
      },
      {
        id: 3,
        type: "success",
        title: "Library system ready",
        message:
          "LibraryOS is running normally.",
        read: true,
      },
    ]);

  // -----------------------------
  // Page Title
  // -----------------------------
  const pageTitle =
    pageTitles[location.pathname] ||
    "Dashboard";

  // -----------------------------
  // Search Results
  // -----------------------------
  const filteredSearchItems =
    searchItems.filter((item) => {
      const query = globalSearch
        .trim()
        .toLowerCase();

      if (!query) {
        return false;
      }

      return (
        item.title
          .toLowerCase()
          .includes(query) ||
        item.keywords.includes(query)
      );
    });

  // -----------------------------
  // Unread Notifications
  // -----------------------------
  const unreadCount =
    notifications.filter(
      (notification) => !notification.read
    ).length;

  // -----------------------------
  // Mark Notifications Read
  // -----------------------------
  const handleMarkAllRead = () => {
    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  };

  // -----------------------------
  // Notification Toggle
  // -----------------------------
  const handleNotificationToggle = () => {
    setShowNotifications(
      (current) => !current
    );

    setShowProfile(false);
    setShowSearchResults(false);
  };

  // -----------------------------
  // Profile Toggle
  // -----------------------------
  const handleProfileToggle = () => {
    setShowProfile(
      (current) => !current
    );

    setShowNotifications(false);
    setShowSearchResults(false);
  };

  // -----------------------------
  // Settings
  // -----------------------------
  const handleSettings = () => {
    setShowSettings(true);

    setShowProfile(false);
    setShowNotifications(false);
    setShowSearchResults(false);
  };

  // -----------------------------
  // Search
  // -----------------------------
  const handleSearchChange = (e) => {
    const value = e.target.value;

    setGlobalSearch(value);
    setShowSearchResults(true);

    setShowNotifications(false);
    setShowProfile(false);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Escape") {
      setShowSearchResults(false);
      return;
    }

    if (
      e.key === "Enter" &&
      filteredSearchItems.length > 0
    ) {
      const firstResult =
        filteredSearchItems[0];

      navigate(firstResult.path);

      setGlobalSearch("");
      setShowSearchResults(false);
    }
  };

  const handleSearchResultClick = (path) => {
    navigate(path);

    setGlobalSearch("");
    setShowSearchResults(false);
  };

  return (
    <>
      <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white/95 px-4 backdrop-blur dark:border-gray-800 dark:bg-gray-950/95 sm:px-6">

        {/* -------------------------------- */}
        {/* Current Page */}
        {/* -------------------------------- */}

        <div className="min-w-0">
          <h2 className="truncate text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
            {pageTitle}
          </h2>
        </div>

        {/* -------------------------------- */}
        {/* Right Side */}
        {/* -------------------------------- */}

        <div className="flex items-center gap-1 sm:gap-2">

          {/* -------------------------------- */}
          {/* Global Search */}
          {/* -------------------------------- */}

          <div className="relative hidden sm:block">

            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={globalSearch}
              onChange={handleSearchChange}
              onFocus={() => {
                if (globalSearch.trim()) {
                  setShowSearchResults(true);
                }
              }}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search pages..."
              className="w-48 rounded-xl border border-gray-200 bg-gray-50 py-2 pl-9 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:focus:bg-gray-900 lg:w-64"
            />

            {/* Search Results */}

            {showSearchResults &&
              globalSearch.trim() && (
                <div className="absolute right-0 top-12 z-50 w-72 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-900">

                  {filteredSearchItems.length >
                  0 ? (
                    filteredSearchItems.map(
                      (item) => (
                        <button
                          key={item.path}
                          type="button"
                          onClick={() =>
                            handleSearchResultClick(
                              item.path
                            )
                          }
                          className="flex w-full items-center justify-between px-4 py-3 text-left transition hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                          <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                            {item.title}
                          </span>

                          <span className="text-xs text-gray-400">
                            Page
                          </span>
                        </button>
                      )
                    )
                  ) : (
                    <div className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
                      No results found
                    </div>
                  )}

                </div>
              )}

          </div>

          {/* -------------------------------- */}
          {/* Notifications */}
          {/* -------------------------------- */}

          <div className="relative">

            <button
              type="button"
              onClick={
                handleNotificationToggle
              }
              title="Notifications"
              className="relative rounded-xl p-2.5 text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <Bell size={19} />

              {unreadCount > 0 && (
                <span className="absolute right-1.5 top-1.5 flex h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-950" />
              )}
            </button>

            {showNotifications && (
              <NotificationPanel
                notifications={notifications}
                onClose={() =>
                  setShowNotifications(false)
                }
                onMarkAllRead={
                  handleMarkAllRead
                }
              />
            )}

          </div>

          {/* -------------------------------- */}
          {/* Theme */}
          {/* -------------------------------- */}

          <button
            type="button"
            onClick={toggleTheme}
            title={
              theme === "dark"
                ? "Switch to light mode"
                : "Switch to dark mode"
            }
            className="rounded-xl p-2.5 text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            {theme === "dark" ? (
              <Sun size={19} />
            ) : (
              <Moon size={19} />
            )}
          </button>

          {/* -------------------------------- */}
          {/* Profile */}
          {/* -------------------------------- */}

          <div className="relative">

            <button
              type="button"
              onClick={handleProfileToggle}
              title="Profile"
              className="rounded-xl p-1.5 text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <UserCircle size={28} />
            </button>

            {showProfile && (
              <ProfileMenu
                onSettings={handleSettings}
                onClose={() =>
                  setShowProfile(false)
                }
              />
            )}

          </div>

        </div>

      </header>

      {/* -------------------------------- */}
      {/* Settings */}
      {/* -------------------------------- */}

      <SettingsPanel
        open={showSettings}
        onClose={() =>
          setShowSettings(false)
        }
      />
    </>
  );
}