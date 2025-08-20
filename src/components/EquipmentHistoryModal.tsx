import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface EquipmentHistory {
  id: string;
  sequence_number: number;
  name: string;
  equipment_type: string;
  serial_number?: string;
  sisant_registration?: string;
  manufacturer?: string;
  status: string;
  deleted_at: string;
}

interface EquipmentHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EquipmentHistoryModal = ({ isOpen, onClose }: EquipmentHistoryModalProps) => {
  const [history, setHistory] = useState<EquipmentHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('equipment_history')
        .select('id, sequence_number, name, equipment_type, serial_number, sisant_registration, manufacturer, status, deleted_at')
        .order('deleted_at', { ascending: false });

      if (error) throw error;
      setHistory(data || []);
    } catch (error) {
      console.error('Error fetching equipment history:', error);
      toast({
        title: "Erro",
        description: "Falha ao carregar histórico de equipamentos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchHistory();
    }
  }, [isOpen]);

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Histórico de Equipamentos Excluídos</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-auto">
          {loading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Carregando histórico...</p>
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Nenhum equipamento excluído encontrado</p>
            </div>
          ) : (
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
                  <TableHead>Excluído em</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono text-sm font-semibold text-destructive">
                      #{String(item.sequence_number).padStart(4, '0')}
                    </TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{getEquipmentTypeLabel(item.equipment_type)}</TableCell>
                    <TableCell>{item.serial_number || "-"}</TableCell>
                    <TableCell>{item.sisant_registration || "-"}</TableCell>
                    <TableCell>{item.manufacturer || "-"}</TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(item.deleted_at)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EquipmentHistoryModal;