import {
  AlertTriangle,
  CheckCircle2,
  Bell,
  X,
} from "lucide-react";

export default function NotificationPanel({
  notifications,
  onClose,
  onMarkAllRead,
}) {
  return (
    <div className="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-900">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-700">

        <div className="flex items-center gap-2">
          <Bell
            size={18}
            className="text-blue-600"
          />

          <h3 className="font-semibold text-gray-900 dark:text-white">
            Notifications
          </h3>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <X size={17} />
        </button>

      </div>

      {/* Notifications */}
      <div className="max-h-80 overflow-y-auto">

        {notifications.length === 0 ? (
          <div className="px-5 py-10 text-center">

            <Bell
              size={28}
              className="mx-auto mb-2 text-gray-300"
            />

            <p className="text-sm text-gray-500 dark:text-gray-400">
              No notifications
            </p>

          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`flex gap-3 border-b border-gray-100 px-4 py-3 dark:border-gray-800 ${
                !notification.read
                  ? "bg-blue-50/50 dark:bg-blue-950/20"
                  : ""
              }`}
            >

              <div className="mt-0.5">

                {notification.type === "warning" ? (
                  <AlertTriangle
                    size={18}
                    className="text-orange-500"
                  />
                ) : (
                  <CheckCircle2
                    size={18}
                    className="text-green-500"
                  />
                )}

              </div>

              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {notification.title}
                </p>

                <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                  {notification.message}
                </p>
              </div>

            </div>
          ))
        )}

      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="border-t border-gray-200 p-3 dark:border-gray-700">

          <button
            type="button"
            onClick={onMarkAllRead}
            className="w-full rounded-lg py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30"
          >
            Mark all as read
          </button>

        </div>
      )}

    </div>
  );
}