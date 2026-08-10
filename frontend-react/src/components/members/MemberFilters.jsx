export default function MemberFilters({
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

      <option value="inactive">
        Inactive
      </option>

    </select>
  );
}