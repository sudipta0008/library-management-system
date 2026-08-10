import useReports from "../hooks/useReports";

import ReportsHeader from "../components/reports/ReportsHeader";
import PopularBooksReport from "../components/reports/PopularBooksReport";
import OverdueBooksReport from "../components/reports/OverdueBooksReport";
import FineSummaryReport from "../components/reports/FineSummaryReport";
import GenreReport from "../components/reports/GenreReport";
import AuditReport from "../components/reports/AuditReport";

export default function Reports() {
  const {
    popularBooks,
    overdueBooks,
    fineSummary,
    genreReport,
    auditLogs,

    loading,
    error,

    refreshReports,
  } = useReports();

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-xl font-semibold">
          Loading Reports...
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
      <ReportsHeader
        onRefresh={refreshReports}
      />

      {/* Top Reports */}
      <div className="grid gap-6 lg:grid-cols-2">

        <PopularBooksReport
          books={popularBooks}
        />

        <OverdueBooksReport
          books={overdueBooks}
        />

      </div>

      {/* Fine Summary */}
      <FineSummaryReport
        fines={fineSummary}
      />

      {/* Genre Report */}
      <GenreReport
        genres={genreReport}
      />

      {/* Audit */}
      <AuditReport
        logs={auditLogs}
      />

    </div>
  );
}