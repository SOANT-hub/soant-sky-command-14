import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, GraduationCap, MapPin, Plane } from "lucide-react";

const PilotStats = () => {
  const { data: pilotsData, isLoading } = useQuery({
    queryKey: ['pilots-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pilots')
        .select('*');
      if (error) throw error;
      return data;
    }
  });

  const totalPilots = pilotsData?.length || 0;
  const pilotsWithCourses = pilotsData?.filter(pilot => pilot.courses && pilot.courses.length > 0).length || 0;
  const totalCourses = pilotsData?.reduce((acc, pilot) => acc + (pilot.courses?.length || 0), 0) || 0;
  const allocatedPilots = pilotsData?.filter(pilot => pilot.allocation && pilot.allocation.trim() !== '').length || 0;

  const stats = [
    {
      title: "Total de Pilotos",
      value: totalPilots,
      description: "Pilotos cadastrados",
      icon: Users,
      trend: null,
    },
    {
      title: "Pilotos com Cursos",
      value: pilotsWithCourses,
      description: "Pilotos certificados",
      icon: GraduationCap,
      trend: null,
    },
    {
      title: "Total de Cursos",
      value: totalCourses,
      description: "Certificações registradas",
      icon: Plane,
      trend: null,
    },
    {
      title: "Pilotos Alocados",
      value: allocatedPilots,
      description: "Com lotação definida",
      icon: MapPin,
      trend: null,
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <div className="h-4 bg-muted rounded w-24"></div>
              </CardTitle>
              <div className="h-4 w-4 bg-muted rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-16 mb-1"></div>
              <div className="h-3 bg-muted rounded w-20"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="border-border/50 hover:shadow-elevation transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground/80">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PilotStats;