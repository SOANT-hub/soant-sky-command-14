
-- Fix the get_next_equipment_sequence function to include WHERE clause
CREATE OR REPLACE FUNCTION public.get_next_equipment_sequence()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
    next_seq INTEGER;
BEGIN
    -- Update the single record in equipment_sequence table
    UPDATE public.equipment_sequence 
    SET last_sequence_number = last_sequence_number + 1,
        updated_at = now()
    WHERE id = (SELECT id FROM public.equipment_sequence LIMIT 1)
    RETURNING last_sequence_number INTO next_seq;
    
    -- If no record exists, create one and return 1
    IF next_seq IS NULL THEN
        INSERT INTO public.equipment_sequence (last_sequence_number)
        VALUES (1)
        RETURNING last_sequence_number INTO next_seq;
    END IF;
    
    RETURN next_seq;
END;
$function$
