import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Settings, Palette, MessageSquare, Building2, Globe,
  CheckCircle2, Upload, Sun,
} from 'lucide-react';

const PRESET_COLORS = [
  { name: 'Émeraude', value: '#10b981' },
  { name: 'Bleu',     value: '#3b82f6' },
  { name: 'Violet',   value: '#8b5cf6' },
  { name: 'Orange',   value: '#f59e0b' },
  { name: 'Rouge',    value: '#ef4444' },
  { name: 'Cyan',     value: '#06b6d4' },
];

const DEFAULT_TEMPLATES = {
  followUp: `Bonjour {{client}}, je vous contacte au sujet de votre projet solaire. Votre devis est disponible — n'hésitez pas à me contacter pour toute question. Cordialement, {{commercial}}`,
  creos: `Bonjour {{client}}, votre dossier CREOS est en cours de traitement (réf. {{ref}}). Nous vous tiendrons informé dès réception de l'autorisation. Cordialement, {{commercial}}`,
  install: `Bonjour {{client}}, votre installation est confirmée pour le {{date}}. Notre équipe arrivera entre 8h et 9h. Merci de libérer l'accès au toit. Cordialement, {{commercial}}`,
};

type Tab = 'identity' | 'appearance' | 'whatsapp' | 'region';

export default function SettingsPage() {
  const [tab, setTab] = useState<Tab>('identity');
  const [saved, setSaved] = useState(false);

  // Identity
  const [companyName, setCompanyName] = useState('SolarOps Luxembourg');
  const [tagline, setTagline] = useState('Gestion de chantiers');
  const [userName, setUserName] = useState('Hugo M.');
  const [userRole, setUserRole] = useState('Directeur Commercial');

  // Appearance
  const [primaryColor, setPrimaryColor] = useState('#10b981');

  // WhatsApp templates
  const [templates, setTemplates] = useState(DEFAULT_TEMPLATES);

  // Region
  const [currency, setCurrency] = useState('EUR');
  const [subsidyName, setSubsidyName] = useState('Klimabonus');
  const [operatorName, setOperatorName] = useState('CREOS');
  const [country, setCountry] = useState('Luxembourg');

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'identity',   label: 'Identité',   icon: <Building2 className="h-4 w-4" /> },
    { id: 'appearance', label: 'Apparence',  icon: <Palette className="h-4 w-4" /> },
    { id: 'whatsapp',   label: 'WhatsApp',   icon: <MessageSquare className="h-4 w-4" /> },
    { id: 'region',     label: 'Région',     icon: <Globe className="h-4 w-4" /> },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">

      {/* Header */}
      <div className="rounded-2xl bg-white/80 border border-slate-200/80 shadow-sm p-6 md:p-8">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center">
            <Settings className="h-5 w-5 text-slate-600" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Paramètres</h1>
            <p className="text-slate-500 text-sm">Personnalisez l'application pour votre entreprise</p>
          </div>
        </div>
      </div>

      {/* Preview card */}
      <Card className="border-white/60 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Aperçu en temps réel</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="rounded-xl p-4 flex items-center gap-3 border"
            style={{ borderColor: primaryColor + '40', background: primaryColor + '0a' }}
          >
            <div
              className="h-12 w-12 rounded-xl flex items-center justify-center text-white shadow-lg"
              style={{ background: `linear-gradient(135deg, ${primaryColor}, #3b82f6)` }}
            >
              <Sun className="h-7 w-7 fill-yellow-300 stroke-white" />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-lg leading-tight">{companyName}</p>
              <p className="text-xs text-slate-500">{tagline}</p>
            </div>
            <div className="ml-auto text-right">
              <p className="text-sm font-bold text-slate-700">{userName}</p>
              <p className="text-xs text-slate-400">{userRole}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 text-sm font-medium py-2 px-3 rounded-lg transition-all ${
              tab === t.id
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {t.icon}
            <span className="hidden sm:inline">{t.label}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'identity' && (
        <Card className="border-white/60 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-slate-700 flex items-center gap-2">
              <Building2 className="h-4 w-4 text-slate-400" />
              Identité de l'entreprise
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Logo upload */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Logo</label>
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-slate-300 transition-colors cursor-pointer">
                <Upload className="h-6 w-6 text-slate-400 mx-auto mb-2" />
                <p className="text-sm text-slate-500">Glissez votre logo ou <span className="text-blue-500 font-medium">parcourez</span></p>
                <p className="text-xs text-slate-400 mt-1">PNG, SVG — max 2 MB</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Nom de l'entreprise" value={companyName} onChange={setCompanyName} placeholder="ex. SolarOps Luxembourg" />
              <Field label="Sous-titre navbar" value={tagline} onChange={setTagline} placeholder="ex. Gestion de chantiers" />
              <Field label="Nom utilisateur" value={userName} onChange={setUserName} placeholder="ex. Jean D." />
              <Field label="Rôle utilisateur" value={userRole} onChange={setUserRole} placeholder="ex. Directeur Commercial" />
            </div>
          </CardContent>
        </Card>
      )}

      {tab === 'appearance' && (
        <Card className="border-white/60 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-slate-700 flex items-center gap-2">
              <Palette className="h-4 w-4 text-slate-400" />
              Couleur principale
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <p className="text-sm text-slate-500 mb-4">Choisissez la couleur qui correspond à votre charte graphique.</p>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {PRESET_COLORS.map(c => (
                  <button
                    key={c.value}
                    onClick={() => setPrimaryColor(c.value)}
                    className="flex flex-col items-center gap-2 group"
                  >
                    <div
                      className={`h-12 w-12 rounded-xl shadow-sm transition-transform group-hover:scale-105 ${primaryColor === c.value ? 'ring-2 ring-offset-2 ring-slate-400 scale-110' : ''}`}
                      style={{ backgroundColor: c.value }}
                    >
                      {primaryColor === c.value && (
                        <div className="h-full flex items-center justify-center">
                          <CheckCircle2 className="h-5 w-5 text-white" />
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-slate-500">{c.name}</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Couleur personnalisée (hex)</label>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg border border-slate-200 flex-shrink-0" style={{ backgroundColor: primaryColor }} />
                <input
                  type="text"
                  value={primaryColor}
                  onChange={e => setPrimaryColor(e.target.value)}
                  className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 font-mono"
                  placeholder="#10b981"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {tab === 'whatsapp' && (
        <Card className="border-white/60 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-slate-700 flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-slate-400" />
              Modèles WhatsApp
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <p className="text-sm text-slate-500">
              Variables disponibles : <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs font-mono">{`{{client}}`}</code>{' '}
              <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs font-mono">{`{{commercial}}`}</code>{' '}
              <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs font-mono">{`{{date}}`}</code>{' '}
              <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs font-mono">{`{{ref}}`}</code>
            </p>
            {[
              { key: 'followUp', label: 'Relance après devis' },
              { key: 'creos',    label: 'Suivi CREOS' },
              { key: 'install',  label: 'Confirmation installation' },
            ].map(t => (
              <div key={t.key}>
                <label className="block text-sm font-medium text-slate-700 mb-2">{t.label}</label>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none bg-white"
                  value={templates[t.key as keyof typeof templates]}
                  onChange={e => setTemplates(prev => ({ ...prev, [t.key]: e.target.value }))}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {tab === 'region' && (
        <Card className="border-white/60 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-slate-700 flex items-center gap-2">
              <Globe className="h-4 w-4 text-slate-400" />
              Région & localisation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <p className="text-sm text-slate-500">
              Adaptez l'application à votre pays — subventions, opérateur réseau, monnaie.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Pays</label>
                <select
                  value={country}
                  onChange={e => setCountry(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
                >
                  {['Luxembourg', 'France', 'Belgique', 'Suisse', 'Allemagne', 'Portugal', 'Espagne'].map(c => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Monnaie</label>
                <select
                  value={currency}
                  onChange={e => setCurrency(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
                >
                  {['EUR', 'CHF', 'GBP'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <Field label="Nom du subsidy / subvention" value={subsidyName} onChange={setSubsidyName} placeholder="ex. Klimabonus, MaPrimeRénov'…" />
              <Field label="Opérateur réseau" value={operatorName} onChange={setOperatorName} placeholder="ex. CREOS, Enedis, Elia…" />
            </div>
            <div className="rounded-xl bg-blue-50 border border-blue-100 p-4">
              <p className="text-sm font-semibold text-blue-700 mb-1">Comment ça fonctionne</p>
              <p className="text-xs text-blue-600">
                Les noms de subvention et d'opérateur apparaissent automatiquement dans les devis PDF, les alertes pipeline et les modèles WhatsApp. Changez-les ici pour adapter l'app à n'importe quel marché.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Save button */}
      <div className="flex justify-end pb-4">
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 text-sm font-semibold px-6 py-3 rounded-xl shadow transition-all ${
            saved
              ? 'bg-emerald-500 text-white'
              : 'bg-gradient-to-r from-emerald-500 to-blue-500 text-white hover:opacity-90'
          }`}
        >
          {saved ? (
            <><CheckCircle2 className="h-4 w-4" /> Sauvegardé</>
          ) : (
            'Sauvegarder les changements'
          )}
        </button>
      </div>
    </div>
  );
}

function Field({
  label, value, onChange, placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">{label}</label>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
      />
    </div>
  );
}
