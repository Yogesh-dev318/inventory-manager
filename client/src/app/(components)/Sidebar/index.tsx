"use client";

import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsSidebarCollapsed } from "@/state";
import {
  Archive,
  CircleDollarSign,
  Clipboard,
  Layout,
  LucideIcon,
  Menu,
  SlidersHorizontal,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface SidebarLinkProps {
  href: string;
  icon: LucideIcon;
  label: string;
  isCollapsed: boolean;
}

const SidebarLink = ({
  href,
  icon: Icon,
  label,
  isCollapsed,
}: SidebarLinkProps) => {
  const pathname = usePathname();
  const isActive =
    pathname === href || (pathname === "/" && href === "/dashboard");

  return (
    <Link href={href}>
      <div
        className={`group flex items-center gap-3 px-6 py-3.5 transition-all duration-200
          ${
            isCollapsed 
              ? "justify-center mx-2 rounded-lg" 
              : "justify-start"
          }
          ${
            isActive
              ? "bg-blue-100/20 text-white border-l-4 border-blue-400"
              : "text-gray-300 hover:bg-blue-100/10 hover:text-white"
          }
        `}
      >
        <Icon
          className={`h-5 w-5 transition-colors ${
            isActive ? "text-blue-400" : "group-hover:text-blue-300"
          }`}
        />
        <span
          className={`text-sm font-medium transition-all ${
            isCollapsed ? "hidden" : "block"
          }`}
        >
          {label}
        </span>
      </div>
    </Link>
  );
};

const Sidebar = () => {
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );

  const toggleSidebar = () => {
    dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
  };

  const sidebarClassNames = `fixed flex flex-col h-full bg-blue-950 shadow-xl z-40
    ${isSidebarCollapsed ? "w-16" : "w-64"} 
    transition-all duration-300 overflow-hidden`;

  return (
    <div className={sidebarClassNames}>
      {/* TOP LOGO */}
      <div className="flex items-center justify-between p-4 bg-blue-900/30">
        <div
          className={`flex items-center gap-3 overflow-hidden transition-all ${
            isSidebarCollapsed ? "w-0 opacity-0" : "w-full opacity-100"
          }`}
        >
          <div className="flex items-center gap-2 min-w-max pl-2">
            <Image
              src="https://inventorymanagements13.s3.us-east-1.amazonaws.com/logo.png"
              alt="edstock-logo"
              width={28}
              height={28}
              className="rounded-lg filter invert"
            />
            <h1 className="text-xl font-bold text-white">Inventory</h1>
          </div>
        </div>
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-lg hover:bg-blue-800 transition-colors"
        >
          <Menu className="h-5 w-5 text-white" />
        </button>
      </div>

      {/* LINKS */}
      <div className="flex-grow pt-4 space-y-1">
        <SidebarLink
          href="/dashboard"
          icon={Layout}
          label="Dashboard"
          isCollapsed={isSidebarCollapsed}
        />
        <SidebarLink
          href="/inventory"
          icon={Archive}
          label="Inventory"
          isCollapsed={isSidebarCollapsed}
        />
        <SidebarLink
          href="/products"
          icon={Clipboard}
          label="Products"
          isCollapsed={isSidebarCollapsed}
        />
        <SidebarLink
          href="/users"
          icon={User}
          label="Users"
          isCollapsed={isSidebarCollapsed}
        />
        <SidebarLink
          href="/settings"
          icon={SlidersHorizontal}
          label="Settings"
          isCollapsed={isSidebarCollapsed}
        />
        <SidebarLink
          href="/expenses"
          icon={CircleDollarSign}
          label="Expenses"
          isCollapsed={isSidebarCollapsed}
        />
      </div>

      {/* FOOTER */}
      <div className={`p-4 ${isSidebarCollapsed ? "hidden" : "block"}`}>
        <p className="text-xs text-center text-gray-400">
          &copy; {new Date().getFullYear()} Inventory
        </p>
      </div>
    </div>
  );
};

export default Sidebar;