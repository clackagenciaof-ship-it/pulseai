import { createClient } from '@supabase/supabase-js'

const fallbackSupabaseUrl = 'https://uopfvhbblveyhpieiuks.supabase.co'
const fallbackSupabasePublishableKey = 'sb_publishable_ZDgw-FzT7PCMAcIxh1PwmA_lH2cKOoS'

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string | undefined) || fallbackSupabaseUrl
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) || fallbackSupabasePublishableKey

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})

export type UserRole = 'user' | 'business' | 'driver' | 'admin'
export type PulseProfile = {
  id: string
  role: UserRole
  full_name: string
  email: string | null
  phone: string | null
  city: string | null
  residential_address: string | null
  avatar_url: string | null
  points: number
  level: string
}
export type VibeReactionType = 'bombando' | 'energia_alta' | 'acolhedor' | 'seguro' | 'publico_incrivel' | 'atendimento_top'
export type TransportKind = 'so_ida' | 'so_volta' | 'ida_volta'
export type VehiclePreference = 'carro' | 'moto' | 'mais_rapido'
