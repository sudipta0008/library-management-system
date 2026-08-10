import {
  FileBarChart,
  RefreshCw,
} from "lucide-react";

export default function ReportsHeader({
  onRefresh,
}) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

      <div>
        <div className="flex items-center gap-3">

          <div className="rounded-xl bg-blue-100 p-3">
            <FileBarChart
              size={24}
              className="text-blue-600"
            />
          </div>

          <div>
            <h1 className="text-4xl font-bold">
              Reports
            </h1>

            <p className="mt-1 text-gray-500">
              Analyze library activity, loans, fines, and members.
            </p>
          </div>

        </div>
      </div>

      <button
        type="button"
        onClick={onRefresh}
        className="flex items-center gap-2 self-start rounded-xl border px-4 py-2 hover:bg-gray-100 lg:self-auto"
      >
        <RefreshCw size={18} />
        Refresh
      </button>

    </div>
  );
}