import { Search } from "lucide-react";

export default function LoanSearch({
  search,
  setSearch,
}) {
  return (
    <div className="relative flex-1">

      <Search
        size={18}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
      />

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search member or book..."
        className="w-full rounded-xl border py-2 pl-10 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
      />

    </div>
  );
}