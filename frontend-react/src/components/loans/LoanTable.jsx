import {
  BookOpen,
  RotateCcw,
} from "lucide-react";

export default function LoanTable({
  loans,
  onReturnBook,
}) {
  if (loans.length === 0) {
    return (
      <div className="rounded-2xl border bg-white p-10 text-center shadow-sm">
        <p className="text-gray-500">
          No loans found.
        </p>
      </div>
    );
  }

  // -----------------------------
  // Check Overdue
  // -----------------------------
  const isOverdue = (loan) => {
    if (loan.return_date) {
      return false;
    }

    if (loan.status !== "active") {
      return false;
    }

    return (
      new Date(loan.due_date) < new Date()
    );
  };

  // -----------------------------
  // Status Badge
  // -----------------------------
  const getStatusClass = (loan) => {
    if (isOverdue(loan)) {
      return "bg-red-100 text-red-700";
    }

    if (loan.status === "active") {
      return "bg-blue-100 text-blue-700";
    }

    if (loan.status === "returned") {
      return "bg-green-100 text-green-700";
    }

    return "bg-gray-100 text-gray-700";
  };

  // -----------------------------
  // Display Status
  // -----------------------------
  const getDisplayStatus = (loan) => {
    if (isOverdue(loan)) {
      return "Overdue";
    }

    return loan.status;
  };

  return (
    <div className="overflow-x-auto rounded-2xl border bg-white shadow-sm">

      <table className="w-full min-w-[1100px]">

        <thead>
          <tr className="border-b bg-gray-50 text-left">

            <th className="px-5 py-4 text-sm font-semibold">
              Member
            </th>

            <th className="px-5 py-4 text-sm font-semibold">
              Book
            </th>

            <th className="px-5 py-4 text-sm font-semibold">
              Loan Date
            </th>

            <th className="px-5 py-4 text-sm font-semibold">
              Due Date
            </th>

            <th className="px-5 py-4 text-sm font-semibold">
              Return Date
            </th>

            <th className="px-5 py-4 text-sm font-semibold">
              Status
            </th>

            <th className="px-5 py-4 text-sm font-semibold">
              Fine
            </th>

            <th className="px-5 py-4 text-right text-sm font-semibold">
              Actions
            </th>

          </tr>
        </thead>

        <tbody>

          {loans.map((loan) => {

            const overdue = isOverdue(loan);

            return (
              <tr
                key={loan.loan_id}
                className="border-b last:border-b-0 hover:bg-gray-50"
              >

                {/* Member */}
                <td className="px-5 py-4">
                  <p className="font-medium">
                    {loan.member_name}
                  </p>

                  <p className="text-xs text-gray-500">
                    ID: {loan.member_id}
                  </p>
                </td>

                {/* Book */}
                <td className="px-5 py-4">

                  <div className="flex items-center gap-2">

                    <BookOpen
                      size={18}
                      className="text-blue-600"
                    />

                    <div>
                      <p className="font-medium">
                        {loan.book_title}
                      </p>

                      <p className="text-xs text-gray-500">
                        ID: {loan.book_id}
                      </p>
                    </div>

                  </div>

                </td>

                {/* Loan Date */}
                <td className="px-5 py-4">
                  {loan.loan_date
                    ? new Date(
                        loan.loan_date
                      ).toLocaleDateString()
                    : "—"}
                </td>

                {/* Due Date */}
                <td
                  className={`px-5 py-4 ${
                    overdue
                      ? "font-semibold text-red-600"
                      : ""
                  }`}
                >
                  {loan.due_date
                    ? new Date(
                        loan.due_date
                      ).toLocaleDateString()
                    : "—"}
                </td>

                {/* Return Date */}
                <td className="px-5 py-4">
                  {loan.return_date
                    ? new Date(
                        loan.return_date
                      ).toLocaleDateString()
                    : "—"}
                </td>

                {/* Status */}
                <td className="px-5 py-4">

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                      loan
                    )}`}
                  >
                    {getDisplayStatus(loan)}
                  </span>

                </td>

                {/* Fine */}
                <td className="px-5 py-4">

                  <span
                    className={
                      Number(loan.fine || 0) > 0
                        ? "font-semibold text-red-600"
                        : "text-green-600"
                    }
                  >
                    ₹
                    {Number(
                      loan.fine || 0
                    ).toFixed(2)}
                  </span>

                </td>

                {/* Actions */}
                <td className="px-5 py-4">

                  <div className="flex justify-end">

                    {loan.status === "active" && (
                      <button
                        onClick={() =>
                          onReturnBook(loan)
                        }
                        title="Return Book"
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-green-100"
                      >

                        <RotateCcw
                          size={17}
                          className="text-green-600"
                        />

                        <span className="text-green-700">
                          Return
                        </span>

                      </button>
                    )}

                  </div>

                </td>

              </tr>
            );
          })}

        </tbody>

      </table>

    </div>
  );
}