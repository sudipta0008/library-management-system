import { RotateCcw, X } from "lucide-react";

export default function ReturnBookDialog({
  open,
  loan,
  onClose,
  onConfirm,
  loading = false,
}) {
  if (!open || !loan) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">

        <div className="flex items-center justify-between border-b px-6 py-5">

          <h2 className="text-xl font-semibold">
            Return Book
          </h2>

          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-lg p-2 hover:bg-gray-100"
          >
            <X size={20} />
          </button>

        </div>

        <div className="p-6">

          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-green-100 p-4">
              <RotateCcw
                size={28}
                className="text-green-600"
              />
            </div>
          </div>

          <h3 className="text-center text-lg font-semibold">
            Return "{loan.book_title}"?
          </h3>

          <p className="mt-2 text-center text-sm text-gray-500">
            Borrowed by{" "}
            <span className="font-medium">
              {loan.member_name}
            </span>
          </p>

          <div className="mt-6 rounded-xl bg-gray-50 p-4 text-sm">

            <div className="flex justify-between">
              <span className="text-gray-500">
                Due Date
              </span>

              <span className="font-medium">
                {loan.due_date
                  ? new Date(
                      loan.due_date
                    ).toLocaleDateString()
                  : "—"}
              </span>
            </div>

          </div>

          <div className="mt-6 flex justify-end gap-3">

            <button
              onClick={onClose}
              disabled={loading}
              className="rounded-xl border px-5 py-2.5 hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              onClick={onConfirm}
              disabled={loading}
              className="rounded-xl bg-green-600 px-5 py-2.5 text-white hover:bg-green-700 disabled:opacity-50"
            >
              {loading
                ? "Returning..."
                : "Return Book"}
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}