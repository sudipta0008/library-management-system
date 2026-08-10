import { CreditCard } from "lucide-react";

export default function FineSummaryReport({
  fines = [],
}) {
  return (
    <div className="rounded-2xl border bg-white shadow-sm">

      <div className="flex items-center justify-between border-b px-6 py-5">

        <div>
          <h2 className="text-xl font-semibold">
            Fine Summary
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Fine activity by member.
          </p>
        </div>

        <CreditCard
          className="text-yellow-500"
          size={22}
        />

      </div>

      {fines.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          No fine data available.
        </div>
      ) : (
        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>
              <tr className="border-b bg-gray-50 text-left">

                <th className="px-6 py-4 text-sm font-semibold">
                  Member
                </th>

                <th className="px-6 py-4 text-sm font-semibold">
                  Total Fines
                </th>

                <th className="px-6 py-4 text-sm font-semibold">
                  Total Amount
                </th>

                <th className="px-6 py-4 text-sm font-semibold">
                  Unpaid Amount
                </th>

              </tr>
            </thead>

            <tbody>

              {fines.map((fine) => (
                <tr
                  key={fine.member_id}
                  className="border-b last:border-b-0 hover:bg-gray-50"
                >

                  <td className="px-6 py-4">
                    <p className="font-medium">
                      {fine.name}
                    </p>

                    <p className="text-xs text-gray-500">
                      ID: {fine.member_id}
                    </p>
                  </td>

                  <td className="px-6 py-4">
                    {fine.total_fines ?? 0}
                  </td>

                  <td className="px-6 py-4">
                    ₹
                    {Number(
                      fine.total_amount || 0
                    ).toFixed(2)}
                  </td>

                  <td className="px-6 py-4">

                    <span
                      className={
                        Number(
                          fine.unpaid_amount || 0
                        ) > 0
                          ? "font-semibold text-red-600"
                          : "text-green-600"
                      }
                    >
                      ₹
                      {Number(
                        fine.unpaid_amount || 0
                      ).toFixed(2)}
                    </span>

                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>
      )}

    </div>
  );
}