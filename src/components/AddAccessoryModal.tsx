
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AccessoryCatalogSelector from "./accessories/AccessoryCatalogSelector";
import EquipmentSelector from "./accessories/EquipmentSelector";

interface AddAccessoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  parentEquipmentId: string;
  onAccessoryAdded: () => void;
}

const AddAccessoryModal = ({ isOpen, onClose, parentEquipmentId, onAccessoryAdded }: AddAccessoryModalProps) => {
  const [accessoryType, setAccessoryType] = useState<"catalog" | "equipment">("catalog");
const [selectedBrand, setSelectedBrand] = useState("DJI");
const [selectedCatalogId, setSelectedCatalogId] = useState("");
const [customCatalogAccessory, setCustomCatalogAccessory] = useState<{ name: string; category: string } | null>(null);
const [selectedEquipmentId, setSelectedEquipmentId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [parentEquipmentModel, setParentEquipmentModel] = useState("");
  const { toast } = useToast();

  // Fetch parent equipment info to get model for compatibility filtering
  useEffect(() => {
    const fetchParentEquipment = async () => {
      if (parentEquipmentId) {
        try {
          const { data, error } = await supabase
            .from('equipments')
            .select('model')
            .eq('id', parentEquipmentId)
            .single();

          if (error) throw error;
          setParentEquipmentModel(data?.model || "");
        } catch (error) {
          console.error('Error fetching parent equipment:', error);
        }
      }
    };

if (isOpen) {
  fetchParentEquipment();
  // Reset form
  setAccessoryType("catalog");
  setSelectedBrand("DJI");
  setSelectedCatalogId("");
  setCustomCatalogAccessory(null);
  setSelectedEquipmentId("");
  setQuantity(1);
  setNotes("");
}
  }, [isOpen, parentEquipmentId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
if (accessoryType === "catalog" && !selectedCatalogId && !customCatalogAccessory?.name) {
  toast({
    title: "Erro",
    description: "Selecione um acessório do catálogo ou digite um nome",
    variant: "destructive",
  });
  return;
}

    if (accessoryType === "equipment" && !selectedEquipmentId) {
      toast({
        title: "Erro",
        description: "Selecione um equipamento para vincular",
        variant: "destructive",
      });
      return;
    }

setSubmitting(true);
try {
  let accessoryCatalogIdToUse = selectedCatalogId;

  // If user typed a custom accessory name, create it in the catalog first
  if (accessoryType === "catalog" && !selectedCatalogId && customCatalogAccessory?.name) {
    const { data: newAcc, error: accErr } = await supabase
      .from('accessory_catalog')
      .insert({
        name: customCatalogAccessory.name.trim(),
        brand: selectedBrand,
        category: customCatalogAccessory.category,
        subcategory: null,
        description: null,
        model_compatibility: parentEquipmentModel ? [parentEquipmentModel] : null
      })
      .select('id')
      .single();
    if (accErr) throw accErr;
    accessoryCatalogIdToUse = newAcc.id;
  }

  const insertData = {
    parent_equipment_id: parentEquipmentId,
    quantity,
    notes: notes.trim() || null,
    accessory_type: accessoryType,
    ...(accessoryType === "catalog" 
      ? { accessory_catalog_id: accessoryCatalogIdToUse }
      : { accessory_equipment_id: selectedEquipmentId }
    )
  };

  const { error } = await supabase
    .from('equipment_accessories')
    .insert(insertData);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Acessório vinculado com sucesso",
      });

      onAccessoryAdded();
      onClose();
    } catch (error) {
      console.error('Error adding accessory:', error);
      toast({
        title: "Erro",
        description: "Falha ao vincular acessório",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

const isFormValid = () => {
  if (accessoryType === "catalog") {
    return selectedCatalogId || !!customCatalogAccessory?.name;
  }
  return !!selectedEquipmentId;
};

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adicionar Acessório</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tipo de Acessório */}
          <div className="space-y-3">
            <Label>Tipo de Acessório</Label>
            <RadioGroup 
              value={accessoryType} 
              onValueChange={(value) => setAccessoryType(value as "catalog" | "equipment")}
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="catalog" id="catalog" />
                <Label htmlFor="catalog">Do Catálogo (Novo Item)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="equipment" id="equipment" />
                <Label htmlFor="equipment">Equipamento Existente</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Seleção do Acessório */}
          {accessoryType === "catalog" ? (
            <Tabs value={selectedBrand} onValueChange={setSelectedBrand} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="DJI">DJI</TabsTrigger>
                <TabsTrigger value="Autel Robotics">Autel Robotics</TabsTrigger>
                <TabsTrigger value="Dahua">Dahua</TabsTrigger>
              </TabsList>
              
<TabsContent value="DJI" className="space-y-4">
  <AccessoryCatalogSelector
    brand="DJI"
    selectedAccessoryId={selectedCatalogId}
    onAccessorySelect={setSelectedCatalogId}
    parentEquipmentModel={parentEquipmentModel}
    onCustomAccessoryChange={setCustomCatalogAccessory}
  />
</TabsContent>
              
<TabsContent value="Autel Robotics" className="space-y-4">
  <AccessoryCatalogSelector
    brand="Autel Robotics"
    selectedAccessoryId={selectedCatalogId}
    onAccessorySelect={setSelectedCatalogId}
    parentEquipmentModel={parentEquipmentModel}
    onCustomAccessoryChange={setCustomCatalogAccessory}
  />
</TabsContent>
              
<TabsContent value="Dahua" className="space-y-4">
  <AccessoryCatalogSelector
    brand="Dahua"
    selectedAccessoryId={selectedCatalogId}
    onAccessorySelect={setSelectedCatalogId}
    parentEquipmentModel={parentEquipmentModel}
    onCustomAccessoryChange={setCustomCatalogAccessory}
  />
</TabsContent>
            </Tabs>
          ) : (
            <EquipmentSelector
              parentEquipmentId={parentEquipmentId}
              selectedEquipmentId={selectedEquipmentId}
              onEquipmentSelect={setSelectedEquipmentId}
            />
          )}

          {/* Quantidade */}
          <div>
            <Label htmlFor="quantity">Quantidade</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              required
            />
          </div>

          {/* Observações */}
          <div>
            <Label htmlFor="notes">Observações (Opcional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Observações sobre este acessório..."
              rows={3}
            />
          </div>

          {/* Botões */}
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={submitting || !isFormValid()}
            >
              {submitting ? "Vinculando..." : "Vincular Acessório"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddAccessoryModal;
