
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/components/ui/use-toast";

interface TaskProgressListProps {
  taskId: string;
}

export const TaskProgressList = ({ taskId }: TaskProgressListProps) => {
  const [newProgress, setNewProgress] = useState("");
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: progressList, isLoading } = useQuery({
    queryKey: ['task-progress', taskId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('task_progress')
        .select('*')
        .eq('task_id', taskId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const addProgressMutation = useMutation({
    mutationFn: async (description: string) => {
      const { error } = await supabase
        .from('task_progress')
        .insert([{
          task_id: taskId,
          description,
          created_by: 'Usuário Atual', // Aqui você pode usar o usuário logado
        }]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task-progress', taskId] });
      setNewProgress("");
      setShowForm(false);
      toast({
        title: "Andamento adicionado",
        description: "O andamento foi registrado com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao adicionar o andamento.",
        variant: "destructive",
      });
      console.error(error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProgress.trim()) {
      addProgressMutation.mutate(newProgress.trim());
    }
  };

  if (isLoading) {
    return <div className="text-center py-4">Carregando andamentos...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Andamentos da Tarefa</h3>
        <Button
          onClick={() => setShowForm(!showForm)}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Novo Andamento
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Adicionar Andamento</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-3">
              <Textarea
                value={newProgress}
                onChange={(e) => setNewProgress(e.target.value)}
                placeholder="Descreva o andamento da tarefa..."
                rows={3}
                required
              />
              <div className="flex gap-2">
                <Button type="submit" disabled={addProgressMutation.isPending}>
                  {addProgressMutation.isPending ? "Salvando..." : "Adicionar"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setNewProgress("");
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {progressList && progressList.length > 0 ? (
          progressList.map((progress) => (
            <Card key={progress.id}>
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <MessageSquare className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm">{progress.description}</p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                      <span>
                        {format(new Date(progress.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                      </span>
                      {progress.created_by && (
                        <>
                          <span>•</span>
                          <span>{progress.created_by}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum andamento registrado ainda
          </div>
        )}
      </div>
    </div>
  );
};
