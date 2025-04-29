"use client";

import { useCreateProductMutation, useGetProductsQuery } from "@/state/api";
import { PlusCircleIcon, SearchIcon, Star } from "lucide-react";
import { useState } from "react";
import Header from "@/app/(components)/Header";
import Rating from "@/app/(components)/Rating";
import CreateProductModal from "./CreateProductModal";
import Image from "next/image";
// import { Skeleton } from "@/components/ui/skeleton";

type ProductFormData = {
  name: string;
  price: number;
  stockQuantity: number;
  rating: number;
};

const Products = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: products, isLoading, isError } = useGetProductsQuery(searchTerm);
  const [createProduct] = useCreateProductMutation();

  const handleCreateProduct = async (productData: ProductFormData) => {
    await createProduct(productData);
  };

  if (isLoading) {
    return (
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-64 bg-gray-200 animate-pulse rounded-xl"></div>
        ))}
      </div>
    );
  }

  if (isError || !products) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center p-6 bg-red-50 rounded-xl max-w-md">
          <div className="text-red-600 font-medium mb-2">
            Failed to load products
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
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <Header name="Product Catalog" />
        <div className="w-full sm:w-96">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            <input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
        >
          <PlusCircleIcon className="w-5 h-5" />
          <span>New Product</span>
        </button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.productId}
            className="group relative bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 overflow-hidden"
          >
            <div className="p-4 flex flex-col items-center">
              <div className="relative w-full aspect-square mb-4 rounded-lg overflow-hidden bg-gray-50">
                <Image
                  src={`https://inventorymanagements13.s3.us-east-1.amazonaws.com/product${
                    Math.floor(Math.random() * 3) + 1
                  }.png`}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {product.name}
              </h3>
              <p className="text-xl font-bold text-blue-600 mb-2">
                ${product.price.toFixed(2)}
              </p>
              
              <div className="flex items-center gap-2 mb-3">
                <div className={`px-2.5 py-1 rounded-full text-sm font-medium ${
                  product.stockQuantity > 0 
                    ? "bg-green-100 text-green-800" 
                    : "bg-red-100 text-red-800"
                }`}>
                  {product.stockQuantity} in stock
                </div>
              </div>

              {product.rating && (
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm font-medium text-gray-700">
                    {product.rating.toFixed(1)}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <CreateProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateProduct}
      />
    </div>
  );
};

export default Products;