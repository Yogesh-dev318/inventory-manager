"use client";

import { useGetUsersQuery } from "@/state/api";
import Header from "@/app/(components)/Header";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { User as UserIcon, Shield, SearchIcon } from "lucide-react";
import { useState } from "react";

interface User {
  userId: string;
  name: string;
  email: string;
  status: 'active' | 'inactive';
  role: 'admin' | 'user';
}

const Users = () => {
  const { data: users, isError, isLoading } = useGetUsersQuery();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = users?.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Calculate user metrics
  const userMetrics = {
    totalUsers: users?.length || 0,
    activeUsers: (users as User[])?.filter(u => u.status === 'active').length || 0,
    adminUsers: (users as User[])?.filter(u => u.role === 'admin').length || 0
  };

  const columns: GridColDef[] = [
    { 
      field: "userId", 
      headerName: "USER ID",
      width: 150,
      renderHeader: () => (
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4" />
          <span className="font-semibold">ID</span>
        </div>
      ),
      renderCell: (params) => (
        <span className="text-blue-600 font-mono">USER-{params.value.slice(0, 6)}</span>
      )
    },
    { 
      field: "name", 
      headerName: "NAME",
      width: 200,
      renderHeader: () => (
        <div className="font-semibold">Full Name</div>
      ),
      renderCell: (params) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <UserIcon className="w-4 h-4 text-blue-600" />
          </div>
          {params.value}
        </div>
      )
    },
    { 
      field: "email", 
      headerName: "EMAIL",
      width: 250,
      renderHeader: () => (
        <div className="font-semibold">Email Address</div>
      ),
      renderCell: (params) => (
        <a 
          href={`mailto:${params.value}`}
          className="text-blue-600 hover:underline"
        >
          {params.value}
        </a>
      )
    },
    {
      field: "status",
      headerName: "STATUS",
      width: 130,
      renderCell: (params) => (
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
          params.value === 'active' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {params.value}
        </span>
      )
    }
  ];

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

  if (isError || !users) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center p-6 bg-red-50 rounded-xl max-w-md">
          <div className="text-red-600 font-medium mb-2">
            Failed to load users data
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
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <Header name="User Management" />
        <div className="w-full md:w-96">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            <input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* User Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Users</p>
              <p className="text-2xl font-bold text-gray-800">
                {userMetrics.totalUsers}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <UserIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Users</p>
              <p className="text-2xl font-bold text-gray-800">
                {userMetrics.activeUsers}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <UserIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Admin Users</p>
              <p className="text-2xl font-bold text-gray-800">
                {userMetrics.adminUsers}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <DataGrid
          rows={filteredUsers}
          columns={columns}
          getRowId={(row) => row.userId}
          checkboxSelection
          autoHeight
          sx={{
            border: 'none',
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#f8fafc',
              borderRadius: '0',
              borderBottom: '1px solid #f1f5f9'
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
            '& .MuiDataGrid-columnHeaderTitle': {
              fontWeight: 600,
              color: '#1e293b'
            },
          }}
        />
      </div>
    </div>
  );
};

export default Users;