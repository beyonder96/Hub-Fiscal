
"use client";

import './globals.css';
import {ThemeProvider} from '@/components/theme-provider';
import {Toaster} from '@/components/ui/toaster';
import { MouseSpotlight } from '@/components/mouse-spotlight';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { useState } from 'react';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <title>Sistema Fiscal</title>
        <meta name="description" content="Gerencie seus chamados fiscais com eficiência. Nossa plataforma moderna oferece acompanhamento em tempo real e resolução ágil para suas necessidades." />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="fixed inset-0 -z-10 h-full w-full bg-background bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.2),rgba(255,255,255,0))]"></div>
            <MouseSpotlight />
             <div className="relative flex min-h-screen">
              <Sidebar isCollapsed={isSidebarCollapsed} onToggle={toggleSidebar} />
              <div className="flex-1 flex flex-col">
                <Header />
                <main className="flex-1 p-4 sm:p-6 md:p-8">
                  {children}
                </main>
              </div>
            </div>
            <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
