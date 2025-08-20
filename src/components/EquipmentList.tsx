import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit2, Trash2, Search, Settings, History } from "lucide-react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import EquipmentModal from "./EquipmentModal";
import EquipmentAccessoriesModal from "./EquipmentAccessoriesModal";
import EquipmentHistoryModal from "./EquipmentHistoryModal";

interface Equipment {
  id: string;
  sequence_number: number;
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

const EquipmentList = () => {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [filteredEquipments, setFilteredEquipments] = useState<Equipment[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [showAccessoriesModal, setShowAccessoriesModal] = useState(false);
  const [selectedEquipmentForAccessories, setSelectedEquipmentForAccessories] = useState<Equipment | null>(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetchEquipments();
    checkAdminRole();
  }, []);

  useEffect(() => {
    const filtered = equipments.filter(equipment =>
      equipment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipment.serial_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipment.manufacturer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipment.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipment.sequence_number?.toString().includes(searchTerm)
    );
    setFilteredEquipments(filtered);
  }, [equipments, searchTerm]);

  const fetchEquipments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('equipments')
        .select('*')
        .order('sequence_number', { ascending: true });

      if (error) {
        console.error('Error fetching equipments:', error);
        toast.error("Erro ao carregar equipamentos");
        return;
      }

      setEquipments(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error("Erro ao carregar equipamentos");
    } finally {
      setLoading(false);
    }
  };

  const checkAdminRole = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .maybeSingle();
        
        if (!error && data) {
          setIsAdmin(true);
        }
      }
    } catch (error) {
      console.error('Error checking admin role:', error);
    }
  };

  const handleEdit = (equipment: Equipment) => {
    setSelectedEquipment(equipment);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este equipamento?")) {
      return;
    }

    try {
      const { error } = await supabase
        .from('equipments')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting equipment:', error);
        toast.error("Erro ao excluir equipamento");
        return;
      }

      toast.success("Equipamento excluído com sucesso!");
      fetchEquipments();
    } catch (error) {
      console.error('Error:', error);
      toast.error("Erro ao excluir equipamento");
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedEquipment(null);
    fetchEquipments();
  };

  const handleOpenAccessories = (equipment: Equipment) => {
    setSelectedEquipmentForAccessories(equipment);
    setShowAccessoriesModal(true);
  };

  const handleAccessoriesModalClose = () => {
    setShowAccessoriesModal(false);
    setSelectedEquipmentForAccessories(null);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      ativo: { label: "Ativo", variant: "default" as const },
      inativo: { label: "Inativo", variant: "secondary" as const },
      manutencao: { label: "Manutenção", variant: "destructive" as const },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.ativo;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getEquipmentTypeLabel = (type: string) => {
    const types = {
      drone: "Drone",
      bateria: "Bateria",
      helice: "Hélice",
      camera: "Câmera",
      controle: "Controle Remoto",
      carregador: "Carregador",
      case: "Case/Estojo",
      acessorio: "Acessório"
    };
    return types[type as keyof typeof types] || type;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Carregando equipamentos...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>Lista de Equipamentos</CardTitle>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar equipamentos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full sm:w-64"
                  />
                </div>
                {isAdmin && (
                  <Button
                    variant="outline"
                    onClick={() => setShowHistoryModal(true)}
                    className="w-full sm:w-auto"
                  >
                    <History className="h-4 w-4 mr-2" />
                    Histórico
                  </Button>
                )}
                <Button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full sm:w-auto"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Equipamento
                </Button>
              </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">#</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Nº Série</TableHead>
                  <TableHead>Registro SISANT</TableHead>
                  <TableHead>Fabricante</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Responsável</TableHead>
                  <TableHead className="text-right w-[200px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEquipments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      {searchTerm ? "Nenhum equipamento encontrado com os filtros aplicados." : "Nenhum equipamento cadastrado."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEquipments.map((equipment) => (
                    <TableRow key={equipment.id}>
                      <TableCell className="font-mono text-sm font-semibold text-muted-foreground">
                        #{String(equipment.sequence_number).padStart(4, '0')}
                      </TableCell>
                      <TableCell className="font-medium">{equipment.name}</TableCell>
                      <TableCell>{getEquipmentTypeLabel(equipment.equipment_type)}</TableCell>
                      <TableCell>{equipment.serial_number || "-"}</TableCell>
                      <TableCell>{equipment.sisant_registration || "-"}</TableCell>
                      <TableCell>{equipment.manufacturer || "-"}</TableCell>
                      <TableCell>{getStatusBadge(equipment.status)}</TableCell>
                      <TableCell>{equipment.responsible_user || "-"}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {equipment.equipment_type === 'drone' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenAccessories(equipment)}
                              title="Gerenciar Acessórios"
                            >
                              <Settings className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(equipment)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(equipment.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <EquipmentModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        equipment={selectedEquipment}
      />

      <EquipmentAccessoriesModal
        isOpen={showAccessoriesModal}
        onClose={handleAccessoriesModalClose}
        equipmentId={selectedEquipmentForAccessories?.id || ''}
        equipmentName={selectedEquipmentForAccessories?.name || ''}
      />

      <EquipmentHistoryModal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
      />
    </>
  );
};

export default EquipmentList;