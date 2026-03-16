import React, { useState } from 'react';
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Sun, Plus, LayoutDashboard, BarChart2, Menu, X, TrendingUp, Users, Settings } from "lucide-react";
import { opsCopy } from "@/config/opsCopy";

const navLinks = [
  { href: '/dashboard',  icon: <LayoutDashboard className="h-4 w-4" />, label: 'Tableau de bord' },
  { href: '/analytics',  icon: <BarChart2 className="h-4 w-4" />,       label: 'Analytics' },
  { href: '/executive',  icon: <TrendingUp className="h-4 w-4" />,      label: 'Direction' },
  { href: '/team',       icon: <Users className="h-4 w-4" />,           label: 'Équipe' },
  { href: '/quote',      icon: <Plus className="h-4 w-4" />,            label: 'Nouveau devis' },
  { href: '/settings',   icon: <Settings className="h-4 w-4" />,        label: 'Paramètres' },
];

export function Navbar() {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/70 border-b border-white/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2 group cursor-pointer">
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

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <Link key={link.href} href={link.href} className={cn(
              "text-sm font-medium transition-colors hover:text-primary flex items-center gap-2",
              location === link.href ? "text-primary font-bold" : "text-muted-foreground"
            )}>
              {link.icon}
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right: user + hamburger */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-700 leading-none">{opsCopy.userName}</p>
              <p className="text-xs text-slate-500 leading-none mt-1">{opsCopy.userRole}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-slate-200 to-slate-300 border-2 border-white shadow-md flex items-center justify-center text-slate-600 font-bold text-sm">
              HM
            </div>
          </div>
          {/* Hamburger — mobile only */}
          <button
            className="md:hidden h-9 w-9 flex items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            onClick={() => setMobileOpen(prev => !prev)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white/95 backdrop-blur-xl px-4 py-3 space-y-1 shadow-lg">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors",
                location === link.href
                  ? "bg-primary/10 text-primary font-bold"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
