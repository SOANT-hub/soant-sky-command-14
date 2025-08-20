import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FolderOpen, Clock, CheckCircle, AlertTriangle } from "lucide-react";

const ProjectStats = () => {
  const stats = [
    {
      title: "Projetos Ativos",
      value: "12",
      subtitle: "Em andamento",
      icon: FolderOpen,
      status: "active",
      trend: "+2 este mês"
    },
    {
      title: "Projetos Concluídos",
      value: "28",
      subtitle: "Total finalizado",
      icon: CheckCircle,
      status: "completed",
      trend: "+5 este mês"
    },
    {
      title: "Prazo Médio",
      value: "45",
      subtitle: "Dias por projeto",
      icon: Clock,
      status: "neutral",
      trend: "-3 dias"
    },
    {
      title: "Projetos Atrasados",
      value: "3",
      subtitle: "Requer atenção",
      icon: AlertTriangle,
      status: "warning",
      trend: "-1 esta semana"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-primary bg-primary/10";
      case "completed":
        return "text-green-600 bg-green-50";
      case "warning":
        return "text-orange-600 bg-orange-50";
      default:
        return "text-muted-foreground bg-muted";
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getStatusColor(stat.status)}`}>
                <Icon className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.subtitle}
              </p>
              <div className="flex items-center pt-2">
                <Badge variant="secondary" className="text-xs">
                  {stat.trend}
                </Badge>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default ProjectStats;