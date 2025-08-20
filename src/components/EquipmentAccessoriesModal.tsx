
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AddAccessoryModal from "./AddAccessoryModal";

interface EquipmentAccessory {
  id: string;
  quantity: number;
  notes?: string;
  accessory_type: string;
  equipments?: {
    id: string;
    name: string;
    equipment_type: string;
    serial_number?: string;
    status: string;
  };
  accessory_catalog?: {
    id: string;
    name: string;
    brand: string;
    category: string;
    subcategory?: string;
  };
}

interface EquipmentAccessoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  equipmentId: string;
  equipmentName: string;
}

const EquipmentAccessoriesModal = ({ isOpen, onClose, equipmentId, equipmentName }: EquipmentAccessoriesModalProps) => {
  const [accessories, setAccessories] = useState<EquipmentAccessory[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const { toast } = useToast();

  const fetchAccessories = async () => {
    if (!equipmentId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('equipment_accessories')
        .select(`
          id,
          quantity,
          notes,
          accessory_type,
          equipments!accessory_equipment_id (
            id,
            name,
            equipment_type,
            serial_number,
            status
          ),
          accessory_catalog!accessory_catalog_id (
            id,
            name,
            brand,
            category,
            subcategory
          )
        `)
        .eq('parent_equipment_id', equipmentId);

      if (error) throw error;
      setAccessories(data || []);
    } catch (error) {
      console.error('Error fetching accessories:', error);
      toast({
        title: "Erro",
        description: "Falha ao carregar acessórios",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && equipmentId) {
      fetchAccessories();
    }
  }, [isOpen, equipmentId]);

  const handleRemoveAccessory = async (accessoryId: string, accessoryName: string) => {
    if (!confirm(`Tem certeza que deseja desvincular o acessório "${accessoryName}"?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('equipment_accessories')
        .delete()
        .eq('id', accessoryId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Acessório desvinculado com sucesso",
      });
      
      fetchAccessories();
    } catch (error) {
      console.error('Error removing accessory:', error);
      toast({
        title: "Erro",
        description: "Falha ao desvincular acessório",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ativo':
        return <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-200">Ativo</Badge>;
      case 'inativo':
        return <Badge variant="secondary">Inativo</Badge>;
      case 'manutencao':
        return <Badge variant="destructive" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Manutenção</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

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

  const getAccessoryDisplayName = (accessory: EquipmentAccessory) => {
    if (accessory.accessory_type === 'equipment' && accessory.equipments) {
      return accessory.equipments.name;
    }
    if (accessory.accessory_type === 'catalog' && accessory.accessory_catalog) {
      return accessory.accessory_catalog.name;
    }
    return 'Nome não disponível';
  };

  const getAccessoryType = (accessory: EquipmentAccessory) => {
    if (accessory.accessory_type === 'equipment' && accessory.equipments) {
      return getEquipmentTypeLabel(accessory.equipments.equipment_type);
    }
    if (accessory.accessory_type === 'catalog' && accessory.accessory_catalog) {
      return accessory.accessory_catalog.category;
    }
    return 'Tipo não disponível';
  };

  const getAccessorySerialOrBrand = (accessory: EquipmentAccessory) => {
    if (accessory.accessory_type === 'equipment' && accessory.equipments) {
      return accessory.equipments.serial_number || '-';
    }
    if (accessory.accessory_type === 'catalog' && accessory.accessory_catalog) {
      return accessory.accessory_catalog.brand;
    }
    return '-';
  };

  const getAccessoryStatus = (accessory: EquipmentAccessory) => {
    if (accessory.accessory_type === 'equipment' && accessory.equipments) {
      return getStatusBadge(accessory.equipments.status);
    }
    return <Badge variant="outline">Catálogo</Badge>;
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Acessórios de {equipmentName}</span>
              <Button 
                onClick={() => setShowAddModal(true)} 
                size="sm"
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Adicionar Acessório
              </Button>
            </DialogTitle>
          </DialogHeader>

          <div className="mt-4">
            {loading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Carregando acessórios...</p>
              </div>
            ) : accessories.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Nenhum acessório vinculado</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Clique em "Adicionar Acessório" para vincular equipamentos ou itens do catálogo
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Tipo/Categoria</TableHead>
                    <TableHead>Série/Marca</TableHead>
                    <TableHead>Quantidade</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Observações</TableHead>
                    <TableHead className="w-[100px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accessories.map((accessory) => (
                    <TableRow key={accessory.id}>
                      <TableCell className="font-medium">
                        {getAccessoryDisplayName(accessory)}
                      </TableCell>
                      <TableCell>{getAccessoryType(accessory)}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {getAccessorySerialOrBrand(accessory)}
                      </TableCell>
                      <TableCell>{accessory.quantity}</TableCell>
                      <TableCell>{getAccessoryStatus(accessory)}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {accessory.notes || '-'}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveAccessory(accessory.id, getAccessoryDisplayName(accessory))}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <AddAccessoryModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        parentEquipmentId={equipmentId}
        onAccessoryAdded={fetchAccessories}
      />
    </>
  );
};

export default EquipmentAccessoriesModal;
