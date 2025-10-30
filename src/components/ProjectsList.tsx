import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface Project {
  id: number;
  title: string;
  description: string;
  style: string;
  sections: string;
  colors: any;
  created_at: string;
}

const ProjectsList = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [sessionId] = useState(() => {
    let id = localStorage.getItem('duwdu_session');
    if (!id) {
      id = `session-${Date.now()}`;
      localStorage.setItem('duwdu_session', id);
    }
    return id;
  });

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://functions.poehali.dev/2860771b-5137-42fd-ba78-81ca4404091d?session_id=${sessionId}`
      );
      const data = await response.json();
      
      if (data.projects) {
        setProjects(data.projects);
      }
    } catch (error) {
      console.error('Error loading projects:', error);
      toast.error('Ошибка загрузки проектов');
    } finally {
      setLoading(false);
    }
  };

  const copyProjectUrl = (projectId: number) => {
    const url = `${window.location.origin}/p/${projectId}`;
    navigator.clipboard.writeText(url);
    toast.success('Ссылка скопирована!');
  };

  const openProject = (projectId: number) => {
    window.open(`/p/${projectId}`, '_blank');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Icon name="Loader2" size={32} className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <Card className="p-12 text-center">
        <Icon name="FolderOpen" size={48} className="mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-xl font-semibold mb-2">Пока нет проектов</h3>
        <p className="text-muted-foreground mb-4">
          Создай свой первый сайт и он появится здесь
        </p>
      </Card>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {projects.map((project) => (
        <Card key={project.id} className="p-4 hover:border-primary/50 transition-colors">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="font-semibold mb-1">{project.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {project.description}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-3">
            <Badge variant="secondary" className="text-xs">
              {project.style}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {project.sections?.split(',').length || 0} разделов
            </Badge>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
            <span>ID: {project.id}</span>
            <span>{new Date(project.created_at).toLocaleDateString('ru')}</span>
          </div>

          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => openProject(project.id)}
            >
              <Icon name="Eye" className="mr-2" size={16} />
              Открыть
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => copyProjectUrl(project.id)}
            >
              <Icon name="Link" size={16} />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ProjectsList;
