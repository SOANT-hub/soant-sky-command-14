
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { isAccessoryCompatible } from "@/utils/equipmentModels";

interface AccessoryItem {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  description?: string;
  model_compatibility?: string[];
}

interface AccessoryCatalogSelectorProps {
  brand: string;
  selectedAccessoryId: string;
  onAccessorySelect: (accessoryId: string) => void;
  parentEquipmentModel?: string;
  onCustomAccessoryChange?: (custom: { name: string; category: string } | null) => void;
}

const AccessoryCatalogSelector = ({ 
  brand, 
  selectedAccessoryId, 
  onAccessorySelect,
  parentEquipmentModel,
  onCustomAccessoryChange
}: AccessoryCatalogSelectorProps) => {
const [accessories, setAccessories] = useState<AccessoryItem[]>([]);
const [categories, setCategories] = useState<string[]>([]);
const [selectedCategory, setSelectedCategory] = useState("");
const [filteredAccessories, setFilteredAccessories] = useState<AccessoryItem[]>([]);
const [loading, setLoading] = useState(false);
const [customAccessoryName, setCustomAccessoryName] = useState("");
const { toast } = useToast();

  const fetchAccessories = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('accessory_catalog')
        .select('*')
        .eq('brand', brand)
        .order('category', { ascending: true })
        .order('name', { ascending: true });

      if (error) throw error;

      const accessoryData = data || [];
      setAccessories(accessoryData);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(accessoryData.map(item => item.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching accessories:', error);
      toast({
        title: "Erro",
        description: "Falha ao carregar catálogo de acessórios",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (brand) {
      fetchAccessories();
    }
  }, [brand]);

useEffect(() => {
  // Reset custom input when category or list changes
  setCustomAccessoryName("");
  onCustomAccessoryChange?.(null);
  onAccessorySelect("");

  if (selectedCategory) {
    let filtered = accessories.filter(acc => acc.category === selectedCategory);
    
    // Apply compatibility filter using the new compatibility function
    if (parentEquipmentModel) {
      filtered = filtered.filter(acc => 
        isAccessoryCompatible(acc.model_compatibility, parentEquipmentModel)
      );
    }
    
    setFilteredAccessories(filtered);
  } else {
    setFilteredAccessories([]);
  }
}, [selectedCategory, accessories, parentEquipmentModel]);

// Notify parent when user types a custom accessory name
useEffect(() => {
  if (customAccessoryName.trim() && selectedCategory) {
    onCustomAccessoryChange?.({ name: customAccessoryName.trim(), category: selectedCategory });
  } else {
    onCustomAccessoryChange?.(null);
  }
}, [customAccessoryName, selectedCategory]);

  if (loading) {
    return <div className="text-center py-4">Carregando catálogo...</div>;
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="category">Categoria</Label>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione uma categoria" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedCategory && (
        <div>
          <Label htmlFor="accessory">Acessório</Label>
          <Select value={selectedAccessoryId} onValueChange={onAccessorySelect}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione um acessório" />
            </SelectTrigger>
            <SelectContent>
              {filteredAccessories.length === 0 ? (
                <SelectItem value="no-items" disabled>
                  {parentEquipmentModel 
                    ? `Nenhum acessório compatível com ${parentEquipmentModel} nesta categoria`
                    : "Nenhum acessório disponível nesta categoria"
                  }
                </SelectItem>
              ) : (
                filteredAccessories.map((accessory) => (
                  <SelectItem key={accessory.id} value={accessory.id}>
                    <div>
                      <div className="font-medium">{accessory.name}</div>
                      {accessory.subcategory && (
                        <div className="text-sm text-muted-foreground">{accessory.subcategory}</div>
                      )}
                    </div>
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
      )}

      {selectedCategory && filteredAccessories.length === 0 && (
        <div className="space-y-2">
          <Label htmlFor="customAccessoryName">Outro (digitar)</Label>
          <Input
            id="customAccessoryName"
            placeholder="Digite o nome do acessório"
            value={customAccessoryName}
            onChange={(e) => setCustomAccessoryName(e.target.value)}
          />
        </div>
      )}

      {selectedAccessoryId && (
        <Card className="mt-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Detalhes do Acessório</CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const selectedAccessory = accessories.find(acc => acc.id === selectedAccessoryId);
              if (!selectedAccessory) return null;
              
              return (
                <div className="space-y-2">
                  <div>
                    <span className="font-medium">Nome:</span> {selectedAccessory.name}
                  </div>
                  {selectedAccessory.subcategory && (
                    <div>
                      <span className="font-medium">Subcategoria:</span> {selectedAccessory.subcategory}
                    </div>
                  )}
                  {selectedAccessory.description && (
                    <div>
                      <span className="font-medium">Descrição:</span> {selectedAccessory.description}
                    </div>
                  )}
                  {selectedAccessory.model_compatibility && selectedAccessory.model_compatibility.length > 0 && (
                    <div>
                      <span className="font-medium">Compatível com:</span> {selectedAccessory.model_compatibility.join(', ')}
                    </div>
                  )}
                </div>
              );
            })()}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AccessoryCatalogSelector;
