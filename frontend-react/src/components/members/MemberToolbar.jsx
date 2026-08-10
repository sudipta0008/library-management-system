import MemberSearch from "./MemberSearch";
import MemberFilters from "./MemberFilters";

export default function MemberToolbar({
  search,
  setSearch,
  status,
  setStatus,
}) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">

      <MemberSearch
        search={search}
        setSearch={setSearch}
      />

      <MemberFilters
        status={status}
        setStatus={setStatus}
      />

    </div>
  );
}