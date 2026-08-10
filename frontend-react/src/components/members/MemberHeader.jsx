import { Plus, RefreshCw } from "lucide-react";

export default function MemberHeader({
  onRefresh,
  onAddMember,
}) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

      <div>
        <h1 className="text-4xl font-bold">
          Members
        </h1>

        <p className="mt-2 text-gray-500">
          Manage your library members.
        </p>
      </div>

      <div className="flex gap-3">

        <button
          type="button"
          onClick={onRefresh}
          className="flex items-center gap-2 rounded-xl border px-4 py-2 hover:bg-gray-100"
        >
          <RefreshCw size={18} />
          Refresh
        </button>

        <button
          onClick={onAddMember}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          <Plus size={18} />
          Add Member
        </button>

      </div>

    </div>
  );
}