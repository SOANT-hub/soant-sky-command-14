-- Create flights table for flight registration
CREATE TABLE public.flights (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  equipment_id UUID NOT NULL REFERENCES public.equipments(id) ON DELETE RESTRICT,
  location TEXT NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  end_time TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'em_voo' CHECK (status IN ('em_voo', 'finalizado', 'cancelado')),
  created_by UUID NOT NULL,
  incidents TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create flight accessories table to track accessories used in each flight
CREATE TABLE public.flight_accessories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  flight_id UUID NOT NULL REFERENCES public.flights(id) ON DELETE CASCADE,
  accessory_id UUID NOT NULL REFERENCES public.equipment_accessories(id) ON DELETE RESTRICT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on flights table
ALTER TABLE public.flights ENABLE ROW LEVEL SECURITY;

-- Create policies for flights
CREATE POLICY "Everyone can view flights" 
ON public.flights 
FOR SELECT 
USING (true);

CREATE POLICY "Everyone can create flights" 
ON public.flights 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Everyone can update flights" 
ON public.flights 
FOR UPDATE 
USING (true);

CREATE POLICY "Everyone can delete flights" 
ON public.flights 
FOR DELETE 
USING (true);

-- Enable RLS on flight accessories table
ALTER TABLE public.flight_accessories ENABLE ROW LEVEL SECURITY;

-- Create policies for flight accessories
CREATE POLICY "Everyone can view flight accessories" 
ON public.flight_accessories 
FOR SELECT 
USING (true);

CREATE POLICY "Everyone can create flight accessories" 
ON public.flight_accessories 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Everyone can update flight accessories" 
ON public.flight_accessories 
FOR UPDATE 
USING (true);

CREATE POLICY "Everyone can delete flight accessories" 
ON public.flight_accessories 
FOR DELETE 
USING (true);

-- Create trigger for automatic timestamp updates on flights
CREATE TRIGGER update_flights_updated_at
BEFORE UPDATE ON public.flights
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();