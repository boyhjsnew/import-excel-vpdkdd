"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../../../components/Header";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Kiểm tra đăng nhập
    const token = localStorage.getItem("authToken");
    const username = localStorage.getItem("username");

    if (!token || !username) {
      router.push("/auth");
      return;
    }

    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="p-6">{children}</main>
    </div>
  );
}
