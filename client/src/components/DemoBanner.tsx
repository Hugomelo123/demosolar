import React from 'react';

export function DemoBanner() {
  return (
    <div className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white px-4 py-2.5 text-center text-sm border-b border-emerald-700/30">
      <span className="font-semibold">Portfolio demo · Hugo Melo</span>
      <span className="mx-2 opacity-60">·</span>
      <span>Console opérations solaire Luxembourg — construit pour montrer une compréhension métier + compétences full-stack</span>
      <span className="mx-2 opacity-60">·</span>
      <span className="opacity-80">Données locales (navigateur) · En production : connecté à votre CRM</span>
    </div>
  );
}
