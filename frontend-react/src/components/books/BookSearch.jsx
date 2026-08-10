import { Search } from "lucide-react";

export default function BookSearch({
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
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search title, author or ISBN..."
        className="w-full rounded-xl border py-2 pl-10 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
      />

    </div>
  );
}