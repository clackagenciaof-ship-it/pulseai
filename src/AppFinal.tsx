import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { categories, experiences } from './data/seed'
import type { Category, Experience } from './types'

type Tab = 'mapa' | 'evento' | 'transporte' | 'perfil'
type Modal = 'baixar' | 'negocio' | 'motorista' | 'admin' | 'painel' | 'corrida' | 'compra' | null
type MenuItem = Experience['menu'][number]

const icons: Record<Category, string> = {
  Bombando: '🔥',
  'Musica ao vivo': '🎶',
  Gastronomia: '🍽️',
  Cultural: '🎭',
  'Modo Relax': '🌙',
  'Ambiente infantil': '🧸'
}

const vibes = ['Bombando 🔥', 'Energia Alta ⚡', 'Acolhedor 💜', 'Seguro 🛡️', 'Público Incrível ✨', 'Atendimento Top 👏']
const scroll = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
const priceNumber = (price: string) => Number(price.replace(/[^0-9]/g, '')) || 0

export default function AppFinal() {
  const [cat, setCat] = useState<Category>('Bombando')
  const [tab, setTab] = useState<Tab>('mapa')
  const [q, setQ] = useState('Will, onde é hoje?')
  const [ride, setRide] = useState('Só ida')
  const [react, setReact] = useState('')
  const [panel, setPanel] = useState(false)
  const [modal, setModal] = useState<Modal>(null)
  const [cart, setCart] = useState<MenuItem[]>([])
  const ev = useMemo(() => experiences.find((e) => e.category === cat) ?? experiences[0], [cat])

  function abrirApp() {
    setCat('Bombando')
    setTab('mapa')
    setPanel(false)
    setQ('Bombando agora')
    scroll('top')
  }

  function abrirWill() {
    setTab('mapa')
    setPanel(false)
    setQ('Will, onde é hoje?')
    scroll('top')
  }

  function choose(c: Category) {
    setCat(c)
    setTab('mapa')
    setPanel(false)
    scroll('top')
  }

  function will() {
    const s = q.toLowerCase()
    if (s.includes('infantil') || s.includes('kids') || s.includes('criança')) setCat('Ambiente infantil')
    else if (s.includes('música') || s.includes('musica') || s.includes('show') || s.includes('ao vivo')) setCat('Musica ao vivo')
    else if (s.includes('gastro') || s.includes('comida') || s.includes('restaurante') || s.includes('cardápio') || s.includes('cardapio')) setCat('Gastronomia')
    else if (s.includes('cultur') || s.includes('teatro')) setCat('Cultural')
    else if (s.includes('relax') || s.includes('tranquil')) setCat('Modo Relax')
    else setCat('Bombando')
    setTab('mapa')
    setPanel(false)
    scroll('top')
  }

  function abrirCorrida(tipo: string) {
    setRide(tipo)
    setModal('corrida')
  }

  function addMenu(item: MenuItem) {
    setCart((current) => [...current, item])
    setModal('compra')
  }

  return <main className="app-shell">
    <header className="topbar">
      <button className="brand" onClick={() => scroll('top')}><span className="logo" /><strong>PulseAí</strong></button>
      <nav>
        <button onClick={() => scroll('quem-sai')}>Para quem sai</button>
        <button onClick={() => scroll('negocios')}>Para negócios</button>
        <button onClick={() => scroll('motoristas')}>Cadastro de motorista</button>
        <button onClick={() => setModal('admin')}>Admin 🔒</button>
        <button className="download-top" onClick={() => setModal('baixar')}>Quero baixar</button>
      </nav>
    </header>

    <section className="hero" id="top">
      <div className="hero-copy">
        <h1>Onde a cidade <span>pulsa agora.</span></h1>
        <p>Descubra o que está rolando em tempo real, veja lotação, cardápio, bebidas, combos, promoções e programe sua ida, sua volta ou sua ida + volta em uma experiência bonita, simples e pronta para virar hábito.</p>
        <p className="subcopy">PulseAí não mostra só onde é hoje. Ele mostra onde a vida urbana realmente acontece — e te leva até lá.</p>
        <div className="actions">
          <button className="primary" onClick={abrirApp}>Explorar hoje</button>
          <button className="secondary" onClick={() => setModal('baixar')}>Quero baixar</button>
          <button className="ghost" onClick={abrirWill}>Perguntar ao Will</button>
        </div>
        <div className="stats">
          <article><strong>&lt; 4 min</strong><small>para decidir onde ir com confiança</small></article>
          <article><strong>5%+</strong><small>de cashback e pontos por check-in</small></article>
          <article><strong>100%</strong><small>reações coletivas, positivas e anônimas</small></article>
        </div>
      </div>
      <Phone ev={ev} cat={cat} choose={choose} tab={tab} setTab={setTab} q={q} setQ={setQ} will={will} abrirWill={abrirWill} ride={ride} abrirCorrida={abrirCorrida} react={react} setReact={setReact} panel={panel} setPanel={setPanel} open={setModal} addMenu={addMenu} />
    </section>

    <Section id="quem-sai" eyebrow="Para quem sai" title={<><span>Descubra mais rápido.</span> Escolha melhor.<br />Chegue mais fácil.</>} text="O app mostra o que está acontecendo agora, filtra por música, ambiente e vibe, exibe lotação estimada, cardápio, promoções, combos, compra antecipada e transporte." cards={[["🗺️", "Mapa como tela principal", "Abra o app e veja a cidade acontecendo em tempo real."], ["🎟️", "Evento completo", "Foto, detalhes, lotação, cardápio, combos, cashback e voucher."], ["🚘", "Transporte flexível", "Solicite só ida, só volta ou ida + volta."]]} cta="Quero baixar" onCta={() => setModal('baixar')} />
    <Section id="negocios" eyebrow="Para negócios" title={<>Pare de depender só de stories.<br /><span>Comece a vender com dados.</span></>} text="Para bares, restaurantes, casas de show e produtores: visibilidade geolocalizada, publicação autônoma, combos, cardápio, métricas reais, WhatsApp e Instagram." cards={[["📍", "Apareça para quem está perto", "Seu evento surge para quem está pronto para decidir."], ["📊", "Saiba quantos viram", "Visualizações, cliques, check-ins, vouchers e conversão."], ["💬", "Automatize a divulgação", "Confirmações, lembretes e relatórios."]]} cta="Quero cadastrar meu negócio" onCta={() => setModal('negocio')} />
    <Section id="motoristas" eyebrow="Cadastro de motorista" title={<>Corridas conectadas à <span>movimentação da cidade.</span></>} text="Motoristas de carro e moto recebem solicitações ligadas aos eventos, bares, restaurantes e experiências da cidade." cards={[["🚘", "Carro ou moto", "Cadastro de condutor, veículo, placa, cidade, documentos e horários."], ["📍", "Geolocalização", "Origem, destino, tipo de solicitação, status, rota e operação."]]} cta="Quero me cadastrar como motorista" onCta={() => setModal('motorista')} extraClass="motorista-section" />
    <footer className="public-section" style={{ paddingTop: 20 }}><div className="cta-box"><strong>PulseAí — Onde a vida urbana acontece de verdade.</strong><p>Direitos reservados • Clack Growth Company</p></div></footer>
    <ModalBox modal={modal} setModal={setModal} event={ev} ride={ride} setRide={setRide} cart={cart} clearCart={() => setCart([])} />
  </main>
}

function Phone({ ev, cat, choose, tab, setTab, q, setQ, will, abrirWill, ride, abrirCorrida, react, setReact, panel, setPanel, open, addMenu }: { ev: Experience; cat: Category; choose: (c: Category) => void; tab: Tab; setTab: (t: Tab) => void; q: string; setQ: (v: string) => void; will: () => void; abrirWill: () => void; ride: string; abrirCorrida: (tipo: string) => void; react: string; setReact: (v: string) => void; panel: boolean; setPanel: (v: boolean) => void; open: (m: Modal) => void; addMenu: (item: MenuItem) => void }) {
  return <aside className="phone"><div className="phone-inner">
    <div className="phone-top"><strong>PulseAí</strong><button className="menu-icon" onClick={() => setPanel(true)}>☰</button></div>
    <div className="phone-view">
      {panel && <div className="quick-panel"><h3>Painel <span>pulsa agora.</span></h3><button onClick={() => { setPanel(false); setTab('mapa') }}>🔎 Descobrir agora</button><button onClick={() => { setPanel(false); setTab('evento') }}>🎟️ Evento em destaque</button><button onClick={() => { setPanel(false); setTab('transporte') }}>🚘 Programar transporte</button><button onClick={abrirWill}>💬 Falar com Will</button><button onClick={() => { setPanel(false); setTab('perfil') }}>👤 Meu perfil</button><button onClick={() => open('baixar')}>✨ Pulse+ benefícios</button><button onClick={() => setPanel(false)}>Fechar painel</button></div>}
      {tab === 'mapa' && <section className="phone-section"><div className="intro-card"><small>Onde a cidade</small><span>pulsa agora.</span><b>Descubra o que está rolando em tempo real</b></div><div className="search phone-search"><span>🔎</span><input value={q} onChange={(e) => setQ(e.target.value)} onFocus={() => setTab('mapa')} /><button onClick={() => setQ('')}>×</button><button onClick={will}>🔎</button></div><div className="category-grid">{categories.map((c) => <button key={c} className={c === cat ? 'active' : ''} onClick={() => choose(c)}><span>{icons[c]}</span>{c}</button>)}</div><div className="mini-map"><i className="pin pin-a" /><i className="pin pin-b" /><i className="pin pin-c" /><i className="pin pin-d" /><small>{cat} agora</small></div><div className="row-title"><strong>Acontecendo agora</strong><small>{ev.distance}</small></div><div className="will-card"><b>Will responde</b><p><strong>{ev.title}</strong><br />{ev.description}</p></div><div className="actions"><button className="primary" onClick={() => setTab('evento')}>Ver evento</button><button className="ghost" onClick={() => setTab('transporte')}>Programar transporte</button></div></section>}
      {tab === 'evento' && <section className="phone-section"><div className="photo-card" style={{ background: ev.imageGradient }}><span>{ev.schedule}</span></div><h3>{ev.title}</h3><p>{ev.description}</p><div className="phone-metrics"><article><small>Lotação</small><b>{ev.crowd}%</b></article><article><small>Vibe</small><b>{ev.vibe}</b></article><article><small>Cashback</small><b>{ev.cashback}%</b></article><article><small>Check-ins</small><b>{ev.checkins}</b></article></div><h4>Cardápio, combos e bebidas</h4><div className="phone-menu">{ev.menu.map((i) => <button key={i.id} onClick={() => addMenu(i)}><span>{i.emoji}</span><b>{i.name}</b><em>{i.price}</em></button>)}</div><button className="primary full" onClick={() => open('compra')}>Ver lista / reservar</button><h4>Reagir à vibe</h4><div className="reaction-list">{vibes.map((v) => <button key={v} className={react === v ? 'active' : ''} onClick={() => setReact(v)}>{v}</button>)}</div><button className="secondary full" onClick={() => alert(react ? 'Reação enviada: ' + react : 'Escolha uma reação antes de enviar.')}>Enviar reação</button></section>}
      {tab === 'transporte' && <section className="phone-section"><div className="will-card"><b>Seu plano de mobilidade</b><p>Escolha só ida, só volta ou ida + volta. Ao tocar, você preenche origem, destino, nome e preferência de veículo.</p></div><div className="ride-options">{['Só ida', 'Só volta', 'Ida + volta'].map((r) => <button key={r} className={ride === r ? 'active' : ''} onClick={() => abrirCorrida(r)}>{r}</button>)}</div><div className="will-card"><b>Resumo da solicitação</b><p>Origem: minha localização<br />Destino: {ev.title}<br />Tipo: {ride}</p></div><button className="primary full" onClick={() => abrirCorrida(ride)}>Solicitar corrida</button></section>}
      {tab === 'perfil' && <section className="phone-section"><div className="profile-card"><div className="avatar">W</div><h3>Will</h3><p>Perfil privado com nome, telefone, endereço residencial, preferências, pontos e histórico quando houver.</p></div><div className="phone-metrics two"><article><small>Pontos</small><b>320</b></article><article><small>Cashback</small><b>R$ 18</b></article></div></section>}
    </div>
    <div className="phone-tabs"><button className={tab === 'mapa' ? 'tab-on' : ''} onClick={() => setTab('mapa')}><span>🗺️</span>Mapa</button><button className={tab === 'evento' ? 'tab-on' : ''} onClick={() => setTab('evento')}><span>🎟️</span>Evento</button><button className={tab === 'transporte' ? 'tab-on' : ''} onClick={() => setTab('transporte')}><span>🚘</span>Transporte</button><button className={tab === 'perfil' ? 'tab-on' : ''} onClick={() => setTab('perfil')}><span>👤</span>Perfil</button></div>
  </div></aside>
}

function Section({ id, eyebrow, title, text, cards, cta, onCta, extraClass = '' }: { id: string; eyebrow: string; title: ReactNode; text: string; cards: string[][]; cta: string; onCta: () => void; extraClass?: string }) {
  return <section id={id} className={`public-section ${extraClass}`}><span className="pill">{eyebrow}</span><h2>{title}</h2><p>{text}</p><div className="public-cards">{cards.map(([i, t, p]) => <article key={t}><span>{i}</span><h3>{t}</h3><p>{p}</p></article>)}</div><div className="cta-box"><h3>{cta}</h3><p>Toque para seguir a jornada e abrir o próximo passo dentro da plataforma.</p><button className="secondary" onClick={onCta}>{cta}</button></div></section>
}

function ModalBox({ modal, setModal, event, ride, setRide, cart, clearCart }: { modal: Modal; setModal: (m: Modal) => void; event: Experience; ride: string; setRide: (r: string) => void; cart: MenuItem[]; clearCart: () => void }) {
  const [pass, setPass] = useState('')
  const total = cart.reduce((sum, item) => sum + priceNumber(item.price), 0)
  if (!modal) return null
  const close = () => setModal(null)
  return <div className="modal-back"><div className="modal-card">
    {modal === 'baixar' && <><h2>Baixar PulseAí</h2><p>Escolha onde deseja baixar. No lançamento, os botões levam para as lojas oficiais do app.</p><div className="actions"><button className="primary" onClick={() => alert('Caminho Android / Google Play')}>Android / Google Play</button><button className="secondary" onClick={() => alert('Caminho iPhone / App Store')}>iPhone / App Store</button><button className="ghost" onClick={close}>Versão web</button><button className="ghost" onClick={close}>Fechar</button></div></>}
    {modal === 'negocio' && <><h2>Cadastro de negócio</h2><p>Preencha os dados do proprietário e do estabelecimento/promotor para aprovação.</p><input placeholder="Proprietário / responsável" /><input placeholder="Nome do negócio" /><input placeholder="Categoria" /><input placeholder="WhatsApp" /><input placeholder="Endereço" /><div className="actions"><button className="secondary" onClick={() => alert('Interesse do negócio registrado no MVP.')}>Enviar interesse</button><button className="ghost" onClick={close}>Fechar</button></div></>}
    {modal === 'motorista' && <><h2>Cadastro de motorista</h2><p>Informe dados do condutor, veículo, placa, cidade e disponibilidade.</p><input placeholder="Nome completo" /><input placeholder="WhatsApp" /><input placeholder="Carro ou moto" /><input placeholder="Placa" /><input placeholder="Cidade" /><div className="actions"><button className="primary" onClick={() => alert('Pré-cadastro de motorista registrado no MVP.')}>Enviar pré-cadastro</button><button className="ghost" onClick={close}>Fechar</button></div></>}
    {modal === 'corrida' && <><h2>Solicitar transporte</h2><p>Preencha os dados da corrida para conectar sua ida, volta ou ida + volta ao movimento do evento.</p><input placeholder="Nome do passageiro" /><input placeholder="Localização de saída / origem" /><input placeholder={`Destino final: ${event.title}`} /><select value={ride} onChange={(e) => setRide(e.target.value)}><option>Só ida</option><option>Só volta</option><option>Ida + volta</option></select><select><option>Prefiro carro</option><option>Prefiro moto</option><option>O mais rápido disponível</option></select><div className="actions"><button className="primary" onClick={() => alert('Solicitação de transporte registrada no MVP.')}>Confirmar solicitação</button><button className="ghost" onClick={close}>Fechar</button></div></>}
    {modal === 'compra' && <><h2>Lista de compra / reserva</h2><p>Itens selecionados no cardápio de <strong>{event.title}</strong>.</p>{cart.length === 0 ? <p>Nenhum item selecionado ainda. Toque em um combo, bebida ou produto do cardápio.</p> : <div className="cart-list">{cart.map((item, index) => <div className="cart-row" key={`${item.id}-${index}`}><span>{item.name}</span><strong>{item.price}</strong></div>)}<div className="cart-total"><span>Total estimado</span><strong>R$ {total}</strong></div></div>}<div className="actions"><button className="primary" onClick={() => alert('Reserva/compra registrada no MVP.')}>Confirmar reserva / compra</button><button className="ghost" onClick={clearCart}>Limpar lista</button><button className="ghost" onClick={close}>Fechar</button></div></>}
    {modal === 'admin' && <><h2>Admin 🔒 acesso restrito</h2><p>Área exclusiva do dono do app. Digite uma senha para simular a entrada no painel administrativo.</p><input type="password" placeholder="Senha do dono" value={pass} onChange={(e) => setPass(e.target.value)} /><div className="actions"><button className="secondary" onClick={() => pass ? setModal('painel') : alert('Digite uma senha para simular o acesso.')}>Entrar</button><button className="ghost" onClick={close}>Fechar</button></div></>}
    {modal === 'painel' && <><h2>Painel admin liberado</h2><p>Controle de usuários, parceiros, motoristas, eventos ativos, aprovações, moderação, receitas e expansão.</p><div className="dashboard-grid"><article><small>Usuários</small><strong>226</strong></article><article><small>Negócios</small><strong>18</strong></article><article><small>Motoristas</small><strong>34</strong></article><article><small>Eventos</small><strong>12</strong></article></div><button className="primary" onClick={close}>Fechar painel</button></>}
  </div></div>
}
