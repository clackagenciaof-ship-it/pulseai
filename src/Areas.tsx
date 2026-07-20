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
  const [counts,setCounts]=useState({favorites:0,checkins:0,rides:0})
  return <ProtectedArea allowed={['usuario','admin']}>{profile => <UserContent profile={profile} counts={counts} setCounts={setCounts}/>}</ProtectedArea>
}

function UserContent({ profile, counts, setCounts }: { profile: PulseProfile; counts: {favorites:number;checkins:number;rides:number}; setCounts:(v:{favorites:number;checkins:number;rides:number})=>void }) {
  useEffect(()=>{ Promise.all([
    supabase.from('favorites').select('*',{count:'exact',head:true}).eq('user_profile_id',profile.id),
    supabase.from('checkins').select('*',{count:'exact',head:true}).eq('user_profile_id',profile.id),
    supabase.from('ride_requests').select('*',{count:'exact',head:true}).eq('user_profile_id',profile.id),
  ]).then(([f,c,r])=>setCounts({favorites:f.count||0,checkins:c.count||0,rides:r.count||0})) },[profile.id])
  return <AreaShell title={`Olá, ${(profile.full_name || 'Usuário').split(' ')[0]}`} subtitle="Descubra experiências, salve favoritos e acompanhe suas rotas." metrics={[{label:'Status',value:profile.is_active?'Ativo':'Inativo',icon:ShieldCheck},{label:'Favoritos',value:counts.favorites,icon:Heart},{label:'Check-ins',value:counts.checkins,icon:CheckCircle2},{label:'Rotas',value:counts.rides,icon:Route}]}><section className="area-grid"><article className="area-card wide"><h2>O que está rolando agora</h2><p>Eventos publicados e estabelecimentos ativos aparecem aqui em tempo real.</p><button onClick={()=>window.location.href='/'}><MapPin/> Explorar Floriano</button></article><article className="area-card"><h2>Seu perfil</h2><p>{profile.phone || 'Telefone não informado'}</p><p>{profile.city || 'Floriano'}, {profile.state || 'PI'}</p></article></section></AreaShell>
}

export function BusinessArea() {
  const [business, setBusiness] = useState<any>(null)
  const [events,setEvents]=useState(0)
  return <ProtectedArea allowed={['negocio','admin']}>{profile => <BusinessContent profile={profile} business={business} setBusiness={setBusiness} events={events} setEvents={setEvents}/>}</ProtectedArea>
}

function BusinessContent({ profile, business, setBusiness, events, setEvents }: { profile: PulseProfile; business: any; setBusiness: (b:any)=>void; events:number; setEvents:(n:number)=>void }) {
  useEffect(()=>{ supabase.from('businesses').select('*').eq('owner_profile_id',profile.id).maybeSingle().then(({data})=>{setBusiness(data); if(data) supabase.from('events').select('*',{count:'exact',head:true}).eq('business_id',data.id).then(({count})=>setEvents(count||0))}) },[profile.id])
  return <AreaShell title={business?.name || 'Painel do estabelecimento'} subtitle="Gerencie presença, eventos, cardápios, ofertas e métricas." metrics={[{label:'Status',value:business?.is_active?'Ativo':'Pendente',icon:ShieldCheck},{label:'Eventos',value:events,icon:CalendarDays},{label:'Cidade',value:business?.city || 'Floriano',icon:MapPin},{label:'Categorias',value:business?.categories?.length || 0,icon:BarChart3}]}><section className="area-grid"><article className="area-card wide"><h2>Seu negócio está conectado</h2><p>Cadastre eventos, combos, itens de cardápio e acompanhe os dados do estabelecimento.</p><button><Plus/> Cadastrar primeiro evento</button></article><article className="area-card"><Building2/><h2>Dados do negócio</h2><p>{business?.categories?.join(', ') || 'Categoria não informada'}</p><p>{business?.address || 'Endereço não informado'}</p></article></section></AreaShell>
}

export function DriverArea() {
  const [driver, setDriver] = useState<any>(null)
  const [rides,setRides]=useState(0)
  return <ProtectedArea allowed={['motorista','admin']}>{profile => <DriverContent profile={profile} driver={driver} setDriver={setDriver} rides={rides} setRides={setRides}/>}</ProtectedArea>
}

function DriverContent({ profile, driver, setDriver, rides, setRides }: { profile: PulseProfile; driver: any; setDriver: (d:any)=>void; rides:number; setRides:(n:number)=>void }) {
  useEffect(()=>{ supabase.from('drivers').select('*').eq('profile_id',profile.id).maybeSingle().then(({data})=>{setDriver(data); if(data) supabase.from('ride_requests').select('*',{count:'exact',head:true}).or(`driver_id.eq.${data.id},status.eq.solicitada`).then(({count})=>setRides(count||0))}) },[profile.id])
  async function toggle(){ if(!driver)return; const next=driver.status==='online'?'offline':'online'; const {data}=await supabase.from('drivers').update({status:next}).eq('id',driver.id).select().single(); if(data)setDriver(data) }
  return <AreaShell title="Área do motorista" subtitle="Fique online para receber solicitações de ida, volta e ida + volta." metrics={[{label:'Conta',value:driver?.is_active?'Ativa':'Inativa',icon:ShieldCheck},{label:'Status',value:driver?.status==='online'?'Online':'Offline',icon:Car},{label:'Solicitações',value:rides,icon:Route},{label:'Veículo',value:driver?.vehicle_type || '-',icon:Star}]}><section className="area-grid"><article className="area-card wide"><h2>{driver?.status==='online'?'Você está online':'Fique disponível para corridas'}</h2><p>As solicitações próximas aparecerão aqui conforme a movimentação da cidade.</p><button onClick={toggle}><Car/> {driver?.status==='online'?'Ficar offline':'Ficar online'}</button></article><article className="area-card"><Clock3/><h2>Dados do veículo</h2><p>{driver?.vehicle_label || driver?.vehicle_type || 'Veículo'}</p><p>{driver?.plate || 'Placa não informada'}</p></article></section></AreaShell>
}

export function AdminArea() {
  const [stats,setStats]=useState({users:0,businesses:0,drivers:0,events:0,rides:0})
  return <ProtectedArea allowed={['admin']}>{() => <AdminContent stats={stats} setStats={setStats}/>}</ProtectedArea>
}

function AdminContent({stats,setStats}:{stats:{users:number;businesses:number;drivers:number;events:number;rides:number};setStats:(v:any)=>void}){
  useEffect(()=>{ Promise.all([
    supabase.from('profiles').select('*',{count:'exact',head:true}),
    supabase.from('businesses').select('*',{count:'exact',head:true}),
    supabase.from('drivers').select('*',{count:'exact',head:true}),
    supabase.from('events').select('*',{count:'exact',head:true}),
    supabase.from('ride_requests').select('*',{count:'exact',head:true}),
  ]).then(([u,b,d,e,r])=>setStats({users:u.count||0,businesses:b.count||0,drivers:d.count||0,events:e.count||0,rides:r.count||0})) },[])
  return <AreaShell title="Admin PulseAí" subtitle="Controle geral de usuários, negócios, motoristas, conteúdo e operação." metrics={[{label:'Usuários',value:stats.users,icon:UsersRound},{label:'Negócios',value:stats.businesses,icon:Building2},{label:'Motoristas',value:stats.drivers,icon:Car},{label:'Eventos',value:stats.events,icon:CalendarDays}]}><section className="area-grid"><article className="area-card wide"><h2>Central de gestão</h2><p>Cadastros reais já são contabilizados pelo Supabase. Próxima etapa: aprovar, bloquear, revisar e publicar conteúdos pelo painel.</p><button><ShieldCheck/> Abrir aprovações</button></article><article className="area-card"><BarChart3/><h2>Operação</h2><p>{stats.rides} solicitações de corrida registradas.</p></article></section></AreaShell>
}
