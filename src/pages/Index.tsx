import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import ProjectCreator from '@/components/ProjectCreator';
import ProjectsList from '@/components/ProjectsList';

const Index = () => {
  const [activeView, setActiveView] = useState<'create' | 'projects'>('create');

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🚀</span>
              <h1 className="text-xl font-bold">DUWDU</h1>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant={activeView === 'create' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveView('create')}
              >
                <Icon name="Plus" className="mr-2" size={16} />
                Создать
              </Button>
              <Button
                variant={activeView === 'projects' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveView('projects')}
              >
                <Icon name="FolderOpen" className="mr-2" size={16} />
                Проекты
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        {activeView === 'create' ? (
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <h2 className="text-3xl font-bold mb-2">Создать новый сайт</h2>
              <p className="text-muted-foreground">
                Ответь на несколько вопросов, и я создам готовый сайт с хостингом
              </p>
            </div>
            <ProjectCreator />
          </div>
        ) : (
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <h2 className="text-3xl font-bold mb-2">Мои проекты</h2>
              <p className="text-muted-foreground">
                Все твои сайты с возможностью редактирования и публикации
              </p>
            </div>
            <ProjectsList />
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
