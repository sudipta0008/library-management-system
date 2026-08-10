import { AlertTriangle, CheckCircle, CreditCard, X } from "lucide-react";

export default function MemberActionDialog({
  open,
  type,
  member,
  onClose,
  onConfirm,
  loading = false,
}) {
  if (!open || !member) {
    return null;
  }

  const isPayFine = type === "pay-fines";

  const title = isPayFine
    ? "Pay Pending Fines"
    : "Reactivate Member";

  const message = isPayFine
    ? `Clear all unpaid fines for ${member.name}?`
    : `Reactivate ${member.name}?`;

  const amount = Number(
    member.unpaid_fines ?? 0
  ).toFixed(2);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-5">

          <h2 className="text-xl font-semibold">
            {title}
          </h2>

          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-lg p-2 hover:bg-gray-100"
          >
            <X size={20} />
          </button>

        </div>

        {/* Body */}
        <div className="p-6">

          <div className="mb-4 flex justify-center">

            <div
              className={`rounded-full p-4 ${
                isPayFine
                  ? "bg-yellow-100"
                  : "bg-green-100"
              }`}
            >
              {isPayFine ? (
                <CreditCard
                  size={28}
                  className="text-yellow-600"
                />
              ) : (
                <CheckCircle
                  size={28}
                  className="text-green-600"
                />
              )}
            </div>

          </div>

          <h3 className="text-center text-lg font-semibold">
            {message}
          </h3>

          {isPayFine && (
            <p className="mt-2 text-center text-sm text-gray-500">
              Current unpaid fines:{" "}
              <span className="font-semibold text-red-600">
                ₹{amount}
              </span>
            </p>
          )}

          {!isPayFine && (
            <p className="mt-2 text-center text-sm text-gray-500">
              The member's status will be changed to active.
            </p>
          )}

          {/* Buttons */}
          <div className="mt-6 flex justify-end gap-3">

            <button
              onClick={onClose}
              disabled={loading}
              className="rounded-xl border px-5 py-2.5 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              onClick={onConfirm}
              disabled={loading}
              className={`rounded-xl px-5 py-2.5 text-white disabled:opacity-50 ${
                isPayFine
                  ? "bg-yellow-600 hover:bg-yellow-700"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {loading
                ? "Processing..."
                : isPayFine
                  ? "Pay Fines"
                  : "Reactivate"}
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}