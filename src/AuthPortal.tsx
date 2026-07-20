import { FormEvent, useMemo, useState } from 'react'
import { ArrowLeft, Building2, Car, Eye, EyeOff, LockKeyhole, Mail, MapPin, Phone, ShieldCheck, UserRound } from 'lucide-react'
import { supabase, type AuthRole, type UserRole } from './lib/supabase'
import './auth.css'

type Props = { forcedRole?: AuthRole }

const labels: Record<AuthRole, { title: string; description: string; icon: typeof UserRound }> = {
  user: { title: 'Para quem sai', description: 'Crie seu perfil e descubra o que está pulsando em Floriano.', icon: UserRound },
  business: { title: 'Negócios', description: 'Cadastre seu estabelecimento e gerencie eventos, cardápios, combos e métricas.', icon: Building2 },
  driver: { title: 'Motoristas', description: 'Cadastre-se para receber solicitações ligadas à movimentação da cidade.', icon: Car },
  admin: { title: 'Admin', description: 'Acesso restrito ao proprietário e à gestão do PulseAí.', icon: ShieldCheck },
}

const roleMap: Record<AuthRole, UserRole> = {
  user: 'usuario',
  business: 'negocio',
  driver: 'motorista',
  admin: 'admin',
}

function destination(role: UserRole) {
  if (role === 'negocio') return '/parceiro'
  if (role === 'motorista') return '/motorista'
  if (role === 'admin') return '/admin'
  return '/app'
}

export default function AuthPortal({ forcedRole }: Props) {
  const search = new URLSearchParams(window.location.search)
  const initialRole = forcedRole || (search.get('role') as AuthRole) || 'user'
  const [role, setRole] = useState<AuthRole>(initialRole)
  const [mode, setMode] = useState<'login' | 'register'>('register')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', city: 'Floriano', address: '', password: '', businessName: '', category: 'Restaurante', vehicleType: 'carro', plate: '' })
  const meta = useMemo(() => labels[role], [role])
  const Icon = meta.icon

  async function submit(event: FormEvent) {
    event.preventDefault()
    setLoading(true)
    setMessage('')
    try {
      if (mode === 'login') {
        const { data, error } = await supabase.auth.signInWithPassword({ email: form.email.trim(), password: form.password })
        if (error) throw error
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('auth_user_id', data.user.id)
          .single()
        if (profileError) throw profileError
        window.location.href = destination(profile.role as UserRole)
        return
      }

      if (role === 'admin') throw new Error('Contas administrativas não podem ser criadas publicamente.')

      const { data, error } = await supabase.auth.signUp({
        email: form.email.trim(),
        password: form.password,
        options: {
          data: {
            full_name: form.fullName.trim(),
            role,
            phone: form.phone.trim(),
            city: form.city.trim(),
            address: form.address.trim(),
            business_name: form.businessName.trim(),
            category: form.category,
            vehicle_type: form.vehicleType,
            plate: form.plate.trim().toUpperCase(),
          },
        },
      })
      if (error) throw error
      if (!data.user) throw new Error('Não foi possível criar o usuário.')

      if (!data.session) {
        setMessage('Cadastro criado. Confirme o e-mail enviado pelo PulseAí e depois entre na sua conta.')
      } else {
        window.location.href = destination(roleMap[role])
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Não foi possível concluir. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-page">
      <button className="auth-back" onClick={() => window.location.href = '/'}><ArrowLeft size={18}/> Voltar para o início</button>
      <section className="auth-shell">
        <aside className="auth-side">
          <div className="auth-logo"><span>PulseAí</span><small>Onde a cidade pulsa agora.</small></div>
          <div className="auth-role-icon"><Icon /></div>
          <p className="auth-kicker">Acesso PulseAí</p>
          <h1>{meta.title}</h1>
          <p>{meta.description}</p>
          <div className="auth-role-list">
            {(['user','business','driver','admin'] as AuthRole[]).map(item => {
              const ItemIcon = labels[item].icon
              return <button key={item} className={role === item ? 'active' : ''} onClick={() => { setRole(item); setMode(item === 'admin' ? 'login' : mode); setMessage('') }}><ItemIcon size={19}/><span>{labels[item].title}</span></button>
            })}
          </div>
        </aside>

        <div className="auth-form-wrap">
          <div className="auth-tabs">
            <button className={mode === 'register' ? 'active' : ''} disabled={role === 'admin'} onClick={() => setMode('register')}>Criar conta</button>
            <button className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')}>Entrar</button>
          </div>
          <form onSubmit={submit} className="auth-form">
            <h2>{mode === 'login' ? `Entrar como ${meta.title}` : `Cadastro: ${meta.title}`}</h2>
            <p>{mode === 'login' ? 'Use seu e-mail e senha para acessar seu painel.' : 'Preencha os dados abaixo para iniciar seu acesso real ao PulseAí.'}</p>

            {mode === 'register' && <label><span>Nome completo</span><div><UserRound/><input required value={form.fullName} onChange={e => setForm({...form, fullName:e.target.value})} placeholder="Seu nome completo"/></div></label>}
            <label><span>E-mail</span><div><Mail/><input required type="email" value={form.email} onChange={e => setForm({...form, email:e.target.value})} placeholder="voce@email.com"/></div></label>
            {mode === 'register' && <label><span>WhatsApp</span><div><Phone/><input required value={form.phone} onChange={e => setForm({...form, phone:e.target.value})} placeholder="(89) 99999-9999"/></div></label>}
            {mode === 'register' && <label><span>Cidade</span><div><MapPin/><input required value={form.city} onChange={e => setForm({...form, city:e.target.value})}/></div></label>}
            {mode === 'register' && role === 'business' && <><label><span>Nome do estabelecimento</span><div><Building2/><input required value={form.businessName} onChange={e => setForm({...form, businessName:e.target.value})} placeholder="Nome do negócio"/></div></label><label><span>Categoria</span><select value={form.category} onChange={e => setForm({...form, category:e.target.value})}><option>Restaurante</option><option>Bar / Pub</option><option>Casa de show</option><option>Produtor de eventos</option><option>Cultural</option><option>Gastronomia</option><option>Ambiente infantil</option><option>Modo Relax</option></select></label><label><span>Endereço do estabelecimento</span><div><MapPin/><input required value={form.address} onChange={e => setForm({...form, address:e.target.value})} placeholder="Rua, número e bairro"/></div></label></>}
            {mode === 'register' && role === 'driver' && <><label><span>Veículo</span><select value={form.vehicleType} onChange={e => setForm({...form, vehicleType:e.target.value})}><option value="carro">Carro</option><option value="moto">Moto</option></select></label><label><span>Placa</span><div><Car/><input required value={form.plate} onChange={e => setForm({...form, plate:e.target.value})} placeholder="ABC1D23"/></div></label></>}
            {mode === 'register' && role === 'user' && <label><span>Endereço residencial (opcional)</span><div><MapPin/><input value={form.address} onChange={e => setForm({...form, address:e.target.value})} placeholder="Usado somente para facilitar rotas"/></div></label>}
            <label><span>Senha</span><div><LockKeyhole/><input required minLength={8} type={showPassword ? 'text' : 'password'} value={form.password} onChange={e => setForm({...form, password:e.target.value})} placeholder="Mínimo de 8 caracteres"/><button type="button" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff/> : <Eye/>}</button></div></label>

            {message && <div className="auth-message">{message}</div>}
            <button className="auth-submit" disabled={loading}>{loading ? 'Processando...' : mode === 'login' ? 'Entrar no PulseAí' : 'Criar minha conta'}</button>
            <small className="auth-legal">Ao continuar, você concorda com os termos e a política de privacidade do PulseAí.</small>
          </form>
        </div>
      </section>
    </main>
  )
}
