import useDashboard from "../hooks/useDashboard";

import DashboardStats from "../components/dashboard/DashboardStats";
import DashboardCharts from "../components/dashboard/DashboardCharts";
import DashboardTables from "../components/dashboard/DashboardTables";
import DashboardHeader from "../components/dashboard/DashboardHeader";

export default function Dashboard() {
  const {
    stats,
    genres,
    activeLoans,
    audit,
    popularBooks,
    loading,
    error,
  } = useDashboard();

  // -----------------------------
  // Loading
  // -----------------------------

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Loading Dashboard...
        </p>
      </div>
    );
  }

  // -----------------------------
  // Error
  // -----------------------------

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
        {error}
      </div>
    );
  }

  // -----------------------------
  // Empty
  // -----------------------------

  if (!stats) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white px-4 py-10 text-center text-sm text-gray-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
        No dashboard data found.
      </div>
    );
  }

  return (
    <div className="space-y-6">

      <DashboardHeader />

      <DashboardStats
        stats={stats}
      />

      <DashboardCharts
        genres={genres}
      />

      <DashboardTables
        activeLoans={activeLoans}
        audit={audit}
        popularBooks={popularBooks}
      />

    </div>
  );
}