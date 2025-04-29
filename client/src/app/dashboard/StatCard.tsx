import { LucideIcon } from "lucide-react";
import React from "react";

type StatDetail = {
  title: string;
  amount: string;
  changePercentage: number;
  IconComponent: LucideIcon;
};

type StatCardProps = {
  title: string;
  primaryIcon: JSX.Element;
  details: StatDetail[];
  dateRange: string;
};

const StatCard = ({
  title,
  primaryIcon,
  details,
  dateRange,
}: StatCardProps) => {
  const formatPercentage = (value: number) => {
    const signal = value >= 0 ? "+" : "";
    return `${signal}${value.toFixed()}%`;
  };

  const getChangeColor = (value: number) =>
    value >= 0 ? "text-green-500" : "text-red-500";

  return (
    // Add these props to your StatCard component
<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all hover:shadow-md">
  <div className="flex items-center justify-between mb-4">
    <div className="flex items-center gap-3">
      {primaryIcon}
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
    </div>
    <span className="text-sm text-gray-500">{dateRange}</span>
  </div>
  
  <div className="space-y-4">
    {details.map((detail, index) => (
      <div key={index} className="flex items-center justify-between pb-2 border-b border-gray-100 last:border-0">
        <div className="space-y-1">
          <span className="text-sm text-gray-600">{detail.title}</span>
          <p className="text-lg font-semibold text-gray-800">{detail.amount}</p>
        </div>
        <div className={`flex items-center gap-2 ${detail.changePercentage > 0 ? 'text-green-600' : 'text-red-600'}`}>
          <detail.IconComponent className="w-5 h-5" />
          <span className="text-sm font-medium bg-green-50 px-2 py-1 rounded">
            {detail.changePercentage}%
          </span>
        </div>
      </div>
    ))}
  </div>
</div>
  );
};

export default StatCard;
