import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plane, Battery, MapPin, Clock } from "lucide-react";

const DashboardStats = () => {
  const stats = [
    {
      title: "Drones Ativos",
      value: "12",
      subtitle: "de 18 total",
      icon: Plane,
      status: "success",
      trend: "+2 desde ontem"
    },
    {
      title: "Voos Hoje",
      value: "8",
      subtitle: "em andamento: 3",
      icon: MapPin,
      status: "primary",
      trend: "23% do planejado"
    },
    {
      title: "Tempo de Voo",
      value: "142h",
      subtitle: "este mês",
      icon: Clock,
      status: "warning",
      trend: "+15h vs. mês anterior"
    },
    {
      title: "Status Geral",
      value: "Operacional",
      subtitle: "todos sistemas ok",
      icon: Battery,
      status: "success",
      trend: "100% disponibilidade"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-success text-success-foreground';
      case 'warning':
        return 'bg-warning text-warning-foreground';
      case 'danger':
        return 'bg-danger text-danger-foreground';
      default:
        return 'bg-primary text-primary-foreground';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card key={index} className="border-0 shadow-elevation hover:shadow-primary transition-smooth">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div className={`w-8 h-8 rounded-lg ${getStatusColor(stat.status)} flex items-center justify-center`}>
              <stat.icon className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-2">
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
              <Badge variant="outline" className="text-xs w-fit">
                {stat.trend}
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardStats;