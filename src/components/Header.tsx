
import { Button } from "@/components/ui/button";
import { Plane, Settings, User, Bell } from "lucide-react";
import soantLogo from "@/assets/soant-logo.png";

const Header = () => {
  return (
    <header className="bg-gradient-navy border-b border-soant shadow-soant">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-full overflow-hidden ring-1 ring-ring flex items-center justify-center shadow-soant">
                <img 
                  src={soantLogo} 
                  alt="SOANT Logo" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to icon if image not found
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <Plane className="w-5 h-5 text-navy hidden" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-navy-foreground text-soant-official">
                  SOANT
                </h1>
                <p className="text-xs text-navy-foreground/80 font-medium">
                  Sistema de Controle de Drones
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="/" className="text-navy-foreground/80 hover:text-navy-foreground transition-smooth font-medium text-sm">
              Dashboard de Voos
            </a>
            <a href="/projects" className="text-navy-foreground/80 hover:text-navy-foreground transition-smooth font-medium text-sm">
              Dashboard de Projetos
            </a>
            <a href="/equipments" className="text-navy-foreground/80 hover:text-navy-foreground transition-smooth font-medium text-sm">
              Equipamentos
            </a>
            <a href="/tasks" className="text-navy-foreground/80 hover:text-navy-foreground transition-smooth font-medium text-sm">
              Gerenciamento de Tarefas
            </a>
            <a href="#" className="text-navy-foreground/80 hover:text-navy-foreground transition-smooth font-medium text-sm">
              Relatórios
            </a>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-navy-foreground hover:bg-navy-foreground/10 h-9 w-9 p-0"
            >
              <Bell className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-navy-foreground hover:bg-navy-foreground/10 h-9 w-9 p-0"
            >
              <Settings className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-navy-foreground hover:bg-navy-foreground/10 h-9 w-9 p-0"
            >
              <User className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
