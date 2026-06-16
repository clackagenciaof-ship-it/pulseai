import { createClient } from '@supabase/supabase-js';

const fallbackSupabaseUrl = 'https://uopfvhbblveyhpieiuks.supabase.co';
const fallbackSupabasePublishableKey = 'sb_publishable_ZDgw-FzT7PCMAcIxh1PwmA_lH2cKOoS';

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string | undefined) || fallbackSupabaseUrl;
const supabaseAnonKey =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) || fallbackSupabasePublishableKey;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type UserRole = 'user' | 'business' | 'driver' | 'admin';
export type VibeReactionType =
  | 'bombando'
  | 'energia_alta'
  | 'acolhedor'
  | 'seguro'
  | 'publico_incrivel'
  | 'atendimento_top';

export type TransportKind = 'so_ida' | 'so_volta' | 'ida_volta';
export type VehiclePreference = 'carro' | 'moto' | 'mais_rapido';
