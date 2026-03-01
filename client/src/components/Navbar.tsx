import React from 'react';
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Sun, Plus, LayoutDashboard, BarChart2 } from "lucide-react";
import { opsCopy } from "@/config/opsCopy";

export function Navbar() {
  const [location] = useLocation();

  return (
    <nav className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/70 border-b border-white/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group cursor-pointer">
          <div className="h-10 w-10 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform">
            <Sun className="h-6 w-6 fill-yellow-300 stroke-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-blue-600 font-display leading-tight">
              {opsCopy.companyName}
            </span>
            <span className="text-[10px] md:text-xs text-slate-500 font-medium -mt-0.5">{opsCopy.consoleTagline}</span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className={cn(
            "text-sm font-medium transition-colors hover:text-primary flex items-center gap-2",
            location === "/" ? "text-primary font-bold" : "text-muted-foreground"
          )}>
            <LayoutDashboard className="h-4 w-4" />
            Tableau de bord
          </Link>
          <Link href="/analytics" className={cn(
            "text-sm font-medium transition-colors hover:text-primary flex items-center gap-2",
            location === "/analytics" ? "text-primary font-bold" : "text-muted-foreground"
          )}>
            <BarChart2 className="h-4 w-4" />
            Analytics
          </Link>
          <Link href="/quote" className={cn(
            "text-sm font-medium transition-colors hover:text-primary flex items-center gap-2",
            location === "/quote" ? "text-primary font-bold" : "text-muted-foreground"
          )}>
            <Plus className="h-4 w-4" />
            Nouveau devis
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-700 leading-none">{opsCopy.userName}</p>
              <p className="text-xs text-slate-500 leading-none mt-1">{opsCopy.userRole}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-slate-200 to-slate-300 border-2 border-white shadow-md flex items-center justify-center text-slate-600 font-bold text-sm">
              HM
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
