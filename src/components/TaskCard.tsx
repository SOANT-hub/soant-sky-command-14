
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, AlertTriangle, CheckCircle, Clock, XCircle, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface TaskCardProps {
  task: any;
  onClick: () => void;
}

export const TaskCard = ({ task, onClick }: TaskCardProps) => {
  const { data: lastProgress } = useQuery({
    queryKey: ['task-last-progress', task.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('task_progress')
        .select('*')
        .eq('task_id', task.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'alta': return 'bg-red-100 text-red-800 border-red-200';
      case 'media': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'baixa': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendente': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'em_andamento': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'concluida': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelada': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pendente': return <AlertTriangle className="h-4 w-4" />;
      case 'em_andamento': return <Clock className="h-4 w-4" />;
      case 'concluida': return <CheckCircle className="h-4 w-4" />;
      case 'cancelada': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="cursor-pointer hover:shadow-md transition-shadow" onClick={onClick}>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-lg">{task.title}</h3>
            <div className="flex gap-2">
              <Badge className={getPriorityColor(task.priority)}>
                {task.priority.toUpperCase()}
              </Badge>
              <Badge className={getStatusColor(task.status)}>
                <div className="flex items-center gap-1">
                  {getStatusIcon(task.status)}
                  {task.status.replace('_', ' ').toUpperCase()}
                </div>
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {task.description && (
            <p className="text-muted-foreground text-sm line-clamp-2">
              {task.description}
            </p>
          )}
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {task.assigned_to && (
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {task.assigned_to}
              </div>
            )}
            
            {task.due_date && (
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {format(new Date(task.due_date), "dd/MM/yyyy", { locale: ptBR })}
              </div>
            )}
          </div>
          
          <div className="text-xs text-muted-foreground">
            Criada em {format(new Date(task.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
          </div>
        </CardContent>
      </Card>
      
      {lastProgress && (
        <div className="bg-muted/30 border border-t-0 rounded-b-lg border-border/50 px-4 py-3">
          <div className="flex items-start gap-2">
            <MessageSquare className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground line-clamp-2">
                {lastProgress.description}
              </p>
              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                <span>
                  {format(new Date(lastProgress.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                </span>
                {lastProgress.created_by && (
                  <>
                    <span>•</span>
                    <span>{lastProgress.created_by}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
