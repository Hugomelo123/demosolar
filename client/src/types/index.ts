export type ProjectStatus = 'lead' | 'visit' | 'quote' | 'creos' | 'installation' | 'raccordement' | 'completed';

export interface ChangeEvent {
  id: string;
  type: 'status_change' | 'note' | 'contact' | 'whatsapp' | 'problem' | 'field_update';
  label: string;
  at: string; // ISO timestamp
  meta?: string;
}

export type NextAction =
  | 'Call client'
  | 'Schedule site visit'
  | 'Send quote PDF'
  | 'Send CREOS documents'
  | 'Request deposit'
  | 'Plan installation date'
  | 'Schedule CREOS raccordement'
  | 'Close project';

export type ProjectOwner = 'Sales' | 'Admin' | 'Team';

export interface Project {
  id: string;
  clientName: string;
  address: string;
  kwp: number;
  value: number;
  status: ProjectStatus;
  createdAt: Date;
  daysInStage: number;
  lastContactDaysAgo: number;
  phone: string;
  nextAction: NextAction;
  notes: string[];
  visitDate?: string;
  assignedTech?: string;
  /** Who owns this project (Sales / Admin / Team) */
  owner?: ProjectOwner;
  /** Due date for next step (ISO string) */
  dueDate?: string;
  /** ISO timestamp when the project entered its current stage */
  stageEnteredAt?: string;
  /** ISO timestamp of last client contact */
  lastContactAt?: string;
  /** Change history events for audit trail */
  history?: ChangeEvent[];
}

export interface QuoteData {
  address: string;
  roofType: 'pitched' | 'flat' | 'facade';
  areaM2: number;
  monthlyBill: number;
  hasBattery: boolean;
  consumptionProfile: 'low' | 'normal' | 'high';
  packageType: 'basic' | 'premium';
  kwp: number;
  production: number;
  installCost: number;
  klimabonus: number;
  netCost: number;
  /** Indicative range: client sees "between X and Y €" (not a fixed quote). */
  netCostMin: number;
  netCostMax: number;
  annualSavings: number;
  paybackYears: number;
}
