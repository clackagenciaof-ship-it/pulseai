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
    imageGradient: 'radial-gradient(circle at 24% 22%, rgba(255,78,150,.50), transparent 27%), radial-gradient(circle at 72% 28%, rgba(255,148,77,.38), transparent 25%), linear-gradient(135deg,#35124B,#1A315A,#4A2418)',
    menu: [
      { id: 'combo-samba', type: 'Combo', name: 'Combo promocional', price: 'R$ 45', emoji: '01', detail: 'Acesso + item da casa' },
      { id: 'bebida-casa', type: 'Bebida', name: 'Bebida da casa', price: 'R$ 18', emoji: '02', detail: 'Opcao selecionada pelo estabelecimento' },
      { id: 'petisco-misto', type: 'Petisco', name: 'Petisco misto', price: 'R$ 32', emoji: '03', detail: 'Porcao para compartilhar' },
      { id: 'combo-premium', type: 'Premium', name: 'Entrada + 2 itens', price: 'R$ 85', emoji: '04', detail: 'Voucher antecipado' }
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
    imageGradient: 'radial-gradient(circle at 25% 25%, rgba(34,231,215,.38), transparent 28%), radial-gradient(circle at 76% 30%, rgba(255,78,150,.34), transparent 24%), linear-gradient(135deg,#1A1E54,#0E2C52,#241126)',
    menu: [
      { id: 'couvert', type: 'Combo', name: 'Entrada + item da casa', price: 'R$ 36', emoji: '01', detail: 'Combo especial do evento' },
      { id: 'burger', type: 'Prato', name: 'Burger artesanal', price: 'R$ 28', emoji: '02', detail: 'Prato publicado pelo local' },
      { id: 'drink', type: 'Bebida', name: 'Drink tropical', price: 'R$ 22', emoji: '03', detail: 'Bebida promocional' }
    ]
  },
  {
    id: 'sabores-cidade',
    category: 'Gastronomia',
    title: 'Festival Sabores da Cidade',
    distance: '1,4 km',
    schedule: 'Hoje, 19h as 23h',
    vibe: 'Familiar',
    crowd: 61,
    cashback: 6,
    checkins: 124,
    description: 'Cardapio variado, preco acessivel e boa opcao para grupos.',
    imageGradient: 'radial-gradient(circle at 30% 20%, rgba(255,148,77,.52), transparent 28%), radial-gradient(circle at 75% 30%, rgba(34,231,215,.22), transparent 26%), linear-gradient(135deg,#341A0F,#51251E,#15344A)',
    menu: [
      { id: 'prato-chef', type: 'Prato', name: 'Prato do chef', price: 'R$ 39', emoji: '01', detail: 'Prato destaque do dia' },
      { id: 'combo-casal', type: 'Combo', name: 'Combo para dois', price: 'R$ 72', emoji: '02', detail: 'Opcao para casal ou dupla' },
      { id: 'sobremesa', type: 'Sobremesa', name: 'Sobremesa da casa', price: 'R$ 18', emoji: '03', detail: 'Finalizacao especial' }
    ]
  },
  {
    id: 'mostra-cultural',
    category: 'Cultural',
    title: 'Mostra Cultural no Teatro Cidade',
    distance: '2,8 km',
    schedule: 'Hoje, 20h as 22h',
    vibe: 'Cultural',
    crowd: 38,
    cashback: 3,
    checkins: 58,
    description: 'Programacao cultural, entrada acessivel e boa avaliacao do publico.',
    imageGradient: 'radial-gradient(circle at 28% 25%, rgba(139,92,246,.48), transparent 26%), radial-gradient(circle at 74% 28%, rgba(34,231,215,.24), transparent 24%), linear-gradient(135deg,#2A154B,#113151,#091725)',
    menu: [
      { id: 'ingresso-cultural', type: 'Ingresso', name: 'Ingresso cultural', price: 'R$ 20', emoji: '01', detail: 'Acesso ao evento' },
      { id: 'combo-cafe', type: 'Combo', name: 'Cafe + bolo', price: 'R$ 19', emoji: '02', detail: 'Combo do foyer' }
    ]
  },
  {
    id: 'lounge-mirante',
    category: 'Modo Relax',
    title: 'Lounge Mirante',
    distance: '1,2 km',
    schedule: 'Hoje, 18h as 01h',
    vibe: 'Relax',
    crowd: 35,
    cashback: 4,
    checkins: 66,
    description: 'Vibe tranquila, lotacao leve e ambiente confortavel.',
    imageGradient: 'radial-gradient(circle at 20% 20%, rgba(255,215,106,.45), transparent 24%), radial-gradient(circle at 74% 34%, rgba(139,92,246,.34), transparent 26%), linear-gradient(135deg,#101E44,#16394F,#30194A)',
    menu: [
      { id: 'drink-relax', type: 'Bebida', name: 'Drink assinado', price: 'R$ 24', emoji: '01', detail: 'Bebida autoral' },
      { id: 'combo-sunset', type: 'Combo', name: 'Combo sunset', price: 'R$ 52', emoji: '02', detail: 'Combo para o fim de tarde' }
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
      { id: 'combo-kids', type: 'Combo', name: 'Combo kids', price: 'R$ 29', emoji: '01', detail: 'Mini prato + suco + brinde' },
      { id: 'playground', type: 'Experiencia', name: 'Acesso playground', price: 'R$ 12', emoji: '02', detail: 'Area de jogos e brinquedos' }
    ]
  }
]
