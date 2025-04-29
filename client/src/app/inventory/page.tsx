"use client";

import { useGetProductsQuery } from "@/state/api";
import Header from "@/app/(components)/Header";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Package, CheckCircle, DollarSign } from "lucide-react";
import { useState } from "react";

const Inventory = () => {
  const { data: products, isError, isLoading } = useGetProductsQuery();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = products?.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const columns: GridColDef[] = [
    { 
      field: "productId", 
      headerName: "SKU",
      width: 120,
      renderHeader: () => <span className="font-semibold">SKU</span>
    },
    { 
      field: "name", 
      headerName: "Product Name", 
      width: 240,
      renderHeader: () => <span className="font-semibold">Product Name</span>
    },
    {
      field: "price",
      headerName: "Price",
      width: 120,
      type: "number",
      renderCell: (params) => (
        <span className="font-medium">
          ${parseFloat(params.row.price).toFixed(2)}
        </span>
      ),
      renderHeader: () => <span className="font-semibold">Price</span>
    },
    {
      field: "rating",
      headerName: "Rating",
      width: 120,
      renderCell: (params) => (
        <div className="flex items-center gap-1">
          <span className="font-medium">
            {params.row.rating || "N/A"}
          </span>
          {params.row.rating && (
            <span className="text-yellow-500">★</span>
          )}
        </div>
      ),
      renderHeader: () => <span className="font-semibold">Rating</span>
    },
    {
      field: "stockQuantity",
      headerName: "Stock",
      width: 120,
      renderCell: (params) => (
        <span className={`font-medium ${
          params.row.stockQuantity === 0 ? "text-red-500" : 
          params.row.stockQuantity < 10 ? "text-orange-500" : "text-green-600"
        }`}>
          {params.row.stockQuantity}
        </span>
      ),
      renderHeader: () => <span className="font-semibold">Stock</span>
    },
  ];

  // Calculate inventory metrics
  const inventoryMetrics = {
    totalProducts: products?.length || 0,
    inStock: products?.filter(p => p.stockQuantity > 0).length || 0,
    averagePrice: products?.length ? products.reduce((acc: number, p) => acc + Number(p.price), 0) / products.length : 0
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-pulse text-gray-500">Loading inventory...</div>
      </div>
    );
  }

  if (isError || !products) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500 text-center p-4 border border-red-100 bg-red-50 rounded-lg">
          Failed to load inventory data
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6 bg-gray-50 min-h-screen">
      <Header name="Inventory Management" />
      
      {/* Inventory Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Products</p>
              <p className="text-2xl font-bold text-gray-800">
                {inventoryMetrics.totalProducts}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">In Stock</p>
              <p className="text-2xl font-bold text-gray-800">
                {inventoryMetrics.inStock}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Avg. Price</p>
              <p className="text-2xl font-bold text-gray-800">
                ${inventoryMetrics.averagePrice.toFixed(2)}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Data Grid */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
          <div className="w-full md:w-64">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="text-sm text-gray-500">
            Showing {filteredProducts.length} of {products.length} products
          </div>
        </div>

        <DataGrid
          rows={filteredProducts}
          columns={columns}
          getRowId={(row) => row.productId}
          checkboxSelection
          autoHeight
          sx={{
            border: 'none',
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#f8fafc',
              borderRadius: '8px',
            },
            '& .MuiDataGrid-cell': {
              borderBottom: '1px solid #f1f5f9',
            },
            '& .MuiDataGrid-row:hover': {
              backgroundColor: '#f8fafc',
            },
            '& .MuiCheckbox-root': {
              color: '#94a3b8',
            },
          }}
        />
      </div>
    </div>
  );
};

export default Inventory;