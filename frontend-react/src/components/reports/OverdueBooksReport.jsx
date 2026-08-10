import {
  AlertTriangle,
  Clock,
} from "lucide-react";

export default function OverdueBooksReport({
  books = [],
}) {
  return (
    <div className="rounded-2xl border bg-white shadow-sm">

      <div className="flex items-center justify-between border-b px-6 py-5">

        <div>
          <h2 className="text-xl font-semibold">
            Overdue Books
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Books that have passed their due date.
          </p>
        </div>

        <AlertTriangle
          className="text-red-500"
          size={22}
        />

      </div>

      {books.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          No overdue books.
        </div>
      ) : (
        <div className="divide-y">

          {books.map((loan) => (
            <div
              key={loan.loan_id}
              className="px-6 py-4 hover:bg-gray-50"
            >

              <div className="flex items-start justify-between gap-4">

                <div className="flex items-start gap-3">

                  <div className="rounded-lg bg-red-100 p-2">
                    <Clock
                      size={18}
                      className="text-red-600"
                    />
                  </div>

                  <div>
                    <p className="font-medium">
                      {loan.book_title}
                    </p>

                    <p className="text-sm text-gray-500">
                      Borrowed by {loan.member_name}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      Due:{" "}
                      {loan.due_date
                        ? new Date(
                            loan.due_date
                          ).toLocaleDateString()
                        : "—"}
                    </p>
                  </div>

                </div>

                <div className="text-right">

                  <p className="font-semibold text-red-600">
                    {loan.days_overdue} days
                  </p>

                  <p className="text-sm text-gray-500">
                    ₹
                    {Number(
                      loan.estimated_fine || 0
                    ).toFixed(2)}
                  </p>

                </div>

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}