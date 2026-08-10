import {
  AreaChart,
  Area,
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const sampleData = [
  { month: "Jan", loans: 12 },
  { month: "Feb", loans: 18 },
  { month: "Mar", loans: 25 },
  { month: "Apr", loans: 19 },
  { month: "May", loans: 31 },
  { month: "Jun", loans: 22 },
  { month: "Jul", loans: 28 },
  { month: "Aug", loans: 35 },
];

export default function LoanTrendChart() {
  return (
    <div className="h-full">

      <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
        Loan Activity
      </h2>

      <div className="h-[calc(100%-2.5rem)]">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <AreaChart data={sampleData}>

            <defs>

              <linearGradient
                id="loanColor"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >

                <stop
                  offset="5%"
                  stopColor="#2563eb"
                  stopOpacity={0.8}
                />

                <stop
                  offset="95%"
                  stopColor="#2563eb"
                  stopOpacity={0}
                />

              </linearGradient>

            </defs>

            <CartesianGrid
              strokeDasharray="4 4"
              stroke="currentColor"
              className="text-gray-200 dark:text-gray-800"
            />

            <XAxis
              dataKey="month"
              stroke="currentColor"
              className="text-gray-500 dark:text-gray-400"
              tick={{ fontSize: 12 }}
            />

            <YAxis
              stroke="currentColor"
              className="text-gray-500 dark:text-gray-400"
              tick={{ fontSize: 12 }}
            />

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

            <Area
              type="monotone"
              dataKey="loans"
              stroke="#2563eb"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#loanColor)"
            />

          </AreaChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}