import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { EQUIPMENT_MODELS } from "@/utils/equipmentModels";

interface Equipment {
  id: string;
  name: string;
  equipment_type: string;
  serial_number: string;
  sisant_registration: string;
  manufacturer: string;
  model: string;
  status: string;
  acquisition_date: string;
  value: number;
  location: string;
  responsible_user: string;
  observations: string;
}

interface EquipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  equipment?: Equipment | null;
}

export const EquipmentModal = ({ isOpen, onClose, equipment }: EquipmentModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    equipment_type: 'drone',
    serial_number: '',
    sisant_registration: '',
    manufacturer: '',
    model: '',
    status: 'ativo',
    acquisition_date: '',
    value: 0,
    location: '',
    responsible_user: '',
    observations: ''
  });
  const [loading, setLoading] = useState(false);
  const [availableModels, setAvailableModels] = useState<string[]>([]);

  useEffect(() => {
    if (equipment) {
      setFormData({
        name: equipment.name,
        equipment_type: equipment.equipment_type,
        serial_number: equipment.serial_number || '',
        sisant_registration: equipment.sisant_registration || '',
        manufacturer: equipment.manufacturer || '',
        model: equipment.model || '',
        status: equipment.status,
        acquisition_date: equipment.acquisition_date || '',
        value: equipment.value || 0,
        location: equipment.location || '',
        responsible_user: equipment.responsible_user || '',
        observations: equipment.observations || ''
      });
    } else {
      setFormData({
        name: '',
        equipment_type: 'drone',
        serial_number: '',
        sisant_registration: '',
        manufacturer: '',
        model: '',
        status: 'ativo',
        acquisition_date: '',
        value: 0,
        location: '',
        responsible_user: '',
        observations: ''
      });
    }
  }, [equipment, isOpen]);

  // Update available models when manufacturer changes
  useEffect(() => {
    const manufacturerKey = formData.manufacturer as keyof typeof EQUIPMENT_MODELS;
    
    if (formData.manufacturer && EQUIPMENT_MODELS[manufacturerKey]) {
      // Convert readonly array to mutable array using spread operator
      const models = [...EQUIPMENT_MODELS[manufacturerKey]];
      setAvailableModels(models);
      
      // Reset model if it's not available for the new manufacturer
      const currentModel = formData.model;
      if (currentModel && !models.some(model => model === currentModel)) {
        setFormData(prev => ({ ...prev, model: '' }));
      }
    } else {
      setAvailableModels([]);
      setFormData(prev => ({ ...prev, model: '' }));
    }
  }, [formData.manufacturer]);

  const sanitizeFormData = (data: typeof formData) => {
    return {
      ...data,
      serial_number: data.serial_number === '' ? null : data.serial_number,
      sisant_registration: data.sisant_registration === '' ? null : data.sisant_registration,
      manufacturer: data.manufacturer === '' ? null : data.manufacturer,
      model: data.model === '' ? null : data.model,
      acquisition_date: data.acquisition_date === '' ? null : data.acquisition_date,
      value: data.value || null,
      location: data.location === '' ? null : data.location,
      responsible_user: data.responsible_user === '' ? null : data.responsible_user,
      observations: data.observations === '' ? null : data.observations,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const sanitizedData = sanitizeFormData(formData);

      if (equipment) {
        const { error } = await supabase
          .from('equipments')
          .update(sanitizedData)
          .eq('id', equipment.id);

        if (error) {
          console.error('Error updating equipment:', error);
          toast.error(`Erro ao atualizar equipamento: ${error.message}`);
          return;
        }

        toast.success("Equipamento atualizado com sucesso!");
      } else {
        const { error } = await supabase
          .from('equipments')
          .insert([sanitizedData]);

        if (error) {
          console.error('Error creating equipment:', error);
          toast.error(`Erro ao criar equipamento: ${error.message}`);
          return;
        }

        toast.success("Equipamento criado com sucesso!");
      }

      onClose();
    } catch (error) {
      console.error('Error:', error);
      toast.error("Erro ao salvar equipamento");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {equipment ? 'Editar Equipamento' : 'Novo Equipamento'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Equipamento *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Digite o nome do equipamento"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Tipo de Equipamento</Label>
              <Select
                value={formData.equipment_type}
                onValueChange={(value) => handleChange('equipment_type', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="drone">Drone</SelectItem>
                  <SelectItem value="bateria">Bateria</SelectItem>
                  <SelectItem value="helice">Hélice</SelectItem>
                  <SelectItem value="camera">Câmera</SelectItem>
                  <SelectItem value="controle">Controle Remoto</SelectItem>
                  <SelectItem value="carregador">Carregador</SelectItem>
                  <SelectItem value="case">Case/Estojo</SelectItem>
                  <SelectItem value="acessorio">Acessório</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="serial_number">Número de Série</Label>
              <Input
                id="serial_number"
                value={formData.serial_number}
                onChange={(e) => handleChange('serial_number', e.target.value)}
                placeholder="Número de série do equipamento"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sisant_registration">Registro SISANT (ANAC)</Label>
              <Input
                id="sisant_registration"
                value={formData.sisant_registration}
                onChange={(e) => handleChange('sisant_registration', e.target.value)}
                placeholder="Registro SISANT"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Fabricante</Label>
              <Select
                value={formData.manufacturer}
                onValueChange={(value) => handleChange('manufacturer', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o fabricante" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DJI">DJI</SelectItem>
                  <SelectItem value="Autel Robotics">Autel Robotics</SelectItem>
                  <SelectItem value="Dahua">Dahua</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Modelo</Label>
              <Select
                value={formData.model}
                onValueChange={(value) => handleChange('model', value)}
                disabled={!formData.manufacturer || availableModels.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder={
                    !formData.manufacturer 
                      ? "Primeiro selecione o fabricante" 
                      : availableModels.length === 0 
                      ? "Nenhum modelo disponível"
                      : "Selecione o modelo"
                  } />
                </SelectTrigger>
                <SelectContent>
                  {availableModels.map((model) => (
                    <SelectItem key={model} value={model}>
                      {model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                  <SelectItem value="manutencao">Manutenção</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="acquisition_date">Data de Aquisição</Label>
              <Input
                id="acquisition_date"
                type="date"
                value={formData.acquisition_date}
                onChange={(e) => handleChange('acquisition_date', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="value">Valor (R$)</Label>
              <Input
                id="value"
                type="number"
                step="0.01"
                min="0"
                value={formData.value}
                onChange={(e) => handleChange('value', parseFloat(e.target.value) || 0)}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Localização</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                placeholder="Local onde o equipamento está armazenado"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="responsible_user">Responsável</Label>
              <Input
                id="responsible_user"
                value={formData.responsible_user}
                onChange={(e) => handleChange('responsible_user', e.target.value)}
                placeholder="Nome do responsável pelo equipamento"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="observations">Observações</Label>
            <Textarea
              id="observations"
              value={formData.observations}
              onChange={(e) => handleChange('observations', e.target.value)}
              placeholder="Observações adicionais sobre o equipamento"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? 'Salvando...' : (equipment ? 'Atualizar' : 'Criar')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EquipmentModal;
