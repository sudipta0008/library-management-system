import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
];

export default function GenrePieChart({
  data = [],
}) {
  return (
    <div className="h-full">

      <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
        Genre Distribution
      </h2>

      {data.length === 0 ? (
        <div className="flex h-[260px] items-center justify-center text-sm text-gray-500 dark:text-gray-400">
          No genre data available.
        </div>
      ) : (
        <div className="h-[calc(100%-2.5rem)]">

          <ResponsiveContainer
            width="100%"
            height="100%"
          >

            <PieChart>

              <Pie
                data={data}
                dataKey="total_loans"
                nameKey="genre"
                outerRadius={95}
                innerRadius={45}
                paddingAngle={2}
              >

                {data.map(
                  (entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        COLORS[
                          index %
                            COLORS.length
                        ]
                      }
                    />
                  )
                )}

              </Pie>

              <Tooltip
                contentStyle={{
                  backgroundColor:
                    "var(--background)",
                  borderColor:
                    "var(--border)",
                  borderRadius: "12px",
                  color: "var(--foreground)",
                }}
              />

              <Legend
                wrapperStyle={{
                  fontSize: "12px",
                }}
              />

            </PieChart>

          </ResponsiveContainer>

        </div>
      )}

    </div>
  );
}