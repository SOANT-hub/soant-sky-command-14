import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Battery, MapPin, Plane, Settings, Eye } from "lucide-react";

const DroneList = () => {
  const drones = [
    {
      id: "DRN-001",
      name: "Falcon Alpha",
      model: "DJI Mavic 3",
      status: "Em Voo",
      battery: 78,
      location: "Zona Norte - Setor 3",
      pilot: "João Silva",
      flightTime: "1h 23m",
      statusColor: "success"
    },
    {
      id: "DRN-002",
      name: "Eagle Beta",
      model: "DJI Phantom 4",
      status: "Standby",
      battery: 92,
      location: "Base Principal",
      pilot: "Maria Santos",
      flightTime: "0h 00m",
      statusColor: "warning"
    },
    {
      id: "DRN-003",
      name: "Hawk Gamma",
      model: "Autel EVO II",
      status: "Manutenção",
      battery: 45,
      location: "Hangar 2",
      pilot: "-",
      flightTime: "0h 00m",
      statusColor: "danger"
    },
    {
      id: "DRN-004",
      name: "Swift Delta",
      model: "DJI Mini 3",
      status: "Em Voo",
      battery: 65,
      location: "Zona Sul - Setor 1",
      pilot: "Carlos Lima",
      flightTime: "0h 45m",
      statusColor: "success"
    }
  ];

  const getStatusBadge = (status: string, color: string) => {
    const colorClasses = {
      success: "bg-success text-success-foreground",
      warning: "bg-warning text-warning-foreground",
      danger: "bg-danger text-danger-foreground"
    };

    return (
      <Badge className={colorClasses[color as keyof typeof colorClasses]}>
        {status}
      </Badge>
    );
  };

  const getBatteryColor = (level: number) => {
    if (level > 60) return "text-success";
    if (level > 30) return "text-warning";
    return "text-danger";
  };

  return (
    <Card className="shadow-elevation">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plane className="w-5 h-5 text-primary" />
          Frota de Drones
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {drones.map((drone) => (
            <div key={drone.id} className="p-6 hover:bg-muted/50 transition-smooth">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-sky rounded-lg flex items-center justify-center">
                    <Plane className="w-6 h-6 text-navy" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{drone.name}</h3>
                    <p className="text-sm text-muted-foreground">{drone.id} • {drone.model}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Status</p>
                    {getStatusBadge(drone.status, drone.statusColor)}
                  </div>
                  
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Bateria</p>
                    <div className="flex items-center space-x-1">
                      <Battery className={`w-4 h-4 ${getBatteryColor(drone.battery)}`} />
                      <span className={`text-sm font-medium ${getBatteryColor(drone.battery)}`}>
                        {drone.battery}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Localização</p>
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{drone.location}</span>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Piloto</p>
                    <span className="text-sm">{drone.pilot}</span>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Tempo de Voo</p>
                    <span className="text-sm font-mono">{drone.flightTime}</span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DroneList;