
"use client";

import { useState, useEffect } from "react";
import { AdminDashboard } from "@/components/admin-dashboard";
import { AdminLogin } from "@/components/admin-login";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    try {
      const sessionAuth = sessionStorage.getItem("isAdminAuthenticated");
      if (sessionAuth === "true") {
        setIsAuthenticated(true);
      }
    } catch (error) {
        console.error("Could not access sessionStorage:", error);
    } finally {
        setIsCheckingAuth(false);
    }
  }, []);

  const handleLoginSuccess = () => {
    try {
      sessionStorage.setItem("isAdminAuthenticated", "true");
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Could not access sessionStorage:", error);
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="w-full max-w-md mx-auto">
          <Skeleton className="h-[340px] w-full" />
      </div>
    )
  }

  return (
    <>
        {isAuthenticated ? (
          <AdminDashboard />
        ) : (
          <AdminLogin onLoginSuccess={handleLoginSuccess} />
        )}
    </>
  );
}
