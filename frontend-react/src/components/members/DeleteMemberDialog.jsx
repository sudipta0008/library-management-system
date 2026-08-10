import { Trash2, X } from "lucide-react";

export default function DeleteMemberDialog({
  open,
  member,
  onClose,
  onConfirm,
  loading = false,
}) {
  if (!open || !member) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">

        <div className="flex items-center justify-between border-b px-6 py-5">

          <h2 className="text-xl font-semibold">
            Delete Member
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
            <div className="rounded-full bg-red-100 p-4">
              <Trash2
                size={28}
                className="text-red-600"
              />
            </div>
          </div>

          <h3 className="text-center text-lg font-semibold">
            Delete "{member.name}"?
          </h3>

          <p className="mt-2 text-center text-sm text-gray-500">
            This member will be permanently removed
            if they have no active loans.
          </p>

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
              className="rounded-xl bg-red-600 px-5 py-2.5 text-white hover:bg-red-700 disabled:opacity-50"
            >
              {loading
                ? "Deleting..."
                : "Delete Member"}
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}