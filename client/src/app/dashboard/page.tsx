"use client";

import {
  CheckCircle,
  Package,
  Tag,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import CardExpenseSummary from "./CardExpenseSummary";
import CardPopularProducts from "./CardPopularProducts";
import CardPurchaseSummary from "./CardPurchaseSummary";
import CardSalesSummary from "./CardSalesSummary";
import StatCard from "./StatCard";

const Dashboard = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-6 bg-gray-50">
      {/* Popular Products - Full Width Top Row */}
      <div className="xl:col-span-3">
        <CardPopularProducts />
      </div>

      {/* Middle Row - Metrics Cards */}
      <div className="xl:col-span-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <div className="h-64"> {/* Fixed height for Sales Summary */}
          <CardSalesSummary />
        </div>
        <CardPurchaseSummary />
        <CardExpenseSummary />
      </div>

      {/* Bottom Row - Stat Cards */}
      <div className="xl:col-span-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <StatCard
          title="Customer & Expenses"
          primaryIcon={
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="text-blue-600 w-6 h-6" />
            </div>
          }
          dateRange="Oct 22 - 29, 2023"
          details={[
            {
              title: "Customer Growth",
              amount: "$175.00",
              changePercentage: 131,
              IconComponent: TrendingUp,
            },
            {
              title: "Expenses",
              amount: "$10.00",
              changePercentage: -56,
              IconComponent: TrendingDown,
            },
          ]}
        />

        <StatCard
          title="Dues & Pending Orders"
          primaryIcon={
            <div className="p-2 bg-blue-100 rounded-lg">
              <CheckCircle className="text-blue-600 w-6 h-6" />
            </div>
          }
          dateRange="Oct 22 - 29, 2023"
          details={[
            {
              title: "Dues",
              amount: "$250.00",
              changePercentage: 131,
              IconComponent: TrendingUp,
            },
            {
              title: "Pending Orders",
              amount: "147",
              changePercentage: -56,
              IconComponent: TrendingDown,
            },
          ]}
        />

        <StatCard
          title="Sales & Discount"
          primaryIcon={
            <div className="p-2 bg-blue-100 rounded-lg">
              <Tag className="text-blue-600 w-6 h-6" />
            </div>
          }
          dateRange="Oct 22 - 29, 2023"
          details={[
            {
              title: "Sales",
              amount: "$1000.00",
              changePercentage: 20,
              IconComponent: TrendingUp,
            },
            {
              title: "Discount",
              amount: "$200.00",
              changePercentage: -10,
              IconComponent: TrendingDown,
            },
          ]}
        />
      </div>
    </div>
  );
};

export default Dashboard;