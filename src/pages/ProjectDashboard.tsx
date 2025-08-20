import ProjectStats from "@/components/ProjectStats";
import ProjectList from "@/components/ProjectList";

const ProjectDashboard = () => {
  return (
    <div className="bg-background">
      
      {/* Hero Section */}
      <div className="relative h-32 bg-gradient-navy">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-navy-foreground">
            <h1 className="text-3xl font-bold mb-2">Dashboard de Projetos SOANT</h1>
            <p className="text-lg text-navy-foreground/90">
              Gestão e Controle de Projetos do Setor
            </p>
          </div>
        </div>
      </div>

      {/* Main Dashboard */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Project Stats */}
        <ProjectStats />
        
        {/* Project List */}
        <div className="mt-8">
          <ProjectList />
        </div>
      </main>
    </div>
  );
};

export default ProjectDashboard;