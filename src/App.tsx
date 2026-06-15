import { useMemo, useState } from 'react'
import { categories, experiences } from './data/seed'
import type { Category, Experience, Role } from './types'
import { getLocal, saveLocal } from './lib/storage'

type Page = 'home' | 'user' | 'business' | 'driver' | 'admin'
type PhoneTab = 'mapa' | 'evento' | 'transporte' | 'perfil' | 'agenda' | 'beneficios'

type PartnerForm = { name: string; category: string; instagram: string; address: string; phone: string }
type DriverForm = { name: string; phone: string; vehicle: string; plate: string; city: string }

const iconByCategory: Record<Category, string> = {
  Bombando: '🔥',
  'Musica ao vivo': '🎶',
  Gastronomia: '🍽️',
  Cultural: '🎭',
  'Modo Relax': '🌙',
  'Ambiente infantil': '🧸'
}

const reactions = ['Bombando 🔥', 'Energia Alta ⚡', 'Acolhedor 💜', 'Seguro 🛡️', 'Publico Incrivel ✨', 'Atendimento Top 👏']

export default function App() {
  const [page, setPage] = useState<Page>('home')
  const [category, setCategory] = useState<Category>('Bombando')
  const [query, setQuery] = useState('Will, onde e hoje?')
  const [phoneTab, setPhoneTab] = useState<PhoneTab>('mapa')
  const [ride, setRide] = useState('So ida')
  const [reaction, setReaction] = useState('')
  const [partnerOpen, setPartnerOpen] = useState(false)
  const [driverOpen, setDriverOpen] = useState(false)

  const event = useMemo(() => experiences.find((item) => item.category === category) ?? experiences[0], [category])

  function askWill() {
    const q = query.toLowerCase()
    if (q.includes('infantil') || q.includes('crianca') || q.includes('kids')) setCategory('Ambiente infantil')
    else if (q.includes('musica') || q.includes('show') || q.includes('ao vivo')) setCategory('Musica ao vivo')
    else if (q.includes('comida') || q.includes('gastronomia') || q.includes('restaurante')) setCategory('Gastronomia')
    else if (q.includes('cultura') || q.includes('teatro')) setCategory('Cultural')
    else if (q.includes('relax') || q.includes('tranquilo')) setCategory('Modo Relax')
    else setCategory('Bombando')
    setPhoneTab('evento')
    setPage('user')
  }

  function chooseCategory(value: Category) {
    setCategory(value)
    setPhoneTab('evento')
    setPage('user')
  }

  function downloadIntent() {
    alert('No lancamento, este botao abre Google Play ou App Store. Agora ele registra interesse no MVP.')
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <button className="brand" onClick={() => setPage('home')}><span className="logo" /><strong>PulseAí</strong></button>
        <nav>
          <button className={page === 'user' ? 'nav-active' : ''} onClick={() => setPage('user')}>Para quem sai</button>
          <button className={page === 'business' ? 'nav-active' : ''} onClick={() => setPage('business')}>Para negócios</button>
          <button className={page === 'driver' ? 'nav-active' : ''} onClick={() => setPage('driver')}>Cadastro de motorista</button>
          <button className={page === 'admin' ? 'nav-active' : ''} onClick={() => setPage('admin')}>Admin 🔒</button>
          <button className="download-top" onClick={downloadIntent}>Quero baixar</button>
        </nav>
      </header>

      {page === 'home' && (
        <section className="hero">
          <div className="hero-copy">
            <h1>Onde a cidade <span>pulsa agora.</span></h1>
            <p>Descubra o que está rolando em tempo real, veja lotação, cardápio, bebidas, combos, promoções e programe sua ida, sua volta ou sua ida + volta em uma experiência bonita, simples e pronta para virar hábito.</p>
            <p className="subcopy">PulseAí não mostra só onde é hoje. Ele mostra onde a vida urbana realmente acontece — e te leva até lá.</p>
            <div className="actions">
              <button className="primary" onClick={() => setPage('user')}>Explorar hoje</button>
              <button className="secondary" onClick={downloadIntent}>Quero baixar</button>
              <button className="ghost" onClick={askWill}>Perguntar ao Will</button>
            </div>
            <div className="stats">
              <article><strong>&lt; 4 min</strong><small>para decidir onde ir com confiança</small></article>
              <article><strong>5%+</strong><small>de cashback e pontos por check-in</small></article>
              <article><strong>100%</strong><small>reações coletivas, positivas e anônimas</small></article>
            </div>
          </div>
          <PulsePhone event={event} category={category} query={query} setQuery={setQuery} onAskWill={askWill} onCategory={chooseCategory} tab={phoneTab} setTab={setPhoneTab} ride={ride} setRide={setRide} reaction={reaction} setReaction={setReaction} />
        </section>
      )}

      {page === 'user' && <UserSection setPage={setPage} onDownload={downloadIntent} />}
      {page === 'business' && <BusinessSection open={partnerOpen} setOpen={setPartnerOpen} />}
      {page === 'driver' && <DriverSection open={driverOpen} setOpen={setDriverOpen} />}
      {page === 'admin' && <AdminSection />}
    </main>
  )
}

function PulsePhone(props: {
  event: Experience
  category: Category
  query: string
  setQuery: (value: string) => void
  onAskWill: () => void
  onCategory: (value: Category) => void
  tab: PhoneTab
  setTab: (value: PhoneTab) => void
  ride: string
  setRide: (value: string) => void
  reaction: string
  setReaction: (value: string) => void
}) {
  const { event, category, query, setQuery, onAskWill, onCategory, tab, setTab, ride, setRide, reaction, setReaction } = props
  const [panelOpen, setPanelOpen] = useState(false)

  function closePanelTo(next: PhoneTab) {
    setPanelOpen(false)
    setTab(next)
  }

  return (
    <aside className="phone">
      <div className="phone-inner">
        <div className="phone-top">
          <strong>PulseAí</strong>
          <button className="menu-icon" aria-label="Abrir painel" onClick={() => setPanelOpen(true)}>☰</button>
        </div>

        <div className="phone-view">
          {panelOpen && (
            <div className="quick-panel">
              <h3>Painel <span>pulsa agora.</span></h3>
              <button onClick={() => closePanelTo('mapa')}>🔎 Descobrir agora</button>
              <button onClick={() => closePanelTo('evento')}>🎟️ Evento em destaque</button>
              <button onClick={() => closePanelTo('transporte')}>🚘 Programar transporte</button>
              <button onClick={() => { setPanelOpen(false); onAskWill() }}>💬 Falar com Will</button>
              <button onClick={() => closePanelTo('agenda')}>📅 Minha agenda</button>
              <button onClick={() => closePanelTo('perfil')}>👤 Meu perfil</button>
              <button onClick={() => closePanelTo('beneficios')}>✨ Pulse+ benefícios</button>
              <button onClick={() => setPanelOpen(false)}>Fechar painel</button>
            </div>
          )}

          {tab === 'mapa' && (
            <section className="phone-section">
              <div className="intro-card"><small>Onde a cidade</small><span>pulsa agora.</span><b>Descubra o que está rolando em tempo real</b></div>
              <div className="search phone-search"><span>🔎</span><input value={query} onChange={(e) => setQuery(e.target.value)} /><button onClick={() => setQuery('')}>×</button><button onClick={onAskWill}>🔎</button></div>
              <div className="category-grid">{categories.map((cat) => <button key={cat} className={cat === category ? 'active' : ''} onClick={() => onCategory(cat)}><span>{iconByCategory[cat]}</span>{cat}</button>)}</div>
              <div className="mini-map"><i className="pin pin-a" /><i className="pin pin-b" /><i className="pin pin-c" /><i className="pin pin-d" /><small>Bombando agora</small></div>
              <div className="row-title"><strong>Acontecendo agora</strong><small>{event.distance}</small></div>
              <div className="will-card"><b>Will recomenda</b><p>{event.title} porque tem {event.vibe.toLowerCase()}, cardápio publicado e boa movimentação.</p></div>
            </section>
          )}

          {tab === 'evento' && (
            <section className="phone-section">
              <div className="photo-card" style={{ background: event.imageGradient }}><span>{event.schedule}</span></div>
              <h3>{event.title}</h3>
              <p>{event.description}</p>
              <div className="phone-metrics"><article><small>Lotação</small><b>{event.crowd}%</b></article><article><small>Vibe</small><b>{event.vibe}</b></article><article><small>Cashback</small><b>{event.cashback}%</b></article><article><small>Check-ins</small><b>{event.checkins}</b></article></div>
              <h4>Cardápio, combos e bebidas</h4>
              <div className="phone-menu">{event.menu.map((item) => <button key={item.id} onClick={() => alert(`${item.name} — ${item.price}\n${item.detail}`)}><span>{item.emoji}</span><b>{item.name}</b><em>{item.price}</em></button>)}</div>
              <button className="primary full" onClick={() => alert('Voucher gerado: combo/reserva salvo na sua agenda PulseAí.')}>Comprar combo / reservar</button>
              <h4>Reagir à vibe</h4>
              <div className="reaction-list">{reactions.map((item) => <button key={item} className={reaction === item ? 'active' : ''} onClick={() => setReaction(item)}>{item}</button>)}</div>
              <button className="secondary full" onClick={() => alert(reaction ? `Reação enviada: ${reaction}` : 'Escolha uma reação antes de enviar.')}>Enviar reação</button>
            </section>
          )}

          {tab === 'transporte' && (
            <section className="phone-section">
              <div className="will-card"><b>Seu plano de mobilidade</b><p>Escolha só ida, só volta ou ida + volta com geolocalização e confirmação.</p></div>
              <div className="ride-options">{['So ida', 'So volta', 'Ida + volta'].map((item) => <button key={item} className={ride === item ? 'active' : ''} onClick={() => setRide(item)}>{item}</button>)}</div>
              <div className="will-card"><b>Resumo da solicitação</b><p>Origem: minha localização. Destino: {event.title}. Tipo: {ride}. Status: aguardando motorista.</p></div>
              <button className="primary full" onClick={() => alert(`Corrida solicitada: ${ride}. Motoristas próximos serão notificados.`)}>Solicitar corrida</button>
            </section>
          )}

          {tab === 'perfil' && (
            <section className="phone-section">
              <div className="profile-card"><div className="avatar">W</div><h3>Will</h3><p>Perfil privado com nome, telefone, endereço residencial, preferências, pontos e histórico.</p></div>
              <div className="phone-metrics two"><article><small>Pontos</small><b>320</b></article><article><small>Cashback</small><b>R$ 18</b></article></div>
            </section>
          )}

          {tab === 'agenda' && <section className="phone-section"><div className="will-card"><b>Minha agenda</b><p>Reservas, vouchers, eventos salvos e transportes programados aparecem aqui.</p></div></section>}
          {tab === 'beneficios' && <section className="phone-section"><div className="will-card"><b>Pulse+ benefícios</b><p>Cashback, pontos, prioridade em combos e campanhas exclusivas.</p></div></section>}
        </div>

        <div className="phone-tabs">
          <button className={tab === 'mapa' ? 'tab-on' : ''} onClick={() => setTab('mapa')}><span>🗺️</span>Mapa</button>
          <button className={tab === 'evento' ? 'tab-on' : ''} onClick={() => setTab('evento')}><span>🎟️</span>Evento</button>
          <button className={tab === 'transporte' ? 'tab-on' : ''} onClick={() => setTab('transporte')}><span>🚘</span>Transporte</button>
          <button className={tab === 'perfil' ? 'tab-on' : ''} onClick={() => setTab('perfil')}><span>👤</span>Perfil</button>
        </div>
      </div>
    </aside>
  )
}

function UserSection({ setPage, onDownload }: { setPage: (page: Page) => void; onDownload: () => void }) {
  return <PublicSection eyebrow="Para quem sai" title={<><span>Descubra mais rápido.</span> Escolha melhor.<br />Chegue mais fácil.</>} text="O app responde às dores levantadas na validação: saber o que está acontecendo agora, filtrar por música, ambiente e vibe, ver lotação estimada, cardápio, promoções, combos, compra antecipada e transporte pelo próprio app." cards={[['🗺️','Mapa como tela principal','O usuário abre o app e vê a cidade acontecendo em tempo real, com locais próximos e recomendações do Will.'],['🎟️','Evento completo','Foto publicada pelo estabelecimento, detalhes, lotação, cardápio, bebidas, combos, cashback e voucher.'],['🚘','Transporte flexível','O usuário pode solicitar só ida, só volta ou ida + volta, com geolocalização e confirmação.']]} ctaTitle="Baixar o app agora" ctaText="Encontrar algo interessante em poucos minutos, com oferta real, desconto real e a sensação de que agora eu sei para onde ir." ctaLabel="Quero baixar" onCta={onDownload} secondaryLabel="Ver negócios" onSecondary={() => setPage('business')} />
}

function BusinessSection({ open, setOpen }: { open: boolean; setOpen: (value: boolean) => void }) {
  const [form, setForm] = useState<PartnerForm>(() => getLocal('partner', { name: '', category: '', instagram: '', address: '', phone: '' }))
  return <><PublicSection eyebrow="Para negócios" title={<>Pare de depender só de stories.<br /><span>Comece a vender com dados.</span></>} text="Para bares, restaurantes, casas de show e produtores, o PulseAí entrega visibilidade geolocalizada, publicação autônoma, combos, cardápio, métricas reais, notificações e automações com WhatsApp e Instagram." cards={[['📍','Apareça para quem está perto','Seu evento surge para quem está na cidade, com interesse compatível e pronto para decidir.'],['📊','Saiba quantos viram','Visualizações, salvamentos, cliques, check-ins, vouchers, vendas, conversão e reações do público.'],['💬','Automatize a divulgação','Confirmações por WhatsApp, lembretes, relatório semanal e sugestões de post para Instagram.']]} ctaTitle="Seu evento merece mais do que alcance. Merece conversão." ctaText="Publique, apareça, venda, acompanhe e cresça com autonomia." ctaLabel="Quero cadastrar meu negócio" onCta={() => setOpen(true)} /></>
}

function DriverSection({ open, setOpen }: { open: boolean; setOpen: (value: boolean) => void }) {
  const [form, setForm] = useState<DriverForm>(() => getLocal('driver', { name: '', phone: '', vehicle: 'Carro', plate: '', city: '' }))
  return <><PublicSection eyebrow="Cadastro de motorista" title={<>Corridas conectadas à <span>movimentação da cidade.</span></>} text="Motoristas de carro e moto podem compor a frente de mobilidade do PulseAí, recebendo solicitações ligadas aos eventos, bares, restaurantes e experiências da cidade." cards={[['🚘','Carro ou moto','Cadastro de condutor, veículo, cidade, documentos, horários disponíveis e aprovação do perfil.'],['📍','Geolocalização','Corridas com origem, destino, tipo de solicitação, status, rota e acompanhamento da operação.']]} ctaTitle="Quer dirigir com o PulseAí?" ctaText="Entre no pré-cadastro de motoristas para participar da futura operação de mobilidade." ctaLabel="Quero me cadastrar como motorista" onCta={() => setOpen(true)} />{open && <FormPanel title="Pré-cadastro de motorista" fields={<><input placeholder="Nome completo" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /><input placeholder="Telefone / WhatsApp" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /><select value={form.vehicle} onChange={(e) => setForm({ ...form, vehicle: e.target.value })}><option>Carro</option><option>Moto</option></select><input placeholder="Placa" value={form.plate} onChange={(e) => setForm({ ...form, plate: e.target.value })} /><input placeholder="Cidade" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></>} onSave={() => { saveLocal('driver', form); alert('Cadastro de motorista salvo no MVP.') }} onClose={() => setOpen(false)} />}</>
}

function PublicSection(props: { eyebrow: string; title: React.ReactNode; text: string; cards: string[][]; ctaTitle: string; ctaText: string; ctaLabel: string; onCta: () => void; secondaryLabel?: string; onSecondary?: () => void }) {
  return <section className="public-section"><span className="pill">{props.eyebrow}</span><h2>{props.title}</h2><p>{props.text}</p><div className="public-cards">{props.cards.map(([icon, title, text]) => <article key={title}><span>{icon}</span><h3>{title}</h3><p>{text}</p></article>)}</div><div className="cta-box"><h3>{props.ctaTitle}</h3><p>{props.ctaText}</p><button className="secondary" onClick={props.onCta}>{props.ctaLabel}</button>{props.secondaryLabel && <button className="ghost" onClick={props.onSecondary}>{props.secondaryLabel}</button>}</div></section>
}

function FormPanel({ title, fields, onSave, onClose }: { title: string; fields: React.ReactNode; onSave: () => void; onClose: () => void }) {
  return <section className="form-panel"><h2>{title}</h2><div className="form-grid">{fields}</div><div className="actions"><button className="primary" onClick={onSave}>Salvar pré-cadastro</button><button className="ghost" onClick={onClose}>Fechar</button></div></section>
}

function AdminSection() {
  const [unlocked, setUnlocked] = useState(false)
  const [password, setPassword] = useState('')
  if (!unlocked) return <section className="admin-lock"><span className="pill">Admin 🔒</span><h2>Controle restrito da plataforma.</h2><p>Área do criador para acompanhar usuários, negócios, motoristas, eventos, aprovações, receita e expansão.</p><input type="password" placeholder="Senha do administrador" value={password} onChange={(e) => setPassword(e.target.value)} /><button className="secondary" onClick={() => password ? setUnlocked(true) : alert('Digite a senha para simular o acesso.')}>Entrar no painel</button></section>
  return <section className="admin-dashboard"><span className="pill">Admin liberado</span><h2>Painel de comando PulseAí</h2><div className="dashboard-grid"><article><small>Usuários</small><strong>226</strong></article><article><small>Negócios</small><strong>18</strong></article><article><small>Motoristas</small><strong>34</strong></article><article><small>Eventos ativos</small><strong>12</strong></article><article><small>Vouchers</small><strong>42</strong></article><article><small>Conversão</small><strong>18%</strong></article></div><div className="public-cards"><article><span>✅</span><h3>Aprovações</h3><p>Validar estabelecimentos, produtores, motoristas e eventos.</p></article><article><span>🧭</span><h3>Operação em tempo real</h3><p>Check-ins, transportes, mapa de calor e denúncias.</p></article><article><span>📈</span><h3>Receita e expansão</h3><p>Planos, taxas, add-ons, cidades e campanhas.</p></article></div></section>
}
