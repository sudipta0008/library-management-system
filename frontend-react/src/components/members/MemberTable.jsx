import {
  CreditCard,
  Pencil,
  PlayCircle,
  Trash2,
} from "lucide-react";

export default function MemberTable({
  members,
  onEditMember,
  onDeleteMember,
  onReactivateMember,
  onPayFines,
}) {
  if (members.length === 0) {
    return (
      <div className="rounded-2xl border bg-white p-10 text-center">
        <p className="text-gray-500">
          No members found.
        </p>
      </div>
    );
  }

  const getStatusClass = (status) => {
    if (status === "active") {
      return "bg-green-100 text-green-700";
    }

    return "bg-gray-100 text-gray-700";
  };

  return (
    <div className="overflow-x-auto rounded-2xl border bg-white shadow-sm">
      <table className="w-full min-w-[1200px]">

        <thead>
          <tr className="border-b bg-gray-50 text-left">

            <th className="px-5 py-4 text-sm font-semibold">
              Member
            </th>

            <th className="px-5 py-4 text-sm font-semibold">
              Email
            </th>

            <th className="px-5 py-4 text-sm font-semibold">
              Phone
            </th>

            <th className="px-5 py-4 text-sm font-semibold">
              Joined
            </th>

            <th className="px-5 py-4 text-sm font-semibold">
              Total Loans
            </th>

            <th className="px-5 py-4 text-sm font-semibold">
              Active Loans
            </th>

            <th className="px-5 py-4 text-sm font-semibold">
              Returned
            </th>

            <th className="px-5 py-4 text-sm font-semibold">
              Total Fines
            </th>

            <th className="px-5 py-4 text-sm font-semibold">
              Unpaid Fines
            </th>

            <th className="px-5 py-4 text-sm font-semibold">
              Status
            </th>

            <th className="px-5 py-4 text-right text-sm font-semibold">
              Actions
            </th>

          </tr>
        </thead>

        <tbody>
          {members.map((member) => (
            <tr
              key={member.member_id}
              className="border-b last:border-b-0 hover:bg-gray-50"
            >

              {/* Member */}
              <td className="px-5 py-4 font-medium">
                {member.name}
              </td>

              {/* Email */}
              <td className="px-5 py-4">
                {member.email}
              </td>

              {/* Phone */}
              <td className="px-5 py-4">
                {member.phone || "—"}
              </td>

              {/* Joined */}
              <td className="px-5 py-4">
                {member.joined_date
                  ? new Date(
                      member.joined_date
                    ).toLocaleDateString()
                  : "—"}
              </td>

              {/* Total Loans */}
              <td className="px-5 py-4">
                {member.total_loans ?? 0}
              </td>

              {/* Active Loans */}
              <td className="px-5 py-4">
                {member.active_loans ?? 0}
              </td>

              {/* Returned */}
              <td className="px-5 py-4">
                {member.returned_books ?? 0}
              </td>

              {/* Total Fines */}
              <td className="px-5 py-4">
                ₹
                {Number(
                  member.total_fines ?? 0
                ).toFixed(2)}
              </td>

              {/* Unpaid Fines */}
              <td className="px-5 py-4">
                <span
                  className={
                    Number(
                      member.unpaid_fines ?? 0
                    ) > 0
                      ? "font-semibold text-red-600"
                      : "text-green-600"
                  }
                >
                  ₹
                  {Number(
                    member.unpaid_fines ?? 0
                  ).toFixed(2)}
                </span>
              </td>

              {/* Status */}
              <td className="px-5 py-4">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                    member.status
                  )}`}
                >
                  {member.status}
                </span>
              </td>

              {/* Actions */}
              <td className="px-5 py-4">
                <div className="flex justify-end gap-2">

                  {/* Reactivate */}
                  {member.status === "inactive" && (
                    <button
                      onClick={() =>
                        onReactivateMember(member)
                      }
                      title="Reactivate Member"
                      className="rounded-lg p-2 hover:bg-green-100"
                    >
                      <PlayCircle
                        size={18}
                        className="text-green-600"
                      />
                    </button>
                  )}

                  {/* Pay Fines */}
                  {Number(
                    member.unpaid_fines ?? 0
                  ) > 0 && (
                    <button
                      onClick={() =>
                        onPayFines(member)
                      }
                      title="Pay Fines"
                      className="rounded-lg p-2 hover:bg-yellow-100"
                    >
                      <CreditCard
                        size={18}
                        className="text-yellow-600"
                      />
                    </button>
                  )}

                  {/* Edit */}
                  <button
                    onClick={() =>
                      onEditMember(member)
                    }
                    title="Edit Member"
                    className="rounded-lg p-2 hover:bg-blue-100"
                  >
                    <Pencil
                      size={18}
                      className="text-blue-600"
                    />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() =>
                      onDeleteMember(member)
                    }
                    title="Delete Member"
                    className="rounded-lg p-2 hover:bg-red-100"
                  >
                    <Trash2
                      size={18}
                      className="text-red-600"
                    />
                  </button>

                </div>
              </td>

            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}