import {
  RefreshCw,
  ScrollText,
} from "lucide-react";

import useAudit from "../hooks/useAudit";
import AuditTable from "../components/audit/AuditTable";

export default function Audit() {
  const {
    auditLogs,
    loading,
    error,
    refreshAudit,
  } = useAudit();

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-xl font-semibold">
          Loading Audit Logs...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div className="flex items-center gap-3">

          <div className="rounded-xl bg-blue-100 p-3">
            <ScrollText
              size={24}
              className="text-blue-600"
            />
          </div>

          <div>
            <h1 className="text-4xl font-bold">
              Audit Logs
            </h1>

            <p className="mt-1 text-gray-500">
              Track recent activity in the library system.
            </p>
          </div>

        </div>

        <button
          type="button"
          onClick={refreshAudit}
          className="flex items-center gap-2 self-start rounded-xl border px-4 py-2 hover:bg-gray-100 lg:self-auto"
        >
          <RefreshCw size={18} />
          Refresh
        </button>

      </div>

      {/* Table */}
      <AuditTable logs={auditLogs} />

    </div>
  );
}