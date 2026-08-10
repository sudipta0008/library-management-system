import {
  Activity,
  Clock,
} from "lucide-react";

export default function AuditReport({
  logs = [],
}) {
  return (
    <div className="rounded-2xl border bg-white shadow-sm">

      <div className="flex items-center justify-between border-b px-6 py-5">

        <div>
          <h2 className="text-xl font-semibold">
            Audit Log
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Recent library system activity.
          </p>
        </div>

        <Activity
          className="text-blue-500"
          size={22}
        />

      </div>

      {logs.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          No audit records available.
        </div>
      ) : (
        <div className="divide-y">

          {logs.map((log) => (
            <div
              key={log.log_id}
              className="flex gap-4 px-6 py-4 hover:bg-gray-50"
            >

              <div className="mt-1 rounded-full bg-blue-100 p-2">
                <Clock
                  size={16}
                  className="text-blue-600"
                />
              </div>

              <div className="flex-1">

                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">

                  <p className="font-medium">
                    {log.event_type}
                  </p>

                  <p className="text-xs text-gray-400">
                    {log.created_at
                      ? new Date(
                          log.created_at
                        ).toLocaleString()
                      : "—"}
                  </p>

                </div>

                <p className="mt-1 text-sm text-gray-600">
                  {log.description}
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  Member ID:{" "}
                  {log.member_id ?? "—"}
                  {" • "}
                  Book ID:{" "}
                  {log.book_id ?? "—"}
                </p>

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}