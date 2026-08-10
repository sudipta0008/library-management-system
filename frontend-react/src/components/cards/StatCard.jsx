export default function StatCard({
  title,
  value,
  subtitle,
  color,
  icon,
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-gray-800 dark:bg-gray-900">

      <div className="flex items-start justify-between">

        <div className="min-w-0">

          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {title}
          </p>

          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
            {value ?? 0}
          </p>

          <p className="mt-2 text-sm text-gray-400 dark:text-gray-500">
            {subtitle}
          </p>

        </div>

        <div
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-white shadow-sm ${color}`}
        >
          {icon}
        </div>

      </div>

    </div>
  );
}