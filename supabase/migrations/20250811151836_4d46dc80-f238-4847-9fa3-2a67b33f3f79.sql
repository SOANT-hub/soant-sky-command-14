-- Create pilots table for pilot management
CREATE TABLE public.pilots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  functional_id TEXT NOT NULL UNIQUE,
  allocation TEXT,
  courses TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.pilots ENABLE ROW LEVEL SECURITY;

-- Create policies for pilot access
CREATE POLICY "Everyone can view pilots" 
ON public.pilots 
FOR SELECT 
USING (true);

CREATE POLICY "Everyone can create pilots" 
ON public.pilots 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Everyone can update pilots" 
ON public.pilots 
FOR UPDATE 
USING (true);

CREATE POLICY "Everyone can delete pilots" 
ON public.pilots 
FOR DELETE 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_pilots_updated_at
BEFORE UPDATE ON public.pilots
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();