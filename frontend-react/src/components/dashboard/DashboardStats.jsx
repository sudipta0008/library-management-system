import {
  BookOpen,
  Users,
  RefreshCcw,
  TriangleAlert,
  Library,
} from "lucide-react";

import StatCard from "../cards/StatCard";

export default function DashboardStats({ stats }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">

      <StatCard
        title="Total Books"
        value={stats.total_books}
        subtitle="Books available"
        color="bg-blue-500"
        icon={<BookOpen size={28} />}
      />

      <StatCard
        title="Members"
        value={stats.total_members}
        subtitle="Registered members"
        color="bg-green-500"
        icon={<Users size={28} />}
      />

      <StatCard
        title="Active Loans"
        value={stats.active_loans}
        subtitle="Currently issued"
        color="bg-orange-500"
        icon={<RefreshCcw size={28} />}
      />

      <StatCard
        title="Overdue"
        value={stats.overdue_loans}
        subtitle="Need attention"
        color="bg-red-500"
        icon={<TriangleAlert size={28} />}
      />

      <StatCard
        title="Available"
        value={stats.available_books}
        subtitle="Ready to borrow"
        color="bg-purple-500"
        icon={<Library size={28} />}
      />

    </div>
  );
}