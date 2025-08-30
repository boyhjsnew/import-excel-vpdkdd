"use client";

import React from "react";
import { Button } from "primereact/button";
import { useRouter, usePathname } from "next/navigation";

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("username");
    localStorage.removeItem("password");
    localStorage.removeItem("ma_dvcs");
    router.push("/auth");
  };

  const getPageTitle = () => {
    switch (pathname) {
      case "/home":
        return "Thêm biên lai";
      default:
        return "Thêm biên lai";
    }
  };

  return (
    <div className="bg-white shadow-sm border-b border-gray-200">
      <div className="h-1"></div>

      {/* Main header */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Logo */}
          <div className="flex items-center">
            <div className="flex items-center mr-8">
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-blue-500 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <div>
                <span className="text-red-500 font-bold text-lg">
                  M-invoice
                </span>
                <div className="text-xs text-blue-600 -mt-1">
                  GIẢI PHÁP HÓA ĐƠN ĐIỆN TỬ
                </div>
              </div>
            </div>
          </div>

          {/* Center - Toolbar */}
          <div className="flex-1 flex justify-center">
            <div className="bg-gray-100 border border-purple-200 rounded-lg px-3 py-2 flex items-center">
              <i className="pi pi-users text-blue-600 mr-2 text-sm"></i>
              <span className="text-blue-600 text-sm font-medium">
                Thêm biên lai hàng loạt
              </span>
            </div>
          </div>

          {/* Right side - User info */}
          <div className="flex items-center space-x-4">
            {/* User profile */}
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <div className="text-sm font-bold text-blue-600">
                  VĂN PHÒNG ĐĂNG KÝ ĐẤT ĐAI THÀNH PHỐ
                </div>
                <div className="text-xs font-bold text-gray-500">
                  MST: 0313364566
                </div>
              </div>
            </div>

            {/* Logout button */}
            <Button
              icon="pi pi-sign-out"
              onClick={handleLogout}
              className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors duration-200"
              tooltip="Đăng xuất"
              tooltipOptions={{ position: "bottom" }}
            />
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="px-6 py-2 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center space-x-2 text-sm">
          <i className="pi pi-home text-blue-600"></i>
          <span className="text-gray-400">/</span>
          <span className="text-blue-600 font-medium">{getPageTitle()}</span>
        </div>
      </div>
    </div>
  );
};

export default Header;
