import { Plane, Home, FolderOpen, Package, ListTodo, FileText, Settings, User, Bell, Users } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import soantLogo from "@/assets/soant-logo.png";

const navigationItems = [
  { title: "Dashboard de Voos", url: "/", icon: Home },
  { title: "Dashboard de Projetos", url: "/projects", icon: FolderOpen },
  { title: "Equipamentos", url: "/equipments", icon: Package },
  { title: "Controle de Pilotos", url: "/pilots", icon: Users },
  { title: "Gerenciamento de Tarefas", url: "/tasks", icon: ListTodo },
  { title: "Relatórios", url: "/reports", icon: FileText },
];

const userActions = [
  { title: "Notificações", icon: Bell },
  { title: "Configurações", icon: Settings },
  { title: "Perfil", icon: User },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const isCollapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path;

  const getNavClassName = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" 
      : "hover:bg-sidebar-accent/50 text-sidebar-foreground";

  return (
    <Sidebar
      collapsible="icon"
    >
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center space-x-3 p-4">
          <div className="w-12 h-12 rounded bg-black flex items-center justify-center shadow-elevation">
            <img 
              src={soantLogo}
              alt="SOANT Logo"
              className="w-10 h-10 object-contain"
            />
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="text-lg font-bold text-sidebar-foreground">
                SOANT SKY COMMAND
              </h1>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>

          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end 
                      className={getNavClassName}
                    >
                      <item.icon className="w-4 h-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-2">
        <div className={isCollapsed ? "space-y-1" : "flex items-center justify-center space-x-1"}>
          {userActions.map((action) => (
            <Button
              key={action.title}
              variant="ghost"
              size="sm"
              className="text-sidebar-foreground hover:bg-sidebar-accent/50 w-8 h-8 p-0"
              title={action.title}
            >
              <action.icon className="w-4 h-4" />
            </Button>
          ))}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}