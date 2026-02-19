import React from 'react';
import { useProjects } from "./Providers";
import { Alert, AlertTitle, AlertDescription } from "./ui/alert";
import { AlertTriangle, Clock, PhoneCall } from "lucide-react";
import { Link } from "wouter";
import { Badge } from "./ui/badge";
import { opsCopy } from "@/config/opsCopy";

export function BottleneckAlert() {
  const { projects } = useProjects();

  const creosStuck = projects.filter(p => p.status === 'creos' && p.daysInStage > 21);
  const quoteStuck = projects.filter(p => p.status === 'quote' && p.daysInStage > 14);
  const followUpNeeded = projects.filter(p => p.lastContactDaysAgo > 7);

  const totalAlerts = creosStuck.length + quoteStuck.length + followUpNeeded.length;

  if (totalAlerts === 0) return null;

  return (
    <div className="mb-8 space-y-4">
      {creosStuck.map(p => (
        <Alert key={p.id} variant="destructive" className="bg-rose-50 border-rose-200 text-rose-900 shadow-sm">
          <AlertTriangle className="h-5 w-5 text-rose-600" />
          <AlertTitle className="text-rose-900 font-bold flex items-center gap-2">
            {opsCopy.creosDelayTitle}
            <Badge variant="destructive" className="ml-2 bg-rose-200 text-rose-800 hover:bg-rose-300 border-0">{p.daysInStage} j</Badge>
          </AlertTitle>
          <AlertDescription className="text-rose-800 mt-1 flex justify-between items-center">
            <span>{p.clientName} — {opsCopy.creosDelayDesc}</span>
            <Link href={`/projects/${p.id}`} className="font-bold underline hover:text-rose-950">
              {opsCopy.voirProjet}
            </Link>
          </AlertDescription>
        </Alert>
      ))}

      {quoteStuck.map(p => (
        <Alert key={p.id} className="bg-amber-50 border-amber-200 text-amber-900 shadow-sm">
          <Clock className="h-5 w-5 text-amber-600" />
          <AlertTitle className="text-amber-900 font-bold flex items-center gap-2">
            {opsCopy.quoteStuckTitle}
            <Badge variant="warning" className="ml-2 bg-amber-200 text-amber-800 hover:bg-amber-300 border-0">{p.daysInStage} j</Badge>
          </AlertTitle>
          <AlertDescription className="text-amber-800 mt-1 flex justify-between items-center">
            <span>{p.clientName} — {opsCopy.quoteStuckDesc}</span>
            <Link href={`/projects/${p.id}`} className="font-bold underline hover:text-amber-950">
              {opsCopy.relancer}
            </Link>
          </AlertDescription>
        </Alert>
      ))}
      
      {followUpNeeded.length > 0 && (
         <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <PhoneCall className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-blue-900">{followUpNeeded.length} {opsCopy.followUpTitle}</h4>
                <p className="text-sm text-blue-700">{opsCopy.followUpDesc}</p>
              </div>
            </div>
            <div className="flex gap-2">
               {followUpNeeded.slice(0, 3).map(p => (
                  <Link key={p.id} href={`/projects/${p.id}`}>
                    <Badge variant="secondary" className="bg-white hover:bg-blue-100 cursor-pointer border border-blue-100">
                      {p.clientName}
                    </Badge>
                  </Link>
               ))}
               {followUpNeeded.length > 3 && <span className="text-sm text-blue-500 self-center">{opsCopy.moreOthers(followUpNeeded.length - 3)}</span>}
            </div>
         </div>
      )}
    </div>
  );
}
