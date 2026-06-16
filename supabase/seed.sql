-- PulseAí — dados mockados para validar o MVP real
-- Rodar depois do schema.sql no Supabase SQL Editor.

insert into public.businesses (id, owner_name, name, category, description, whatsapp, address, city, latitude, longitude, cover_image_url, status, is_partner)
values
  ('11111111-1111-1111-1111-111111111111','Boteco do Zé','Boteco do Zé','Bar / Música ao vivo','Bar com samba ao vivo, combos e petiscos.','5599999999999','Rua das Flores, Centro','Floriano',-6.7669,-43.0225,'','approved',true),
  ('22222222-2222-2222-2222-222222222222','Pub Estação','Pub Estação','Pub / Música ao vivo','Pub com MPB, rock e noites acústicas.','5599999999998','Rua São Pedro, Centro','Floriano',-6.7680,-43.0230,'','approved',true),
  ('33333333-3333-3333-3333-333333333333','Espaço Kids & Games','Espaço Kids & Games','Ambiente infantil','Espaço para famílias com brinquedos, jogos e alimentação.','5599999999997','Shopping da Cidade','Floriano',-6.7600,-43.0200,'','approved',true)
on conflict (id) do nothing;

insert into public.events (id, business_id, title, description, category, event_date, start_time, end_time, address, city, latitude, longitude, music_genre, environment_type, estimated_capacity_percent, cashback_percent, is_live, status, tags)
values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','11111111-1111-1111-1111-111111111111','Noite de Samba no Boteco do Zé','Samba ao vivo, combo ativo, cardápio publicado e lotação boa para chegar agora.','Bombando',current_date,'20:00','02:00','Rua das Flores, Centro','Floriano',-6.7669,-43.0225,'Samba','Energia alta',72,5,true,'published',array['samba','bar','combos']),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','22222222-2222-2222-2222-222222222222','MPB Acústico no Pub Estação','Show intimista, mesas disponíveis e ambiente acolhedor.','Música ao vivo',current_date,'21:00','00:00','Rua São Pedro, Centro','Floriano',-6.7680,-43.0230,'MPB','Acolhedor',54,4,true,'published',array['mpb','pub','ao vivo']),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc','33333333-3333-3333-3333-333333333333','Espaço Kids & Games','Brinquedos, jogos, alimentação para famílias e espaço seguro.','Ambiente infantil',current_date,'17:00','22:00','Shopping da Cidade','Floriano',-6.7600,-43.0200,'Infantil','Familiar',61,3,false,'published',array['kids','familia','jogos'])
on conflict (id) do nothing;

insert into public.menu_items (business_id, event_id, type, title, description, price, active)
values
  ('11111111-1111-1111-1111-111111111111','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','combo','Combo Samba + Cerveja','Entrada + cerveja long neck',45,true),
  ('11111111-1111-1111-1111-111111111111','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','bebida','Caipirinha da Casa','Limão, gelo e dose especial',18,true),
  ('11111111-1111-1111-1111-111111111111','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','petisco','Tábua Mista','Frios, torradas e molhos',32,true),
  ('22222222-2222-2222-2222-222222222222','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','combo','Couvert + drink','Entrada + drink da casa',36,true),
  ('33333333-3333-3333-3333-333333333333','cccccccc-cccc-cccc-cccc-cccccccccccc','combo','Combo Família','2 pizzas pequenas + suco',59,true);
