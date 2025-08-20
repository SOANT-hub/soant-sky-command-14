-- Create equipments table for drones and accessories
CREATE TABLE public.equipments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  equipment_type TEXT NOT NULL DEFAULT 'drone',
  serial_number TEXT,
  sisant_registration TEXT,
  manufacturer TEXT,
  model TEXT,
  status TEXT NOT NULL DEFAULT 'ativo',
  acquisition_date DATE,
  value DECIMAL(10,2),
  location TEXT,
  responsible_user TEXT,
  observations TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.equipments ENABLE ROW LEVEL SECURITY;

-- Create policies for equipment access
CREATE POLICY "Everyone can view equipments" 
ON public.equipments 
FOR SELECT 
USING (true);

CREATE POLICY "Everyone can create equipments" 
ON public.equipments 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Everyone can update equipments" 
ON public.equipments 
FOR UPDATE 
USING (true);

CREATE POLICY "Everyone can delete equipments" 
ON public.equipments 
FOR DELETE 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_equipments_updated_at
BEFORE UPDATE ON public.equipments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();