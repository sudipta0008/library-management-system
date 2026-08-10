import { X } from "lucide-react";
import MemberForm from "./MemberForm";

export default function MemberDialog({
  open,
  onClose,
  onSubmit,
  loading,
  mode = "add",
  member = null,
}) {
  if (!open) {
    return null;
  }

  const isEdit = mode === "edit";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">

        <div className="flex items-center justify-between border-b px-6 py-5">

          <div>
            <h2 className="text-xl font-semibold">
              {isEdit
                ? "Edit Member"
                : "Add Member"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {isEdit
                ? "Update member information."
                : "Add a new member to your library."}
            </p>
          </div>

          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-lg p-2 hover:bg-gray-100"
          >
            <X size={20} />
          </button>

        </div>

        <div className="max-h-[80vh] overflow-y-auto p-6">

          <MemberForm
            mode={mode}
            member={member}
            onSubmit={onSubmit}
            onCancel={onClose}
            loading={loading}
          />

        </div>

      </div>

    </div>
  );
}