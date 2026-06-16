# PulseAí — fases de execução para sair do protótipo e virar plataforma real

Este documento organiza a implantação do PulseAí em fases práticas, com foco em colocar o produto em operação comercial com usuários, estabelecimentos, motoristas e admin.

## Fase 0 — Protótipo publicado

Status: concluído.

Entrega atual:

- landing page publicada no GitHub Pages;
- experiência navegável do usuário final;
- área do parceiro simulada;
- área do motorista simulada;
- área do usuário simulada;
- admin restrito com KPIs simulados;
- jornadas de evento, cardápio, reação, transporte, favoritos e descoberta.

Uso recomendado:

- apresentação para estabelecimentos;
- coleta de feedback;
- validação de proposta de valor;
- pré-venda de pilotos.

## Fase 1 — Base real com Supabase

Status: iniciada.

Entrega desta fase:

- criar projeto Supabase;
- rodar `supabase/schema.sql`;
- rodar `supabase/seed.sql`;
- configurar `.env.local` com as chaves reais;
- criar buckets de imagens;
- ativar autenticação;
- preparar tabelas de usuários, negócios, eventos, cardápios, reações, check-ins, motoristas, corridas, pedidos e analytics.

Resultado esperado:

- dados deixam de ser mockados/localStorage;
- parceiros podem cadastrar eventos reais;
- motoristas podem entrar em operação;
- usuários podem criar perfil real;
- admin enxerga KPIs reais.

## Fase 2 — Login e perfis reais

Criar fluxos:

- cadastro de usuário final;
- cadastro de parceiro/estabelecimento;
- cadastro de motorista;
- login com e-mail/senha ou telefone;
- roles: `user`, `business`, `driver`, `admin`;
- perfil privado com nome, telefone, endereço, foto, preferências, pontos e histórico.

## Fase 3 — Painel do estabelecimento real

Criar painel com:

- login do parceiro;
- cadastro do negócio;
- cadastro do evento;
- upload de foto do evento/local;
- data e horário;
- endereço;
- gênero musical;
- tipo de ambiente;
- lotação estimada;
- combos;
- bebidas;
- promoções;
- cardápio;
- cashback;
- ingresso/reserva;
- WhatsApp de recebimento;
- métricas: alcance, visualizações, cliques, check-ins, vendas e reações.

## Fase 4 — Usuário final real

Criar experiência real com:

- explorar cidade;
- mapa;
- categorias;
- favoritos;
- check-in;
- reações à vibe;
- cardápio e combos;
- compra/reserva;
- transporte;
- recomendações do Will.

## Fase 5 — Motoristas em operação

Criar:

- painel do motorista;
- status online/offline;
- disponibilidade: só ida, só volta, ida + volta;
- aceite de corrida;
- dados visíveis ao usuário depois do aceite: nome, veículo, placa, avaliação e contato protegido;
- histórico de corridas.

## Fase 6 — WhatsApp, pagamento e notificações

Integrações:

- WhatsApp Cloud API para avisar estabelecimento e motorista;
- Mercado Pago para Pix/cartão;
- notificações por e-mail, push ou WhatsApp;
- confirmação automática de pedidos e reservas.

## Fase 7 — App mobile

Caminho recomendado:

1. PWA instalável;
2. empacotar com Capacitor;
3. gerar Android;
4. testar em celulares reais;
5. gerar iOS;
6. publicar na Google Play;
7. publicar na App Store.

## Fase 8 — Piloto comercial

Começar com:

- 3 a 5 estabelecimentos;
- 2 a 5 motoristas;
- público convidado;
- dashboard de métricas;
- plano comercial inicial.

Indicadores do piloto:

- usuários cadastrados;
- visualizações por evento;
- cliques em rota;
- pedidos/reservas;
- check-ins;
- reações;
- corridas solicitadas;
- retorno dos estabelecimentos.

## Critério para vender

O PulseAí pode ser vendido como piloto quando tiver:

- cadastro real de parceiro;
- cadastro real de evento;
- cardápio/combos reais;
- WhatsApp de recebimento;
- métricas mínimas reais;
- painel admin;
- termos comerciais claros.

O app só deve ir para loja quando login, banco, privacidade, suporte e estabilidade estiverem validados.