import {
  BookOpen,
  UserCheck,
  CircleDollarSign,
} from "lucide-react";

function getIcon(type = "") {
  if (type.includes("BOOK")) {
    return <BookOpen size={18} />;
  }

  if (type.includes("MEMBER")) {
    return <UserCheck size={18} />;
  }

  return <CircleDollarSign size={18} />;
}

export default function RecentActivity({
  audit = [],
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">

      <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
        Recent Activity
      </h2>

      {audit.length === 0 ? (
        <p className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
          No recent activity.
        </p>
      ) : (
        <div className="space-y-5">

          {audit.map((item) => (

            <div
              key={item.log_id}
              className="flex items-start gap-4"
            >

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                {getIcon(item.event_type)}
              </div>

              <div className="min-w-0 flex-1">

                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  {item.event_type
                    ?.replaceAll("_", " ")}
                </h3>

                <p className="mt-1 text-sm leading-5 text-gray-500 dark:text-gray-400">
                  {item.description}
                </p>

              </div>

            </div>

          ))}

        </div>
      )}

    </div>
  );
}