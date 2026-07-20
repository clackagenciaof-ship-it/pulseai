import { useEffect, useState } from 'react'
import { BarChart3, Building2, Car, CalendarDays, CheckCircle2, Clock3, Heart, MapPin, Plus, Route, ShieldCheck, Star, UsersRound } from 'lucide-react'
import ProtectedArea from './ProtectedArea'
import { supabase, type PulseProfile } from './lib/supabase'
import './areas.css'

type Metric = { label: string; value: string | number; icon: typeof UsersRound }

function AreaShell({ title, subtitle, metrics, children }: { title: string; subtitle: string; metrics: Metric[]; children: React.ReactNode }) {
  return <main className="area-page"><section className="area-heading"><p>PulseAí • Floriano, PI</p><h1>{title}</h1><span>{subtitle}</span></section><section className="area-metrics">{metrics.map(item => { const Icon=item.icon; return <article key={item.label}><Icon/><span>{item.label}</span><strong>{item.value}</strong></article> })}</section>{children}</main>
}

export function UserArea() {
  return <ProtectedArea allowed={['user','admin']}>{profile => <AreaShell title={`Olá, ${profile.full_name.split(' ')[0]}`} subtitle="Descubra experiências, salve favoritos e acompanhe suas rotas." metrics={[{label:'Pontos',value:profile.points,icon:Star},{label:'Favoritos',value:'0',icon:Heart},{label:'Check-ins',value:'0',icon:CheckCircle2},{label:'Rotas',value:'0',icon:Route}]}><section className="area-grid"><article className="area-card wide"><h2>O que está rolando agora</h2><p>Eventos publicados e aprovados aparecerão aqui em tempo real.</p><button onClick={()=>window.location.href='/'}><MapPin/> Explorar Floriano</button></article><article className="area-card"><h2>Seu perfil</h2><p>{profile.email}</p><p>{profile.city || 'Floriano, PI'}</p></article></section></AreaShell>}</ProtectedArea>
}

export function BusinessArea() {
  const [business, setBusiness] = useState<any>(null)
  return <ProtectedArea allowed={['business','admin']}>{profile => <BusinessContent profile={profile} business={business} setBusiness={setBusiness}/>}</ProtectedArea>
}

function BusinessContent({ profile, business, setBusiness }: { profile: PulseProfile; business: any; setBusiness: (b:any)=>void }) {
  useEffect(()=>{ supabase.from('businesses').select('*').eq('owner_id',profile.id).maybeSingle().then(({data})=>setBusiness(data)) },[profile.id])
  return <AreaShell title={business?.name || 'Painel do estabelecimento'} subtitle="Gerencie presença, eventos, cardápios, ofertas e métricas." metrics={[{label:'Status',value:business?.status || 'Pendente',icon:ShieldCheck},{label:'Eventos',value:'0',icon:CalendarDays},{label:'Visualizações',value:'0',icon:UsersRound},{label:'Conversões',value:'0',icon:BarChart3}]}><section className="area-grid"><article className="area-card wide"><h2>Seu negócio está em análise</h2><p>Após aprovação administrativa, o estabelecimento poderá publicar eventos e aparecer na descoberta pública.</p><button><Plus/> Cadastrar primeiro evento</button></article><article className="area-card"><Building2/><h2>Dados do negócio</h2><p>{business?.category || 'Categoria não informada'}</p><p>{business?.address || 'Endereço não informado'}</p></article></section></AreaShell>
}

export function DriverArea() {
  const [driver, setDriver] = useState<any>(null)
  return <ProtectedArea allowed={['driver','admin']}>{profile => <DriverContent profile={profile} driver={driver} setDriver={setDriver}/>}</ProtectedArea>
}

function DriverContent({ profile, driver, setDriver }: { profile: PulseProfile; driver: any; setDriver: (d:any)=>void }) {
  useEffect(()=>{ supabase.from('drivers').select('*').eq('profile_id',profile.id).maybeSingle().then(({data})=>setDriver(data)) },[profile.id])
  async function toggle(){ if(!driver)return; const {data}=await supabase.from('drivers').update({available:!driver.available}).eq('id',driver.id).select().single(); if(data)setDriver(data) }
  return <AreaShell title="Área do motorista" subtitle="Fique online para receber solicitações de ida, volta e ida + volta." metrics={[{label:'Aprovação',value:driver?.approved?'Aprovado':'Pendente',icon:ShieldCheck},{label:'Status',value:driver?.available?'Online':'Offline',icon:Car},{label:'Corridas',value:'0',icon:Route},{label:'Avaliação',value:driver?.rating || '5.0',icon:Star}]}><section className="area-grid"><article className="area-card wide"><h2>{driver?.available?'Você está online':'Fique disponível para corridas'}</h2><p>As solicitações próximas aparecerão aqui conforme a movimentação da cidade.</p><button onClick={toggle}><Car/> {driver?.available?'Ficar offline':'Ficar online'}</button></article><article className="area-card"><Clock3/><h2>Dados do veículo</h2><p>{driver?.vehicle_type || 'Veículo'}</p><p>{driver?.plate || 'Placa não informada'}</p></article></section></AreaShell>
}

export function AdminArea() {
  const [stats,setStats]=useState({users:0,businesses:0,drivers:0,events:0})
  useEffect(()=>{ Promise.all([supabase.from('profiles').select('*',{count:'exact',head:true}),supabase.from('businesses').select('*',{count:'exact',head:true}),supabase.from('drivers').select('*',{count:'exact',head:true}),supabase.from('events').select('*',{count:'exact',head:true})]).then(([u,b,d,e])=>setStats({users:u.count||0,businesses:b.count||0,drivers:d.count||0,events:e.count||0})) },[])
  return <ProtectedArea allowed={['admin']}>{() => <AreaShell title="Admin PulseAí" subtitle="Controle geral de usuários, negócios, motoristas, conteúdo e operação." metrics={[{label:'Usuários',value:stats.users,icon:UsersRound},{label:'Negócios',value:stats.businesses,icon:Building2},{label:'Motoristas',value:stats.drivers,icon:Car},{label:'Eventos',value:stats.events,icon:CalendarDays}]}><section className="area-grid"><article className="area-card wide"><h2>Central de aprovação</h2><p>A próxima etapa conectará listas de negócios e motoristas pendentes com botões reais de aprovar, bloquear e revisar.</p><button><ShieldCheck/> Abrir aprovações</button></article><article className="area-card"><BarChart3/><h2>Operação</h2><p>Monitoramento dos cadastros reais já conectado ao Supabase.</p></article></section></AreaShell>}</ProtectedArea>
}
