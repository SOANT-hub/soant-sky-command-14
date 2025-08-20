import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, GraduationCap, MapPin, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PilotModal from "@/components/PilotModal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type Pilot = {
  id: string;
  name: string;
  functional_id: string;
  allocation?: string;
  courses?: string[];
  created_at: string;
  updated_at: string;
};

const PilotList = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPilot, setEditingPilot] = useState<Pilot | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: pilots, isLoading } = useQuery({
    queryKey: ['pilots'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pilots')
        .select('*')
        .order('name');
      if (error) throw error;
      return data as Pilot[];
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('pilots')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pilots'] });
      queryClient.invalidateQueries({ queryKey: ['pilots-stats'] });
      toast({
        title: "Sucesso",
        description: "Piloto excluído com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao excluir piloto: " + error.message,
        variant: "destructive",
      });
    }
  });

  const handleEdit = (pilot: Pilot) => {
    setEditingPilot(pilot);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditingPilot(null);
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingPilot(null);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pilotos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="-mx-4 sm:-mx-6 lg:-mx-8">
        <Card className="rounded-none border-x-0">
          <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Pilotos Cadastrados
          </CardTitle>
          <Button onClick={handleAdd} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Novo Piloto
          </Button>
        </CardHeader>
        <CardContent>
          {!pilots || pilots.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">Nenhum piloto cadastrado</p>
              <p className="text-sm">Clique em "Novo Piloto" para começar</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pilots.map((pilot) => (
                <Card key={pilot.id} className="border border-border/50 hover:shadow-elevation transition-all duration-200">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1">
                          {pilot.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          ID Funcional: {pilot.functional_id}
                        </p>
                      </div>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(pilot)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir o piloto "{pilot.name}"? Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(pilot.id)}
                                className="bg-destructive hover:bg-destructive/90"
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>

                    <div className="mt-2">
                      {pilot.allocation && (
                        <div className="flex items-center text-sm text-muted-foreground mb-2">
                          <MapPin className="h-3 w-3 mr-2" />
                          {pilot.allocation}
                        </div>
                      )}

                      <div className="mt-3">
                        <div className="flex items-center text-sm mb-2">
                          <GraduationCap className="h-3 w-3 mr-2 text-muted-foreground" />
                          <span className="font-medium text-foreground">Cursos</span>
                          <span className="ml-1 text-muted-foreground">({pilot.courses?.length || 0})</span>
                        </div>
                        {pilot.courses && pilot.courses.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {pilot.courses.map((course, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="px-2 py-1 text-xs"
                              >
                                {course}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <Badge variant="outline" className="px-2 py-1 text-xs text-muted-foreground">
                            Sem cursos
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      </div>

      <PilotModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        pilot={editingPilot}
      />
    </>
  );
};

export default PilotList;