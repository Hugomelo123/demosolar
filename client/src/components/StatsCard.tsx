import React from 'react';
import { Card, CardContent } from "./ui/card";
import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon?: React.ReactNode;
}

export function StatsCard({ title, value, change, trend, icon }: StatsCardProps) {
  return (
    <Card className="hover:shadow-xl transition-shadow duration-300 border-white/60">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{value}</h3>
          </div>
          {icon && (
            <div className="p-3 bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-sm border border-white">
              {icon}
            </div>
          )}
        </div>
        <div className="mt-4 flex items-center gap-2">
          <div className={cn(
            "flex items-center text-xs font-bold px-2 py-1 rounded-full",
            trend === 'up' 
              ? "bg-emerald-100 text-emerald-700" 
              : "bg-rose-100 text-rose-700"
          )}>
            {trend === 'up' ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
            {change}
          </div>
          <span className="text-xs text-muted-foreground">vs last week</span>
        </div>
      </CardContent>
    </Card>
  );
}
