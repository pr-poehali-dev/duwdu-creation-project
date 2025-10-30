import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Icon from '@/components/ui/icon';

const ProjectPage = () => {
  const { id } = useParams();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProject();
  }, [id]);

  const loadProject = async () => {
    try {
      const response = await fetch(
        `https://functions.poehali.dev/2860771b-5137-42fd-ba78-81ca4404091d?id=${id}`
      );
      const data = await response.json();
      setProject(data);
    } catch (error) {
      console.error('Error loading project:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Icon name="Loader2" size={48} className="animate-spin text-primary" />
      </div>
    );
  }

  if (!project || !project.html_content) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Проект не найден</h1>
          <p className="text-muted-foreground">Проверьте правильность ссылки</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen">
      <iframe
        srcDoc={project.html_content}
        className="w-full h-full border-0"
        title={project.title}
      />
    </div>
  );
};

export default ProjectPage;
