import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plane, Battery, Wrench, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const EquipmentStats = () => {
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    maintenance: 0,
    inactive: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data: equipments, error } = await supabase
        .from('equipments')
        .select('status');

      if (error) {
        console.error('Error fetching equipment stats:', error);
        return;
      }

      const total = equipments?.length || 0;
      const active = equipments?.filter(eq => eq.status === 'ativo').length || 0;
      const maintenance = equipments?.filter(eq => eq.status === 'manutencao').length || 0;
      const inactive = equipments?.filter(eq => eq.status === 'inativo').length || 0;

      setStats({ total, active, maintenance, inactive });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const statCards = [
    {
      title: "Total de Equipamentos",
      value: stats.total,
      icon: Plane,
      color: "text-blue-600"
    },
    {
      title: "Ativos",
      value: stats.active,
      icon: Battery,
      color: "text-green-600"
    },
    {
      title: "Em Manutenção",
      value: stats.maintenance,
      icon: Wrench,
      color: "text-yellow-600"
    },
    {
      title: "Inativos",
      value: stats.inactive,
      icon: AlertTriangle,
      color: "text-red-600"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default EquipmentStats;