export type Role = 'visitor' | 'user' | 'partner' | 'driver' | 'admin'
export type Category = 'Bombando' | 'Musica ao vivo' | 'Gastronomia' | 'Cultural' | 'Modo Relax' | 'Ambiente infantil'

export type MenuItem = {
  id: string
  type: string
  name: string
  price: string
  emoji: string
  detail: string
}

export type Experience = {
  id: string
  category: Category
  title: string
  distance: string
  schedule: string
  vibe: string
  crowd: number
  cashback: number
  checkins: number
  description: string
  imageGradient: string
  menu: MenuItem[]
}
