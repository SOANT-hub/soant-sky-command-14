
-- Criar tabela para tarefas
CREATE TABLE public.tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT NOT NULL DEFAULT 'media' CHECK (priority IN ('alta', 'media', 'baixa')),
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'em_andamento', 'concluida', 'cancelada')),
  assigned_to TEXT,
  due_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para andamentos das tarefas
CREATE TABLE public.task_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by TEXT
);

-- Habilitar RLS nas tabelas
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_progress ENABLE ROW LEVEL SECURITY;

-- Políticas para tarefas
CREATE POLICY "Todos podem visualizar tarefas" 
  ON public.tasks 
  FOR SELECT 
  USING (true);

CREATE POLICY "Todos podem criar tarefas" 
  ON public.tasks 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Todos podem atualizar tarefas" 
  ON public.tasks 
  FOR UPDATE 
  USING (true);

CREATE POLICY "Todos podem deletar tarefas" 
  ON public.tasks 
  FOR DELETE 
  USING (true);

-- Políticas para andamentos
CREATE POLICY "Todos podem visualizar andamentos" 
  ON public.task_progress 
  FOR SELECT 
  USING (true);

CREATE POLICY "Todos podem criar andamentos" 
  ON public.task_progress 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Todos podem atualizar andamentos" 
  ON public.task_progress 
  FOR UPDATE 
  USING (true);

CREATE POLICY "Todos podem deletar andamentos" 
  ON public.task_progress 
  FOR DELETE 
  USING (true);

-- Trigger para atualizar updated_at automaticamente
CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON public.tasks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
