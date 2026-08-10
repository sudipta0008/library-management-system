import {
  Activity,
  BookOpen,
  Clock,
  User,
} from "lucide-react";

export default function AuditTable({
  logs = [],
}) {
  if (logs.length === 0) {
    return (
      <div className="rounded-2xl border bg-white p-10 text-center shadow-sm">
        <p className="text-gray-500">
          No audit logs found.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border bg-white shadow-sm">

      <table className="w-full min-w-[1000px]">

        <thead>
          <tr className="border-b bg-gray-50 text-left">

            <th className="px-5 py-4 text-sm font-semibold">
              Event
            </th>

            <th className="px-5 py-4 text-sm font-semibold">
              Description
            </th>

            <th className="px-5 py-4 text-sm font-semibold">
              Member
            </th>

            <th className="px-5 py-4 text-sm font-semibold">
              Book
            </th>

            <th className="px-5 py-4 text-sm font-semibold">
              Date & Time
            </th>

          </tr>
        </thead>

        <tbody>

          {logs.map((log) => (
            <tr
              key={log.log_id}
              className="border-b last:border-b-0 hover:bg-gray-50"
            >

              {/* Event */}
              <td className="px-5 py-4">

                <div className="flex items-center gap-3">

                  <div className="rounded-lg bg-blue-100 p-2">
                    <Activity
                      size={18}
                      className="text-blue-600"
                    />
                  </div>

                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                    {log.event_type}
                  </span>

                </div>

              </td>

              {/* Description */}
              <td className="max-w-md px-5 py-4">
                <p className="text-sm text-gray-700">
                  {log.description}
                </p>
              </td>

              {/* Member */}
              <td className="px-5 py-4">

                <div className="flex items-center gap-2">

                  <User
                    size={16}
                    className="text-gray-400"
                  />

                  <span>
                    {log.member_id ?? "—"}
                  </span>

                </div>

              </td>

              {/* Book */}
              <td className="px-5 py-4">

                <div className="flex items-center gap-2">

                  <BookOpen
                    size={16}
                    className="text-gray-400"
                  />

                  <span>
                    {log.book_id ?? "—"}
                  </span>

                </div>

              </td>

              {/* Date */}
              <td className="px-5 py-4">

                <div className="flex items-center gap-2 text-sm text-gray-600">

                  <Clock
                    size={16}
                    className="text-gray-400"
                  />

                  {log.created_at
                    ? new Date(
                        log.created_at
                      ).toLocaleString()
                    : "—"}

                </div>

              </td>

            </tr>
          ))}

        </tbody>

      </table>

    </div>
  );
}