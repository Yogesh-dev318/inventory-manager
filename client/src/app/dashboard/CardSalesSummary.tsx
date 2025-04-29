import { useGetDashboardMetricsQuery } from "@/state/api";
import { TrendingUp, DollarSign, BarChart } from "lucide-react";
import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
} from "recharts";

const CardSalesSummary = () => {
  const { data, isLoading, isError } = useGetDashboardMetricsQuery();
  const salesData = data?.salesSummary || [];
  const [timeframe, setTimeframe] = useState("weekly");

  const totalValueSum = salesData.reduce((acc, curr) => acc + curr.totalValue, 0) || 0;
  const averageChangePercentage = salesData.reduce((acc, curr, _, array) => {
    return acc + curr.changePercentage! / array.length;
  }, 0) || 0;

  if (isError) {
    return <div className="m-5">Failed to fetch data</div>;
  }

  // Process data for chart
  const chartData = salesData.map((item) => ({
    name: new Date(item.date).toLocaleDateString("en-US", { month: "short" }),
    value: item.totalValue,
  }));

  return (
    <div className="h-full bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Sales Summary</h3>
          <p className="text-sm text-gray-500">
            {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)} Performance
          </p>
        </div>
        <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full">
          <TrendingUp className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-600">
            {averageChangePercentage.toFixed(2)}%
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className="h-44 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
              width={80}
              tickFormatter={(value) => `$${value / 1000}k`}
            />
            <Tooltip
              contentStyle={{
                background: "#fff",
                border: "none",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
            <Area
              type="monotone"
              dataKey="value"
              fill="url(#colorUv)"
              strokeWidth={0}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Total Sales</span>
            <DollarSign className="w-4 h-4 text-gray-500" />
          </div>
          <p className="text-xl font-semibold text-gray-800 mt-2">
            ${(totalValueSum / 1000000).toLocaleString("en", { maximumFractionDigits: 2 })}m
          </p>
        </div>
        
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Avg. Daily</span>
            <BarChart className="w-4 h-4 text-gray-500" />
          </div>
          <p className="text-xl font-semibold text-gray-800 mt-2">
            ${(totalValueSum / (salesData.length || 1) / 1000).toFixed(1)}k
          </p>
        </div>
      </div>

      {/* Timeframe Selector */}
      <div className="mt-4 flex justify-end">
        <select
          className="text-sm border border-gray-200 rounded-lg px-3 py-1 bg-white"
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>
    </div>
  );
};

export default CardSalesSummary;