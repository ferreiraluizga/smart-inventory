TRUNCATE TABLE produtos, pedidos, itens_pedido RESTART IDENTITY CASCADE;
TRUNCATE TABLE categorias, marcas, fornecedores RESTART IDENTITY CASCADE;
-- ==========================================
-- 1. POPULAR A TABELA DE CATEGORIAS
-- ==========================================
INSERT INTO categorias (nome, descricao) VALUES
                                             ('Eletrônicos', 'Dispositivos eletrônicos, gadgets e acessórios tecnológicos.'),
                                             ('Eletrodomésticos', 'Aparelhos para cozinha, lavanderia e uso doméstico geral.'),
                                             ('Informática', 'Computadores, notebooks, periféricos e componentes de hardware.'),
                                             ('Móveis', 'Móveis para escritório, sala de estar, quarto e cozinha.'),
                                             ('Ferramentas', 'Ferramentas manuais, elétricas e equipamentos de medição.'),
                                             ('Iluminação', 'Lâmpadas LED, luminárias, fitas inteligentes e refletores.'),
                                             ('Papelaria', 'Artigos de escritório, cadernos, papéis e materiais de escrita.'),
                                             ('Segurança', 'Câmeras de monitoramento, alarmes, sensores e fechaduras digitais.');

-- ==========================================
-- 2. POPULAR A TABELA DE MARCAS
-- ==========================================
INSERT INTO marcas (nome) VALUES
                              ('Samsung'),
                              ('Apple'),
                              ('Dell'),
                              ('Logitech'),
                              ('Bosch'),
                              ('Philips'),
                              ('Tramontina'),
                              ('Intelbras'),
                              ('LG'),
                              ('HP');

-- ==========================================
-- 3. POPULAR A TABELA DE FORNECEDORES
-- ==========================================
INSERT INTO fornecedores (nome, cnpj, email) VALUES
                                                 ('Distribuidora Tech Brasil Ltda', '12345678000199', 'contato@techbrasil.com.br'),
                                                 ('Global Eletro Atacadista', '98765432000188', 'vendas@globaleletro.com'),
                                                 ('Logística e Suprimentos Norte-Sul', '45678912000177', 'suprimentos@nortesul.com'),
                                                 ('Inovação Comercial S.A.', '78912345000166', 'parceiros@inovacao.ind.br'),
                                                 ('Meta Atacado de Ferramentas', '32165498000155', 'comercial@metaferramentas.com.br'),
                                                 ('Luz & Vida Materiais Elétricos', '65498732000144', 'faturamento@luzevida.com'),
                                                 ('Office Express Distribuidora', '11223344000133', 'corporativo@officeexpress.com'),
                                                 ('Segurança Máxima Equipamentos', '55667788000122', 'vendas@segurancamaxima.com');


-- ==========================================
-- 4. POPULAR A TABELA DE PRODUTOS (TESTES)
-- ==========================================
INSERT INTO produtos (nome, descricao, preco, quantidade, ativo, fornecedor_id, categoria_id, marca_id) VALUES
                                                                                                            ('Smartphone Galaxy S24 Ultra', 'Smartphone premium com inteligência artificial, 256GB de armazenamento.', 5999.00, 15, TRUE, 1, 1, 1),
                                                                                                            ('Smart TV OLED 55 Inches', 'Televisor 4K UHD com taxa de atualização de 120Hz e inteligência artificial.', 4299.90, 8, TRUE, 1, 1, 1),
                                                                                                            ('iPhone 15 Pro Max', 'Titânio natural, tela Super Retina XDR de 6.7 polegadas e câmera de 48MP.', 7499.00, 10, TRUE, 1, 1, 2),
                                                                                                            ('Notebook Dell Inspiron 15', 'Processador Intel Core i5, 16GB RAM, 512GB SSD e tela FHD de 15.6 polegadas.', 3499.00, 12, TRUE, 3, 3, 3),
                                                                                                            ('Mouse Sem Fio MX Master 3S', 'Mouse ergonômico de alta precisão com rolagem ultra rápida e cliques silenciosos.', 499.90, 45, TRUE, 2, 3, 4),
                                                                                                            ('Teclado Mecânico Pop Keys', 'Teclado mecânico Bluetooth com teclas de emoji customizáveis e design retrô.', 399.00, 20, TRUE, 2, 3, 4),
                                                                                                            ('Parafusadeira de Impacto 18V', 'Parafusadeira e furadeira a bateria com maleta e duas baterias inclusas.', 649.00, 25, TRUE, 5, 5, 5),
                                                                                                            ('Martelete Perfurador SDS-Plus', 'Martelete elétrico profissional com força de impacto de 2.7 Joules.', 899.00, 6, TRUE, 5, 5, 5),
                                                                                                            ('Lâmpada Inteligente Hue Wifi', 'Lâmpada LED colorida de 9W com integração para Alexa e Google Assistant.', 189.90, 120, TRUE, 6, 6, 6),
                                                                                                            ('Fita LED Inteligente 2 Metros', 'Fita de iluminação decorativa RGBW inteligente e expansível.', 279.00, 40, TRUE, 6, 6, 6),
                                                                                                            ('Jogo de Panelas Inox 5 Peças', 'Conjunto de panelas com fundo triplo de alta condução térmica.', 459.00, 30, TRUE, 4, 2, 7),
                                                                                                            ('Câmera Wi-Fi Externa iM5', 'Câmera de segurança Full HD com visão noturna e gravação em cartão MicroSD.', 329.00, 50, TRUE, 8, 8, 8),
                                                                                                            ('Fechadura Digital de Embutir FR 101', 'Fechadura digital com teclado numérico e capacidade para até 9 senhas.', 419.00, 18, TRUE, 8, 8, 8),
                                                                                                            ('Ar Condicionado Inverter 12000 BTU', 'Ar condicionado Split frio com economia de energia de até 70%.', 2199.00, 14, TRUE, 2, 2, 9),
                                                                                                            ('Impressora Multifuncional Ink Advantage', 'Impressora térmica colorida com conexão sem fio Wi-Fi e scanner.', 449.00, 22, TRUE, 7, 7, 10);

-- ==========================================
-- 5. POPULAR A TABELA DE PEDIDOS (ATUALIZADO)
-- ==========================================
INSERT INTO pedidos (fornecedor_id, data_pedido, data_vencimento, data_pagamento, total, status) VALUES
    (1, '2026-06-26 10:00:00', '2026-07-15 14:00:00', NULL, 44993.00, 'PENDENTE');

INSERT INTO pedidos (fornecedor_id, data_pedido, data_vencimento, data_pagamento, total, status) VALUES
    (8, '2026-06-25 09:15:00', '2026-06-30 18:00:00', '2026-06-26 15:30:00', 5385.00, 'PAGO');

INSERT INTO pedidos (fornecedor_id, data_pedido, data_vencimento, data_pagamento, total, status) VALUES
    (2, '2026-06-26 14:20:00', '2026-08-10 12:00:00', NULL, 21293.50, 'PENDENTE');


-- ==========================================
-- 6. POPULAR A TABELA DE ITENS DOS PEDIDOS
-- ==========================================
INSERT INTO itens_pedido (pedido_id, produto_id, quant, subtotal) VALUES
                                                                      (1, 1, 5, 29995.00),
                                                                      (1, 3, 2, 14998.00),
                                                                      (2, 12, 10, 3290.00),
                                                                      (2, 13, 5, 2095.00),
                                                                      (3, 5, 25, 12497.50),
                                                                      (3, 14, 4, 8796.00);