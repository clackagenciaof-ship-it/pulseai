# PulseAí — Onde a cidade pulsa agora

**PulseAí** é uma plataforma inteligente para descoberta em tempo real de experiências urbanas: eventos, música ao vivo, gastronomia, cultura, combos, cardápios, check-ins, transporte programado, motoristas e métricas para negócios.

> Não mostra só onde é hoje. Mostra onde a vida urbana realmente acontece — e te leva até lá.

## Frentes do produto

1. **Usuário final** — descobre experiências, pergunta ao Will, vê lotação/vibe, consulta cardápio, reserva combo, programa transporte e reage à vibe.
2. **Negócios e promotores** — cadastram estabelecimento, eventos, fotos, cardápio, bebidas, combos e acompanham métricas.
3. **Motoristas** — cadastro de carro/moto para corridas de ida, volta ou ida + volta.
4. **Admin** — área restrita para aprovação, moderação, métricas, receita e expansão.

## Status do MVP

- React + TypeScript + CSS
- Vite
- PWA instalável
- Capacitor preparado para Android/iOS
- Dados mockados com localStorage
- Supabase preparado para backend real
- GitHub Actions para build e deploy no GitHub Pages

## Rodar localmente

```bash
npm install
npm run dev
```

Acesse:

```bash
http://localhost:5173
```

## Build

```bash
npm run build
npm run preview
```

## Mobile com Capacitor

```bash
npm run build
npx cap sync
npx cap add android
npx cap open android
```

iOS exige Mac com Xcode:

```bash
npx cap add ios
npx cap open ios
```

## Publicação web

Este repositório está preparado para GitHub Pages. Depois do primeiro workflow rodar, habilite:

```txt
Settings → Pages → Build and deployment → Source: GitHub Actions
```

URL esperada:

```txt
https://clackagenciaof-ship-it.github.io/pulseai/
```

## Autor

Criação estratégica: **Will / Clack Growth Company**

Direitos reservados • Clack Growth Company
