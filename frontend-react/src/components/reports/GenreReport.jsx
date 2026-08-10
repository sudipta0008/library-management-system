import { BarChart3 } from "lucide-react";

export default function GenreReport({
  genres = [],
}) {
  return (
    <div className="rounded-2xl border bg-white shadow-sm">

      <div className="flex items-center justify-between border-b px-6 py-5">

        <div>
          <h2 className="text-xl font-semibold">
            Genre Report
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Loan activity by genre.
          </p>
        </div>

        <BarChart3
          className="text-purple-500"
          size={22}
        />

      </div>

      {genres.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          No genre data available.
        </div>
      ) : (
        <div className="overflow-x-auto">

          <table className="w-full min-w-[800px]">

            <thead>
              <tr className="border-b bg-gray-50 text-left">

                <th className="px-6 py-4 text-sm font-semibold">
                  Genre
                </th>

                <th className="px-6 py-4 text-sm font-semibold">
                  Total Loans
                </th>

                <th className="px-6 py-4 text-sm font-semibold">
                  Members
                </th>

                <th className="px-6 py-4 text-sm font-semibold">
                  Books Out
                </th>

                <th className="px-6 py-4 text-sm font-semibold">
                  Avg. Days
                </th>

                <th className="px-6 py-4 text-sm font-semibold">
                  Total Fines
                </th>

              </tr>
            </thead>

            <tbody>

              {genres.map((genre) => (
                <tr
                  key={genre.genre}
                  className="border-b last:border-b-0 hover:bg-gray-50"
                >

                  <td className="px-6 py-4 font-medium">
                    {genre.genre}
                  </td>

                  <td className="px-6 py-4">
                    {genre.total_loans ?? 0}
                  </td>

                  <td className="px-6 py-4">
                    {genre.unique_members ?? 0}
                  </td>

                  <td className="px-6 py-4">
                    {genre.books_out ?? 0}
                  </td>

                  <td className="px-6 py-4">
                    {Number(
                      genre.average_days || 0
                    ).toFixed(2)}
                  </td>

                  <td className="px-6 py-4">
                    ₹
                    {Number(
                      genre.total_fines || 0
                    ).toFixed(2)}
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