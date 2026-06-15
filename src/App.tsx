import { useMemo, useState } from 'react'
import { categories, experiences } from './data/seed'
import type { Category, Role } from './types'
import { getLocal, saveLocal } from './lib/storage'

export default function App() {
  const [role, setRole] = useState<Role>('visitor')
  const [category, setCategory] = useState<Category>('Bombando')
  const [query, setQuery] = useState('Will, onde e hoje?')
  const [tab, setTab] = useState('mapa')
  const [ride, setRide] = useState('So ida')
  const [reaction, setReaction] = useState('')
  const event = useMemo(() => experiences.find((item) => item.category === category) ?? experiences[0], [category])

  function askWill() {
    const q = query.toLowerCase()
    if (q.includes('infantil') || q.includes('crianca')) setCategory('Ambiente infantil')
    else if (q.includes('musica') || q.includes('show')) setCategory('Musica ao vivo')
    else setCategory('Bombando')
    setTab('evento')
    setRole('user')
  }

  function choose(cat: Category) {
    setCategory(cat)
    setTab('evento')
    setRole('user')
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <button className="brand" onClick={() => setRole('visitor')}><span className="logo" />PulseAi</button>
        <nav>{['visitor:Inicio','user:Usuario','partner:Negocios','driver:Motoristas','admin:Admin'].map((item) => { const [value,label] = item.split(':'); return <button key={value} className={role === value ? 'nav-active' : ''} onClick={() => setRole(value as Role)}>{label}</button> })}</nav>
      </header>

      {role === 'visitor' && <section className="hero"><div className="hero-copy"><span className="pill">MVP online publicado</span><h1>Onde a cidade <span>pulsa agora.</span></h1><p>Descubra experiencias, eventos, cardapios, combos, lotacao, transporte e vibe em tempo real.</p><p className="subcopy">Menos tempo procurando em stories. Mais tempo vivendo o melhor da cidade.</p><div className="actions"><button className="primary" onClick={() => setRole('user')}>Explorar hoje</button><button className="secondary" onClick={() => alert('Em breve na Google Play e App Store')}>Quero baixar</button><button className="ghost" onClick={askWill}>Perguntar ao Will</button></div><div className="stats"><article><strong>&lt; 4 min</strong><small>para decidir onde ir</small></article><article><strong>5%+</strong><small>cashback por check-in</small></article><article><strong>100%</strong><small>reacoes positivas</small></article></div></div><Phone event={event} query={query} setQuery={setQuery} category={category} choose={choose} tab={tab} setTab={setTab} askWill={askWill} ride={ride} setRide={setRide} /></section>}

      {role === 'user' && <section className="grid"><div className="panel floating-panel"><span className="pill">Para quem sai</span><h2>Descubra mais rapido. Escolha melhor. Chegue mais facil.</h2><p>Busque, filtre, reserve, reaja a vibe e programe seu transporte.</p><div className="search"><input value={query} onChange={(e) => setQuery(e.target.value)} /><button onClick={() => setQuery('')}>X</button><button onClick={askWill}>Buscar</button></div><div className="filters">{categories.map((cat) => <button key={cat} className={cat === category ? 'active' : ''} onClick={() => choose(cat)}>{cat}</button>)}</div></div><EventPanel event={event} ride={ride} setRide={setRide} reaction={reaction} setReaction={setReaction} /></section>}
      {role === 'partner' && <Partner />}
      {role === 'driver' && <Driver />}
      {role === 'admin' && <Admin />}
    </main>
  )
}

function Phone(props: any) {
  const { event, query, setQuery, category, choose, tab, setTab, askWill, ride, setRide } = props
  return <aside className="phone premium-phone"><div className="phone-top"><strong>PulseAi</strong><button onClick={() => setTab('mapa')}>menu</button></div><div className="phone-view">{tab === 'mapa' && <div className="phone-section"><div className="intro"><strong>Onde a cidade</strong><span>pulsa agora.</span><small>Will, onde e hoje?</small></div><div className="search phone-search"><input value={query} onChange={(e:any) => setQuery(e.target.value)} /><button onClick={() => setQuery('')}>X</button><button onClick={askWill}>Ir</button></div><div className="filters phone-filters">{categories.map((cat) => <button key={cat} className={cat === category ? 'active' : ''} onClick={() => choose(cat)}>{cat}</button>)}</div><div className="mini-map"><span className="pin pin-a"/><span className="pin pin-b"/><span className="pin pin-c"/><span className="pin pin-d"/></div><div className="will-card"><b>Will recomenda</b><p>{event.title} com {event.vibe.toLowerCase()}, cardapio e boa movimentacao.</p></div></div>}{tab === 'evento' && <MiniEvent event={event} />}{tab === 'transporte' && <div className="phone-section"><div className="will-card"><b>Seu plano de mobilidade</b><p>Escolha como quer ir e voltar.</p></div><div className="filters">{['So ida','So volta','Ida + volta'].map((item) => <button key={item} className={ride === item ? 'active' : ''} onClick={() => setRide(item)}>{item}</button>)}</div><button className="primary full">Solicitar corrida</button></div>}{tab === 'perfil' && <div className="phone-section"><div className="profile-card"><div className="avatar">W</div><h3>Will</h3><p>Perfil com preferencias, pontos e historico.</p></div></div>}</div><div className="phone-tabs">{['mapa','evento','transporte','perfil'].map((item) => <button key={item} className={tab === item ? 'tab-on' : ''} onClick={() => setTab(item)}>{item}</button>)}</div></aside>
}

function MiniEvent({ event }: any) { return <div className="phone-section"><div className="photo-card" style={{ background: event.imageGradient }}><span>{event.schedule}</span></div><div className="row-title"><strong>Acontecendo agora</strong><small>{event.distance}</small></div><h3>{event.title}</h3><p>{event.description}</p><div className="phone-metrics"><article><small>Lotacao</small><b>{event.crowd}%</b></article><article><small>Vibe</small><b>{event.vibe}</b></article><article><small>Cashback</small><b>{event.cashback}%</b></article><article><small>Check-ins</small><b>{event.checkins}</b></article></div><h4>Cardapio, combos e bebidas</h4><div className="phone-menu">{event.menu.map((item:any) => <button key={item.id}><span>{item.emoji}</span><b>{item.name}</b><em>{item.price}</em></button>)}</div><button className="primary full">Comprar combo / reservar</button></div> }

function EventPanel({ event, ride, setRide, reaction, setReaction }: any) { return <div className="panel premium-panel"><article className="event" style={{ background: event.imageGradient }}><small>{event.category} - {event.distance}</small><h2>{event.title}</h2><p>{event.description}</p></article><div className="metrics"><article><small>Lotacao</small><strong>{event.crowd}%</strong></article><article><small>Vibe</small><strong>{event.vibe}</strong></article><article><small>Cashback</small><strong>{event.cashback}%</strong></article><article><small>Check-ins</small><strong>{event.checkins}</strong></article></div><h3>Cardapio, combos e oportunidades</h3><div className="menu">{event.menu.map((item:any) => <button key={item.id}><span>{item.emoji}</span><div><b>{item.name}</b><small>{item.type}</small><em>{item.price}</em></div></button>)}</div><h3>Transporte flexivel</h3><div className="filters compact">{['So ida','So volta','Ida + volta'].map((item) => <button key={item} className={ride === item ? 'active' : ''} onClick={() => setRide(item)}>{item}</button>)}</div><button className="primary full">Solicitar corrida</button><h3>Reagir a vibe</h3><div className="filters compact">{['Bombando','Energia Alta','Acolhedor','Seguro','Atendimento Top','Publico Incrivel'].map((item) => <button key={item} className={reaction === item ? 'active' : ''} onClick={() => setReaction(item)}>{item}</button>)}</div><button className="secondary full">Enviar reacao</button></div> }

function Partner(){const [f,setF]=useState(()=>getLocal('partner',{name:'',category:'',instagram:'',address:''}));return <section className="grid"><div className="panel floating-panel"><span className="pill">Para negocios</span><h2>Pare de depender so de stories. Comece a vender com dados.</h2><input placeholder="Nome do negocio" value={f.name} onChange={(e)=>setF({...f,name:e.target.value})}/><input placeholder="Categoria" value={f.category} onChange={(e)=>setF({...f,category:e.target.value})}/><input placeholder="Instagram" value={f.instagram} onChange={(e)=>setF({...f,instagram:e.target.value})}/><input placeholder="Endereco" value={f.address} onChange={(e)=>setF({...f,address:e.target.value})}/><button className="primary full" onClick={()=>{saveLocal('partner',f);alert('Negocio enviado')}}>Enviar para aprovacao</button></div><div className="panel premium-panel"><h2>Dashboard premium</h2><div className="metrics"><article><strong>1.245</strong><small>views</small></article><article><strong>87</strong><small>check-ins</small></article><article><strong>42</strong><small>vouchers</small></article><article><strong>18%</strong><small>conversao</small></article></div></div></section>}
function Driver(){const [f,setF]=useState(()=>getLocal('driver',{name:'',phone:'',vehicle:'Carro',plate:''}));return <section className="grid"><div className="panel floating-panel"><span className="pill">Cadastro de motorista</span><h2>Corridas conectadas ao movimento da cidade.</h2><input placeholder="Nome" value={f.name} onChange={(e)=>setF({...f,name:e.target.value})}/><input placeholder="Telefone" value={f.phone} onChange={(e)=>setF({...f,phone:e.target.value})}/><select value={f.vehicle} onChange={(e)=>setF({...f,vehicle:e.target.value})}><option>Carro</option><option>Moto</option></select><input placeholder="Placa" value={f.plate} onChange={(e)=>setF({...f,plate:e.target.value})}/><button className="primary full" onClick={()=>{saveLocal('driver',f);alert('Motorista enviado')}}>Enviar cadastro</button></div><div className="panel premium-panel"><h2>Corridas proximas</h2><article className="ride">Evento para Centro - So volta - R$ 18 estimado</article></div></section>}
function Admin(){return <section className="grid"><div className="panel premium-panel"><h2>Painel admin</h2><div className="metrics"><article><strong>226</strong><small>usuarios</small></article><article><strong>18</strong><small>negocios</small></article><article><strong>34</strong><small>motoristas</small></article><article><strong>12</strong><small>eventos</small></article></div></div></section>}
