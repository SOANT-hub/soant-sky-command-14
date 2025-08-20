
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, AlertTriangle, XCircle } from "lucide-react";

export const TaskStats = () => {
  const { data: stats } = useQuery({
    queryKey: ['task-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('status');
      
      if (error) throw error;
      
      const statsByStatus = data.reduce((acc, task) => {
        acc[task.status] = (acc[task.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      return {
        total: data.length,
        pendente: statsByStatus.pendente || 0,
        em_andamento: statsByStatus.em_andamento || 0,
        concluida: statsByStatus.concluida || 0,
        cancelada: statsByStatus.cancelada || 0,
      };
    },
  });

  const statCards = [
    {
      title: "Total de Tarefas",
      value: stats?.total || 0,
      icon: Clock,
      color: "text-blue-600",
    },
    {
      title: "Pendentes",
      value: stats?.pendente || 0,
      icon: AlertTriangle,
      color: "text-yellow-600",
    },
    {
      title: "Em Andamento",
      value: stats?.em_andamento || 0,
      icon: Clock,
      color: "text-blue-600",
    },
    {
      title: "Concluídas",
      value: stats?.concluida || 0,
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      title: "Canceladas",
      value: stats?.cancelada || 0,
      icon: XCircle,
      color: "text-red-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
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
