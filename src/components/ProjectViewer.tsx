import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface ProjectViewerProps {
  project: any;
  config: any;
}

const ProjectViewer = ({ project, config }: ProjectViewerProps) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const projectUrl = `${window.location.origin}/p/${project.project_id}`;

  const copyUrl = () => {
    navigator.clipboard.writeText(projectUrl);
    toast.success('Ссылка скопирована!');
  };

  const downloadCode = () => {
    const htmlContent = generateHTML();
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${config.title || 'website'}.html`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Код скачан!');
  };

  const generateHTML = () => {
    const primary = config.colors?.primary || '#0EA5E9';
    const secondary = config.colors?.secondary || '#0284C7';
    
    return `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${config.title}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            line-height: 1.6;
            color: #333;
        }
        .hero { 
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background: linear-gradient(135deg, ${primary} 0%, ${secondary} 100%);
            color: white;
            text-align: center;
            padding: 2rem;
        }
        .hero h1 { font-size: 3rem; margin-bottom: 1rem; }
        .hero p { font-size: 1.5rem; margin-bottom: 2rem; opacity: 0.9; }
        .hero button { 
            padding: 1rem 2rem;
            font-size: 1.1rem;
            background: white;
            color: ${primary};
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
        }
        section { padding: 4rem 2rem; max-width: 1200px; margin: 0 auto; }
        section h2 { font-size: 2.5rem; margin-bottom: 1.5rem; color: ${primary}; }
        section p { font-size: 1.2rem; color: #666; }
    </style>
</head>
<body>
    <section class="hero">
        <h1>${config.title}</h1>
        <p>${config.description}</p>
        <button>Начать</button>
    </section>
    
    ${config.sections?.includes('about') ? `
    <section>
        <h2>О нас</h2>
        <p>Здесь будет информация о компании</p>
    </section>` : ''}
    
    ${config.sections?.includes('contact') ? `
    <section>
        <h2>Контакты</h2>
        <p>Email: info@example.com</p>
        <p>Телефон: +7 (999) 123-45-67</p>
    </section>` : ''}
</body>
</html>`;
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold">{config.title}</h3>
            <p className="text-sm text-muted-foreground">ID: {project.project_id}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={downloadCode}>
              <Icon name="Download" className="mr-2" size={16} />
              Скачать
            </Button>
            <Button size="sm" onClick={copyUrl}>
              <Icon name="Link" className="mr-2" size={16} />
              Ссылка
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
          <Icon name="Globe" size={20} className="text-muted-foreground" />
          <Input 
            value={projectUrl} 
            readOnly 
            className="flex-1 bg-background"
          />
          <Button variant="ghost" size="icon" onClick={copyUrl}>
            <Icon name="Copy" size={16} />
          </Button>
        </div>
      </Card>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <TabsList className="w-full">
          <TabsTrigger value="preview" className="flex-1">
            <Icon name="Eye" className="mr-2" size={16} />
            Превью
          </TabsTrigger>
          <TabsTrigger value="code" className="flex-1">
            <Icon name="Code" className="mr-2" size={16} />
            Код
          </TabsTrigger>
        </TabsList>

        <TabsContent value="preview">
          <Card className="p-0 overflow-hidden">
            <iframe
              srcDoc={generateHTML()}
              className="w-full h-[600px] border-0"
              title="Website Preview"
            />
          </Card>
        </TabsContent>

        <TabsContent value="code">
          <Card className="p-4">
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
              <code>{generateHTML()}</code>
            </pre>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectViewer;
