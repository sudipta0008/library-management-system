export default function LoanFilters({
  status,
  setStatus,
}) {
  return (
    <select
      value={status}
      onChange={(e) => setStatus(e.target.value)}
      className="rounded-xl border px-3 py-2"
    >
      <option value="">
        All Status
      </option>

      <option value="active">
        Active
      </option>

      <option value="returned">
        Returned
      </option>

      <option value="overdue">
        Overdue
      </option>
    </select>
  );
}