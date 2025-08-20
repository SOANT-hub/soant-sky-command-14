
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TaskList } from "@/components/TaskList";
import { TaskStats } from "@/components/TaskStats";

const TaskDashboard = () => {
  const [activeTab, setActiveTab] = useState("all");

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Gerenciamento de Tarefas</h1>
            <p className="text-muted-foreground mt-2">
              Gerencie tarefas, prioridades e acompanhe o progresso das atividades
            </p>
          </div>

          <TaskStats />

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">Todas</TabsTrigger>
              <TabsTrigger value="pendente">Pendentes</TabsTrigger>
              <TabsTrigger value="em_andamento">Em Andamento</TabsTrigger>
              <TabsTrigger value="concluida">Concluídas</TabsTrigger>
              <TabsTrigger value="cancelada">Canceladas</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              <TaskList filter="all" />
            </TabsContent>
            <TabsContent value="pendente" className="space-y-4">
              <TaskList filter="pendente" />
            </TabsContent>
            <TabsContent value="em_andamento" className="space-y-4">
              <TaskList filter="em_andamento" />
            </TabsContent>
            <TabsContent value="concluida" className="space-y-4">
              <TaskList filter="concluida" />
            </TabsContent>
            <TabsContent value="cancelada" className="space-y-4">
              <TaskList filter="cancelada" />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default TaskDashboard;
