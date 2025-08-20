import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Pilot = {
  id: string;
  name: string;
  functional_id: string;
  allocation?: string;
  courses?: string[];
  created_at: string;
  updated_at: string;
};

interface PilotModalProps {
  isOpen: boolean;
  onClose: () => void;
  pilot?: Pilot | null;
}

const PilotModal = ({ isOpen, onClose, pilot }: PilotModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    functional_id: '',
    allocation: '',
  });
  const [courses, setCourses] = useState<string[]>([]);
  const [newCourse, setNewCourse] = useState('');
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (pilot) {
      setFormData({
        name: pilot.name || '',
        functional_id: pilot.functional_id || '',
        allocation: pilot.allocation || '',
      });
      setCourses(pilot.courses || []);
    } else {
      setFormData({
        name: '',
        functional_id: '',
        allocation: '',
      });
      setCourses([]);
    }
    setNewCourse('');
  }, [pilot, isOpen]);

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      if (pilot) {
        const { error } = await supabase
          .from('pilots')
          .update(data)
          .eq('id', pilot.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('pilots')
          .insert([data]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pilots'] });
      queryClient.invalidateQueries({ queryKey: ['pilots-stats'] });
      toast({
        title: "Sucesso",
        description: pilot ? "Piloto atualizado com sucesso!" : "Piloto criado com sucesso!",
      });
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: "Erro ao salvar piloto: " + error.message,
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Erro",
        description: "Nome é obrigatório",
        variant: "destructive",
      });
      return;
    }

    if (!formData.functional_id.trim()) {
      toast({
        title: "Erro", 
        description: "ID Funcional é obrigatório",
        variant: "destructive",
      });
      return;
    }

    mutation.mutate({
      ...formData,
      courses: courses.length > 0 ? courses : null,
    });
  };

  const addCourse = () => {
    if (newCourse.trim() && !courses.includes(newCourse.trim())) {
      setCourses([...courses, newCourse.trim()]);
      setNewCourse('');
    }
  };

  const removeCourse = (courseToRemove: string) => {
    setCourses(courses.filter(course => course !== courseToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCourse();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {pilot ? "Editar Piloto" : "Novo Piloto"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Nome completo do piloto"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="functional_id">ID Funcional *</Label>
            <Input
              id="functional_id"
              value={formData.functional_id}
              onChange={(e) => setFormData({ ...formData, functional_id: e.target.value })}
              placeholder="Identificação funcional"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="allocation">Lotação</Label>
            <Input
              id="allocation"
              value={formData.allocation}
              onChange={(e) => setFormData({ ...formData, allocation: e.target.value })}
              placeholder="Unidade/setor de lotação"
            />
          </div>

          <div className="space-y-2">
            <Label>Cursos</Label>
            <div className="flex space-x-2">
              <Input
                value={newCourse}
                onChange={(e) => setNewCourse(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Nome do curso"
              />
              <Button type="button" onClick={addCourse} variant="outline" size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            {courses.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {courses.map((course, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {course}
                    <X 
                      className="h-3 w-3 cursor-pointer hover:text-destructive" 
                      onClick={() => removeCourse(course)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Salvando..." : pilot ? "Atualizar" : "Criar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PilotModal;