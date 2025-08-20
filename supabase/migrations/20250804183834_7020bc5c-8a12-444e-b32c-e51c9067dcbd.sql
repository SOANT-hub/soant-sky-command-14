
-- Create accessory_catalog table to store pre-defined accessories organized by brand and category
CREATE TABLE public.accessory_catalog (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  brand text NOT NULL CHECK (brand IN ('DJI', 'Autel Robotics', 'Dahua')),
  category text NOT NULL,
  subcategory text,
  description text,
  model_compatibility text[], -- Array of compatible drone models
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on accessory_catalog
ALTER TABLE public.accessory_catalog ENABLE ROW LEVEL SECURITY;

-- Create policies for accessory_catalog
CREATE POLICY "Everyone can view accessory catalog" 
  ON public.accessory_catalog 
  FOR SELECT 
  USING (true);

CREATE POLICY "Everyone can create accessory catalog items" 
  ON public.accessory_catalog 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Everyone can update accessory catalog items" 
  ON public.accessory_catalog 
  FOR UPDATE 
  USING (true);

CREATE POLICY "Everyone can delete accessory catalog items" 
  ON public.accessory_catalog 
  FOR DELETE 
  USING (true);

-- Add trigger for updated_at
CREATE TRIGGER update_accessory_catalog_updated_at 
  BEFORE UPDATE ON public.accessory_catalog 
  FOR EACH ROW 
  EXECUTE FUNCTION public.update_updated_at_column();

-- Modify equipment_accessories table to support catalog items
ALTER TABLE public.equipment_accessories 
ADD COLUMN accessory_catalog_id uuid REFERENCES public.accessory_catalog(id),
ADD COLUMN accessory_type text CHECK (accessory_type IN ('equipment', 'catalog')) DEFAULT 'equipment';

-- Make accessory_equipment_id nullable since we might link to catalog instead
ALTER TABLE public.equipment_accessories 
ALTER COLUMN accessory_equipment_id DROP NOT NULL;

-- Add constraint to ensure either equipment or catalog is referenced
ALTER TABLE public.equipment_accessories 
ADD CONSTRAINT check_accessory_reference 
CHECK (
  (accessory_equipment_id IS NOT NULL AND accessory_catalog_id IS NULL AND accessory_type = 'equipment') OR
  (accessory_equipment_id IS NULL AND accessory_catalog_id IS NOT NULL AND accessory_type = 'catalog')
);

-- Insert sample accessory catalog data
INSERT INTO public.accessory_catalog (name, brand, category, subcategory, description, model_compatibility) VALUES
-- DJI Hélices
('Hélices padrão (pás principais)', 'DJI', 'Hélices (Propellers)', 'Padrão', 'Hélices originais do fabricante', ARRAY['Mavic 3', 'Air 2S', 'Mini 3']),
('Hélices de baixa ruído (Low-Noise)', 'DJI', 'Hélices (Propellers)', 'Low-Noise', 'Hélices com design para redução de ruído', ARRAY['Mavic 3', 'Air 2S']),
('Hélices reforçadas (High-performance)', 'DJI', 'Hélices (Propellers)', 'Carbono', 'Hélices de alto desempenho em fibra de carbono', ARRAY['Matrice 300', 'Matrice 30']),
('Kits de hélices sobressalentes', 'DJI', 'Hélices (Propellers)', 'Kit', 'Conjunto completo de hélices de reposição', ARRAY['Mavic 3', 'Air 2S', 'Mini 3']),

-- DJI Baterias
('Baterias inteligentes (Intelligent Flight)', 'DJI', 'Baterias', 'Inteligente', 'Bateria com sistema de gerenciamento inteligente', ARRAY['Mavic 3', 'Air 2S']),
('Baterias estendidas (Extended Capacity)', 'DJI', 'Baterias', 'Estendida', 'Bateria com maior capacidade para voos prolongados', ARRAY['Matrice 300', 'Matrice 30']),
('Estação de carregamento (Battery Charging Hub)', 'DJI', 'Baterias', 'Carregador', 'Hub para carregamento de múltiplas baterias', ARRAY['Mavic 3', 'Air 2S']),

-- DJI Câmeras/Gimbals
('Zenmuse Z30 - Zoom óptico 30x', 'DJI', 'Câmeras e Gimbals (Payloads Específicos)', 'Zoom', 'Câmera com zoom óptico de 30x para inspeções', ARRAY['Matrice 200', 'Matrice 300']),
('Zenmuse H20 / H20T - Multissensor', 'DJI', 'Câmeras e Gimbals (Payloads Específicos)', 'Multissensor', 'Sistema multissensor com wide, zoom, térmica e laser', ARRAY['Matrice 300']),
('Zenmuse XT2 - Câmera térmica FLIR', 'DJI', 'Câmeras e Gimbals (Payloads Específicos)', 'Térmica', 'Câmera térmica com sensor FLIR', ARRAY['Matrice 200', 'Matrice 300']),
('Zenmuse X5S / X7 - Alta performance', 'DJI', 'Câmeras e Gimbals (Payloads Específicos)', 'Cinema', 'Câmeras para filmagem aérea profissional', ARRAY['Inspire 2']),
('Zenmuse P1 - Fotogrametria', 'DJI', 'Câmeras e Gimbals (Payloads Específicos)', 'Mapeamento', 'Sensor full-frame para fotogrametria de precisão', ARRAY['Matrice 300']),
('Zenmuse L1 - LiDAR com RGB', 'DJI', 'Câmeras e Gimbals (Payloads Específicos)', 'LiDAR', 'Sistema LiDAR integrado com câmera RGB', ARRAY['Matrice 300']),

-- Autel
('Autel FLIR Boson - Térmica integrada', 'Autel Robotics', 'Câmeras e Gimbals (Payloads Específicos)', 'Térmica', 'Câmera térmica integrada FLIR Boson', ARRAY['EVO II Pro', 'EVO Max']),
('Autel 6K Camera', 'Autel Robotics', 'Câmeras e Gimbals (Payloads Específicos)', 'Cinema', 'Câmera 6K para filmagem profissional', ARRAY['EVO II Pro']),
('Multispectral Payload', 'Autel Robotics', 'Câmeras e Gimbals (Payloads Específicos)', 'Multiespectral', 'Sensor multiespectral para agricultura', ARRAY['EVO Max']),
('Baterias inteligentes Autel', 'Autel Robotics', 'Baterias', 'Inteligente', 'Sistema de bateria inteligente Autel', ARRAY['EVO II Pro', 'EVO Max']),

-- Dahua
('Câmera térmica TPC - Série industrial', 'Dahua', 'Câmeras e Gimbals (Payloads Específicos)', 'Térmica', 'Câmera térmica industrial de alta precisão', ARRAY['Dahua X820']),
('Câmera visível alta resolução', 'Dahua', 'Câmeras e Gimbals (Payloads Específicos)', 'Visível', 'Câmera de alta resolução para monitoramento', ARRAY['Dahua X820']),
('Payloads segurança pública', 'Dahua', 'Câmeras e Gimbals (Payloads Específicos)', 'Segurança', 'Sistemas especializados para segurança pública', ARRAY['Dahua X820']),

-- Controladores (Universal)
('Smart Controller DJI', 'DJI', 'Controladores e Estações de Comando', 'Controle', 'Controlador inteligente com tela integrada', ARRAY['Mavic 3', 'Air 2S']),
('Autel Smart Controller', 'Autel Robotics', 'Controladores e Estações de Comando', 'Controle', 'Controlador inteligente Autel', ARRAY['EVO II Pro', 'EVO Max']),
('Ground Station Pro', 'DJI', 'Controladores e Estações de Comando', 'Estação', 'Estação de solo para operações complexas', ARRAY['Matrice 300']),

-- Sensores Avançados
('Módulo RTK (Real-Time Kinematic)', 'DJI', 'Sensores e Módulos Avançados', 'RTK', 'Sistema de posicionamento de alta precisão', ARRAY['Matrice 300', 'Phantom 4 RTK']),
('Módulos ADS-B (AirSense)', 'DJI', 'Sensores e Módulos Avançados', 'ADS-B', 'Sistema de detecção de aeronaves', ARRAY['Matrice 300']),

-- Luzes e Alarmes
('Luzes de navegação estroboscópicas', 'DJI', 'Luzes e Alarmes', 'Navegação', 'Luzes para voo noturno e sinalização', ARRAY['Matrice 300', 'Mavic 3']),
('Luzes de busca spotlight LED', 'DJI', 'Luzes e Alarmes', 'Busca', 'Holofotes LED de alta potência', ARRAY['Matrice 300']),
('Alto-falantes (megafone)', 'DJI', 'Luzes e Alarmes', 'Audio', 'Sistema de alto-falante para comunicação', ARRAY['Matrice 300']),

-- Transporte
('Maletas rígidas (Hard Cases)', 'DJI', 'Estojos e Transporte', 'Maleta', 'Cases rígidos para proteção durante transporte', ARRAY['Mavic 3', 'Matrice 300']),
('Mochilas de campo', 'DJI', 'Estojos e Transporte', 'Mochila', 'Mochilas para operações rápidas em campo', ARRAY['Mini 3', 'Air 2S']),

-- Peças de Manutenção
('Motores sobressalentes', 'DJI', 'Peças de Substituição / Manutenção', 'Motor', 'Motores de reposição originais', ARRAY['Mavic 3', 'Matrice 300']),
('Sensores de voo (IMU, compasso)', 'DJI', 'Peças de Substituição / Manutenção', 'Sensor', 'Sensores críticos para navegação', ARRAY['Matrice 300']);
