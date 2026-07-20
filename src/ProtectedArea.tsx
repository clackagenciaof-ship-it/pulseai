import { useEffect, useState, type ReactNode } from 'react'
import { LogOut, ShieldAlert } from 'lucide-react'
import { supabase, type PulseProfile, type UserRole } from './lib/supabase'

type Props = { allowed: UserRole[]; children: (profile: PulseProfile) => ReactNode }

export default function ProtectedArea({ allowed, children }: Props) {
  const [profile, setProfile] = useState<PulseProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    async function load() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        window.location.href = `/entrar?redirect=${encodeURIComponent(window.location.pathname)}`
        return
      }
      const { data, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('auth_user_id', session.user.id)
        .single()
      if (!active) return
      if (profileError || !data) {
        setError('Seu perfil não foi encontrado. Entre novamente ou conclua o cadastro.')
        setLoading(false)
        return
      }
      if (!allowed.includes(data.role as UserRole)) {
        setError('Este perfil não possui permissão para acessar esta área.')
        setLoading(false)
        return
      }
      setProfile(data as PulseProfile)
      setLoading(false)
    }
    load()
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) window.location.href = '/entrar'
    })
    return () => { active = false; listener.subscription.unsubscribe() }
  }, [allowed.join(',')])

  async function logout() {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  if (loading) return <main className="protected-state"><div className="protected-card"><span className="loader"/><h2>Carregando seu painel...</h2></div></main>
  if (error || !profile) return <main className="protected-state"><div className="protected-card"><ShieldAlert/><h2>Acesso não autorizado</h2><p>{error}</p><button onClick={() => window.location.href='/entrar'}>Ir para login</button></div></main>

  return <div className="protected-layout"><header><div><strong>PulseAí</strong><small>{profile.full_name || 'Usuário'} • {profile.role}</small></div><button onClick={logout}><LogOut size={18}/> Sair</button></header>{children(profile)}</div>
}
