
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Equipment {
  id: string;
  name: string;
  equipment_type: string;
  serial_number?: string;
}

interface EquipmentSelectorProps {
  parentEquipmentId: string;
  selectedEquipmentId: string;
  onEquipmentSelect: (equipmentId: string) => void;
}

const EquipmentSelector = ({ parentEquipmentId, selectedEquipmentId, onEquipmentSelect }: EquipmentSelectorProps) => {
  const [availableEquipments, setAvailableEquipments] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchAvailableEquipments = async () => {
    setLoading(true);
    try {
      // Get all equipments except the parent equipment
      const { data: allEquipments, error: equipmentError } = await supabase
        .from('equipments')
        .select('id, name, equipment_type, serial_number')
        .neq('id', parentEquipmentId)
        .order('name');

      if (equipmentError) throw equipmentError;

      // Get already linked accessories for this parent
      const { data: linkedAccessories, error: accessoryError } = await supabase
        .from('equipment_accessories')
        .select('accessory_equipment_id')
        .eq('parent_equipment_id', parentEquipmentId)
        .eq('accessory_type', 'equipment');

      if (accessoryError) throw accessoryError;

      // Filter out already linked equipments
      const linkedIds = linkedAccessories?.map(acc => acc.accessory_equipment_id).filter(Boolean) || [];
      const available = allEquipments?.filter(eq => !linkedIds.includes(eq.id)) || [];

      setAvailableEquipments(available);
    } catch (error) {
      console.error('Error fetching available equipments:', error);
      toast({
        title: "Erro",
        description: "Falha ao carregar equipamentos disponíveis",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (parentEquipmentId) {
      fetchAvailableEquipments();
    }
  }, [parentEquipmentId]);

  const getEquipmentTypeLabel = (type: string) => {
    const types = {
      drone: 'Drone',
      bateria: 'Bateria',
      helice: 'Hélice',
      camera: 'Câmera',
      gimbal: 'Gimbal',
      carregador: 'Carregador',
      case: 'Case/Maleta',
      controle: 'Controle Remoto',
      sensor: 'Sensor',
      outros: 'Outros'
    };
    return types[type as keyof typeof types] || type;
  };

  return (
    <div>
      <Label htmlFor="equipment">Equipamento Cadastrado</Label>
      <Select value={selectedEquipmentId} onValueChange={onEquipmentSelect}>
        <SelectTrigger>
          <SelectValue placeholder="Selecione um equipamento" />
        </SelectTrigger>
        <SelectContent>
          {loading ? (
            <SelectItem value="loading" disabled>
              Carregando...
            </SelectItem>
          ) : availableEquipments.length === 0 ? (
            <SelectItem value="no-equipment" disabled>
              Nenhum equipamento disponível
            </SelectItem>
          ) : (
            availableEquipments.map((equipment) => (
              <SelectItem key={equipment.id} value={equipment.id}>
                {equipment.name} ({getEquipmentTypeLabel(equipment.equipment_type)})
                {equipment.serial_number && ` - ${equipment.serial_number}`}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default EquipmentSelector;
