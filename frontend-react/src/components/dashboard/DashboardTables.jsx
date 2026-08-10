import ActiveLoansTable from "../tables/ActiveLoansTable";
import RecentActivity from "./RecentActivity";
import TopBooks from "./TopBooks";

export default function DashboardTables({
  activeLoans,
  audit,
  popularBooks,
}) {
  return (
    <div className="mt-6">

      {/* Active Loans + Recent Activity */}

      <div className="grid gap-6 xl:grid-cols-2">

        <ActiveLoansTable
          loans={activeLoans}
        />

        <RecentActivity
          audit={audit}
        />

      </div>

      {/* Top Books */}

      <TopBooks
        books={popularBooks}
      />

    </div>
  );
}