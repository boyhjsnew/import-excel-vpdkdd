"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function PagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Nếu đang ở trang chủ thì chuyển hướng đến auth
    if (pathname === "/") {
      router.push("/auth");
    }
  }, [pathname, router]);

  return <>{children}</>;
}
