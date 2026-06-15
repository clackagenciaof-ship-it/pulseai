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
    description: 'Musica ao vivo, combo ativo, cardapio publicado e lotacao boa para chegar agora.',
    imageGradient: 'radial-gradient(circle at 30% 20%, rgba(255,78,150,.55), transparent 26%), radial-gradient(circle at 70% 22%, rgba(255,148,77,.45), transparent 24%), linear-gradient(135deg,#35124B,#1A315A,#4A2418)',
    menu: [
      { id: 'combo-samba', type: 'Combo', name: 'Combo promocional', price: 'R$ 45', emoji: '01', detail: 'Acesso + item da casa' },
      { id: 'suco', type: 'Bebida', name: 'Suco da Casa', price: 'R$ 12', emoji: '02', detail: 'Opcao refrescante da casa' },
      { id: 'tabua', type: 'Petisco', name: 'Tabua Mista', price: 'R$ 32', emoji: '03', detail: 'Petiscos e molhos' }
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
    imageGradient: 'radial-gradient(circle at 24% 22%, rgba(34,231,215,.42), transparent 26%), radial-gradient(circle at 76% 30%, rgba(255,78,150,.38), transparent 24%), linear-gradient(135deg,#1A1E54,#0E2C52,#241126)',
    menu: [
      { id: 'couvert', type: 'Combo', name: 'Entrada + item da casa', price: 'R$ 36', emoji: '01', detail: 'Combo especial do evento' },
      { id: 'burger', type: 'Prato', name: 'Burger Artesanal', price: 'R$ 28', emoji: '02', detail: 'Pao brioche e acompanhamento' }
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
    imageGradient: 'radial-gradient(circle at 24% 24%, rgba(34,231,215,.36), transparent 28%), radial-gradient(circle at 72% 28%, rgba(255,148,77,.35), transparent 24%), linear-gradient(135deg,#0F2D46,#3A1851,#4A2F14)',
    menu: [
      { id: 'combo-kids', type: 'Combo', name: 'Combo Kids', price: 'R$ 29', emoji: '01', detail: 'Mini prato + suco + brinde' },
      { id: 'playground', type: 'Experiencia', name: 'Acesso Playground', price: 'R$ 12', emoji: '02', detail: 'Area de jogos e brinquedos' }
    ]
  }
]
