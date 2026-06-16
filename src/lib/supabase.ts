import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!supabaseUrl || !supabaseAnonKey) {
  // Em desenvolvimento, isso evita quebra quando o projeto ainda está no modo protótipo.
  console.warn('Supabase não configurado. Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no .env.local.');
}

export const supabase = createClient(
  supabaseUrl || 'https://example.supabase.co',
  supabaseAnonKey || 'public-anon-key'
);

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
