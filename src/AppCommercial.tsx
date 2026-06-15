import { useEffect, useMemo, useState } from 'react'

type Role = 'publico' | 'usuario' | 'parceiro' | 'motorista' | 'admin'
type Category = 'Bombando' | 'Música ao vivo' | 'Gastronomia' | 'Cultural' | 'Modo Relax' | 'Ambiente infantil'
type RideType = 'Só ida' | 'Só volta' | 'Ida + volta'
type RideStatus = 'Pendente' | 'Aceita' | 'Finalizada'

type UserAccount = {
  id: string
  name: string
  phone: string
  address: string
  preferences: string
  photo?: string
  points: number
  createdAt: string
}

type PartnerAccount = {
  id: string
  owner: string
  businessName: string
  category: string
  whatsapp: string
  address: string
  password: string
  approved: boolean
  createdAt: string
}

type DriverAccount = {
  id: string
  name: string
  phone: string
  vehicleType: string
  vehicleModel: string
  plate: string
  city: string
  availability: RideType[]
  password: string
  online: boolean
  rating: number
  createdAt: string
}

type EventItem = {
  id: string
  partnerId: string
  partnerName: string
  partnerWhatsapp: string
  name: string
  category: Category
  dateTime: string
  address: string
  photo?: string
  description: string
  musicGenre: string
  environment: string
  crowd: number
  vibe: string
  cashback: number
  ticketType: string
  combos: string[]
  drinks: string[]
  promos: string[]
  menu: string[]
  metrics: {
    reach: number
    views: number
    checkins: number
    clicks: number
    sales: number
    reactions: number
  }
  createdAt: string
}

type RideRequest = {
  id: string
  userId: string
  userName: string
  userPhone: string
  eventId: string
  eventName: string
  origin: string
  destination: string
  type: RideType
  vehiclePreference: string
  status: RideStatus
  driverId?: string
  driverName?: string
  driverPhone?: string
  driverVehicle?: string
  driverPlate?: string
  driverRating?: number
  createdAt: string
}

type OrderItem = {
  id: string
  userId: string
  userName: string
  eventId: string
  eventName: string
  partnerWhatsapp: string
  items: string[]
  total: number
  status: 'Reserva enviada' | 'Compra simulada'
  createdAt: string
}

type Database = {
  users: UserAccount[]
  partners: PartnerAccount[]
  drivers: DriverAccount[]
  events: EventItem[]
  rides: RideRequest[]
  orders: OrderItem[]
}

const categories: Category[] = ['Bombando', 'Música ao vivo', 'Gastronomia', 'Cultural', 'Modo Relax', 'Ambiente infantil']
const rideTypes: RideType[] = ['Só ida', 'Só volta', 'Ida + volta']
const now = () => new Date().toISOString()
const uid = () => Math.random().toString(36).slice(2, 10)
const money = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
const splitLines = (value: string) => value.split('\n').map((item) => item.trim()).filter(Boolean)
const defaultDb: Database = { users: [], partners: [], drivers: [], events: [], rides: [], orders: [] }

const demoEvents: EventItem[] = [
  {
    id: 'demo-samba', partnerId: 'demo', partnerName: 'Boteco do Zé', partnerWhatsapp: '5599999999999',
    name: 'Noite de Samba no Boteco do Zé', category: 'Bombando', dateTime: 'Hoje, 20h às 02h', address: 'Rua das Flores, Centro',
    description: 'Samba ao vivo, combos ativos, cardápio publicado e lotação boa para chegar agora.', musicGenre: 'Samba e pagode', environment: 'Animado', crowd: 72, vibe: 'Energia Alta', cashback: 5, ticketType: 'Reserva e combo',
    combos: ['Combo Samba + Cerveja — R$ 45', 'Entrada + 2 drinks — R$ 85'], drinks: ['Caipirinha da casa — R$ 18', 'Gin Tropical — R$ 22'], promos: ['5% de cashback no check-in'], menu: ['Tábua mista — R$ 32', 'Petisco crocante — R$ 26'],
    metrics: { reach: 1245, views: 832, checkins: 148, clicks: 230, sales: 37, reactions: 194 }, createdAt: now()
  },
  {
    id: 'demo-gastro', partnerId: 'demo', partnerName: 'Petiscos da Vila', partnerWhatsapp: '5599999999999',
    name: 'Festival de Petiscos da Vila', category: 'Gastronomia', dateTime: 'Hoje, 18h às 23h', address: 'Rua Coelho Rodrigues, Centro',
    description: 'Petiscos, cerveja gelada, combos em conta e atendimento rápido para grupos.', musicGenre: 'Ambiente', environment: 'Acolhedor', crowd: 61, vibe: 'Acolhedor', cashback: 4, ticketType: 'Reserva',
    combos: ['Combo Amigos — R$ 69', 'Petisco + drink — R$ 39'], drinks: ['Cerveja long neck — R$ 9', 'Suco da casa — R$ 12'], promos: ['Mesa reservada até 20h'], menu: ['Isca de carne — R$ 34', 'Batata especial — R$ 24'],
    metrics: { reach: 890, views: 604, checkins: 93, clicks: 172, sales: 22, reactions: 127 }, createdAt: now()
  }
]

function getInitialDb(): Database {
  try {
    const raw = localStorage.getItem('pulseai_db')
    if (!raw) return { ...defaultDb, events: demoEvents }
    const parsed = JSON.parse(raw) as Database
    return { ...defaultDb, ...parsed, events: parsed.events?.length ? parsed.events : demoEvents }
  } catch {
    return { ...defaultDb, events: demoEvents }
  }
}

function readFile(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ''))
    reader.readAsDataURL(file)
  })
}

export default function AppCommercial() {
  const [db, setDb] = useState<Database>(getInitialDb)
  const [role, setRole] = useState<Role>('publico')
  const [activeUserId, setActiveUserId] = useState('')
  const [activePartnerId, setActivePartnerId] = useState('')
  const [activeDriverId, setActiveDriverId] = useState('')
  const [category, setCategory] = useState<Category>('Bombando')
  const [selectedEventId, setSelectedEventId] = useState('')
  const [modal, setModal] = useState<'download' | 'admin' | null>(null)

  useEffect(() => { localStorage.setItem('pulseai_db', JSON.stringify(db)) }, [db])

  const currentUser = db.users.find((u) => u.id === activeUserId)
  const currentPartner = db.partners.find((p) => p.id === activePartnerId)
  const currentDriver = db.drivers.find((d) => d.id === activeDriverId)
  const filteredEvents = db.events.filter((event) => event.category === category)
  const selectedEvent = db.events.find((event) => event.id === selectedEventId) || filteredEvents[0] || db.events[0]

  function updateDb(next: Database) { setDb(next) }
  function openRole(next: Role) { setRole(next); window.scrollTo({ top: 0, behavior: 'smooth' }) }

  return <main className="commercial-shell">
    <header className="commercial-topbar">
      <button className="brand" onClick={() => openRole('publico')}><span className="logo" /><strong>PulseAí</strong></button>
      <nav>
        <button onClick={() => openRole('usuario')}>Cliente / usuário</button>
        <button onClick={() => openRole('parceiro')}>Área do parceiro</button>
        <button onClick={() => openRole('motorista')}>Motorista</button>
        <button onClick={() => setModal('admin')}>Admin 🔒</button>
        <button className="download-top" onClick={() => setModal('download')}>Quero baixar</button>
      </nav>
    </header>

    {role === 'publico' && <PublicHome openRole={openRole} setModal={setModal} events={db.events} />}
    {role === 'usuario' && <UserArea db={db} updateDb={updateDb} user={currentUser} setActiveUserId={setActiveUserId} category={category} setCategory={setCategory} events={filteredEvents} selectedEvent={selectedEvent} setSelectedEventId={setSelectedEventId} />}
    {role === 'parceiro' && <PartnerArea db={db} updateDb={updateDb} partner={currentPartner} setActivePartnerId={setActivePartnerId} />}
    {role === 'motorista' && <DriverArea db={db} updateDb={updateDb} driver={currentDriver} setActiveDriverId={setActiveDriverId} />}
    {role === 'admin' && <AdminArea db={db} updateDb={updateDb} />}

    {modal === 'download' && <DownloadModal close={() => setModal(null)} />}
    {modal === 'admin' && <AdminLogin close={() => setModal(null)} enter={() => { setModal(null); openRole('admin') }} />}
  </main>
}

function PublicHome({ openRole, setModal, events }: { openRole: (r: Role) => void; setModal: (m: 'download') => void; events: EventItem[] }) {
  return <section className="commercial-hero">
    <div className="hero-copy">
      <h1>Onde a cidade <span>pulsa agora.</span></h1>
      <p>Uma plataforma para usuário final, estabelecimento, motorista e administrador funcionarem no mesmo ecossistema: descoberta, evento, cardápio, combo, transporte, métricas e gestão.</p>
      <div className="actions"><button className="primary" onClick={() => openRole('usuario')}>Entrar como usuário</button><button className="secondary" onClick={() => openRole('parceiro')}>Cadastrar estabelecimento</button><button className="ghost" onClick={() => openRole('motorista')}>Sou motorista</button></div>
      <div className="stats"><article><strong>{events.length}</strong><small>eventos disponíveis</small></article><article><strong>3 frentes</strong><small>usuário, parceiro e motorista</small></article><article><strong>Admin</strong><small>controle geral restrito</small></article></div>
    </div>
    <div className="platform-card">
      <span className="pill">Pronto para piloto</span>
      <h2>O próximo passo é testar com parceiro real.</h2>
      <p>Cadastre um estabelecimento, publique um evento, adicione cardápio e simule pedidos, corridas e métricas operacionais.</p>
      <button className="primary" onClick={() => setModal('download')}>Ver caminhos de download</button>
    </div>
  </section>
}

function UserArea({ db, updateDb, user, setActiveUserId, category, setCategory, events, selectedEvent, setSelectedEventId }: { db: Database; updateDb: (d: Database) => void; user?: UserAccount; setActiveUserId: (id: string) => void; category: Category; setCategory: (c: Category) => void; events: EventItem[]; selectedEvent?: EventItem; setSelectedEventId: (id: string) => void }) {
  const [form, setForm] = useState({ name: '', phone: '', address: '', preferences: '' })
  const [loginPhone, setLoginPhone] = useState('')
  const [photo, setPhoto] = useState('')
  const [ride, setRide] = useState<RideType>('Só ida')
  const [origin, setOrigin] = useState('Minha localização')
  const [vehicle, setVehicle] = useState('O mais rápido disponível')
  const [cart, setCart] = useState<string[]>([])

  async function uploadPhoto(file?: File) { if (file) setPhoto(await readFile(file)) }
  function registerUser() {
    if (!form.name || !form.phone) return alert('Preencha nome e WhatsApp.')
    const account: UserAccount = { id: uid(), ...form, photo, points: 0, createdAt: now() }
    updateDb({ ...db, users: [...db.users, account] })
    setActiveUserId(account.id)
  }
  function loginUser() {
    const account = db.users.find((u) => u.phone === loginPhone)
    if (!account) return alert('Usuário não encontrado. Faça cadastro primeiro.')
    setActiveUserId(account.id)
  }
  function requestRide() {
    if (!user) return alert('Faça cadastro/login de usuário para solicitar transporte.')
    if (!selectedEvent) return alert('Escolha um evento.')
    const request: RideRequest = { id: uid(), userId: user.id, userName: user.name, userPhone: user.phone, eventId: selectedEvent.id, eventName: selectedEvent.name, origin, destination: selectedEvent.address, type: ride, vehiclePreference: vehicle, status: 'Pendente', createdAt: now() }
    updateDb({ ...db, rides: [...db.rides, request] })
    alert('Solicitação enviada para motoristas disponíveis. Quando um motorista aceitar, você verá nome, veículo, placa, avaliação e contato protegido.')
  }
  function finishOrder() {
    if (!user) return alert('Faça cadastro/login para reservar ou comprar.')
    if (!selectedEvent) return alert('Escolha um evento.')
    if (!cart.length) return alert('Selecione itens do cardápio.')
    const total = cart.reduce((sum, item) => sum + priceNumber(item), 0)
    const order: OrderItem = { id: uid(), userId: user.id, userName: user.name, eventId: selectedEvent.id, eventName: selectedEvent.name, partnerWhatsapp: selectedEvent.partnerWhatsapp, items: cart, total, status: 'Reserva enviada', createdAt: now() }
    updateDb({ ...db, orders: [...db.orders, order] })
    alert(`Pedido enviado para o estabelecimento. Total estimado: ${money(total)}. Na versão com WhatsApp API, isso dispara mensagem automática.`)
  }

  const myRides = user ? db.rides.filter((rideItem) => rideItem.userId === user.id) : []

  return <section className="workspace">
    <PanelTitle eyebrow="Cliente / usuário final" title="Cadastro real, perfil privado e jornada de descoberta." text="O usuário se identifica, escolhe evento, compra/reserva e solicita transporte com segurança." />
    {!user ? <div className="grid two">
      <Card title="Criar cadastro do usuário"><input placeholder="Nome completo" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /><input placeholder="WhatsApp" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /><input placeholder="Endereço residencial" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /><input placeholder="Preferências: música, gastronomia, ambiente..." value={form.preferences} onChange={(e) => setForm({ ...form, preferences: e.target.value })} /><input type="file" accept="image/*" onChange={(e) => uploadPhoto(e.target.files?.[0])} />{photo && <img className="preview" src={photo} alt="Prévia do perfil" />}<button className="primary full" onClick={registerUser}>Criar perfil privado</button></Card>
      <Card title="Entrar com usuário existente"><input placeholder="WhatsApp cadastrado" value={loginPhone} onChange={(e) => setLoginPhone(e.target.value)} /><button className="secondary full" onClick={loginUser}>Entrar</button><p className="muted">Neste MVP web os dados ficam salvos no navegador. Com Supabase, viram login real na nuvem.</p></Card>
    </div> : <div className="user-badge"><div>{user.photo && <img src={user.photo} alt="Perfil" />}<strong>{user.name}</strong><span>{user.phone} • {user.address}</span></div><button className="ghost" onClick={() => setActiveUserId('')}>Sair</button></div>}

    <div className="category-row">{categories.map((cat) => <button key={cat} className={cat === category ? 'active' : ''} onClick={() => setCategory(cat)}>{cat}</button>)}</div>
    <div className="grid three">{events.map((event) => <button className={`event-card ${selectedEvent?.id === event.id ? 'active' : ''}`} key={event.id} onClick={() => setSelectedEventId(event.id)}>{event.photo ? <img src={event.photo} alt={event.name} /> : <div className="fake-photo" />}<strong>{event.name}</strong><span>{event.address}</span><small>{event.dateTime} • Lotação {event.crowd}%</small></button>)}</div>

    {selectedEvent && <div className="grid two align-start"><Card title="Evento selecionado"><h3>{selectedEvent.name}</h3><p>{selectedEvent.description}</p><p><b>Endereço:</b> {selectedEvent.address}</p><p><b>Vibe:</b> {selectedEvent.vibe} • <b>Cashback:</b> {selectedEvent.cashback}% • <b>Check-ins:</b> {selectedEvent.metrics.checkins}</p><div className="chips">{[...selectedEvent.combos, ...selectedEvent.drinks, ...selectedEvent.promos, ...selectedEvent.menu].map((item) => <button key={item} onClick={() => setCart([...cart, item])}>{item}</button>)}</div><button className="primary full" onClick={finishOrder}>Finalizar compra/reserva e enviar ao estabelecimento</button></Card>
      <Card title="Transporte seguro"><div className="modal-options">{rideTypes.map((item) => <button key={item} className={ride === item ? 'active' : ''} onClick={() => setRide(item)}>{item}</button>)}</div><input placeholder="Localização de saída" value={origin} onChange={(e) => setOrigin(e.target.value)} /><input disabled value={`Destino: ${selectedEvent.address}`} /><div className="modal-options"><button className={vehicle === 'Prefiro carro' ? 'active' : ''} onClick={() => setVehicle('Prefiro carro')}>Carro</button><button className={vehicle === 'Prefiro moto' ? 'active' : ''} onClick={() => setVehicle('Prefiro moto')}>Moto</button><button className={vehicle === 'O mais rápido disponível' ? 'active' : ''} onClick={() => setVehicle('O mais rápido disponível')}>Mais rápido</button></div><button className="secondary full" onClick={requestRide}>Solicitar agora</button></Card></div>}

    <div className="grid two"><Card title="Minha lista de compra/reserva">{cart.length ? cart.map((item) => <div className="cart-row" key={item}><span>{item}</span><button onClick={() => setCart(cart.filter((x) => x !== item))}>remover</button></div>) : <p className="muted">Nenhum item selecionado.</p>}</Card><Card title="Minhas corridas">{myRides.length ? myRides.map((rideItem) => <div className="ride-row" key={rideItem.id}><b>{rideItem.eventName}</b><span>{rideItem.type} • {rideItem.status}</span>{rideItem.status === 'Aceita' && <small>Motorista: {rideItem.driverName} • {rideItem.driverVehicle} • Placa {rideItem.driverPlate} • Avaliação {rideItem.driverRating}⭐ • Contato protegido: {rideItem.driverPhone}</small>}</div>) : <p className="muted">Sem solicitações ainda.</p>}</Card></div>
  </section>
}

function PartnerArea({ db, updateDb, partner, setActivePartnerId }: { db: Database; updateDb: (d: Database) => void; partner?: PartnerAccount; setActivePartnerId: (id: string) => void }) {
  const [login, setLogin] = useState({ whatsapp: '', password: '' })
  const [register, setRegister] = useState({ owner: '', businessName: '', category: '', whatsapp: '', address: '', password: '' })
  const [photo, setPhoto] = useState('')
  const [eventForm, setEventForm] = useState({ name: '', category: 'Bombando' as Category, dateTime: '', address: '', description: '', musicGenre: '', environment: '', crowd: 50, vibe: 'Acolhedor', cashback: 5, ticketType: 'Reserva', combos: '', drinks: '', promos: '', menu: '' })

  async function uploadPhoto(file?: File) { if (file) setPhoto(await readFile(file)) }
  function registerPartner() {
    if (!register.owner || !register.businessName || !register.whatsapp || !register.password) return alert('Preencha proprietário, negócio, WhatsApp e senha.')
    const account: PartnerAccount = { id: uid(), ...register, approved: true, createdAt: now() }
    updateDb({ ...db, partners: [...db.partners, account] })
    setActivePartnerId(account.id)
  }
  function loginPartner() {
    const account = db.partners.find((p) => p.whatsapp === login.whatsapp && p.password === login.password)
    if (!account) return alert('Parceiro não encontrado ou senha incorreta.')
    setActivePartnerId(account.id)
  }
  function publishEvent() {
    if (!partner) return
    if (!eventForm.name || !eventForm.address) return alert('Preencha nome do evento e endereço.')
    const event: EventItem = { id: uid(), partnerId: partner.id, partnerName: partner.businessName, partnerWhatsapp: partner.whatsapp, name: eventForm.name, category: eventForm.category, dateTime: eventForm.dateTime, address: eventForm.address, photo, description: eventForm.description, musicGenre: eventForm.musicGenre, environment: eventForm.environment, crowd: Number(eventForm.crowd), vibe: eventForm.vibe, cashback: Number(eventForm.cashback), ticketType: eventForm.ticketType, combos: splitLines(eventForm.combos), drinks: splitLines(eventForm.drinks), promos: splitLines(eventForm.promos), menu: splitLines(eventForm.menu), metrics: { reach: Math.floor(450 + Math.random() * 1800), views: Math.floor(200 + Math.random() * 900), checkins: Math.floor(20 + Math.random() * 180), clicks: Math.floor(50 + Math.random() * 300), sales: Math.floor(5 + Math.random() * 70), reactions: Math.floor(20 + Math.random() * 240) }, createdAt: now() }
    updateDb({ ...db, events: [event, ...db.events] })
    alert('Evento publicado no PulseAí e disponível para o usuário final.')
  }

  const myEvents = partner ? db.events.filter((event) => event.partnerId === partner.id) : []
  const myOrders = partner ? db.orders.filter((order) => myEvents.some((event) => event.id === order.eventId)) : []

  return <section className="workspace"><PanelTitle eyebrow="Área do parceiro" title="Painel do estabelecimento para publicar e vender com dados." text="Somente o parceiro com senha acessa o cadastro de eventos, cardápios, combos, promoções, métricas e pedidos." />
    {!partner ? <div className="grid two"><Card title="Cadastrar estabelecimento"><input placeholder="Proprietário / dono" value={register.owner} onChange={(e) => setRegister({ ...register, owner: e.target.value })} /><input placeholder="Nome do negócio" value={register.businessName} onChange={(e) => setRegister({ ...register, businessName: e.target.value })} /><input placeholder="Categoria: bar, restaurante, pub..." value={register.category} onChange={(e) => setRegister({ ...register, category: e.target.value })} /><input placeholder="WhatsApp de recebimento" value={register.whatsapp} onChange={(e) => setRegister({ ...register, whatsapp: e.target.value })} /><input placeholder="Endereço" value={register.address} onChange={(e) => setRegister({ ...register, address: e.target.value })} /><input type="password" placeholder="Senha de acesso" value={register.password} onChange={(e) => setRegister({ ...register, password: e.target.value })} /><button className="primary full" onClick={registerPartner}>Criar acesso do parceiro</button></Card><Card title="Login do parceiro"><input placeholder="WhatsApp" value={login.whatsapp} onChange={(e) => setLogin({ ...login, whatsapp: e.target.value })} /><input type="password" placeholder="Senha" value={login.password} onChange={(e) => setLogin({ ...login, password: e.target.value })} /><button className="secondary full" onClick={loginPartner}>Entrar no painel</button></Card></div> : <><div className="user-badge"><div><strong>{partner.businessName}</strong><span>{partner.owner} • {partner.whatsapp} • {partner.address}</span></div><button className="ghost" onClick={() => setActivePartnerId('')}>Sair</button></div><div className="dashboard-grid"><article><small>Alcance</small><strong>{myEvents.reduce((s, e) => s + e.metrics.reach, 0)}</strong></article><article><small>Visualizações</small><strong>{myEvents.reduce((s, e) => s + e.metrics.views, 0)}</strong></article><article><small>Check-ins</small><strong>{myEvents.reduce((s, e) => s + e.metrics.checkins, 0)}</strong></article><article><small>Vendas/reservas</small><strong>{myOrders.length}</strong></article></div>
      <div className="grid two align-start"><Card title="Cadastrar novo evento"><input placeholder="Nome do evento" value={eventForm.name} onChange={(e) => setEventForm({ ...eventForm, name: e.target.value })} /><select value={eventForm.category} onChange={(e) => setEventForm({ ...eventForm, category: e.target.value as Category })}>{categories.map((cat) => <option key={cat}>{cat}</option>)}</select><input placeholder="Data e horário" value={eventForm.dateTime} onChange={(e) => setEventForm({ ...eventForm, dateTime: e.target.value })} /><input placeholder="Endereço" value={eventForm.address} onChange={(e) => setEventForm({ ...eventForm, address: e.target.value })} /><input type="file" accept="image/*" onChange={(e) => uploadPhoto(e.target.files?.[0])} />{photo && <img className="preview event-preview" src={photo} alt="Foto do evento" />}<textarea placeholder="Descrição" value={eventForm.description} onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })} /><input placeholder="Gênero musical" value={eventForm.musicGenre} onChange={(e) => setEventForm({ ...eventForm, musicGenre: e.target.value })} /><input placeholder="Tipo de ambiente" value={eventForm.environment} onChange={(e) => setEventForm({ ...eventForm, environment: e.target.value })} /><input type="number" placeholder="Lotação estimada %" value={eventForm.crowd} onChange={(e) => setEventForm({ ...eventForm, crowd: Number(e.target.value) })} /><input placeholder="Vibe" value={eventForm.vibe} onChange={(e) => setEventForm({ ...eventForm, vibe: e.target.value })} /><input type="number" placeholder="Cashback %" value={eventForm.cashback} onChange={(e) => setEventForm({ ...eventForm, cashback: Number(e.target.value) })} /><input placeholder="Ingresso ou reserva" value={eventForm.ticketType} onChange={(e) => setEventForm({ ...eventForm, ticketType: e.target.value })} /><button className="primary full" onClick={publishEvent}>Publicar evento</button></Card>
      <Card title="Cardápio, combos e promoções"><textarea placeholder="Combos — um por linha" value={eventForm.combos} onChange={(e) => setEventForm({ ...eventForm, combos: e.target.value })} /><textarea placeholder="Bebidas — uma por linha" value={eventForm.drinks} onChange={(e) => setEventForm({ ...eventForm, drinks: e.target.value })} /><textarea placeholder="Promoções — uma por linha" value={eventForm.promos} onChange={(e) => setEventForm({ ...eventForm, promos: e.target.value })} /><textarea placeholder="Cardápio — um item por linha" value={eventForm.menu} onChange={(e) => setEventForm({ ...eventForm, menu: e.target.value })} /><p className="muted">Cada linha aparece como item selecionável para compra/reserva pelo usuário.</p></Card></div>
      <div className="grid two"><Card title="Meus eventos publicados">{myEvents.length ? myEvents.map((event) => <div className="event-line" key={event.id}><b>{event.name}</b><span>{event.category} • {event.address}</span><small>Alcance {event.metrics.reach} • Views {event.metrics.views} • Check-ins {event.metrics.checkins} • Cliques {event.metrics.clicks} • Vendas {event.metrics.sales} • Reações {event.metrics.reactions}</small></div>) : <p className="muted">Nenhum evento publicado.</p>}</Card><Card title="Pedidos recebidos">{myOrders.length ? myOrders.map((order) => <div className="event-line" key={order.id}><b>{order.userName}</b><span>{order.eventName}</span><small>{order.items.join(' | ')} • {money(order.total)}</small></div>) : <p className="muted">Sem pedidos ainda.</p>}</Card></div></>}
  </section>
}

function DriverArea({ db, updateDb, driver, setActiveDriverId }: { db: Database; updateDb: (d: Database) => void; driver?: DriverAccount; setActiveDriverId: (id: string) => void }) {
  const [login, setLogin] = useState({ phone: '', password: '' })
  const [form, setForm] = useState({ name: '', phone: '', vehicleType: 'Carro', vehicleModel: '', plate: '', city: '', password: '' })
  const [availability, setAvailability] = useState<RideType[]>(['Só ida', 'Só volta', 'Ida + volta'])
  function registerDriver() {
    if (!form.name || !form.phone || !form.plate || !form.password) return alert('Preencha nome, WhatsApp, placa e senha.')
    const account: DriverAccount = { id: uid(), ...form, availability, online: true, rating: 4.9, createdAt: now() }
    updateDb({ ...db, drivers: [...db.drivers, account] })
    setActiveDriverId(account.id)
  }
  function loginDriver() {
    const account = db.drivers.find((d) => d.phone === login.phone && d.password === login.password)
    if (!account) return alert('Motorista não encontrado ou senha incorreta.')
    setActiveDriverId(account.id)
  }
  function toggleOnline() {
    if (!driver) return
    updateDb({ ...db, drivers: db.drivers.map((d) => d.id === driver.id ? { ...d, online: !d.online } : d) })
  }
  function acceptRide(rideId: string) {
    if (!driver) return
    updateDb({ ...db, rides: db.rides.map((ride) => ride.id === rideId ? { ...ride, status: 'Aceita', driverId: driver.id, driverName: driver.name, driverPhone: driver.phone, driverVehicle: `${driver.vehicleType} ${driver.vehicleModel}`, driverPlate: driver.plate, driverRating: driver.rating } : ride) })
    alert('Corrida aceita. O usuário agora vê seus dados protegidos: nome, veículo, placa, avaliação e contato.')
  }
  const availableRides = db.rides.filter((ride) => ride.status === 'Pendente' && (!driver || driver.availability.includes(ride.type)))
  const myRides = driver ? db.rides.filter((ride) => ride.driverId === driver.id) : []

  return <section className="workspace"><PanelTitle eyebrow="Área do motorista" title="Motorista online, solicitações e aceite de corrida." text="O motorista entra, informa dados, fica online, recebe solicitações compatíveis e aceita corrida com segurança." />
    {!driver ? <div className="grid two"><Card title="Cadastrar motorista"><input placeholder="Nome completo" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /><input placeholder="WhatsApp" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /><select value={form.vehicleType} onChange={(e) => setForm({ ...form, vehicleType: e.target.value })}><option>Carro</option><option>Moto</option></select><input placeholder="Modelo do veículo" value={form.vehicleModel} onChange={(e) => setForm({ ...form, vehicleModel: e.target.value })} /><input placeholder="Placa" value={form.plate} onChange={(e) => setForm({ ...form, plate: e.target.value })} /><input placeholder="Cidade" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /><div className="modal-options">{rideTypes.map((type) => <button key={type} className={availability.includes(type) ? 'active' : ''} onClick={() => setAvailability(availability.includes(type) ? availability.filter((item) => item !== type) : [...availability, type])}>{type}</button>)}</div><input type="password" placeholder="Senha" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /><button className="primary full" onClick={registerDriver}>Criar acesso e ficar online</button></Card><Card title="Login do motorista"><input placeholder="WhatsApp" value={login.phone} onChange={(e) => setLogin({ ...login, phone: e.target.value })} /><input type="password" placeholder="Senha" value={login.password} onChange={(e) => setLogin({ ...login, password: e.target.value })} /><button className="secondary full" onClick={loginDriver}>Entrar</button></Card></div> : <><div className="user-badge"><div><strong>{driver.name}</strong><span>{driver.vehicleType} {driver.vehicleModel} • Placa {driver.plate} • {driver.city} • {driver.rating}⭐</span></div><button className={driver.online ? 'primary' : 'ghost'} onClick={toggleOnline}>{driver.online ? 'Online' : 'Offline'}</button><button className="ghost" onClick={() => setActiveDriverId('')}>Sair</button></div><div className="grid two"><Card title="Solicitações próximas">{availableRides.length ? availableRides.map((ride) => <div className="ride-row" key={ride.id}><b>{ride.userName}</b><span>{ride.eventName}</span><small>{ride.type} • Origem: {ride.origin} • Destino: {ride.destination} • Preferência: {ride.vehiclePreference}</small><button className="primary full" onClick={() => acceptRide(ride.id)}>Aceitar corrida</button></div>) : <p className="muted">Nenhuma solicitação pendente compatível.</p>}</Card><Card title="Minhas corridas aceitas">{myRides.length ? myRides.map((ride) => <div className="ride-row" key={ride.id}><b>{ride.eventName}</b><span>{ride.type} • {ride.status}</span><small>Passageiro: {ride.userName} • Contato protegido: {ride.userPhone}</small></div>) : <p className="muted">Você ainda não aceitou corridas.</p>}</Card></div></>}
  </section>
}

function AdminArea({ db, updateDb }: { db: Database; updateDb: (d: Database) => void }) {
  return <section className="workspace"><PanelTitle eyebrow="Admin 🔒" title="Controle geral da plataforma PulseAí." text="Área do dono do app para acompanhar usuários, parceiros, motoristas, eventos, pedidos, corridas, métricas e qualidade." />
    <div className="dashboard-grid"><article><small>Usuários</small><strong>{db.users.length}</strong></article><article><small>Parceiros</small><strong>{db.partners.length}</strong></article><article><small>Motoristas</small><strong>{db.drivers.length}</strong></article><article><small>Eventos</small><strong>{db.events.length}</strong></article><article><small>Pedidos</small><strong>{db.orders.length}</strong></article><article><small>Corridas</small><strong>{db.rides.length}</strong></article></div>
    <div className="grid two"><Card title="Eventos e métricas">{db.events.map((event) => <div className="event-line" key={event.id}><b>{event.name}</b><span>{event.partnerName} • {event.category}</span><small>Alcance {event.metrics.reach} • Views {event.metrics.views} • Check-ins {event.metrics.checkins} • Cliques {event.metrics.clicks} • Vendas {event.metrics.sales} • Reações {event.metrics.reactions}</small></div>)}</Card><Card title="Corridas em tempo real">{db.rides.length ? db.rides.map((ride) => <div className="ride-row" key={ride.id}><b>{ride.userName}</b><span>{ride.eventName} • {ride.status}</span><small>{ride.type} • {ride.origin} → {ride.destination} {ride.driverName ? `• Motorista: ${ride.driverName}` : ''}</small></div>) : <p className="muted">Sem corridas.</p>}</Card></div>
    <div className="actions"><button className="ghost" onClick={() => { localStorage.removeItem('pulseai_db'); updateDb({ ...defaultDb, events: demoEvents }) }}>Resetar base local do MVP</button></div>
  </section>
}

function PanelTitle({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return <div className="panel-title"><span className="pill">{eyebrow}</span><h2>{title}</h2><p>{text}</p></div>
}
function Card({ title, children }: { title: string; children: React.ReactNode }) { return <article className="panel-card"><h3>{title}</h3>{children}</article> }
function DownloadModal({ close }: { close: () => void }) { return <div className="modal-back"><div className="modal-card"><h2>Baixar PulseAí</h2><p>Escolha onde deseja baixar. No lançamento, os botões levam para as lojas oficiais do app.</p><div className="actions"><button className="primary" onClick={() => alert('Caminho Android / Google Play')}>Android / Google Play</button><button className="secondary" onClick={() => alert('Caminho iPhone / App Store')}>iPhone / App Store</button><button className="ghost" onClick={close}>Versão web</button><button className="ghost" onClick={close}>Fechar</button></div></div></div> }
function AdminLogin({ close, enter }: { close: () => void; enter: () => void }) { const [pass, setPass] = useState(''); return <div className="modal-back"><div className="modal-card"><h2>Admin 🔒 acesso restrito</h2><p>Digite a senha do dono para acessar a operação da plataforma.</p><input type="password" placeholder="Senha do dono" value={pass} onChange={(e) => setPass(e.target.value)} /><div className="actions"><button className="secondary" onClick={() => pass ? enter() : alert('Digite uma senha para simular o acesso.')}>Entrar</button><button className="ghost" onClick={close}>Fechar</button></div></div></div> }
