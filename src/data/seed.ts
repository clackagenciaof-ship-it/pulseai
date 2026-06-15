import type { Experience } from '../types'

export const categories = ['Bombando', 'Musica ao vivo', 'Gastronomia', 'Cultural', 'Modo Relax', 'Ambiente infantil'] as const

export const experiences: Experience[] = [
  {
    id: 'samba-boteco-ze',
    category: 'Bombando',
    title: 'Noite de Samba no Boteco do Ze',
    distance: '1,8 km',
    schedule: 'Hoje, 20h as 02h',
    vibe: 'Energia Alta',
    crowd: 72,
    cashback: 5,
    checkins: 148,
    description: 'Samba ao vivo, combo ativo, cardapio publicado e lotacao boa para chegar agora.',
    imageGradient: 'linear-gradient(135deg,#35124B,#1A315A,#4A2418)',
    menu: [
      { id: 'combo-samba', type: 'Combo', name: 'Samba + Cerveja', price: 'R$ 45', emoji: '🍺', detail: '1 entrada + 1 cerveja long neck' },
      { id: 'caipirinha', type: 'Bebida', name: 'Caipirinha da Casa', price: 'R$ 18', emoji: '🍹', detail: 'Limao, gelo e dose especial' },
      { id: 'tabua', type: 'Petisco', name: 'Tabua Mista', price: 'R$ 32', emoji: '🧀', detail: 'Frios, torradas e molhos' }
    ]
  },
  {
    id: 'mpb-pub-estacao',
    category: 'Musica ao vivo',
    title: 'MPB Acustico no Pub Estacao',
    distance: '2,1 km',
    schedule: 'Hoje, 21h as 00h',
    vibe: 'Acolhedor',
    crowd: 54,
    cashback: 4,
    checkins: 93,
    description: 'Show intimista, mesas disponiveis e ambiente acolhedor.',
    imageGradient: 'linear-gradient(135deg,#1A1E54,#0E2C52,#241126)',
    menu: [
      { id: 'couvert', type: 'Combo', name: 'Couvert + drink', price: 'R$ 36', emoji: '🎤', detail: 'Entrada com drink da casa' },
      { id: 'burger', type: 'Prato', name: 'Burger Artesanal', price: 'R$ 28', emoji: '🍔', detail: 'Pao brioche e batata' }
    ]
  },
  {
    id: 'kids-games',
    category: 'Ambiente infantil',
    title: 'Espaco Kids e Games',
    distance: '3,2 km',
    schedule: 'Hoje, 17h as 22h',
    vibe: 'Infantil',
    crowd: 44,
    cashback: 5,
    checkins: 79,
    description: 'Brinquedos, jogos, alimentacao para familias e espaco seguro.',
    imageGradient: 'linear-gradient(135deg,#0F2D46,#3A1851,#4A2F14)',
    menu: [
      { id: 'combo-kids', type: 'Combo', name: 'Combo Kids', price: 'R$ 29', emoji: 'K', detail: 'Mini burger + suco + brinde' },
      { id: 'playground', type: 'Experiencia', name: 'Acesso Playground', price: 'R$ 12', emoji: 'G', detail: 'Area de jogos e brinquedos' }
    ]
  }
]
