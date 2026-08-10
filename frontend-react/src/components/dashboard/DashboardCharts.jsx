import LoanTrendChart from "../charts/LoanTrendChart";
import GenrePieChart from "../charts/GenrePieChart";

export default function DashboardCharts({
  genres,
}) {
  return (
    <div className="grid gap-6 xl:grid-cols-2">

      <div className="min-w-0 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="h-[340px]">
          <LoanTrendChart />
        </div>
      </div>

      <div className="min-w-0 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="h-[340px]">
          <GenrePieChart data={genres} />
        </div>
      </div>

    </div>
  );
}