import { useMemo, useState } from 'react'
import { categories, experiences } from './data/seed'
import type { Category, Role } from './types'
import { getLocal, saveLocal } from './lib/storage'

export default function App() {
  const [role, setRole] = useState<Role>('visitor')
  const [category, setCategory] = useState<Category>('Bombando')
  const [query, setQuery] = useState('Will, onde e hoje?')
  const [ride, setRide] = useState('So ida')
  const [reaction, setReaction] = useState('')
  const event = useMemo(() => experiences.find((item) => item.category === category) ?? experiences[0], [category])

  function askWill() {
    const q = query.toLowerCase()
    if (q.includes('infantil')) setCategory('Ambiente infantil')
    else if (q.includes('show') || q.includes('musica')) setCategory('Musica ao vivo')
    else setCategory('Bombando')
    setRole('user')
  }

  return (
    <main>
      <header className="topbar">
        <div className="brand"><span className="logo" />PulseAi</div>
        <nav>
          <button onClick={() => setRole('visitor')}>Inicio</button>
          <button onClick={() => setRole('user')}>Usuario</button>
          <button onClick={() => setRole('partner')}>Negocios</button>
          <button onClick={() => setRole('driver')}>Motoristas</button>
          <button onClick={() => setRole('admin')}>Admin</button>
        </nav>
      </header>

      {role === 'visitor' && <section className="hero"><div><h1>Onde a cidade <span>pulsa agora.</span></h1><p>Descubra experiencias, eventos, cardapios, combos, lotacao, transporte e vibe em tempo real.</p><div className="actions"><button className="primary" onClick={() => setRole('user')}>Explorar hoje</button><button className="secondary" onClick={() => alert('Em breve na Google Play e App Store')}>Quero baixar</button><button className="ghost" onClick={askWill}>Perguntar ao Will</button></div><div className="stats"><article><strong>&lt; 4 min</strong><small>para decidir onde ir</small></article><article><strong>5%+</strong><small>cashback por check-in</small></article><article><strong>100%</strong><small>reacoes positivas</small></article></div></div><PhoneIntro /></section>}

      {role === 'user' && <section className="grid"><div className="panel"><h2>Usuario final</h2><p>Busque, filtre, reserve e programe sua ida ou volta.</p><div className="search"><input value={query} onChange={(e) => setQuery(e.target.value)} /><button onClick={() => setQuery('')}>X</button><button onClick={askWill}>Buscar</button></div><div className="filters">{categories.map((cat) => <button className={cat === category ? 'active' : ''} onClick={() => setCategory(cat)} key={cat}>{cat}</button>)}</div></div><div className="panel"><article className="event" style={{ background: event.imageGradient }}><small>{event.category} - {event.distance}</small><h2>{event.title}</h2><p>{event.description}</p></article><div className="metrics"><article><small>Lotacao</small><strong>{event.crowd}%</strong></article><article><small>Vibe</small><strong>{event.vibe}</strong></article><article><small>Cashback</small><strong>{event.cashback}%</strong></article><article><small>Check-ins</small><strong>{event.checkins}</strong></article></div><h3>Cardapio e combos</h3><div className="menu">{event.menu.map((item) => <button key={item.id} onClick={() => alert(item.name + ' - ' + item.price)}><span>{item.emoji}</span><b>{item.name}</b><em>{item.price}</em></button>)}</div><h3>Transporte</h3><div className="filters">{['So ida','So volta','Ida + volta'].map((item) => <button className={ride === item ? 'active' : ''} onClick={() => setRide(item)} key={item}>{item}</button>)}</div><button className="primary" onClick={() => alert('Corrida solicitada: ' + ride)}>Solicitar corrida</button><h3>Reagir a vibe</h3><div className="filters">{['Bombando','Energia Alta','Acolhedor','Seguro','Publico Incrivel','Atendimento Top'].map((item) => <button className={reaction === item ? 'active' : ''} onClick={() => setReaction(item)} key={item}>{item}</button>)}</div><button className="secondary" onClick={() => alert(reaction ? 'Reacao enviada: ' + reaction : 'Escolha uma reacao')}>Enviar reacao</button></div></section>}

      {role === 'partner' && <Partner />}
      {role === 'driver' && <Driver />}
      {role === 'admin' && <Admin />}
    </main>
  )
}

function PhoneIntro() { return <div className="phone"><h2>PulseAi</h2><div className="intro"><strong>Onde a cidade</strong><span>pulsa agora.</span><small>Will, onde e hoje?</small></div><div className="filters">{categories.map((cat) => <button key={cat}>{cat}</button>)}</div></div> }

function Partner() { const [form,setForm]=useState(()=>getLocal('partner',{name:'',category:'',instagram:'',address:''})); return <section className="grid"><div className="panel"><h2>Negocios</h2><p>Cadastre estabelecimento, eventos, cardapios e combos.</p><input placeholder="Nome" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})}/><input placeholder="Categoria" value={form.category} onChange={(e)=>setForm({...form,category:e.target.value})}/><input placeholder="Instagram" value={form.instagram} onChange={(e)=>setForm({...form,instagram:e.target.value})}/><input placeholder="Endereco" value={form.address} onChange={(e)=>setForm({...form,address:e.target.value})}/><button className="primary" onClick={()=>{saveLocal('partner',form);alert('Negocio enviado para aprovacao')}}>Enviar para aprovacao</button></div><div className="panel"><h2>Metricas</h2><div className="metrics"><article><strong>1.245</strong><small>views</small></article><article><strong>87</strong><small>check-ins</small></article><article><strong>42</strong><small>vouchers</small></article><article><strong>18%</strong><small>conversao</small></article></div></div></section> }

function Driver() { const [form,setForm]=useState(()=>getLocal('driver',{name:'',phone:'',vehicle:'Carro',plate:''})); return <section className="grid"><div className="panel"><h2>Cadastro de motorista</h2><input placeholder="Nome" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})}/><input placeholder="Telefone" value={form.phone} onChange={(e)=>setForm({...form,phone:e.target.value})}/><select value={form.vehicle} onChange={(e)=>setForm({...form,vehicle:e.target.value})}><option>Carro</option><option>Moto</option></select><input placeholder="Placa" value={form.plate} onChange={(e)=>setForm({...form,plate:e.target.value})}/><button className="primary" onClick={()=>{saveLocal('driver',form);alert('Motorista enviado para aprovacao')}}>Enviar cadastro</button></div><div className="panel"><h2>Corridas</h2><article className="ride">Evento para Centro - So volta - R$ 18</article></div></section> }

function Admin() { const [ok,setOk]=useState(false); const [pass,setPass]=useState(''); if(!ok) return <section className="grid"><div className="panel"><h2>Admin</h2><input type="password" placeholder="Senha" value={pass} onChange={(e)=>setPass(e.target.value)}/><button className="secondary" onClick={()=>pass?setOk(true):alert('Digite a senha')}>Entrar</button></div></section>; return <section className="grid"><div className="panel"><h2>Painel admin</h2><div className="metrics"><article><strong>226</strong><small>usuarios</small></article><article><strong>18</strong><small>negocios</small></article><article><strong>34</strong><small>motoristas</small></article><article><strong>12</strong><small>eventos</small></article></div></div></section> }
