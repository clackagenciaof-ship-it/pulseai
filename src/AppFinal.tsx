import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { categories, experiences } from './data/seed'
import type { Category, Experience, MenuItem } from './types'

type Tab = 'explorar' | 'mapa' | 'pulse' | 'evento' | 'transporte' | 'favoritos' | 'perfil'
type Modal = 'baixar' | 'corrida' | 'compra' | 'checkin' | null
type EventOption = Experience & { location: string }

const icons: Record<Category, string> = { Bombando: '🔥', 'Musica ao vivo': '🎶', Gastronomia: '🍽️', Cultural: '🎭', 'Modo Relax': '🌙', 'Ambiente infantil': '🧸' }
const label = (c: Category) => c === 'Musica ao vivo' ? 'Música ao vivo' : c
const scroll = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
const priceNumber = (price: string) => Number(price.replace(/[^0-9]/g, '')) || 0

const quickQuestions = ['Will, onde é hoje?', 'Will, o que está bombando hoje?', 'Will, música ao vivo perto.', 'Will, gastronomia para petiscos.', 'Will, restaurante para jantar.', 'Will, combos e bebidas em conta.', 'Will, resenha com amigos.', 'Will, date a dois.']
const vibeReactions = ['🔥 Bombando', '⚡ Energia alta', '❤️ Acolhedor', '🛡️ Seguro', '👥 Público incrível', '😊 Atendimento top']

const optionsByCategory: Record<Category, Array<{ title: string; location: string; distance: string; schedule: string; vibe: string; description: string }>> = {
  Bombando: [
    { title: 'Noite de Samba no Boteco do Zé', location: 'Rua das Flores, Centro', distance: '1,8 km', schedule: 'Hoje, 20h às 02h', vibe: 'Energia alta', description: 'Samba ao vivo, combo ativo, cardápio publicado e lotação boa para chegar agora.' },
    { title: 'Pagode no Deck da Beira Rio', location: 'Av. Beira Rio, Centro', distance: '2,4 km', schedule: 'Hoje, 19h às 00h', vibe: 'Bombando', description: 'Ambiente animado, mesas abertas, bebidas promocionais e público chegando.' },
    { title: 'Happy Hour Forró & Amigos', location: 'Praça do Cruzeiro', distance: '1,1 km', schedule: 'Hoje, 18h às 23h', vibe: 'Público incrível', description: 'Forró, petiscos, promoções e clima bom para resenha com amigos.' }
  ],
  'Musica ao vivo': [
    { title: 'MPB Acústico no Pub Estação', location: 'Rua São Pedro, Centro', distance: '2,1 km', schedule: 'Hoje, 21h às 00h', vibe: 'Acolhedor', description: 'Show intimista, mesas disponíveis e ambiente acolhedor.' },
    { title: 'Voz e Violão no Terraço', location: 'Av. Bucar Neto', distance: '1,6 km', schedule: 'Hoje, 20h às 23h', vibe: 'Relax', description: 'Música leve, drinks, jantar e clima perfeito para conversar.' },
    { title: 'Rock ao Vivo no Galpão', location: 'Bairro Irapuá', distance: '3,0 km', schedule: 'Hoje, 22h às 02h', vibe: 'Energia alta', description: 'Banda local, entrada acessível e combos de bebidas.' }
  ],
  Gastronomia: [
    { title: 'Festival Sabores da Cidade', location: 'Mercado Central', distance: '1,4 km', schedule: 'Hoje, 19h às 23h', vibe: 'Familiar', description: 'Cardápio variado, preço acessível e boa opção para grupos.' },
    { title: 'Petiscos da Vila', location: 'Rua Coelho Rodrigues', distance: '900 m', schedule: 'Hoje, 18h às 23h', vibe: 'Acolhedor', description: 'Petiscos, cerveja gelada, combos em conta e atendimento rápido.' },
    { title: 'Jantar no Bistrô da Praça', location: 'Praça Dr. Sebastião Martins', distance: '1,7 km', schedule: 'Hoje, 19h às 22h', vibe: 'Date a dois', description: 'Ambiente bonito, pratos para casal e reserva antecipada.' }
  ],
  Cultural: [
    { title: 'Mostra Cultural no Teatro Cidade', location: 'Teatro Cidade Cenográfica', distance: '2,8 km', schedule: 'Hoje, 20h às 22h', vibe: 'Cultural', description: 'Programação cultural, entrada acessível e boa avaliação do público.' },
    { title: 'Sarau no Casarão', location: 'Centro Histórico', distance: '1,9 km', schedule: 'Hoje, 19h às 21h', vibe: 'Acolhedor', description: 'Poesia, música, café e encontro de artistas locais.' },
    { title: 'Feira Criativa na Praça', location: 'Praça da Matriz', distance: '1,3 km', schedule: 'Hoje, 17h às 22h', vibe: 'Cultural', description: 'Artesanato, comidas, apresentações e experiências para famílias.' }
  ],
  'Modo Relax': [
    { title: 'Lounge Mirante', location: 'Mirante da Cidade', distance: '1,2 km', schedule: 'Hoje, 18h às 01h', vibe: 'Relax', description: 'Vibe tranquila, lotação leve e ambiente confortável.' },
    { title: 'Café & Jazz no Jardim', location: 'Rua Bento Leão', distance: '2,0 km', schedule: 'Hoje, 18h às 22h', vibe: 'Acolhedor', description: 'Música baixa, cafés especiais e clima reservado.' },
    { title: 'Sunset na Varanda', location: 'Av. Frei Antônio Cúrcio', distance: '2,6 km', schedule: 'Hoje, 17h às 21h', vibe: 'Relax', description: 'Fim de tarde, drinks, vista bonita e movimento controlado.' }
  ],
  'Ambiente infantil': [
    { title: 'Espaço Kids & Games', location: 'Shopping da Cidade', distance: '3,2 km', schedule: 'Hoje, 17h às 22h', vibe: 'Infantil', description: 'Brinquedos, jogos, alimentação para famílias e espaço seguro.' },
    { title: 'Pizzaria com Playground', location: 'Av. Santos Dumont', distance: '2,5 km', schedule: 'Hoje, 18h às 23h', vibe: 'Familiar', description: 'Pizza, área kids, monitores e combo família.' },
    { title: 'Tarde de Jogos no Espaço Família', location: 'Bairro Manguinha', distance: '1,8 km', schedule: 'Hoje, 16h às 20h', vibe: 'Seguro', description: 'Jogos, lanches, espaço infantil e programação leve.' }
  ]
}

function categoryFromText(text: string): Category {
  const s = text.toLowerCase()
  if (s.includes('infantil') || s.includes('kids') || s.includes('criança')) return 'Ambiente infantil'
  if (s.includes('música') || s.includes('musica') || s.includes('show') || s.includes('ao vivo')) return 'Musica ao vivo'
  if (s.includes('gastro') || s.includes('comida') || s.includes('restaurante') || s.includes('petisco') || s.includes('jantar') || s.includes('bebida') || s.includes('combo')) return 'Gastronomia'
  if (s.includes('cultur') || s.includes('teatro')) return 'Cultural'
  if (s.includes('relax') || s.includes('tranquil') || s.includes('date') || s.includes('a dois')) return 'Modo Relax'
  return 'Bombando'
}

function optionsFor(category: Category): EventOption[] {
  const base = experiences.find((item) => item.category === category) ?? experiences[0]
  return optionsByCategory[category].map((item, index) => ({
    ...base,
    id: `${base.id}-${index}`,
    title: item.title,
    location: item.location,
    distance: item.distance,
    schedule: item.schedule,
    vibe: item.vibe,
    crowd: Math.max(25, Math.min(95, base.crowd + index * 9 - 3)),
    checkins: Math.max(18, base.checkins + index * 22 - 8),
    description: item.description,
    menu: base.menu.map((menuItem) => ({ ...menuItem, id: `${menuItem.id}-${index}` }))
  }))
}

function PulseLogo({ small = false }: { small?: boolean }) {
  return <span className={small ? 'pulse-mark small' : 'pulse-mark'}><span className="wave"><i /><i /><i /><i /><i /></span></span>
}

export default function AppFinal() {
  const [cat, setCat] = useState<Category>('Bombando')
  const [selected, setSelected] = useState(0)
  const [tab, setTab] = useState<Tab>('explorar')
  const [q, setQ] = useState('Will, onde é hoje?')
  const [ride, setRide] = useState('Só ida')
  const [react, setReact] = useState('')
  const [panel, setPanel] = useState(false)
  const [modal, setModal] = useState<Modal>(null)
  const [cart, setCart] = useState<MenuItem[]>([])
  const options = useMemo(() => optionsFor(cat), [cat])
  const ev = options[selected] ?? options[0]

  function choose(c: Category) { setCat(c); setSelected(0); setTab('mapa'); setPanel(false); scroll('top') }
  function ask(text = q) { setQ(text); choose(categoryFromText(text)) }
  function addMenu(item: MenuItem) { setCart((current) => [...current, item]); setModal('compra') }

  return <main className="app-shell">
    <header className="topbar">
      <button className="brand" onClick={() => scroll('top')}><PulseLogo /><strong>PulseAí</strong></button>
      <nav>
        <button type="button">Para quem sai</button>
        <button type="button">Para negócios</button>
        <button type="button">Cadastro de motorista</button>
        <button type="button">Admin 🔒</button>
        <button className="download-top" onClick={() => setModal('baixar')}>Quero baixar</button>
      </nav>
    </header>

    <section className="hero" id="top">
      <div className="hero-copy"><span className="pill">MVP online publicado</span><h1>Onde a cidade <span>pulsa agora.</span></h1><p>Descubra o que está rolando em tempo real, veja lotação, cardápio, bebidas, combos, promoções e programe sua ida, sua volta ou sua ida + volta em uma experiência bonita, simples e pronta para virar hábito.</p><p className="subcopy">PulseAí não mostra só onde é hoje. Ele mostra onde a vida urbana realmente acontece — e te leva até lá.</p><div className="actions"><button className="primary" onClick={() => { setTab('explorar'); scroll('top') }}>Explorar agora</button><button className="secondary" onClick={() => setModal('baixar')}>Quero baixar</button><button className="ghost" onClick={() => ask('Will, onde é hoje?')}>Perguntar ao Will</button></div><div className="stats"><article><strong>&lt; 4 min</strong><small>para decidir onde ir com confiança</small></article><article><strong>5%+</strong><small>de cashback e pontos por check-in</small></article><article><strong>100%</strong><small>reações coletivas, positivas e anônimas</small></article></div></div>
      <Phone ev={ev} options={options} selected={selected} setSelected={setSelected} cat={cat} choose={choose} tab={tab} setTab={setTab} q={q} setQ={setQ} ask={ask} ride={ride} setRide={setRide} react={react} setReact={setReact} panel={panel} setPanel={setPanel} open={setModal} addMenu={addMenu} />
    </section>

    <DashboardPreview ev={ev} ask={ask} setTab={setTab} />
    <Section id="quem-sai" eyebrow="Para quem sai" title={<><span>Descubra mais rápido.</span> Escolha melhor.<br />Chegue mais fácil.</>} text="O app mostra o que está acontecendo agora, filtra por música, ambiente e vibe, exibe lotação estimada, cardápio, promoções, combos, compra antecipada e transporte." cards={[["🗺️", "Mapa como tela principal", "Abra o app e veja a cidade acontecendo em tempo real."], ["🎟️", "Evento completo", "Foto, detalhes, lotação, cardápio, combos, cashback e voucher."], ["🚘", "Transporte flexível", "Solicite só ida, só volta ou ida + volta."]]} cta="Baixar o app agora" onCta={() => setModal('baixar')} />
    <Section id="negocios" eyebrow="Para negócios" title={<>Pare de depender só de stories.<br /><span>Comece a vender com dados.</span></>} text="Para bares, restaurantes, casas de show e produtores: visibilidade geolocalizada, publicação autônoma, combos, cardápio, métricas reais, WhatsApp e Instagram." cards={[["📍", "Apareça para quem está perto", "Seu evento surge para quem está pronto para decidir."], ["📊", "Saiba quantos viram", "Visualizações, cliques, check-ins, vouchers e conversão."], ["💬", "Automatize a divulgação", "Confirmações, lembretes e relatórios."]]} cta="Quero cadastrar meu negócio" onCta={() => scroll('negocios')} />
    <Section id="motoristas" eyebrow="Cadastro de motorista" title={<>Corridas conectadas à <span>movimentação da cidade.</span></>} text="Motoristas de carro e moto recebem solicitações ligadas aos eventos, bares, restaurantes e experiências da cidade." cards={[["🚘", "Carro ou moto", "Cadastro de condutor, veículo, placa, cidade, documentos e horários."], ["📍", "Geolocalização", "Origem, destino, tipo de solicitação, status, rota e operação."]]} cta="Quero me cadastrar como motorista" onCta={() => scroll('motoristas')} extraClass="motorista-section" />
    <footer className="public-section" style={{ paddingTop: 20 }}><div className="cta-box"><strong>PulseAí — Onde a vida urbana acontece de verdade.</strong><p>Direitos reservados • Clack Growth Company</p></div></footer>
    <ModalBox modal={modal} setModal={setModal} event={ev} ride={ride} setRide={setRide} cart={cart} clearCart={() => setCart([])} />
  </main>
}

function Phone({ ev, options, selected, setSelected, cat, choose, tab, setTab, q, setQ, ask, ride, setRide, react, setReact, panel, setPanel, open, addMenu }: { ev: EventOption; options: EventOption[]; selected: number; setSelected: (i: number) => void; cat: Category; choose: (c: Category) => void; tab: Tab; setTab: (t: Tab) => void; q: string; setQ: (v: string) => void; ask: (text?: string) => void; ride: string; setRide: (r: string) => void; react: string; setReact: (v: string) => void; panel: boolean; setPanel: (v: boolean) => void; open: (m: Modal) => void; addMenu: (item: MenuItem) => void }) {
  return <aside className="phone"><div className="phone-inner"><div className="phone-top"><strong>PulseAí</strong><button className="menu-icon" onClick={() => setPanel(true)}>☰</button></div><div className="phone-view">
    {panel && <div className="quick-panel"><h3>Painel <span>pulsa agora.</span></h3>{[['explorar', '⌂ Explorar agora'], ['mapa', '⌖ Mapa urbano'], ['pulse', '◎ Pulso da cidade'], ['evento', '🎟️ Evento em destaque'], ['transporte', '🚘 Programar transporte'], ['favoritos', '♡ Favoritos'], ['perfil', '👤 Meu perfil']].map(([key, text]) => <button key={key} onClick={() => { setPanel(false); setTab(key as Tab) }}>{text}</button>)}<button onClick={() => open('baixar')}>✨ Pulse+ benefícios</button><button onClick={() => setPanel(false)}>Fechar painel</button></div>}
    {tab === 'explorar' && <section className="phone-section app-start"><div className="intro-card"><small>Onde a cidade</small><span>pulsa agora.</span><b>Abra o mapa, pergunte ao Will ou escolha uma categoria.</b></div><div className="start-grid"><button onClick={() => setTab('mapa')}>🗺️ Explorar mapa</button><button onClick={() => ask('Will, onde é hoje?')}>💬 Falar com Will</button><button onClick={() => setTab('evento')}>🎟️ Ver evento</button><button onClick={() => setTab('transporte')}>🚘 Transporte</button></div><h4>Explore por categoria</h4><div className="category-grid">{categories.map((c) => <button key={c} className={c === cat ? 'active' : ''} onClick={() => choose(c)}><span>{icons[c]}</span>{label(c)}</button>)}</div><div className="will-card"><b>Hoje o PulseAí recomenda</b><p><strong>{ev.title}</strong><br />{ev.location} • {ev.distance}</p></div><h4>Bombando agora</h4><MiniCards options={options} setSelected={setSelected} setTab={setTab} /></section>}
    {tab === 'mapa' && <section className="phone-section"><div className="intro-card"><small>Onde a cidade</small><span>pulsa agora.</span><b>Descubra o que está rolando em tempo real</b></div><div className="search phone-search"><span>🔎</span><input value={q} onChange={(e) => setQ(e.target.value)} /><button onClick={() => setQ('')}>×</button><button onClick={() => ask(q)}>Ir</button></div><div className="quick-asks">{quickQuestions.map((text) => <button key={text} onClick={() => ask(text)}>{text}</button>)}</div><div className="category-grid">{categories.map((c) => <button key={c} className={c === cat ? 'active' : ''} onClick={() => choose(c)}><span>{icons[c]}</span>{label(c)}</button>)}</div><div className="mini-map"><i className="pin pin-a" /><i className="pin pin-b" /><i className="pin pin-c" /><i className="pin pin-d" /><small>{label(cat)} agora</small></div><div className="row-title"><strong>Acontecendo agora</strong><small>{ev.location} • {ev.distance}</small></div><div className="event-options">{options.map((item, index) => <button key={item.id} className={index === selected ? 'active' : ''} onClick={() => setSelected(index)}><b>{item.title}</b><span>{item.location} • {item.distance}</span><small>{item.schedule}</small></button>)}</div><div className="will-card"><b>Will responde</b><p><strong>{ev.title}</strong><br />{ev.description}</p></div><div className="actions"><button className="primary" onClick={() => setTab('evento')}>Ver evento</button><button className="ghost" onClick={() => setTab('transporte')}>Programar transporte</button></div></section>}
    {tab === 'pulse' && <section className="phone-section"><div className="pulse-now"><PulseLogo /><h3>Atualizando o pulso da cidade...</h3><div className="frequency"><i /><i /><i /><i /><i /><i /><i /></div><p>Mais check-ins, mais reações e recomendações em tempo real.</p></div><MiniCards options={options} setSelected={setSelected} setTab={setTab} /></section>}
    {tab === 'evento' && <section className="phone-section"><div className="photo-card" style={{ background: ev.imageGradient }}><span>{ev.schedule}</span></div><h3>{ev.title}</h3><p className="location-line">📍 {ev.location} • {ev.distance}</p><p>{ev.description}</p><div className="phone-metrics"><article><small>Lotação</small><b>{ev.crowd}%</b></article><article><small>Vibe</small><b>{ev.vibe}</b></article><article><small>Cashback</small><b>{ev.cashback}%</b></article><article><small>Check-ins</small><b>{ev.checkins}</b></article></div><h4>Cardápio, combos e bebidas</h4><div className="phone-menu">{ev.menu.map((i) => <button key={i.id} onClick={() => addMenu(i)}><span>{i.emoji}</span><b>{i.name}</b><small>{i.detail}</small><em>{i.price}</em></button>)}</div><button className="primary full" onClick={() => open('compra')}>Ver lista / reservar</button><h4>Reagir à vibe</h4><div className="reaction-list">{vibeReactions.map((v) => <button key={v} className={react === v ? 'active' : ''} onClick={() => setReact(v)}>{v}</button>)}</div><button className="secondary full" onClick={() => alert(react ? 'Reação enviada: ' + react : 'Escolha uma reação antes de enviar.')}>Enviar reação</button></section>}
    {tab === 'transporte' && <section className="phone-section"><div className="will-card"><b>Seu plano de mobilidade</b><p>Escolha só ida, só volta ou ida + volta.</p></div><div className="ride-options">{['Só ida', 'Só volta', 'Ida + volta'].map((r) => <button key={r} className={ride === r ? 'active' : ''} onClick={() => { setRide(r); open('corrida') }}>{r}</button>)}</div><div className="will-card"><b>Resumo da solicitação</b><p>Origem: minha localização<br />Destino: {ev.title}<br />Local: {ev.location}<br />Tipo: {ride}</p></div><button className="primary full" onClick={() => open('corrida')}>Solicitar agora</button></section>}
    {tab === 'favoritos' && <section className="phone-section"><div className="profile-card"><div className="avatar">♡</div><h3>Favoritos</h3><p>Eventos, lugares, combos e experiências salvas para decidir mais rápido.</p></div><MiniCards options={options} setSelected={setSelected} setTab={setTab} /></section>}
    {tab === 'perfil' && <section className="phone-section"><div className="profile-card"><div className="avatar">W</div><h3>Will</h3><p>Perfil privado com nome, telefone, endereço residencial, preferências, pontos e histórico quando houver.</p></div><button className="secondary full" onClick={() => open('checkin')}>Simular check-in</button></section>}
  </div><div className="phone-tabs"><button className={tab === 'explorar' ? 'tab-on' : ''} onClick={() => setTab('explorar')}><span>⌂</span>Explorar</button><button className={tab === 'mapa' ? 'tab-on' : ''} onClick={() => setTab('mapa')}><span>⌖</span>Mapa</button><button className={tab === 'pulse' ? 'tab-on pulse-on' : 'pulse-on'} onClick={() => setTab('pulse')}><span>◎</span>PulseAí</button><button className={tab === 'favoritos' ? 'tab-on' : ''} onClick={() => setTab('favoritos')}><span>♡</span>Favoritos</button><button className={tab === 'perfil' ? 'tab-on' : ''} onClick={() => setTab('perfil')}><span>♙</span>Perfil</button></div></div></aside>
}

function MiniCards({ options, setSelected, setTab }: { options: EventOption[]; setSelected: (i: number) => void; setTab: (t: Tab) => void }) {
  return <div className="horizontal-cards">{options.map((item, index) => <button key={item.id} onClick={() => { setSelected(index); setTab('evento') }}><span style={{ background: item.imageGradient }} /><b>{item.title}</b><small>{item.location} • {item.distance}</small></button>)}</div>
}

function DashboardPreview({ ev, ask, setTab }: { ev: EventOption; ask: (text: string) => void; setTab: (t: Tab) => void }) {
  return <section className="ecosystem"><span className="pill">Dashboard de descoberta</span><div className="dashboard-shell"><aside className="sidebar"><PulseLogo /><strong>PulseAí</strong>{['Explorar', 'Eventos', 'Música ao vivo', 'Gastronomia', 'Combos', 'Transporte', 'Check-ins', 'Favoritos', 'Perfil'].map((i) => <button key={i}>{i}</button>)}<div className="will-status"><PulseLogo small /><span>Will<br /><small>Assistente IA • Online</small></span></div></aside><div className="dash-main"><div className="dash-title"><h2>O que está rolando agora</h2><span>São Paulo, SP ▾</span></div><div className="dash-cards">{categories.slice(0, 5).map((c) => <article key={c}><b>{icons[c]} {label(c)}</b><small>dados em tempo real</small></article>)}</div><div className="dash-grid"><div className="big-event" style={{ background: ev.imageGradient }}><span className="live-badge">AO VIVO</span><h3>{ev.title}</h3><p>{ev.location}<br />{ev.schedule}</p><button onClick={() => setTab('evento')}>Quero ir</button></div><div className="side-list"><h3>Bombando agora</h3>{optionsByCategory.Bombando.map((x) => <button key={x.title} onClick={() => ask(x.title)}><span style={{ background: experiences[0].imageGradient }} /><b>{x.title}</b><small>{x.vibe} • {x.distance}</small></button>)}</div><div className="map-card"><h3>Perto de você</h3><div className="mini-map"><i className="pin pin-a" /><i className="pin pin-b" /><i className="pin pin-c" /></div><button onClick={() => setTab('mapa')}>Ver no mapa</button></div></div><div className="quick-actions"><button onClick={() => setTab('mapa')}>🗺️ Explorar o mapa</button><button onClick={() => ask('Will, onde é hoje?')}>💬 Falar com Will</button><button onClick={() => alert('Insights conectados ao painel administrativo.')}>📊 Ver insights da cidade</button></div></div></div></section>
}

function Section({ id, eyebrow, title, text, cards, cta, onCta, extraClass = '' }: { id: string; eyebrow: string; title: ReactNode; text: string; cards: string[][]; cta: string; onCta: () => void; extraClass?: string }) {
  return <section id={id} className={`public-section ${extraClass}`}><span className="pill">{eyebrow}</span><h2>{title}</h2><p>{text}</p><div className="public-cards">{cards.map(([i, t, p]) => <article key={t}><span>{i}</span><h3>{t}</h3><p>{p}</p></article>)}</div><div className="cta-box"><h3>{cta}</h3><p>Toque para seguir a jornada e abrir o próximo passo dentro da plataforma.</p><button className="secondary" onClick={onCta}>{cta}</button></div></section>
}

function CheckinReward() {
  return <article className="checkin-card"><h3>Check-in realizado!</h3><div className="radar"><i /><b>✓</b></div><strong>+25 pontos</strong><p>Você está contribuindo com a comunidade.</p><small>Nível 3 • Explorador</small><div className="xp"><span style={{ width: '60%' }} /></div></article>
}

function ModalBox({ modal, setModal, event, ride, setRide, cart, clearCart }: { modal: Modal; setModal: (m: Modal) => void; event: EventOption; ride: string; setRide: (r: string) => void; cart: MenuItem[]; clearCart: () => void }) {
  const [vehicle, setVehicle] = useState('Prefiro carro')
  const total = cart.reduce((sum, item) => sum + priceNumber(item.price), 0)
  if (!modal) return null
  const close = () => setModal(null)
  return <div className="modal-back"><div className="modal-card">
    {modal === 'baixar' && <><h2>Baixar PulseAí</h2><p>Escolha onde deseja baixar. No lançamento, os botões levam para as lojas oficiais do app.</p><div className="actions"><button className="primary" onClick={() => alert('Caminho Android / Google Play')}>Android / Google Play</button><button className="secondary" onClick={() => alert('Caminho iPhone / App Store')}>iPhone / App Store</button><button className="ghost" onClick={close}>Versão web</button></div></>}
    {modal === 'corrida' && <><h2>Solicitar transporte</h2><p>Preencha os dados da corrida para conectar sua ida, volta ou ida + volta ao movimento do evento.</p><input placeholder="Nome do passageiro" /><input placeholder="Localização de saída / origem" /><input placeholder={`Destino final: ${event.title} — ${event.location}`} /><div className="modal-options">{['Só ida', 'Só volta', 'Ida + volta'].map((item) => <button key={item} className={ride === item ? 'active' : ''} onClick={() => setRide(item)}>{item}</button>)}</div><div className="modal-options">{['Prefiro carro', 'Prefiro moto', 'O mais rápido disponível'].map((item) => <button key={item} className={vehicle === item ? 'active' : ''} onClick={() => setVehicle(item)}>{item}</button>)}</div><button className="primary full" onClick={() => alert(`Solicitação enviada aos motoristas próximos. Tipo: ${ride}. Veículo: ${vehicle}.`)}>Solicitar agora e notificar motorista</button></>}
    {modal === 'compra' && <><h2>Lista de compra / reserva</h2><p>Itens selecionados para <strong>{event.title}</strong>.</p>{cart.length === 0 ? <p>Nenhum item selecionado ainda. Toque em um item do cardápio.</p> : <div className="cart-list">{cart.map((item, index) => <div className="cart-row" key={`${item.id}-${index}`}><span>{item.name}</span><strong>{item.price}</strong></div>)}<div className="cart-total"><span>Total estimado</span><strong>R$ {total}</strong></div></div>}<button className="primary full" onClick={() => alert(`Compra/reserva enviada para o estabelecimento. Total: R$ ${total}.`)}>Finalizar compra e enviar ao estabelecimento</button><button className="ghost" onClick={clearCart}>Limpar lista</button></>}
    {modal === 'checkin' && <CheckinReward />}
    <button className="ghost full" onClick={close}>Fechar</button>
  </div></div>
}
