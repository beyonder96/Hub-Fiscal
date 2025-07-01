
"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
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
        <>
            <Header />
            <main className="flex-1 container mx-auto flex items-center justify-center py-24">
              <div className="w-full max-w-md">
                <Skeleton className="h-[340px] w-full" />
              </div>
            </main>
        </>
    )
  }

  return (
    <>
      <Header />
      <main className="flex-1">
        {isAuthenticated ? (
          <AdminDashboard />
        ) : (
          <AdminLogin onLoginSuccess={handleLoginSuccess} />
        )}
      </main>
    </>
  );
}
