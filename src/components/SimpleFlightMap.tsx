
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SimpleFlightMap = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Mapa de Voos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground">
              Mapa de voos será carregado em breve
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Integração com mapa em desenvolvimento
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SimpleFlightMap;
