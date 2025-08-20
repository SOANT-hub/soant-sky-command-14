import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plane, MapPin, Clock, AlertTriangle, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Equipment {
  id: string;
  name: string;
  equipment_type: string;
  model?: string;
}

interface CompletedFlight {
  id: string;
  equipment_id: string;
  location: string;
  start_time: string;
  end_time: string;
  status: string;
  incidents?: string;
  notes?: string;
  equipment?: Equipment;
}

const FlightHistory = () => {
  const [completedFlights, setCompletedFlights] = useState<CompletedFlight[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchCompletedFlights();
  }, []);

  const fetchCompletedFlights = async () => {
    try {
      const { data, error } = await supabase
        .from('flights')
        .select(`
          id,
          equipment_id,
          location,
          start_time,
          end_time,
          status,
          incidents,
          notes,
          equipments (name, equipment_type, model)
        `)
        .eq('status', 'finalizado')
        .order('end_time', { ascending: false })
        .limit(20);

      if (error) throw error;
      setCompletedFlights(data || []);
    } catch (error) {
      console.error('Error fetching completed flights:', error);
      toast({
        title: "Erro",
        description: "Falha ao carregar histórico de voos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (start: string, end: string) => {
    const startTime = new Date(start);
    const endTime = new Date(end);
    const durationMs = endTime.getTime() - startTime.getTime();
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plane className="h-5 w-5" />
            Histórico de Voos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">
            Carregando histórico...
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plane className="h-5 w-5" />
          Histórico de Voos ({completedFlights.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {completedFlights.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            Nenhum voo finalizado encontrado
          </p>
        ) : (
          <div className="space-y-4">
            {completedFlights.map((flight) => (
              <div key={flight.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Plane className="h-4 w-4" />
                    <span className="font-medium">
                      {flight.equipment?.name}
                    </span>
                    <Badge variant="secondary">Finalizado</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 inline mr-1" />
                    {formatDuration(flight.start_time, flight.end_time)}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{flight.location}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <strong>Tipo:</strong> {flight.equipment?.equipment_type}
                    {flight.equipment?.model && ` - ${flight.equipment.model}`}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3 text-sm">
                  <div>
                    <strong>Início:</strong> {new Date(flight.start_time).toLocaleString('pt-BR')}
                  </div>
                  <div>
                    <strong>Fim:</strong> {new Date(flight.end_time).toLocaleString('pt-BR')}
                  </div>
                </div>

                {(flight.notes || flight.incidents) && (
                  <>
                    <Separator className="my-3" />
                    {flight.notes && (
                      <div className="mb-2">
                        <div className="flex items-center gap-1 mb-1">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Observações:</span>
                        </div>
                        <p className="text-sm text-muted-foreground pl-5">
                          {flight.notes}
                        </p>
                      </div>
                    )}
                    {flight.incidents && (
                      <div>
                        <div className="flex items-center gap-1 mb-1">
                          <AlertTriangle className="h-4 w-4 text-destructive" />
                          <span className="text-sm font-medium text-destructive">Intercorrências:</span>
                        </div>
                        <p className="text-sm text-destructive/80 pl-5">
                          {flight.incidents}
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FlightHistory;