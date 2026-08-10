import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

import { Badge } from "../ui/badge";

export default function ActiveLoansTable({
  loans = [],
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">

      {/* Header */}
      <div className="mb-5 flex items-center justify-between">

        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Active Loans
        </h2>

        <Badge variant="secondary">
          {loans.length} Records
        </Badge>

      </div>

      {/* Table */}
      {loans.length === 0 ? (
        <div className="py-10 text-center text-sm text-gray-500 dark:text-gray-400">
          No active loans.
        </div>
      ) : (
        <div className="overflow-x-auto">

          <Table>

            <TableHeader>

              <TableRow className="border-gray-200 dark:border-gray-800">

                <TableHead className="text-gray-600 dark:text-gray-400">
                  Member
                </TableHead>

                <TableHead className="text-gray-600 dark:text-gray-400">
                  Book
                </TableHead>

                <TableHead className="text-gray-600 dark:text-gray-400">
                  Genre
                </TableHead>

                <TableHead className="text-gray-600 dark:text-gray-400">
                  Due Date
                </TableHead>

                <TableHead className="text-gray-600 dark:text-gray-400">
                  Status
                </TableHead>

              </TableRow>

            </TableHeader>

            <TableBody>

              {loans.map((loan) => (

                <TableRow
                  key={loan.loan_id}
                  className="border-gray-200 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50"
                >

                  <TableCell className="font-medium text-gray-900 dark:text-gray-100">
                    {loan.member_name}
                  </TableCell>

                  <TableCell className="text-gray-700 dark:text-gray-300">
                    {loan.title}
                  </TableCell>

                  <TableCell className="text-gray-700 dark:text-gray-300">
                    {loan.genre}
                  </TableCell>

                  <TableCell className="text-gray-700 dark:text-gray-300">
                    {loan.due_date
                      ? new Date(
                          loan.due_date
                        ).toLocaleDateString()
                      : "—"}
                  </TableCell>

                  <TableCell>

                    <Badge
                      variant={
                        loan.loan_status ===
                        "Overdue"
                          ? "destructive"
                          : "default"
                      }
                    >
                      {loan.loan_status}
                    </Badge>

                  </TableCell>

                </TableRow>

              ))}

            </TableBody>

          </Table>

        </div>
      )}

    </div>
  );
}