export interface CreatePlanDto {
  name: string;
  description: string;
  price: number;
  currency: string;
  billing_cycle: string;
  max_matches_per_month?: number;
  max_matches_per_day?: number;
  max_total_matches?: number;
  max_tournaments_per_month?: number;
  max_tournaments_per_year?: number;
  max_users?: number;
  max_admins?: number;
  max_match_duration_hours?: number;
  max_tournament_duration_days?: number;
  max_storage_gb?: number;
  max_file_size_mb?: number;
  analytics_enabled?: boolean;
  custom_branding?: boolean;
  api_access?: boolean;
  priority_support?: boolean;
  live_streaming?: boolean;
  advanced_reporting?: boolean;
  is_popular?: boolean;
}

export interface UpdatePlanDto {
  name?: string;
  description?: string;
  price?: number;
  currency?: string;
  billing_cycle?: string;
  max_matches_per_month?: number;
  max_matches_per_day?: number;
  max_total_matches?: number;
  max_tournaments_per_month?: number;
  max_tournaments_per_year?: number;
  max_users?: number;
  max_admins?: number;
  max_match_duration_hours?: number;
  max_tournament_duration_days?: number;
  max_storage_gb?: number;
  max_file_size_mb?: number;
  analytics_enabled?: boolean;
  custom_branding?: boolean;
  api_access?: boolean;
  priority_support?: boolean;
  live_streaming?: boolean;
  advanced_reporting?: boolean;
  is_active?: boolean;
  is_popular?: boolean;
}

export interface PlanResponseDto {
  id: number;
  name: string;
  description: string;
  price: number;
  currency: string;
  billing_cycle: string;
  max_matches_per_month: number | null;
  max_matches_per_day: number | null;
  max_total_matches: number | null;
  max_tournaments_per_month: number | null;
  max_tournaments_per_year: number | null;
  max_users: number | null;
  max_admins: number | null;
  max_match_duration_hours: number | null;
  max_tournament_duration_days: number | null;
  max_storage_gb: number | null;
  max_file_size_mb: number | null;
  analytics_enabled: boolean;
  custom_branding: boolean;
  api_access: boolean;
  priority_support: boolean;
  live_streaming: boolean;
  advanced_reporting: boolean;
  is_active: boolean;
  is_popular: boolean;
  createdAt: Date;
  updatedAt: Date;
}