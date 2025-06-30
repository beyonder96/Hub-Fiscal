
"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { AdminDashboard } from "@/components/admin-dashboard";
import { AdminLogin } from "@/components/admin-login";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

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
