
import DashboardStats from "@/components/DashboardStats";
import FlightRegistration from "@/components/FlightRegistration";
import SimpleFlightMap from "@/components/SimpleFlightMap";
import FlightHistory from "@/components/FlightHistory";
import heroImage from "@/assets/hero-drone-control.jpg";

const FlightDashboard = () => {
  return (
    <div className="bg-background">
      
      {/* Hero Section */}
      <div className="relative h-64 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-navy/80" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-navy-foreground">
            <h1 className="text-4xl font-bold mb-2">Dashboard de Voos SOANT</h1>
            <p className="text-xl text-navy-foreground/90">
              Monitoramento e Controle de Operações de Voo
            </p>
            <p className="text-navy-foreground/70 mt-2">
              Operacional • Última atualização: {new Date().toLocaleTimeString('pt-BR')}
            </p>
          </div>
        </div>
      </div>

      {/* Main Dashboard */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Stats */}
        <DashboardStats />
        
        {/* Flight Map */}
        <div className="mt-8">
          <SimpleFlightMap />
        </div>
        
        {/* Flight Registration */}
        <div className="mt-8">
          <FlightRegistration />
        </div>
        
        {/* Flight History */}
        <div className="mt-8">
          <FlightHistory />
        </div>
      </main>
    </div>
  );
};

export default FlightDashboard;
