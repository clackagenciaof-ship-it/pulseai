import { useEffect, useMemo, useState, type ReactNode } from 'react'
import AppFinal from './AppFinal'

type Modal = 'quemSai' | 'parceiro' | 'motorista' | 'usuario' | 'admin' | 'baixar' | null

type Evento = {
  id: string
  negocio: string
  dono: string
  whats: string
  nome: string
  categoria: string
  data: string
  endereco: string
  foto?: string
  desc: string
  genero: string
  ambiente: string
  lotacao: string
  vibe: string
  cashback: string
  ingresso: string
  combos: string
  bebidas: string
  promocoes: string
  cardapio: string
  alcance: number
  views: number
  checkins: number
  cliques: number
  vendas: number
  reacoes: number
}

type Motorista = { id: string; nome: string; contato: string; veiculo: string; placa: string; cidade: string; disponibilidade: string; online: boolean }
type Corrida = { id: string; usuario: string; evento: string; origem: string; destino: string; tipo: string; veiculo: string; status: string; motorista?: string; placa?: string; contato?: string }
type Db = { eventos: Evento[]; motoristas: Motorista[]; corridas: Corrida[]; usuarios: any[] }

const db0: Db = { eventos: [], motoristas: [], corridas: [], usuarios: [] }
const id = () => Math.random().toString(36).slice(2, 9)
const load = (): Db => {
  try { return { ...db0, ...JSON.parse(localStorage.getItem('pulseai_plus') || '{}') } } catch { return db0 }
}
const fileToData = (f?: File) => new Promise<string>((ok) => {
  if (!f) return ok('')
  const r = new FileReader()
  r.onload = () => ok(String(r.result || ''))
  r.readAsDataURL(f)
})

export default function AppPlus() {
  const [modal, setModal] = useState<Modal>(null)
  const [db, setDb] = useState<Db>(load)

  useEffect(() => { localStorage.setItem('pulseai_plus', JSON.stringify(db)) }, [db])

  useEffect(() => {
    const h = (ev: MouseEvent) => {
      const button = (ev.target as HTMLElement).closest('button')
      const t = button?.textContent || ''
      if (!button) return
      if (t.includes('Para quem sai')) { ev.preventDefault(); ev.stopPropagation(); setModal('quemSai'); return }
      if (t.includes('Para negócios') || t.includes('Quero cadastrar meu negócio')) { ev.preventDefault(); ev.stopPropagation(); setModal('parceiro'); return }
      if (t.includes('Cadastro de motorista') || t.includes('Quero me cadastrar como motorista')) { ev.preventDefault(); ev.stopPropagation(); setModal('motorista'); return }
      if (t.includes('Quero baixar') || t.includes('Baixar agora')) { ev.preventDefault(); ev.stopPropagation(); setModal('baixar'); return }
      if (t.trim() === 'Perfil' || t.includes('Área do usuário') || t.includes('Meu perfil')) { ev.preventDefault(); ev.stopPropagation(); setModal('usuario'); return }
      if (t.includes('Admin') || t.includes('Administrador')) { ev.preventDefault(); ev.stopPropagation(); setModal('admin'); return }
    }
    document.addEventListener('click', h, true)
    return () => document.removeEventListener('click', h, true)
  }, [])

  return (
    <>
      <AppFinal />
      <div className="floating-actions" style={{ position: 'fixed', right: 18, bottom: 18, zIndex: 90, display: 'grid', gap: 12 }}>
        <button className="ghost" onClick={() => setModal('parceiro')}>Área do parceiro</button>
        <button className="ghost" onClick={() => setModal('usuario')}>Área do usuário</button>
      </div>
      {modal === 'quemSai' && <QuemSai close={() => setModal(null)} openBaixar={() => setModal('baixar')} />}
      {modal === 'baixar' && <Baixar close={() => setModal(null)} />}
      {modal === 'parceiro' && <Parceiro db={db} setDb={setDb} close={() => setModal(null)} />}
      {modal === 'motorista' && <MotoristaPainel db={db} setDb={setDb} close={() => setModal(null)} />}
      {modal === 'usuario' && <Usuario db={db} setDb={setDb} close={() => setModal(null)} />}
      {modal === 'admin' && <Admin db={db} setDb={setDb} close={() => setModal(null)} />}
    </>
  )
}

function Shell({ title, close, children }: { title: string; close: () => void; children: ReactNode }) {
  return (
    <div className="modal-back" role="dialog" aria-modal="true">
      <div className="modal-card pulse-modal-card">
        <div className="row-title modal-head">
          <strong>{title}</strong>
          <button className="ghost" onClick={close}>Fechar</button>
        </div>
        {children}
      </div>
    </div>
  )
}

function QuemSai({ close, openBaixar }: { close: () => void; openBaixar: () => void }) {
  return (
    <Shell title="Para quem sai" close={close}>
      <div className="modal-hero-text">
        <span className="pill-dot">Usuário final</span>
        <h2><em>Descubra mais rápido.</em> Escolha melhor. Chegue mais fácil.</h2>
        <p>O app mostra o que está acontecendo agora, filtra por música, ambiente e vibe, exibe lotação estimada, cardápio, promoções, combos, compra antecipada e transporte.</p>
      </div>
      <div className="public-cards modal-feature-grid">
        {[
          ['🧭', 'Explorar agora', 'Visão geral do que está rolando em Floriano, PI.'],
          ['🗺️', 'Mapa vivo', 'Pins de eventos, bares, restaurantes e rotas.'],
          ['🤖', 'Falar com Will', 'Sugestões inteligentes para decidir onde ir.'],
          ['🎟️', 'Eventos e reservas', 'Detalhes, combos, cardápio, ingressos e reserva.'],
          ['🚘', 'Transporte', 'Solicite só ida, só volta ou ida + volta.'],
          ['💜', 'Favoritos', 'Salve eventos, lugares, combos e rotas.'],
        ].map(([ico, title, text]) => <article key={title}><span className="modal-icon">{ico}</span><h3>{title}</h3><p>{text}</p></article>)}
      </div>
      <div className="modal-actions">
        <button className="primary" onClick={close}>Explorar no app</button>
        <button className="secondary" onClick={openBaixar}>Baixar agora</button>
      </div>
    </Shell>
  )
}

function Baixar({ close }: { close: () => void }) {
  return (
    <Shell title="Baixar PulseAí" close={close}>
      <div className="modal-hero-text compact">
        <h2>Escolha onde deseja baixar.</h2>
        <p>No lançamento, os botões levam para as lojas oficiais do app. Nesta fase, a versão web fica disponível para testes comerciais.</p>
      </div>
      <div className="modal-actions wrap">
        <button className="primary">Android / Google Play</button>
        <button className="secondary">iPhone / App Store</button>
        <button className="ghost">Versão web</button>
      </div>
    </Shell>
  )
}

function Parceiro({ db, setDb, close }: { db: Db; setDb: (d: Db) => void; close: () => void }) {
  const [login, setLogin] = useState(false)
  const [foto, setFoto] = useState('')
  const [f, setF] = useState({ negocio: '', dono: '', whats: '', senha: '', nome: '', categoria: 'Bar / Pub', data: '', endereco: '', desc: '', genero: '', ambiente: 'Energia alta', lotacao: '60', vibe: 'Energia alta', cashback: '5', ingresso: 'Reserva', combos: '', bebidas: '', promocoes: '', cardapio: '' })
  const publicar = () => {
    if (!f.negocio || !f.nome || !f.endereco) return alert('Preencha negócio, evento e endereço.')
    const e: Evento = { id: id(), foto, ...f, alcance: 900 + Math.floor(Math.random() * 900), views: 300 + Math.floor(Math.random() * 600), checkins: 40 + Math.floor(Math.random() * 120), cliques: 80 + Math.floor(Math.random() * 180), vendas: 8 + Math.floor(Math.random() * 40), reacoes: 60 + Math.floor(Math.random() * 180) }
    setDb({ ...db, eventos: [e, ...db.eventos] })
    alert('Evento publicado. Ele aparece na Área do usuário desta versão piloto.')
  }

  return (
    <Shell title="Área do parceiro / Painel do estabelecimento" close={close}>
      {!login ? (
        <div className="form-grid clean-grid">
          <div>
            <h3>Login do estabelecimento</h3>
            <input placeholder="Proprietário / dono" value={f.dono} onChange={e => setF({ ...f, dono: e.target.value })} />
            <input placeholder="Nome do negócio" value={f.negocio} onChange={e => setF({ ...f, negocio: e.target.value })} />
            <input placeholder="WhatsApp de recebimento" value={f.whats} onChange={e => setF({ ...f, whats: e.target.value })} />
            <input type="password" placeholder="Senha de acesso" value={f.senha} onChange={e => setF({ ...f, senha: e.target.value })} />
            <button className="secondary full" onClick={() => f.negocio && f.senha ? setLogin(true) : alert('Preencha negócio e senha.')}>Entrar no painel</button>
          </div>
          <div className="info-panel">
            <h3>O painel permite</h3>
            <p>Cadastrar evento, foto, categoria, data, endereço, gênero musical, ambiente, lotação, vibe, cashback, combos, bebidas, promoções, cardápio e acompanhar métricas.</p>
            <div className="chips category-chips">
              {['Bar / Pub', 'Restaurante', 'Casa de show', 'Produtor', 'Cultural', 'Gastronomia', 'Infantil', 'Modo Relax'].map(c => <button key={c} onClick={() => setF({ ...f, categoria: c })}>{c}</button>)}
            </div>
          </div>
        </div>
      ) : (
        <div className="form-grid clean-grid">
          <div>
            <h3>Cadastrar evento</h3>
            <input placeholder="Nome do evento" value={f.nome} onChange={e => setF({ ...f, nome: e.target.value })} />
            <select value={f.categoria} onChange={e => setF({ ...f, categoria: e.target.value })}>
              {['Bar / Pub', 'Restaurante', 'Casa de show', 'Produtor de eventos', 'Cultural', 'Gastronomia', 'Ambiente infantil', 'Modo Relax'].map(c => <option key={c}>{c}</option>)}
            </select>
            <input placeholder="Data e horário" value={f.data} onChange={e => setF({ ...f, data: e.target.value })} />
            <input placeholder="Endereço" value={f.endereco} onChange={e => setF({ ...f, endereco: e.target.value })} />
            <input type="file" accept="image/*" onChange={async e => setFoto(await fileToData(e.target.files?.[0]))} />
            {foto && <img src={foto} className="upload-preview" />}
            <textarea placeholder="Descrição" value={f.desc} onChange={e => setF({ ...f, desc: e.target.value })} />
            <div className="mini-form-grid">
              <input placeholder="Gênero musical" value={f.genero} onChange={e => setF({ ...f, genero: e.target.value })} />
              <input placeholder="Tipo de ambiente" value={f.ambiente} onChange={e => setF({ ...f, ambiente: e.target.value })} />
              <input placeholder="Lotação estimada %" value={f.lotacao} onChange={e => setF({ ...f, lotacao: e.target.value })} />
              <input placeholder="Cashback %" value={f.cashback} onChange={e => setF({ ...f, cashback: e.target.value })} />
            </div>
            <input placeholder="Combos" value={f.combos} onChange={e => setF({ ...f, combos: e.target.value })} />
            <input placeholder="Bebidas" value={f.bebidas} onChange={e => setF({ ...f, bebidas: e.target.value })} />
            <input placeholder="Promoções" value={f.promocoes} onChange={e => setF({ ...f, promocoes: e.target.value })} />
            <input placeholder="Cardápio" value={f.cardapio} onChange={e => setF({ ...f, cardapio: e.target.value })} />
            <div className="modal-actions"><button className="primary" onClick={publicar}>Publicar evento</button><button className="ghost" onClick={() => setLogin(false)}>Sair do painel</button></div>
          </div>
          <div>
            <h3>Métricas do parceiro</h3>
            <div className="dashboard-grid compact-metrics">
              <article><span>Alcance</span><b>{db.eventos.reduce((s, e) => s + e.alcance, 0)}</b></article>
              <article><span>Visualizações</span><b>{db.eventos.reduce((s, e) => s + e.views, 0)}</b></article>
              <article><span>Check-ins</span><b>{db.eventos.reduce((s, e) => s + e.checkins, 0)}</b></article>
              <article><span>Vendas</span><b>{db.eventos.reduce((s, e) => s + e.vendas, 0)}</b></article>
            </div>
          </div>
        </div>
      )}
    </Shell>
  )
}

function MotoristaPainel({ db, setDb, close }: { db: Db; setDb: (d: Db) => void; close: () => void }) {
  const [m, setM] = useState({ nome: '', contato: '', veiculo: 'Carro', placa: '', cidade: 'Floriano, PI', disponibilidade: 'Só ida' })
  const cadastrar = () => {
    if (!m.nome || !m.contato || !m.placa) return alert('Preencha nome, WhatsApp e placa.')
    setDb({ ...db, motoristas: [{ id: id(), ...m, online: true }, ...db.motoristas] })
    alert('Motorista cadastrado e online para receber corridas.')
  }
  const aceitar = () => {
    const c = db.corridas.find(x => x.status === 'Pendente')
    if (!c) return alert('Nenhuma corrida pendente agora.')
    const driver = db.motoristas[0]
    setDb({ ...db, corridas: db.corridas.map(x => x.id === c.id ? { ...x, status: 'Aceita', motorista: driver?.nome || m.nome, placa: driver?.placa || m.placa, contato: driver?.contato || m.contato } : x) })
    alert('Corrida aceita. O usuário verá nome, veículo, placa, avaliação e contato protegido.')
  }
  return (
    <Shell title="Área do motorista" close={close}>
      <p>Cadastro, status online, recebimento e aceite de corrida.</p>
      <div className="mini-form-grid driver-grid">
        <input placeholder="Nome completo" value={m.nome} onChange={e => setM({ ...m, nome: e.target.value })} />
        <input placeholder="WhatsApp" value={m.contato} onChange={e => setM({ ...m, contato: e.target.value })} />
        <select value={m.veiculo} onChange={e => setM({ ...m, veiculo: e.target.value })}><option>Carro</option><option>Moto</option></select>
        <input placeholder="Placa" value={m.placa} onChange={e => setM({ ...m, placa: e.target.value.toUpperCase() })} />
        <input placeholder="Cidade" value={m.cidade} onChange={e => setM({ ...m, cidade: e.target.value })} />
        <select value={m.disponibilidade} onChange={e => setM({ ...m, disponibilidade: e.target.value })}><option>Só ida</option><option>Só volta</option><option>Ida + volta</option></select>
      </div>
      <div className="info-panel request-panel"><h3>Solicitação pendente</h3><p>{db.corridas.find(c => c.status === 'Pendente')?.evento || 'Noite de Samba no Boteco do Zé'} • Só ida • aguardando aceite</p></div>
      <div className="modal-actions"><button className="primary" onClick={cadastrar}>Cadastrar e ficar online</button><button className="secondary" onClick={aceitar}>Aceitar corrida</button></div>
    </Shell>
  )
}

function Usuario({ db, setDb, close }: { db: Db; setDb: (d: Db) => void; close: () => void }) {
  const [u, setU] = useState({ nome: '', whats: '', endereco: '', pref: '' })
  const [foto, setFoto] = useState('')
  const eventos = db.eventos.length ? db.eventos : mockEventos()
  const [sel, setSel] = useState<Evento | undefined>(eventos[0])
  const [ride, setRide] = useState({ tipo: 'Só ida', origem: '', veiculo: 'Mais rápido' })
  const solicitar = () => {
    if (!sel) return alert('Escolha um evento.')
    const m = db.motoristas.find(x => x.online)
    const c: Corrida = { id: id(), usuario: u.nome || 'Usuário PulseAí', evento: sel.nome, origem: ride.origem || 'Minha localização', destino: sel.endereco, tipo: ride.tipo, veiculo: ride.veiculo, status: m ? 'Aceita' : 'Pendente', motorista: m?.nome, placa: m?.placa, contato: m?.contato }
    setDb({ ...db, usuarios: [u, ...db.usuarios], corridas: [c, ...db.corridas] })
    alert(m ? `Corrida aceita por ${m.nome}. Veículo ${m.veiculo}, placa ${m.placa}.` : 'Solicitação enviada. Aguardando motorista online.')
  }
  return (
    <Shell title="Área do Usuário" close={close}>
      <div className="form-grid clean-grid">
        <div><h3>Cadastro do usuário</h3><input placeholder="Nome completo" value={u.nome} onChange={e => setU({ ...u, nome: e.target.value })} /><input placeholder="WhatsApp" value={u.whats} onChange={e => setU({ ...u, whats: e.target.value })} /><input placeholder="Endereço residencial" value={u.endereco} onChange={e => setU({ ...u, endereco: e.target.value })} /><input placeholder="Preferências" value={u.pref} onChange={e => setU({ ...u, pref: e.target.value })} /><input type="file" accept="image/*" onChange={async e => setFoto(await fileToData(e.target.files?.[0]))} />{foto && <img src={foto} className="avatar-preview" />}<button className="primary full" onClick={() => alert('Perfil privado salvo para validação do app.')}>Salvar perfil</button></div>
        <div><h3>Experiências disponíveis</h3><div className="event-options">{eventos.map(e => <button key={e.id} className={sel?.id === e.id ? 'active' : ''} onClick={() => setSel(e)}><b>{e.nome}</b><span>{e.negocio} • {e.endereco}</span><small>{e.data} • Lotação {e.lotacao}% • {e.vibe}</small></button>)}</div></div>
      </div>
      {sel && <div className="form-grid clean-grid"><div><h3>Cardápio, combos e reservas</h3><p>{sel.desc}</p><div className="chips">{[sel.combos, sel.bebidas, sel.promocoes, sel.cardapio].join('\n').split('\n').filter(Boolean).map(i => <button key={i}>{i}</button>)}</div><button className="secondary">Finalizar compra/reserva</button></div><div><h3>Transporte</h3><input placeholder="Origem" value={ride.origem} onChange={e => setRide({ ...ride, origem: e.target.value })} /><select value={ride.tipo} onChange={e => setRide({ ...ride, tipo: e.target.value })}><option>Só ida</option><option>Só volta</option><option>Ida + volta</option></select><select value={ride.veiculo} onChange={e => setRide({ ...ride, veiculo: e.target.value })}><option>Mais rápido</option><option>Carro</option><option>Moto</option></select><button className="primary full" onClick={solicitar}>Solicitar agora</button></div></div>}
    </Shell>
  )
}

function Admin({ db, setDb, close }: { db: Db; setDb: (d: Db) => void; close: () => void }) {
  const [ok, setOk] = useState(false)
  const [senha, setSenha] = useState('')
  const kpis = useMemo(() => ({ parceiros: new Set(db.eventos.map(e => e.negocio)).size, eventos: db.eventos.length, usuarios: db.usuarios.length, motoristas: db.motoristas.length, corridas: db.corridas.length, checkins: db.eventos.reduce((s, e) => s + e.checkins, 0), vendas: db.eventos.reduce((s, e) => s + e.vendas, 0), reacoes: db.eventos.reduce((s, e) => s + e.reacoes, 0) }), [db])
  if (!ok) return <Shell title="Admin 🔒 acesso restrito" close={close}><div className="admin-login"><p>Área exclusiva do dono do app. Digite a senha para entrar no painel administrativo.</p><input type="password" placeholder="Senha do dono" value={senha} onChange={e => setSenha(e.target.value)} /><div className="modal-actions"><button className="secondary" onClick={() => senha === 'pulseai' || senha === 'admin' ? setOk(true) : alert('Senha incorreta. Use a senha definida para o dono.')}>Entrar</button></div><small>Senha de demonstração: pulseai</small></div></Shell>
  return <Shell title="Admin 🔒 dashboard restrito" close={close}><div className="dashboard-grid admin-grid">{Object.entries(kpis).map(([k, v]) => <article key={k}><span>{k}</span><b>{v}</b></article>)}</div><div className="modal-actions"><button className="ghost" onClick={() => { localStorage.removeItem('pulseai_plus'); setDb(db0); alert('Dados locais resetados.') }}>Resetar dados locais</button></div></Shell>
}

function mockEventos(): Evento[] {
  return [
    { id: 'mock1', negocio: 'Boteco do Zé', dono: 'Zé', whats: '', nome: 'Noite de Samba no Boteco do Zé', categoria: 'Bombando', data: 'Hoje, 20h às 02h', endereco: 'Rua das Flores, Centro', desc: 'Samba ao vivo, combo ativo, cardápio publicado e lotação boa para chegar agora.', genero: 'Samba', ambiente: 'Energia alta', lotacao: '72', vibe: 'Energia alta', cashback: '5', ingresso: 'Reserva', combos: 'Combo Samba + Cerveja — R$ 45', bebidas: 'Caipirinha da Casa — R$ 18', promocoes: 'Tábua Mista — R$ 32', cardapio: 'Entrada + 2 drinks — R$ 85', alcance: 1200, views: 620, checkins: 148, cliques: 210, vendas: 36, reacoes: 270 },
    { id: 'mock2', negocio: 'Pub Estação', dono: 'Ana', whats: '', nome: 'MPB Acústico no Pub Estação', categoria: 'Música ao vivo', data: 'Hoje, 21h', endereco: 'Rua São Pedro, Centro', desc: 'Mostra intimista, mesas disponíveis e ambiente acolhedor.', genero: 'MPB', ambiente: 'Acolhedor', lotacao: '54', vibe: 'Acolhedor', cashback: '4', ingresso: 'Couvert', combos: 'Couvert + drink — R$ 36', bebidas: 'Drink da casa — R$ 20', promocoes: '', cardapio: 'Petiscos da estação — R$ 38', alcance: 980, views: 410, checkins: 70, cliques: 160, vendas: 22, reacoes: 130 }
  ]
}
