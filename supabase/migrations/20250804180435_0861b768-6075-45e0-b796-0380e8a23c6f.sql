-- Create equipment_accessories table to link main equipment to their accessories
CREATE TABLE public.equipment_accessories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  parent_equipment_id UUID NOT NULL,
  accessory_equipment_id UUID NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.equipment_accessories ENABLE ROW LEVEL SECURITY;

-- Create policies for equipment_accessories
CREATE POLICY "Everyone can view equipment accessories" 
ON public.equipment_accessories 
FOR SELECT 
USING (true);

CREATE POLICY "Everyone can create equipment accessories" 
ON public.equipment_accessories 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Everyone can update equipment accessories" 
ON public.equipment_accessories 
FOR UPDATE 
USING (true);

CREATE POLICY "Everyone can delete equipment accessories" 
ON public.equipment_accessories 
FOR DELETE 
USING (true);

-- Add foreign key constraints
ALTER TABLE public.equipment_accessories 
ADD CONSTRAINT equipment_accessories_parent_equipment_id_fkey 
FOREIGN KEY (parent_equipment_id) REFERENCES public.equipments(id) ON DELETE CASCADE;

ALTER TABLE public.equipment_accessories 
ADD CONSTRAINT equipment_accessories_accessory_equipment_id_fkey 
FOREIGN KEY (accessory_equipment_id) REFERENCES public.equipments(id) ON DELETE CASCADE;

-- Add unique constraint to prevent duplicate accessories for same parent
ALTER TABLE public.equipment_accessories 
ADD CONSTRAINT equipment_accessories_parent_accessory_unique 
UNIQUE (parent_equipment_id, accessory_equipment_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_equipment_accessories_updated_at
BEFORE UPDATE ON public.equipment_accessories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();