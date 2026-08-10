export default function DashboardHeader() {
  const today = new Date().toLocaleDateString(
    "en-IN",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
        Dashboard
      </h1>

      <p className="mt-2 text-gray-500 dark:text-gray-400">
        Welcome back! Here's what's happening today.
      </p>

      <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">
        {today}
      </p>
    </div>
  );
}