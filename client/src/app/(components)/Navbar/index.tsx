"use client";

import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsDarkMode, setIsSidebarCollapsed } from "@/state";
import { Bell, Menu, Moon, Settings, Sun, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Navbar = () => {
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  const toggleSidebar = () => {
    dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
  };

  const toggleDarkMode = () => {
    dispatch(setIsDarkMode(!isDarkMode));
  };

  return (
    <nav className={`flex items-center justify-between w-full px-4 py-3 ${
      isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"
    } shadow-sm transition-colors duration-200`}>
      {/* Left Section */}
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={toggleSidebar}
          className={`p-2 rounded-full hover:bg-opacity-20 ${
            isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
          } transition-colors`}
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Search Bar */}
        <div className="flex-1 max-w-2xl">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="search"
              placeholder="Search groups & products..."
              className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                isDarkMode 
                  ? "bg-gray-800 border-gray-700 focus:border-blue-500" 
                  : "bg-gray-50 border-gray-200 focus:border-blue-500"
              } focus:ring-2 focus:ring-blue-500/30 transition-all`}
            />
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4 ml-4">
        {/* Dark Mode Toggle */}
        {/* <button
          onClick={toggleDarkMode}
          className={`p-2 rounded-full hover:bg-opacity-20 ${
            isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
          } transition-colors`}
          aria-label="Toggle dark mode"
        >
          {isDarkMode ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </button> */}

        {/* Notifications */}
        <button
          className={`p-2 rounded-full hover:bg-opacity-20 relative ${
            isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
          } transition-colors`}
          aria-label="View notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Settings */}
        <Link
          href="/settings"
          className={`p-2 rounded-full hover:bg-opacity-20 ${
            isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
          } transition-colors`}
          aria-label="Settings"
        >
          <Settings className="h-5 w-5" />
        </Link>

        {/* Profile */}
        <div className="flex items-center gap-3">
          <Image
            src="https://inventorymanagements13.s3.us-east-1.amazonaws.com/profile.jpeg"
            alt="Profile"
            width={40}
            height={40}
            className="rounded-full border-2 border-transparent hover:border-blue-500 transition-colors"
          />
          <span className="hidden md:inline font-medium">Yogesh Choudhary</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;