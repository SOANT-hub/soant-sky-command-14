
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MapPin, Search, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LocationPickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

interface LatLng {
  lat: number;
  lng: number;
}

const LocationPicker: React.FC<LocationPickerProps> = ({ value, onChange, placeholder = "Digite o local do voo" }) => {
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [coordinates, setCoordinates] = useState<LatLng | null>(null);
  const { toast } = useToast();

  // Geocoding usando Nominatim API
  const searchLocation = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&countrycodes=br&limit=1`
      );
      const data = await response.json();

      if (data.length > 0) {
        const location = data[0];
        const lat = parseFloat(location.lat);
        const lng = parseFloat(location.lon);
        setCoordinates({ lat, lng });
        
        const locationString = `${location.display_name} (Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)})`;
        onChange(locationString);
        
        toast({
          title: "Localização encontrada",
          description: location.display_name,
        });
      } else {
        toast({
          title: "Localização não encontrada",
          description: "Tente um termo mais específico",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro na busca",
        description: "Não foi possível buscar a localização",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  // Obter localização atual do usuário
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocalização não suportada",
        description: "Seu navegador não suporta geolocalização",
        variant: "destructive",
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setCoordinates({ lat, lng });

        // Reverse geocoding para obter o endereço
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
          );
          const data = await response.json();
          const address = data.display_name || `Localização atual`;
          const locationString = `${address} (Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)})`;
          onChange(locationString);
          
          toast({
            title: "Localização obtida",
            description: "Sua localização atual foi definida com sucesso",
          });
        } catch (error) {
          const locationString = `Localização atual (Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)})`;
          onChange(locationString);
          
          toast({
            title: "Localização obtida",
            description: "Coordenadas obtidas com sucesso",
          });
        }
      },
      (error) => {
        toast({
          title: "Erro ao obter localização",
          description: "Não foi possível obter sua localização atual",
          variant: "destructive",
        });
      }
    );
  };

  const handleConfirmLocation = () => {
    setIsMapOpen(false);
    if (coordinates) {
      toast({
        title: "Local confirmado",
        description: "Local do voo atualizado com sucesso",
      });
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1"
        />
        <Dialog open={isMapOpen} onOpenChange={setIsMapOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon" title="Selecionar localização">
              <MapPin className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Selecionar Local do Voo</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {/* Barra de Busca */}
              <div className="flex gap-2">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar endereço ou local..."
                  onKeyPress={(e) => e.key === "Enter" && searchLocation()}
                  className="flex-1"
                />
                <Button onClick={searchLocation} disabled={isSearching} size="icon" title="Buscar">
                  <Search className="h-4 w-4" />
                </Button>
              </div>

              {/* Botão para localização atual */}
              <div className="flex justify-center">
                <Button 
                  onClick={getCurrentLocation} 
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Target className="h-4 w-4" />
                  Usar minha localização atual
                </Button>
              </div>

              {/* Exibição das coordenadas */}
              {coordinates && (
                <div className="p-4 bg-muted rounded-lg border">
                  <h4 className="font-medium mb-2">Coordenadas selecionadas:</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Latitude:</span> {coordinates.lat.toFixed(6)}
                    </div>
                    <div>
                      <span className="font-medium">Longitude:</span> {coordinates.lng.toFixed(6)}
                    </div>
                  </div>
                  <div className="mt-3 p-2 bg-background rounded border">
                    <span className="text-xs text-muted-foreground">Link Google Maps:</span>
                    <a 
                      href={`https://www.google.com/maps?q=${coordinates.lat},${coordinates.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline ml-2"
                    >
                      Ver no Google Maps
                    </a>
                  </div>
                </div>
              )}

              {/* Botões de Ação */}
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setIsMapOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleConfirmLocation} disabled={!coordinates}>
                  Confirmar Local
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default LocationPicker;
