"use client";

import {
  ExpenseByCategorySummary,
  useGetExpensesByCategoryQuery,
} from "@/state/api";
import { useMemo, useState } from "react";
import Header from "@/app/(components)/Header";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { DollarSign, PieChartIcon, Calendar, Filter } from "lucide-react";

type AggregatedDataItem = {
  name: string;
  amount: number;
};

const CHART_COLORS = [
  "#3B82F6", // Blue
  "#10B981", // Green
  "#F59E0B", // Orange
];

const Expenses = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { data: expensesData, isLoading, isError } = useGetExpensesByCategoryQuery();
  const expenses = useMemo(() => expensesData ?? [], [expensesData]);

  const parseDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  const aggregatedData: AggregatedDataItem[] = useMemo(() => {
    const filtered = expenses
      .filter((data: ExpenseByCategorySummary) => {
        const matchesCategory = selectedCategory === "All" || data.category === selectedCategory;
        const dataDate = parseDate(data.date);
        const matchesDate = (!startDate && !endDate) || (dataDate >= startDate && dataDate <= endDate);
        return matchesCategory && matchesDate;
      })
      .reduce((acc: Record<string, AggregatedDataItem>, data: ExpenseByCategorySummary, index: number) => {
        const amount = parseInt(data.amount);
        if (!acc[data.category]) {
          acc[data.category] = {
            name: data.category,
            amount: 0,
          };
        }
        acc[data.category].amount += amount;
        return acc;
      }, {});

    return Object.values(filtered);
  }, [expenses, selectedCategory, startDate, endDate]);

  const totalExpenses = useMemo(() => 
    aggregatedData.reduce((acc, item) => acc + item.amount, 0), 
    [aggregatedData]
  );

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <div className="h-10 w-1/3 bg-gray-200 animate-pulse rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 animate-pulse rounded-xl"></div>
          ))}
        </div>
        <div className="h-96 bg-gray-200 animate-pulse rounded-xl"></div>
      </div>
    );
  }

  if (isError || !expensesData) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center p-6 bg-red-50 rounded-xl max-w-md">
          <div className="text-red-600 font-medium mb-2">
            Failed to load expenses data
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="text-blue-600 hover:underline"
          >
            Try again →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header Section */}
      <div className="mb-8">
        <Header name="Expense Analytics" />
        <p className="text-gray-600 mt-2">Visual breakdown of organizational spending</p>
      </div>

      {/* Stats and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Expenses</p>
              <p className="text-2xl font-bold text-gray-800">
                ${(totalExpenses / 1000).toLocaleString()}k
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Date Range</p>
              <div className="flex gap-2 mt-1">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="text-sm border border-gray-200 rounded-lg px-2 py-1"
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="text-sm border border-gray-200 rounded-lg px-2 py-1"
                />
              </div>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Filter by Category</p>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="mt-1 text-sm border border-gray-200 rounded-lg px-2 py-1.5 w-full"
              >
                <option value="All">All Categories</option>
                {Array.from(new Set(expenses.map(e => e.category))).map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Filter className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-6">
          <PieChartIcon className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-semibold">Expense Distribution</h3>
        </div>

        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={aggregatedData}
                cx="50%"
                cy="50%"
                outerRadius={150}
                innerRadius={80}
                paddingAngle={2}
                dataKey="amount"
                onMouseEnter={(_, index) => setActiveIndex(index)}
                activeIndex={activeIndex}
              >
                {aggregatedData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={CHART_COLORS[index % CHART_COLORS.length]}
                    strokeWidth={index === activeIndex ? 3 : 1}
                    opacity={index === activeIndex ? 1 : 0.9}
                  />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  background: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value: number) => [
                  `$${value.toLocaleString()}`,
                  'Amount'
                ]}
              />
              <Legend 
                layout="vertical"
                align="right"
                verticalAlign="middle"
                formatter={(value, entry: any) => (
                  <span className="text-sm text-gray-600">
                    {entry.payload?.name}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Color Legend */}
        <div className="mt-6 flex flex-wrap gap-4 justify-center">
          {CHART_COLORS.map((color, index) => (
            <div key={color} className="flex items-center gap-2">
              <div 
                className="w-4 h-4 rounded-full" 
                style={{ backgroundColor: color }}
              />
              <span className="text-sm text-gray-600">
                Color Group {index + 1}
              </span>
            </div>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Categories</span>
              <span className="font-medium">{aggregatedData.length}</span>
            </div>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Largest Category</span>
              <span className="font-medium">
                {aggregatedData.reduce((max, item) => 
                  item.amount > max.amount ? item : max, 
                  { amount: 0, name: 'N/A' }
                ).name}
              </span>
            </div>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Avg. Daily</span>
              <span className="font-medium">
                ${(totalExpenses / 30).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Expenses;