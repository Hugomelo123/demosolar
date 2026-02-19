import React from 'react';

export function DemoBanner() {
  return (
    <div className="bg-amber-100 text-amber-900 px-4 py-2 text-center text-sm font-medium border-b border-amber-200">
      🚧 Démo — Données en local (navigateur). En production : connecté à votre CRM. Ce que vous voyez = votre tableau de bord opérations.
    </div>
  );
}
