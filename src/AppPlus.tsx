import { useEffect, useState } from 'react'
import AppFinal from './AppFinal'

type Modal = 'quemSai' | 'parceiro' | 'motorista' | 'usuario' | 'admin' | null

type Evento = { id: string; negocio: string; dono: string; whats: string; nome: string; categoria: string; data: string; endereco: string; foto?: string; desc: string; genero: string; ambiente: string; lotacao: string; vibe: string; cashback: string; ingresso: string; combos: string; bebidas: string; promocoes: string; cardapio: string; alcance: number; views: number; checkins: number; cliques: number; vendas: number; reacoes: number }
type Motorista = { id: string; nome: string; contato: string; veiculo: string; placa: string; cidade: string; disponibilidade: string; online: boolean }
type Corrida = { id: string; usuario: string; evento: string; origem: string; destino: string; tipo: string; veiculo: string; status: string; motorista?: string; placa?: string; contato?: string }
type Db = { eventos: Evento[]; motoristas: Motorista[]; corridas: Corrida[]; usuarios: any[] }

const db0: Db = { eventos: [], motoristas: [], corridas: [], usuarios: [] }
const id = () => Math.random().toString(36).slice(2, 9)
const load = (): Db => { try { return { ...db0, ...JSON.parse(localStorage.getItem('pulseai_plus') || '{}') } } catch { return db0 } }
const fileToData = (f?: File) => new Promise<string>((ok) => { if (!f) return ok(''); const r = new FileReader(); r.onload = () => ok(String(r.result || '')); r.readAsDataURL(f) })

export default function AppPlus() {
  const [modal, setModal] = useState<Modal>(null)
  const [db, setDb] = useState<Db>(load)
  useEffect(() => { localStorage.setItem('pulseai_plus', JSON.stringify(db)) }, [db])
  useEffect(() => {
    const h = (ev: MouseEvent) => {
      const b = (ev.target as HTMLElement).closest('button');
      const t = b?.textContent || '';
      if (!b) return
      if (t.includes('Para quem sai')) { ev.preventDefault(); ev.stopPropagation(); setModal('quemSai'); return }
      if (t.includes('Para negócios') || t.includes('Quero cadastrar meu negócio')) { ev.preventDefault(); ev.stopPropagation(); setModal('parceiro'); return }
      if (t.includes('Cadastro de motorista') || t.includes('Quero me cadastrar como motorista')) { ev.preventDefault(); ev.stopPropagation(); setModal('motorista'); return }
      if (t.trim() === 'Perfil' || t.includes('Meu perfil')) { ev.preventDefault(); ev.stopPropagation(); setModal('usuario'); return }
      if (t.includes('Admin')) { ev.preventDefault(); ev.stopPropagation(); setModal('admin'); return }
    }
    document.addEventListener('click', h, true); return () => document.removeEventListener('click', h, true)
  }, [])
  return <><AppFinal /><div style={{ position: 'fixed', right: 18, bottom: 18, zIndex: 90, display: 'grid', gap: 8 }}><button className="ghost" onClick={() => setModal('parceiro')}>Área do parceiro</button><button className="ghost" onClick={() => setModal('usuario')}>Área do usuário</button></div>{modal === 'parceiro' && <Parceiro db={db} setDb={setDb} close={() => setModal(null)} />}{modal === 'motorista' && <MotoristaPainel db={db} setDb={setDb} close={() => setModal(null)} />}{modal === 'usuario' && <Usuario db={db} setDb={setDb} close={() => setModal(null)} />}{modal === 'admin' && <Admin db={db} setDb={setDb} close={() => setModal(null)} />}</>
}

function Shell({ title, close, children }: { title: string; close: () => void; children: React.ReactNode }) { return <div className="modal-back"><div className="modal-card" style={{ maxWidth: 1040, maxHeight: '88vh', overflow: 'auto' }}><div className="row-title"><strong>{title}</strong><button className="ghost" onClick={close}>Fechar</button></div>{children}</div></div> }

function QuemSai({ close }: { close: () => void }) {
  return <Shell title="Para quem sai" close={close}><div style={{ padding: 8 }}>
    <p style={{ fontWeight: 600 }}>Descubra mais rápido. Escolha melhor. Chegue mais fácil.</p>
    <p>O app mostra o que está acontecendo agora, filtra por música, ambiente e vibe, exibe lotação estimada, cardápio, promoções, combos, compra antecipada e transporte.</p>
    <div className="public-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginTop: 12 }}>
      {['Explorar agora', 'Mapa ao vivo', 'Falar com Will', 'Eventos e gastronomia', 'Favoritos', 'Transporte'].map((c) => <article key={c} style={{ borderRadius: 12, padding: 12, background: 'linear-gradient(135deg,#0f0f12,#121216)' }}><h4>{c}</h4></article>)}
    </div>
    <div style={{ display: 'flex', gap: 8, marginTop: 18 }}>
      <button className="primary">Explorar no app</button>
      <button className="secondary">Quero baixar</button>
      <button className="ghost">Criar perfil</button>
    </div>
  </div></Shell>
}

function Parceiro({ db, setDb, close }: { db: Db; setDb: (d: Db) => void; close: () => void }) {
  const [login, setLogin] = useState(false); const [foto, setFoto] = useState('')
  const [f, setF] = useState({ negocio: '', dono: '', whats: '', senha: '', nome: '', categoria: 'Bar / Pub', data: '', endereco: '', desc: '', genero: '', ambiente: '', lotacao: '60', vibe: 'Energia Alta', cashback: '5', ingresso: 'Reserva', combos: '', bebidas: '', promocoes: '', cardapio: '' })
  const publicar = () => { if (!f.negocio || !f.nome || !f.endereco) return alert('Preencha negócio, evento e endereço.'); const e: Evento = { id: id(), foto, ...f, alcance: 900 + Math.floor(Math.random() * 900), views: 300 + Math.floor(Math.random() * 600), checkins: 40 + Math.floor(Math.random() * 120), cliques: 80 + Math.floor(Math.random() * 180), vendas: 8 + Math.floor(Math.random() * 40), reacoes: 60 + Math.floor(Math.random() * 180) }; setDb({ ...db, eventos: [e, ...db.eventos] }); alert('Evento publicado. Ele aparece na Área do usuário desta versão piloto.') }
    return (
      <Shell title="Área do parceiro / Painel do estabelecimento" close={close}>
        {!login ? (
          <div className="form-grid">
            <div>
              <h3>Login do estabelecimento</h3>
              <input placeholder="Proprietário / dono" value={f.dono} onChange={e => setF({ ...f, dono: e.target.value })} />
              <input placeholder="Nome do negócio" value={f.negocio} onChange={e => setF({ ...f, negocio: e.target.value })} />
              <input placeholder="WhatsApp de recebimento" value={f.whats} onChange={e => setF({ ...f, whats: e.target.value })} />
              <input type="password" placeholder="Senha de acesso" value={f.senha} onChange={e => setF({ ...f, senha: e.target.value })} />
              <button className="secondary full" onClick={() => f.negocio && f.senha ? setLogin(true) : alert('Preencha negócio e senha.')}>Entrar no painel</button>
            </div>
            <div>
              <h3>O painel permite</h3>
              <p>Cadastrar evento, foto, categoria, data, endereço, gênero musical, ambiente, lotação, vibe, cashback, combos, bebidas, promoções, cardápio e ver métricas.</p>
            </div>
          </div>
        ) : (
          <>
            <div className="form-grid">
              <div>
                <h3>Cadastrar evento</h3>
                <input placeholder="Nome do evento" value={f.nome} onChange={e => setF({ ...f, nome: e.target.value })} />
                <select value={f.categoria} onChange={e => setF({ ...f, categoria: e.target.value })}>
                  <option>Bar / Pub</option>
                  <option>Restaurante</option>
                  <option>Casa de show</option>
                  <option>Produtor de eventos</option>
                  <option>Cultural</option>
                  <option>Gastronomia</option>
                  <option>Ambiente infantil</option>
                  <option>Modo Relax</option>
                </select>
                <input placeholder="Data e horário" value={f.data} onChange={e => setF({ ...f, data: e.target.value })} />
                <input placeholder="Endereço" value={f.endereco} onChange={e => setF({ ...f, endereco: e.target.value })} />
                <input type="file" accept="image/*" onChange={async e => setFoto(await fileToData(e.target.files?.[0]))} />
                {foto && <img src={foto} style={{ width: '100%', maxHeight: 170, objectFit: 'cover', borderRadius: 18 }} />}
                <textarea placeholder="Descrição" value={f.desc} onChange={e => setF({ ...f, desc: e.target.value })} />
                <input placeholder="Gênero musical" value={f.genero} onChange={e => setF({ ...f, genero: e.target.value })} />
                <input placeholder="Ambiente" value={f.ambiente} onChange={e => setF({ ...f, ambiente: e.target.value })} />
                <input placeholder="Lotação" value={f.lotacao} onChange={e => setF({ ...f, lotacao: e.target.value })} />
                <input placeholder="Vibe" value={f.vibe} onChange={e => setF({ ...f, vibe: e.target.value })} />
                <input placeholder="Cashback" value={f.cashback} onChange={e => setF({ ...f, cashback: e.target.value })} />
                <input placeholder="Ingressos / reserva" value={f.ingresso} onChange={e => setF({ ...f, ingresso: e.target.value })} />
                <input placeholder="Combos" value={f.combos} onChange={e => setF({ ...f, combos: e.target.value })} />
                <input placeholder="Bebidas" value={f.bebidas} onChange={e => setF({ ...f, bebidas: e.target.value })} />
                <input placeholder="Promoções" value={f.promocoes} onChange={e => setF({ ...f, promocoes: e.target.value })} />
                <input placeholder="Cardápio" value={f.cardapio} onChange={e => setF({ ...f, cardapio: e.target.value })} />
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  <button className="primary" onClick={publicar}>Publicar evento</button>
                  <button className="ghost" onClick={() => setLogin(false)}>Sair do painel</button>
                </div>
              </div>
              <div>
                <h3>Métricas</h3>
                <p>Após publicar, veja visualizações, cliques, check-ins, vendas e conversão neste painel.</p>
              </div>
            </div>
          </>
        )}
      </Shell>
    )
}

function Usuario({ db, setDb, close }: { db: Db; setDb: (d: Db) => void; close: () => void }) {
  const [u, setU] = useState({ nome: '', whats: '', endereco: '', pref: '' }); const [foto, setFoto] = useState(''); const [sel, setSel] = useState<Evento | undefined>(db.eventos[0]); const [ride, setRide] = useState({ tipo: 'Só ida', origem: '', veiculo: 'Mais rápido' })
  const solicitar = () => { if (!sel) return alert('Escolha um evento.'); const m = db.motoristas.find(x => x.online); const c: Corrida = { id: id(), usuario: u.nome || 'Usuário PulseAí', evento: sel.nome, origem: ride.origem || 'Minha localização', destino: sel.endereco, tipo: ride.tipo, veiculo: ride.veiculo, status: m ? 'Aceita' : 'Pendente', motorista: m?.nome, placa: m?.placa, contato: m?.contato }; setDb({ ...db, usuarios: [u, ...db.usuarios], corridas: [c, ...db.corridas] }); alert(m ? `Corrida aceita por ${m.nome}. Veículo ${m.veiculo}, placa ${m.placa}.` : 'Solicitação enviada. Aguardando motorista online.') }
  return <Shell title="Área do Usuário" close={close}><div className="form-grid"><div><h3>Cadastro do usuário</h3><input placeholder="Nome completo" value={u.nome} onChange={e => setU({ ...u, nome: e.target.value })} /><input placeholder="WhatsApp" value={u.whats} onChange={e => setU({ ...u, whats: e.target.value })} /><input placeholder="Endereço residencial" value={u.endereco} onChange={e => setU({ ...u, endereco: e.target.value })} /><input placeholder="Preferências" value={u.pref} onChange={e => setU({ ...u, pref: e.target.value })} /><input type="file" accept="image/*" onChange={async e => setFoto(await fileToData(e.target.files?.[0]))} />{foto && <img src={foto} style={{ width: 86, height: 86, objectFit: 'cover', borderRadius: 24 }} />}<button className="primary full" onClick={() => alert('Perfil privado salvo para validação do app.')}>Salvar perfil</button></div>{db.eventos.length > 0 && <div><h3>Experiências disponíveis</h3><div className="event-options">{db.eventos.map(e => <button key={e.id} className={sel?.id === e.id ? 'active' : ''} onClick={() => setSel(e)}><b>{e.nome}</b><span>{e.negocio} • {e.endereco}</span><small>{e.data} • Lotação {e.lotacao}% • {e.vibe}</small></button>)}</div></div>}</div>{sel && <div className="form-grid"><div><h3>Cardápio, combos e reservas</h3><p>{sel.desc}</p><div className="chips">{[sel.combos, sel.bebidas, sel.promocoes, sel.cardapio].join('\n').split('\n').filter(Boolean).map(i => <button key={i}>{i}</button>)}</div><button className="secondary full" onClick={() => alert(`Reserva enviada para ${sel.negocio} no WhatsApp ${sel.whats}.`)}>Finalizar compra/reserva</button></div><div><h3>Transporte</h3><div className="modal-options"><button className={ride.tipo === 'Só ida' ? 'active' : ''} onClick={() => setRide({ ...ride, tipo: 'Só ida' })}>Só ida</button><button className={ride.tipo === 'Só volta' ? 'active' : ''} onClick={() => setRide({ ...ride, tipo: 'Só volta' })}>Só volta</button><button className={ride.tipo === 'Ida + volta' ? 'active' : ''} onClick={() => setRide({ ...ride, tipo: 'Ida + volta' })}>Ida + volta</button></div><input placeholder="Origem" value={ride.origem} onChange={e => setRide({ ...ride, origem: e.target.value })} /><input disabled value={`Destino: ${sel.endereco}`} /><button className="primary full" onClick={solicitar}>Solicitar agora</button></div></div>}</Shell>
}

function MotoristaPainel({ db, setDb, close }: { db: Db; setDb: (d: Db) => void; close: () => void }) {
  const [m, setM] = useState({ nome: '', contato: '', veiculo: 'Carro', placa: '', cidade: '', disponibilidade: 'Ida + volta' })
  const salvar = () => { if (!m.nome || !m.contato || !m.placa) return alert('Preencha nome, contato e placa.'); setDb({ ...db, motoristas: [{ id: id(), ...m, online: true }, ...db.motoristas] }); alert('Motorista cadastrado e online.') }
  return <Shell title="Área do motorista" close={close}><div className="form-grid"><div><h3>Cadastro</h3><input placeholder="Nome completo" value={m.nome} onChange={e => setM({ ...m, nome: e.target.value })} /><input placeholder="WhatsApp" value={m.contato} onChange={e => setM({ ...m, contato: e.target.value })} /><select value={m.veiculo} onChange={e => setM({ ...m, veiculo: e.target.value })}><option>Carro</option><option>Moto</option></select><input placeholder="Placa" value={m.placa} onChange={e => setM({ ...m, placa: e.target.value })} /><input placeholder="Cidade" value={m.cidade} onChange={e => setM({ ...m, cidade: e.target.value })} /><select value={m.disponibilidade} onChange={e => setM({ ...m, disponibilidade: e.target.value })}><option>Só ida</option><option>Só volta</option><option>Ida + volta</option></select><button className="primary full" onClick={salvar}>Cadastrar e ficar online</button></div><div><h3>Corridas recebidas</h3>{db.corridas.length ? db.corridas.map(c => <div className="will-card" key={c.id}><b>{c.evento}</b><p>{c.usuario} • {c.tipo}<br />{c.origem} → {c.destino}<br />Status: {c.status}</p></div>) : <p>Nenhuma solicitação ainda.</p>}</div></div></Shell>
}

function Admin({ db, setDb, close }: { db: Db; setDb: (d: Db) => void; close: () => void }) {
  const [ok, setOk] = useState(false)
  const estabelecimentos = new Set(db.eventos.map(e => e.negocio)).size
  const alcance = db.eventos.reduce((a, e) => a + e.alcance, 0)
  const [key, setKey] = useState('')

  const views = db.eventos.reduce((a, e) => a + e.views, 0)
  const checkins = db.eventos.reduce((a, e) => a + e.checkins, 0)
  const cliques = db.eventos.reduce((a, e) => a + e.cliques, 0)
  const vendas = db.eventos.reduce((a, e) => a + e.vendas, 0)
  const reacoes = db.eventos.reduce((a, e) => a + e.reacoes, 0)
  const motoristasOnline = db.motoristas.filter(m => m.online).length
  const corridasPendentes = db.corridas.filter(c => c.status === 'Pendente').length
  const corridasAceitas = db.corridas.filter(c => c.status === 'Aceita').length
  const conversao = views ? Math.round((vendas / views) * 100) : 0

  return (
    <Shell title="Admin 🔒 acesso restrito" close={close}>
      {!ok ? (
        <div style={{ padding: 8 }}>
          <p>Admin 🔒 acesso restrito</p>
          <p>Área exclusiva do dono do PulseAí.</p>
          <input type="password" placeholder="Digite a chave de acesso" value={key} onChange={e => setKey(e.target.value)} />
          <div style={{ marginTop: 8 }}>
            <button className="secondary" onClick={() => key.trim() ? setOk(true) : alert('Digite a chave de acesso.')}>Entrar no dashboard</button>
            <button className="ghost" onClick={close} style={{ marginLeft: 8 }}>Fechar</button>
          </div>
        </div>
      ) : (
        <div>
          <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
            <article><small>Usuários</small><strong>{db.usuarios.length}</strong></article>
            <article><small>Estabelecimentos</small><strong>{estabelecimentos}</strong></article>
            <article><small>Eventos</small><strong>{db.eventos.length}</strong></article>
            <article><small>Motoristas</small><strong>{db.motoristas.length}</strong></article>
            <article><small>Motoristas online</small><strong>{motoristasOnline}</strong></article>
            <article><small>Corridas</small><strong>{db.corridas.length}</strong></article>
            <article><small>Corridas pendentes</small><strong>{corridasPendentes}</strong></article>
            <article><small>Corridas aceitas</small><strong>{corridasAceitas}</strong></article>
            <article><small>Visualizações</small><strong>{views}</strong></article>
            <article><small>Check-ins</small><strong>{checkins}</strong></article>
            <article><small>Vendas / reservas</small><strong>{vendas}</strong></article>
            <article><small>Reações</small><strong>{reacoes}</strong></article>
            <article><small>Conversão estimada</small><strong>{conversao}%</strong></article>
            <article><small>Alcance total</small><strong>{alcance}</strong></article>
            <article><small>Categorias ativas</small><strong>{new Set(db.eventos.map(e => e.categoria)).size}</strong></article>
            <article><small>Base operacional</small><strong>{db.eventos.length + db.motoristas.length + db.usuarios.length}</strong></article>
          </div>
          <div style={{ marginTop: 12 }}>
            <button className="ghost" onClick={() => { setOk(false); setKey('') }}>Sair do dashboard</button>
          </div>
        </div>
      )}
    </Shell>
  )
}
