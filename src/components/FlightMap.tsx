import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Map, Plane, MapPin, Radio } from "lucide-react";

const FlightMap = () => {
  const activeFlights = [
    {
      id: "FL-001",
      drone: "Falcon Alpha",
      zone: "Zona Norte",
      altitude: "120m",
      speed: "15 km/h",
      status: "Em Rota"
    },
    {
      id: "FL-002", 
      drone: "Swift Delta",
      zone: "Zona Sul",
      altitude: "85m",
      speed: "12 km/h",
      status: "Patrulhando"
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Map Placeholder */}
      <Card className="lg:col-span-2 shadow-elevation">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Map className="w-5 h-5 text-primary" />
            Mapa de Voos em Tempo Real
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 bg-gradient-to-br from-sky/10 to-navy/10 rounded-lg border-2 border-dashed border-muted-foreground/20 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
                <Map className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Integração de Mapa</h3>
                <p className="text-muted-foreground">Mapa interativo será integrado aqui</p>
                <div className="flex items-center justify-center gap-4 mt-4">
                  <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                    2 Voos Ativos
                  </Badge>
                  <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
                    4 Zonas Monitoradas
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Flights Panel */}
      <Card className="shadow-elevation">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-primary" />
            Voos Ativos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {activeFlights.map((flight) => (
            <div key={flight.id} className="p-4 border border-border rounded-lg bg-gradient-to-r from-card to-muted/20">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-sky rounded-full flex items-center justify-center">
                    <Plane className="w-4 h-4 text-navy" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">{flight.drone}</h4>
                    <p className="text-xs text-muted-foreground">{flight.id}</p>
                  </div>
                </div>
                <Badge className="bg-success text-success-foreground">
                  {flight.status}
                </Badge>
              </div>
              
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Zona:</span>
                  <span className="font-medium">{flight.zone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Altitude:</span>
                  <span className="font-medium">{flight.altitude}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Velocidade:</span>
                  <span className="font-medium">{flight.speed}</span>
                </div>
              </div>
              
              <div className="mt-3 pt-3 border-t border-border">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  <span>Posição atualizada há 2s</span>
                </div>
              </div>
            </div>
          ))}
          
          <div className="p-4 border border-dashed border-muted-foreground/30 rounded-lg text-center">
            <p className="text-sm text-muted-foreground">
              Nenhum outro voo ativo no momento
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FlightMap;