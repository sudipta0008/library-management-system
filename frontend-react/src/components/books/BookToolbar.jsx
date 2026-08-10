import BookSearch from "./BookSearch";
import BookFilters from "./BookFilters";

export default function BookToolbar(props) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">

      <BookSearch
        search={props.search}
        setSearch={props.setSearch}
      />

      <BookFilters
        genres={props.genres}
        genre={props.genre}
        setGenre={props.setGenre}
        status={props.status}
        setStatus={props.setStatus}
        sort={props.sort}
        setSort={props.setSort}
      />

    </div>
  );
}