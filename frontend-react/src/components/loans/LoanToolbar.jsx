import LoanSearch from "./LoanSearch";
import LoanFilters from "./LoanFilters";

export default function LoanToolbar({
  search,
  setSearch,
  status,
  setStatus,
}) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">

      <LoanSearch
        search={search}
        setSearch={setSearch}
      />

      <LoanFilters
        status={status}
        setStatus={setStatus}
      />

    </div>
  );
}