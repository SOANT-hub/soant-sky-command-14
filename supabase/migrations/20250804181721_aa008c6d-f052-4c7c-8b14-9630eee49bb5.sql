-- Fix security issues by adding SET search_path to functions and enabling RLS

-- Fix function search_path issues
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.get_next_equipment_sequence()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    next_seq INTEGER;
BEGIN
    UPDATE public.equipment_sequence 
    SET last_sequence_number = last_sequence_number + 1,
        updated_at = now()
    RETURNING last_sequence_number INTO next_seq;
    
    RETURN next_seq;
END;
$$;

CREATE OR REPLACE FUNCTION public.assign_equipment_sequence()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
    IF NEW.sequence_number IS NULL THEN
        NEW.sequence_number := public.get_next_equipment_sequence();
    END IF;
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.log_deleted_equipment()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    INSERT INTO public.equipment_history (
        original_equipment_id,
        sequence_number,
        name,
        equipment_type,
        serial_number,
        sisant_registration,
        manufacturer,
        model,
        status,
        acquisition_date,
        value,
        location,
        responsible_user,
        observations,
        deleted_by
    ) VALUES (
        OLD.id,
        OLD.sequence_number,
        OLD.name,
        OLD.equipment_type,
        OLD.serial_number,
        OLD.sisant_registration,
        OLD.manufacturer,
        OLD.model,
        OLD.status,
        OLD.acquisition_date,
        OLD.value,
        OLD.location,
        OLD.responsible_user,
        OLD.observations,
        auth.uid()
    );
    RETURN OLD;
END;
$$;

-- Enable RLS on equipment_sequence table
ALTER TABLE public.equipment_sequence ENABLE ROW LEVEL SECURITY;

-- Create policies for equipment_sequence (admin only)
CREATE POLICY "Only admins can view equipment sequence"
ON public.equipment_sequence
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can manage equipment sequence"
ON public.equipment_sequence
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));