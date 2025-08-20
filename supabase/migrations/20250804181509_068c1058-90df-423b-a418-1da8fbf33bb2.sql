-- Create app_role enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create equipment_sequence table to track sequential numbers
CREATE TABLE public.equipment_sequence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    last_sequence_number INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert initial sequence record
INSERT INTO public.equipment_sequence (last_sequence_number) VALUES (0);

-- Create equipment_history table for deleted equipment records
CREATE TABLE public.equipment_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    original_equipment_id UUID NOT NULL,
    sequence_number INTEGER NOT NULL,
    name TEXT NOT NULL,
    equipment_type TEXT NOT NULL,
    serial_number TEXT,
    sisant_registration TEXT,
    manufacturer TEXT,
    model TEXT,
    status TEXT,
    acquisition_date DATE,
    value NUMERIC,
    location TEXT,
    responsible_user TEXT,
    observations TEXT,
    deleted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    deleted_by UUID REFERENCES auth.users(id)
);

-- Enable RLS on equipment_history
ALTER TABLE public.equipment_history ENABLE ROW LEVEL SECURITY;

-- Add sequence_number column to equipments table
ALTER TABLE public.equipments 
ADD COLUMN sequence_number INTEGER UNIQUE;

-- Create function to get next sequence number
CREATE OR REPLACE FUNCTION public.get_next_equipment_sequence()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
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

-- Create trigger function to auto-assign sequence number
CREATE OR REPLACE FUNCTION public.assign_equipment_sequence()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF NEW.sequence_number IS NULL THEN
        NEW.sequence_number := public.get_next_equipment_sequence();
    END IF;
    RETURN NEW;
END;
$$;

-- Create trigger for auto-assigning sequence numbers
CREATE TRIGGER equipment_sequence_trigger
    BEFORE INSERT ON public.equipments
    FOR EACH ROW
    EXECUTE FUNCTION public.assign_equipment_sequence();

-- Create function to handle equipment deletion and logging
CREATE OR REPLACE FUNCTION public.log_deleted_equipment()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
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

-- Create trigger for logging deleted equipment
CREATE TRIGGER equipment_deletion_log_trigger
    BEFORE DELETE ON public.equipments
    FOR EACH ROW
    EXECUTE FUNCTION public.log_deleted_equipment();

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage all roles"
ON public.user_roles
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for equipment_history (admin only)
CREATE POLICY "Only admins can view equipment history"
ON public.equipment_history
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can manage equipment history"
ON public.equipment_history
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Update existing equipments with sequence numbers (for existing data)
DO $$
DECLARE
    eq RECORD;
    seq_num INTEGER := 1;
BEGIN
    FOR eq IN SELECT id FROM public.equipments ORDER BY created_at LOOP
        UPDATE public.equipments 
        SET sequence_number = seq_num 
        WHERE id = eq.id;
        seq_num := seq_num + 1;
    END LOOP;
    
    -- Update the sequence counter
    UPDATE public.equipment_sequence 
    SET last_sequence_number = seq_num - 1;
END $$;