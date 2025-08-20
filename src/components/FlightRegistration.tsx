import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plane, MapPin, Clock, User, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import LocationPicker from "./LocationPicker";

interface Equipment {
  id: string;
  name: string;
  equipment_type: string;
  serial_number?: string;
  model?: string;
}

interface Accessory {
  id: string;
  accessory_equipment_id?: string;
  accessory_catalog_id?: string;
  equipment_name?: string;
  catalog_name?: string;
  quantity: number;
}

interface Flight {
  id: string;
  equipment_id: string;
  location: string;
  start_time: string;
  end_time?: string;
  status: string;
  incidents?: string;
  notes?: string;
  equipment?: Equipment;
}

const FlightRegistration = () => {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [accessories, setAccessories] = useState<Accessory[]>([]);
  const [selectedEquipmentId, setSelectedEquipmentId] = useState("");
  const [selectedAccessoryIds, setSelectedAccessoryIds] = useState<string[]>([]);
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeFlights, setActiveFlights] = useState<Flight[]>([]);
  const [incidents, setIncidents] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchEquipments();
    fetchActiveFlights();
  }, []);

  useEffect(() => {
    if (selectedEquipmentId) {
      fetchAccessories();
    } else {
      setAccessories([]);
      setSelectedAccessoryIds([]);
    }
  }, [selectedEquipmentId]);

  const fetchEquipments = async () => {
    try {
      const { data, error } = await supabase
        .from('equipments')
        .select('id, name, equipment_type, serial_number, model')
        .eq('status', 'ativo')
        .order('name');

      if (error) throw error;
      setEquipments(data || []);
    } catch (error) {
      console.error('Error fetching equipments:', error);
      toast({
        title: "Erro",
        description: "Falha ao carregar equipamentos",
        variant: "destructive",
      });
    }
  };

  const fetchAccessories = async () => {
    try {
      const { data, error } = await supabase
        .from('equipment_accessories')
        .select(`
          id,
          accessory_equipment_id,
          accessory_catalog_id,
          quantity,
          accessory_catalog!accessory_catalog_id (name)
        `)
        .eq('parent_equipment_id', selectedEquipmentId);

      if (error) throw error;
      
      const formattedAccessories = data?.map(acc => ({
        id: acc.id,
        accessory_equipment_id: acc.accessory_equipment_id,
        accessory_catalog_id: acc.accessory_catalog_id,
        equipment_name: null, // Will handle equipment names separately if needed
        catalog_name: acc.accessory_catalog?.name,
        quantity: acc.quantity
      })) || [];

      setAccessories(formattedAccessories);
    } catch (error) {
      console.error('Error fetching accessories:', error);
      toast({
        title: "Erro",
        description: "Falha ao carregar acessórios",
        variant: "destructive",
      });
    }
  };

  const fetchActiveFlights = async () => {
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
        .eq('status', 'em_voo')
        .order('start_time', { ascending: false });

      if (error) throw error;
      setActiveFlights(data || []);
    } catch (error) {
      console.error('Error fetching active flights:', error);
    }
  };

  const handleStartFlight = async () => {
    if (!selectedEquipmentId || !location.trim()) {
      toast({
        title: "Erro",
        description: "Selecione um equipamento e informe o local",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Create flight record
      const { data: flight, error: flightError } = await supabase
        .from('flights')
        .insert({
          equipment_id: selectedEquipmentId,
          location: location.trim(),
          notes: notes.trim() || null,
          created_by: '00000000-0000-0000-0000-000000000000' // Placeholder until auth is implemented
        })
        .select()
        .single();

      if (flightError) throw flightError;

      // Add selected accessories to flight
      if (selectedAccessoryIds.length > 0) {
        const accessoryInserts = selectedAccessoryIds.map(accessoryId => ({
          flight_id: flight.id,
          accessory_id: accessoryId
        }));

        const { error: accessoryError } = await supabase
          .from('flight_accessories')
          .insert(accessoryInserts);

        if (accessoryError) throw accessoryError;
      }

      toast({
        title: "Sucesso",
        description: "Voo registrado com sucesso",
      });

      // Reset form
      setSelectedEquipmentId("");
      setLocation("");
      setNotes("");
      setSelectedAccessoryIds([]);
      
      // Refresh active flights
      fetchActiveFlights();
    } catch (error) {
      console.error('Error starting flight:', error);
      toast({
        title: "Erro",
        description: "Falha ao registrar voo",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEndFlight = async (flightId: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('flights')
        .update({
          end_time: new Date().toISOString(),
          status: 'finalizado',
          incidents: incidents.trim() || null
        })
        .eq('id', flightId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Voo finalizado com sucesso",
      });

      setIncidents("");
      fetchActiveFlights();
    } catch (error) {
      console.error('Error ending flight:', error);
      toast({
        title: "Erro",
        description: "Falha ao finalizar voo",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleAccessory = (accessoryId: string) => {
    setSelectedAccessoryIds(prev => 
      prev.includes(accessoryId) 
        ? prev.filter(id => id !== accessoryId)
        : [...prev, accessoryId]
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Flight Registration Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plane className="h-5 w-5" />
            Registrar Novo Voo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="equipment">Equipamento</Label>
            <Select value={selectedEquipmentId} onValueChange={setSelectedEquipmentId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um equipamento" />
              </SelectTrigger>
              <SelectContent>
                {equipments.map((equipment) => (
                  <SelectItem key={equipment.id} value={equipment.id}>
                    {equipment.name} ({equipment.equipment_type})
                    {equipment.model && ` - ${equipment.model}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {accessories.length > 0 && (
            <div>
              <Label>Acessórios Disponíveis</Label>
              <div className="grid grid-cols-1 gap-2 mt-2">
                {accessories.map((accessory) => (
                  <div
                    key={accessory.id}
                    className={`p-2 border rounded cursor-pointer transition-colors ${
                      selectedAccessoryIds.includes(accessory.id)
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => toggleAccessory(accessory.id)}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm">
                        {accessory.equipment_name || accessory.catalog_name}
                      </span>
                      <Badge variant="outline">{accessory.quantity}x</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="location">Local do Voo</Label>
            <LocationPicker
              value={location}
              onChange={setLocation}
              placeholder="Ex: Base Aérea de Brasília, Coordenadas GPS, etc."
            />
          </div>

          <div>
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              placeholder="Observações sobre o voo..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <Button 
            onClick={handleStartFlight} 
            disabled={loading || !selectedEquipmentId || !location.trim()}
            className="w-full"
          >
            {loading ? "Registrando..." : "Iniciar Voo"}
          </Button>
        </CardContent>
      </Card>

      {/* Active Flights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Voos em Andamento ({activeFlights.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeFlights.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              Nenhum voo em andamento
            </p>
          ) : (
            <div className="space-y-4">
              {activeFlights.map((flight) => (
                <div key={flight.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Plane className="h-4 w-4" />
                      <span className="font-medium">
                        {flight.equipment?.name}
                      </span>
                      <Badge variant="secondary">{flight.status}</Badge>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {new Date(flight.start_time).toLocaleString('pt-BR')}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{flight.location}</span>
                  </div>

                  {flight.notes && (
                    <p className="text-sm text-muted-foreground mb-3">
                      {flight.notes}
                    </p>
                  )}

                  <Separator className="my-3" />
                  
                  <div className="space-y-2">
                    <Label htmlFor={`incidents-${flight.id}`}>
                      <AlertTriangle className="h-4 w-4 inline mr-1" />
                      Intercorrências
                    </Label>
                    <Textarea
                      id={`incidents-${flight.id}`}
                      placeholder="Descreva intercorrências ou problemas durante o voo..."
                      value={incidents}
                      onChange={(e) => setIncidents(e.target.value)}
                      rows={2}
                    />
                    <Button
                      onClick={() => handleEndFlight(flight.id)}
                      disabled={loading}
                      variant="destructive"
                      size="sm"
                      className="w-full"
                    >
                      {loading ? "Finalizando..." : "Finalizar Missão"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FlightRegistration;