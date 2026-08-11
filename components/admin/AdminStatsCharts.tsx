"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function AdminStatsCharts({
  data,
}: {
  data: { name: string; count: number }[];
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-surface p-5">
      <h2 className="mb-4 text-lg font-semibold text-foreground">
        Recipes by Category
      </h2>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 8, right: 8, bottom: 8, left: 8 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--color-border)"
            />
            <XAxis
              dataKey="name"
              stroke="var(--color-muted)"
              fontSize={12}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              stroke="var(--color-muted)"
              fontSize={12}
              tickLine={false}
            />
            <Tooltip cursor={{ fill: "var(--color-surface-secondary)" }} />
            <Bar
              dataKey="count"
              fill="var(--color-primary)"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}