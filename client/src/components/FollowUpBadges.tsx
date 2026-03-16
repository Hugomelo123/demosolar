import React from 'react';
import { Badge } from "./ui/badge";
import { Project } from "@/types";

export const FollowUpBadges = React.memo(function FollowUpBadges({ project }: { project: Project }) {
  const badges = [];

  if (project.lastContactDaysAgo > 7) {
    badges.push(
      <Badge key="contact" variant="destructive" className="bg-rose-100 text-rose-700 hover:bg-rose-200 border-0">
        No contact {project.lastContactDaysAgo}d
      </Badge>
    );
  }

  if (project.status === 'quote' && project.daysInStage > 14) {
    badges.push(
      <Badge key="quote" variant="warning" className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-0">
        Quote {project.daysInStage}d
      </Badge>
    );
  }

  if (project.status === 'creos' && project.daysInStage > 21) {
    badges.push(
      <Badge key="creos" variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-200 border-0">
        CREOS {project.daysInStage}d
      </Badge>
    );
  }

  if (badges.length === 0) return null;

  return <div className="flex flex-wrap gap-1 mt-2">{badges}</div>;
});
