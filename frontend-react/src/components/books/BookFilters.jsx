export default function BookFilters({
  genres,
  genre,
  setGenre,
  status,
  setStatus,
  sort,
  setSort,
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">

      {/* Genre */}
      <select
        value={genre}
        onChange={(e) => setGenre(e.target.value)}
        className="rounded-xl border px-3 py-2"
      >
        <option value="">All Genres</option>

        {genres.map((g) => (
          <option key={g} value={g}>
            {g}
          </option>
        ))}
      </select>

      {/* Status */}
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="rounded-xl border px-3 py-2"
      >
        <option value="">All Status</option>

        <option value="Available">Available</option>
        <option value="Low Stock">Low Stock</option>
        <option value="Out of Stock">Out of Stock</option>
      </select>

      {/* Sort */}
      <select
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        className="rounded-xl border px-3 py-2"
      >
        <option value="title">Sort by Title</option>
        <option value="author">Sort by Author</option>
        <option value="genre">Sort by Genre</option>
        <option value="available_copies">Available Copies</option>
      </select>

    </div>
  );
}