import PilotStats from "@/components/PilotStats";
import PilotList from "@/components/PilotList";

const PilotDashboard = () => {
  return (
    <div className="bg-background">
      
      {/* Hero Section */}
      <div className="relative h-32 bg-gradient-navy">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-navy-foreground">
            <h1 className="text-3xl font-bold mb-2">Controle de Pilotos</h1>
            <p className="text-lg text-navy-foreground/90">
              Gestão de Pilotos de Drones SOANT
            </p>
          </div>
        </div>
      </div>

      {/* Main Dashboard */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Pilot Stats */}
        <PilotStats />
        
        {/* Pilot List */}
        <div className="mt-8">
          <PilotList />
        </div>
      </main>
    </div>
  );
};

export default PilotDashboard;