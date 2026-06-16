# PulseAí — Onde a cidade pulsa agora

MVP web publicado no GitHub Pages como protótipo navegável de descoberta urbana em tempo real.

## Versão atual

A versão atual entrega uma landing page premium com experiência mobile simulada e jornadas clicáveis para:

- usuário final;
- parceiro / estabelecimento;
- motorista;
- administrador restrito.

## Funcionalidades incluídas no protótipo

- Explorar experiências urbanas.
- Mapa com pins e locais próximos.
- Categorias: Bombando, Música ao vivo, Gastronomia, Cultural, Modo Relax e Ambiente infantil.
- Perguntas rápidas para o Will.
- Detalhe de evento com endereço, distância, horário, vibe, lotação, check-ins e cashback.
- Cardápio, combos e bebidas com lista de reserva.
- Reagir à vibe.
- Transporte com só ida, só volta e ida + volta.
- Área do parceiro com cadastro de evento e métricas.
- Área do motorista com cadastro, placa e disponibilidade.
- Área do usuário com perfil privado.
- Admin com KPIs principais.

## Fase real iniciada

A implantação real começou com a base para Supabase:

- `.env.example` com variáveis de ambiente;
- `supabase/schema.sql` com banco de dados do MVP;
- `supabase/seed.sql` com dados iniciais para teste;
- `src/lib/supabase.ts` com cliente Supabase;
- `docs/FASES_DE_EXECUCAO.md` com o plano de execução comercial.

## Próximo passo prático

1. Criar um projeto no Supabase.
2. Copiar o conteúdo de `supabase/schema.sql` e executar no SQL Editor.
3. Copiar o conteúdo de `supabase/seed.sql` e executar no SQL Editor.
4. Criar `.env.local` com `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`.
5. Começar a trocar os dados simulados da interface pelos dados reais do Supabase.

## Objetivo

Validar a experiência, apresentar comercialmente o produto e transformar o protótipo em uma plataforma real com login, banco de dados, parceiros, motoristas, eventos, cardápios, métricas e operação comercial.