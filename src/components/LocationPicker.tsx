import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MapPin, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Fix Leaflet default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

interface LocationPickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

interface LatLng {
  lat: number;
  lng: number;
}

const BRAZIL_CENTER: LatLng = { lat: -14.235, lng: -51.9253 };

// Component for handling map clicks
function MapClickHandler({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: (e) => {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

const LocationPicker: React.FC<LocationPickerProps> = ({ value, onChange, placeholder = "Digite o local do voo" }) => {
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<LatLng | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  // Parse existing coordinates from value if present
  useEffect(() => {
    const coordMatch = value.match(/Lat:\s*(-?\d+\.?\d*),\s*Lng:\s*(-?\d+\.?\d*)/);
    if (coordMatch) {
      setSelectedLocation({
        lat: parseFloat(coordMatch[1]),
        lng: parseFloat(coordMatch[2]),
      });
    }
  }, [value]);

  // Geocoding using Nominatim API
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
        setSelectedLocation({ lat, lng });
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

  // Reverse geocoding
  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
      );
      const data = await response.json();
      return data.display_name || `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`;
    } catch (error) {
      return `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`;
    }
  };

  const handleLocationSelect = async (lat: number, lng: number) => {
    setSelectedLocation({ lat, lng });
    const address = await reverseGeocode(lat, lng);
    const locationString = `${address} (Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)})`;
    onChange(locationString);
    toast({
      title: "Local selecionado",
      description: "Coordenadas atualizadas",
    });
  };

  const handleConfirmLocation = () => {
    setIsMapOpen(false);
    toast({
      title: "Local confirmado",
      description: "Local do voo atualizado com sucesso",
    });
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
            <Button variant="outline" size="icon">
              <MapPin className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle>Selecionar Local no Mapa</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="flex gap-2">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar endereço..."
                  onKeyPress={(e) => e.key === "Enter" && searchLocation()}
                  className="flex-1"
                />
                <Button onClick={searchLocation} disabled={isSearching} size="icon">
                  <Search className="h-4 w-4" />
                </Button>
              </div>

              {/* Map Container */}
              <div className="h-96 w-full rounded-lg overflow-hidden border">
                <MapContainer
                  center={selectedLocation || BRAZIL_CENTER}
                  zoom={selectedLocation ? 15 : 6}
                  style={{ height: "100%", width: "100%" }}
                  key={selectedLocation ? `${selectedLocation.lat}-${selectedLocation.lng}` : "default"}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <MapClickHandler onLocationSelect={handleLocationSelect} />
                  {selectedLocation && (
                    <Marker position={[selectedLocation.lat, selectedLocation.lng]} />
                  )}
                </MapContainer>
              </div>

              {/* Coordinates Display */}
              {selectedLocation && (
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Coordenadas selecionadas: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setIsMapOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleConfirmLocation} disabled={!selectedLocation}>
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