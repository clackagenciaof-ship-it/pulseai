import { createClient } from '@supabase/supabase-js'

const fallbackSupabaseUrl = 'https://mkwtqforzirfcxvsqenf.supabase.co'
const fallbackSupabasePublishableKey = 'sb_publishable_qgqQpLsj3Yxtqafgu3ygpg_EKKljX9l'

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string | undefined) || fallbackSupabaseUrl
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) || fallbackSupabasePublishableKey

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})

export type UserRole = 'usuario' | 'negocio' | 'motorista' | 'admin'
export type AuthRole = 'user' | 'business' | 'driver' | 'admin'

export type PulseProfile = {
  id: string
  auth_user_id: string | null
  role: UserRole
  full_name: string | null
  phone: string | null
  avatar_url: string | null
  city: string | null
  state: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}
