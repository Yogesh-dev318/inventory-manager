import { useGetDashboardMetricsQuery } from "@/state/api";
import { ShoppingBag } from "lucide-react";
import React from "react";
import Rating from "../(components)/Rating";
import Image from "next/image";

const CardPopularProducts = () => {
  const { data: dashboardMetrics, isLoading } = useGetDashboardMetricsQuery();

  return (
    <div className="row-span-3 xl:row-span-6 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center bg-gray-50/50">
          <div className="animate-pulse text-gray-400">Loading products...</div>
        </div>
      ) : (
        <>
          <div className="px-6 pt-6 pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800 relative">
                Popular Products
                <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-blue-500"></span>
              </h3>
              <ShoppingBag className="w-5 h-5 text-gray-400" />
            </div>
          </div>

          <div className="flex-1 overflow-auto scroll-smooth px-4">
            <div className="grid gap-3 pb-4">
              {dashboardMetrics?.popularProducts.map((product) => (
                <div
                  key={product.productId}
                  className="group relative p-4 bg-white rounded-xl border border-gray-100 hover:border-blue-100 transition-all duration-200 hover:shadow-md"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 border-white shadow-sm">
                      <Image
                        src={`https://inventorymanagements13.s3.us-east-1.amazonaws.com/product${
                          Math.floor(Math.random() * 3) + 1
                        }.png`}
                        alt={product.name}
                        width={64}
                        height={64}
                        className="object-cover w-full h-full transform transition-transform group-hover:scale-110"
                      />
                      <div className="absolute bottom-0 right-0 bg-white px-2 py-1 rounded-tl-lg text-xs font-bold text-blue-500 shadow-xs">
                        {Math.round(product.stockQuantity / 1000)}k
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-gray-800 truncate mb-1">
                        {product.name}
                      </h4>
                      <div className="flex items-center gap-2 mb-2">
                        <Rating rating={product.rating || 0} />
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs font-semibold text-blue-500">
                          ${product.price}
                        </span>
                      </div>
                      <button className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-blue-600 transition-colors">
                        <ShoppingBag className="w-4 h-4" />
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  </div>
                  
                  <div className="absolute top-4 right-4 w-2 h-2 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
              ))}
            </div>
          </div>

          <div className="sticky bottom-0 h-6 bg-gradient-to-t from-white/90 to-transparent pointer-events-none border-t border-gray-100"></div>
        </>
      )}
    </div>
  );
};

export default CardPopularProducts;