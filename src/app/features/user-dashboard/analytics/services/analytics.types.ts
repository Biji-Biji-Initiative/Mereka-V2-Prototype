// Service Analytics Dashboard — domain types
// Sourced from Figma "Mereka Onboarding experience - UXA" (37 frames around node 5208:182151).
// The dashboard is gated to Scale and Soar plan users; see PLAN_FEATURE_GATES.

export type ServiceCategory =
  | 'programme'
  | 'course'
  | 'experience'
  | 'expertise'
  | 'gig';

export interface KpiCard {
  label: string;
  value: string;
  delta?: { value: string; trend: 'up' | 'down' | 'flat' };
  hint?: string;
}

export interface ImpactFilterOption {
  id: string;
  label: string;
  count: number;
  selected?: boolean;
  color?: string; // dot color
}

export interface ImpactFilterGroup {
  id: string;
  label: string;
  options: ImpactFilterOption[];
}

export interface SeriesPoint {
  label: string;
  value: number;
}

export interface ServiceRow {
  id: string;
  name: string;
  owner: string;
  type: string;        // e.g. "Workshop", "Event", "Bootcamp"
  mode: string;        // "Hybrid" | "Physical" | "Online" | "Virtual"
  date: string;        // ISO or pretty
  location: string;
  tickets: number;
  fillRate: number;    // 0..100
  rating: number;      // 0..5
  revenue: number;     // RM
}

export interface CorrelationCell {
  rowId: string;
  colId: string;
  value: number;   // -1..1
}

export interface KpiBuilderField {
  id: string;
  label: string;
  group: 'engagement' | 'monetisation' | 'audience' | 'outcomes';
}

export interface B40ImpactSummary {
  reachPct: number;
  uniqueB40: number;
  programmesWithB40: number;
  avgIncomeUplift: number;
}
