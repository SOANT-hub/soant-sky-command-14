
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { MapPin, Search, Target, Navigation } from "lucide-react";
import { toast as sonnerToast } from "@/components/ui/sonner";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface LocationPickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

interface LatLng {
  lat: number;
  lng: number;
}

interface SearchResult {
  display_name: string;
  lat: string;
  lon: string;
  importance: number;
}

// Fix leaflet marker icons
const fixLeafletIcons = () => {
  try {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
  } catch (error) {
    console.warn('Leaflet icons already configured');
  }
};

// Component for handling map clicks
const MapClickHandler: React.FC<{ onLocationSelect: (lat: number, lng: number) => void; onMapClick: () => void }> = ({ onLocationSelect, onMapClick }) => {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
      onMapClick(); // Close suggestions when map is clicked
    },
  });
  return null;
};

const LocationPicker: React.FC<LocationPickerProps> = ({ value, onChange, placeholder = "Digite o local do voo" }) => {
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [coordinates, setCoordinates] = useState<LatLng | null>(null);
  const [searchSuggestions, setSearchSuggestions] = useState<SearchResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mapKey, setMapKey] = useState(0);
  const mapRef = useRef<L.Map | null>(null);

  // Initialize Leaflet icons
  useEffect(() => {
    fixLeafletIcons();
  }, []);

  // Handle map initialization when dialog opens
  useEffect(() => {
    if (isMapOpen) {
      // Force remount of map component to avoid render issues
      setMapKey(prev => prev + 1);
      // Delay map size validation
      setTimeout(() => {
        if (mapRef.current) {
          mapRef.current.invalidateSize();
        }
      }, 200);
    }
  }, [isMapOpen]);

  // Search suggestions with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.length > 2) {
        fetchSearchSuggestions();
      } else {
        setSearchSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const fetchSearchSuggestions = async () => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&countrycodes=br&limit=5&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'SOANT Drone Management System',
            'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8'
          }
        }
      );
      const data: SearchResult[] = await response.json();
      setSearchSuggestions(data);
      setShowSuggestions(data.length > 0);
    } catch (error) {
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = (suggestion: SearchResult) => {
    const lat = parseFloat(suggestion.lat);
    const lng = parseFloat(suggestion.lon);
    setCoordinates({ lat, lng });
    setSearchQuery(suggestion.display_name);
    setShowSuggestions(false);
    
    const locationString = `${suggestion.display_name} (Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)})`;
    onChange(locationString);
  };

  const handleMapClick = useCallback(async (lat: number, lng: number) => {
    try {
      setCoordinates({ lat, lng });
      setShowSuggestions(false);
      
      // Reverse geocoding para obter o endereço
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'SOANT Drone Management System',
            'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8'
          }
        }
      );
      const data = await response.json();
      const address = data.display_name || `Local selecionado`;
      const locationString = `${address} (Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)})`;
      onChange(locationString);
      
      sonnerToast("Local selecionado", {
        description: "Clique em 'Confirmar Local' para salvar",
      });
    } catch (error) {
      const locationString = `Local selecionado (Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)})`;
      onChange(locationString);
      sonnerToast("Local selecionado", {
        description: "Coordenadas definidas com sucesso",
      });
    }
  }, [onChange]);

  // Geocoding usando Nominatim API
  const searchLocation = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&countrycodes=br&limit=1`,
        {
          headers: {
            'User-Agent': 'SOANT Drone Management System',
            'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8'
          }
        }
      );
      const data = await response.json();

      if (data.length > 0) {
        const location = data[0];
        const lat = parseFloat(location.lat);
        const lng = parseFloat(location.lon);
        setCoordinates({ lat, lng });
        
        const locationString = `${location.display_name} (Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)})`;
        onChange(locationString);
        
        sonnerToast("Localização encontrada", {
          description: location.display_name,
        });
      } else {
        sonnerToast("Localização não encontrada", {
          description: "Tente um termo mais específico",
        });
      }
    } catch (error) {
      sonnerToast("Erro na busca", {
        description: "Não foi possível buscar a localização",
      });
    } finally {
      setIsSearching(false);
    }
  };

  // Obter localização atual do usuário
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      sonnerToast("Geolocalização não suportada", {
        description: "Seu navegador não suporta geolocalização",
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
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
            {
              headers: {
                'User-Agent': 'SOANT Drone Management System',
                'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8'
              }
            }
          );
          const data = await response.json();
          const address = data.display_name || `Localização atual`;
          const locationString = `${address} (Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)})`;
          onChange(locationString);
          
          sonnerToast("Localização obtida", {
            description: "Sua localização atual foi definida com sucesso",
          });
        } catch (error) {
          const locationString = `Localização atual (Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)})`;
          onChange(locationString);
          
          sonnerToast("Localização obtida", {
            description: "Coordenadas obtidas com sucesso",
          });
        }
      },
      (error) => {
        sonnerToast("Erro ao obter localização", {
          description: "Não foi possível obter sua localização atual",
        });
      }
    );
  };

  const handleConfirmLocation = () => {
    setIsMapOpen(false);
    if (coordinates) {
      sonnerToast("Local confirmado", {
        description: "Local do voo atualizado com sucesso",
      });
    }
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || "Ex: Base Aérea de Brasília, Coordenadas GPS, etc."}
          className="pr-10"
        />
        <Sheet open={isMapOpen} onOpenChange={setIsMapOpen}>
          <SheetTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-foreground"
              title="Selecionar localização no mapa"
            >
              <MapPin className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="top" className="inset-x-0 top-0 h-[85vh] w-full sm:max-w-none">
            <SheetHeader>
              <SheetTitle>Selecionar Local do Voo</SheetTitle>
            </SheetHeader>
            <div className="space-y-4">
              {/* Barra de Busca */}
              <div className="relative">
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
                
                {/* Sugestões de busca */}
                {showSuggestions && searchSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-background border rounded-md shadow-lg max-h-48 overflow-y-auto">
                    {searchSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => selectSuggestion(suggestion)}
                        className="w-full px-3 py-2 text-left hover:bg-muted text-sm border-b last:border-b-0"
                      >
                        <div className="font-medium">{suggestion.display_name}</div>
                        <div className="text-xs text-muted-foreground">
                          Lat: {parseFloat(suggestion.lat).toFixed(4)}, Lng: {parseFloat(suggestion.lon).toFixed(4)}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
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

              {/* Mapa Interativo */}
              <div className="h-[60vh] border rounded-lg overflow-hidden">
                {isMapOpen && (
                  <MapContainer
                    key={mapKey}
                    center={coordinates || { lat: -14.235, lng: -51.9253 }}
                    zoom={coordinates ? 15 : 4}
                    style={{ height: "100%", width: "100%" }}
                    ref={(mapInstance) => {
                      if (mapInstance) {
                        mapRef.current = mapInstance;
                        setTimeout(() => {
                          mapInstance.invalidateSize();
                        }, 100);
                      }
                    }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <MapClickHandler onLocationSelect={handleMapClick} onMapClick={() => setShowSuggestions(false)} />
                    {coordinates && (
                      <Marker position={[coordinates.lat, coordinates.lng]} />
                    )}
                  </MapContainer>
                )}
              </div>
              
              <div className="text-center text-sm text-muted-foreground">
                <Navigation className="inline h-4 w-4 mr-1" />
                Clique no mapa para selecionar um local
              </div>

              {/* Exibição das coordenadas selecionadas */}
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
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default LocationPicker;
