import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  isAction?: boolean;
}

interface ProjectConfig {
  title: string;
  description: string;
  style: string;
  sections: string;
  colors: { primary: string; secondary: string };
}

const ProjectCreator = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Привет! Я помогу создать твой сайт. Как назовём проект?',
      sender: 'assistant'
    }
  ]);
  const [input, setInput] = useState('');
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState<Partial<ProjectConfig>>({});
  const [sessionId] = useState(() => `session-${Date.now()}`);
  const [createdProject, setCreatedProject] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user'
    };

    setMessages(prev => [...prev, userMessage]);

    await processStep(input);
    setInput('');
  };

  const processStep = async (userInput: string) => {
    let assistantResponse = '';
    let nextStep = step + 1;

    switch (step) {
      case 1:
        setConfig(prev => ({ ...prev, title: userInput }));
        assistantResponse = 'Отлично! Теперь опиши, что будет делать сайт (1-2 предложения)';
        break;
      
      case 2:
        setConfig(prev => ({ ...prev, description: userInput }));
        assistantResponse = 'Какой стиль дизайна предпочитаешь?';
        setTimeout(() => {
          setMessages(prev => [...prev, {
            id: Date.now().toString(),
            text: '',
            sender: 'assistant',
            isAction: true
          }]);
        }, 500);
        break;
      
      case 3:
        setConfig(prev => ({ ...prev, style: userInput }));
        assistantResponse = 'Какие разделы нужны? (например: home, about, services, contact)';
        break;
      
      case 4:
        setConfig(prev => ({ ...prev, sections: userInput }));
        assistantResponse = 'Выбери цветовую схему:';
        setTimeout(() => {
          setMessages(prev => [...prev, {
            id: (Date.now() + 1).toString(),
            text: '',
            sender: 'assistant',
            isAction: true
          }]);
        }, 500);
        break;
      
      case 5:
        const colors = parseColors(userInput);
        setConfig(prev => ({ ...prev, colors }));
        assistantResponse = 'Отлично! Создаю твой сайт... ✨';
        nextStep = 6;
        
        setTimeout(async () => {
          await createProject({
            title: config.title || 'Новый сайт',
            description: config.description || '',
            style: config.style || 'modern',
            sections: config.sections || 'home,about,contact',
            colors
          });
        }, 1500);
        break;
    }

    if (assistantResponse) {
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          text: assistantResponse,
          sender: 'assistant'
        }]);
      }, 500);
    }

    setStep(nextStep);
  };

  const parseColors = (input: string): { primary: string; secondary: string } => {
    const colorMap: Record<string, { primary: string; secondary: string }> = {
      'фиолетовый': { primary: '#9b87f5', secondary: '#7E69AB' },
      'синий': { primary: '#0EA5E9', secondary: '#0284C7' },
      'зелёный': { primary: '#10B981', secondary: '#059669' },
      'розовый': { primary: '#EC4899', secondary: '#DB2777' },
      'оранжевый': { primary: '#F97316', secondary: '#EA580C' }
    };

    const normalized = input.toLowerCase();
    for (const [key, value] of Object.entries(colorMap)) {
      if (normalized.includes(key)) return value;
    }

    return { primary: '#9b87f5', secondary: '#7E69AB' };
  };

  const handleStyleClick = (style: string) => {
    setInput(style);
    handleSend();
  };

  const handleColorClick = (colorName: string) => {
    setInput(colorName);
    handleSend();
  };

  const createProject = async (projectConfig: ProjectConfig) => {
    setIsCreating(true);
    
    try {
      const response = await fetch('https://functions.poehali.dev/4aefaed9-f8dc-4e5d-98fa-d97059d9ac2c', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-Id': sessionId
        },
        body: JSON.stringify(projectConfig)
      });

      const data = await response.json();
      setCreatedProject(data);

      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        text: `🎉 Готово! Твой сайт "${projectConfig.title}" создан!`,
        sender: 'assistant'
      }]);

      setTimeout(() => {
        setShowPreview(true);
      }, 1000);
      
    } catch (error) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        text: 'Произошла ошибка при создании сайта. Попробуй ещё раз.',
        sender: 'assistant'
      }]);
    } finally {
      setIsCreating(false);
    }
  };

  const renderActionButtons = (message: Message) => {
    if (!message.isAction) return null;

    if (step === 3) {
      return (
        <div className="flex flex-wrap gap-2 mt-2">
          {['Минималистичный', 'Современный', 'Яркий', 'Корпоративный'].map((style) => (
            <Button
              key={style}
              variant="outline"
              size="sm"
              onClick={() => handleStyleClick(style)}
              className="hover:bg-primary/10 hover:text-primary hover:border-primary"
            >
              {style}
            </Button>
          ))}
        </div>
      );
    }

    if (step === 5) {
      return (
        <div className="flex flex-wrap gap-2 mt-2">
          {[
            { name: 'Фиолетовый', color: '#9b87f5' },
            { name: 'Синий', color: '#0EA5E9' },
            { name: 'Зелёный', color: '#10B981' },
            { name: 'Розовый', color: '#EC4899' },
            { name: 'Оранжевый', color: '#F97316' }
          ].map((colorOption) => (
            <Button
              key={colorOption.name}
              variant="outline"
              size="sm"
              onClick={() => handleColorClick(colorOption.name)}
              className="hover:bg-primary/10 hover:border-primary"
            >
              <span 
                className="w-4 h-4 rounded-full mr-2" 
                style={{ backgroundColor: colorOption.color }}
              />
              {colorOption.name}
            </Button>
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <Card className="p-6 h-[600px] flex flex-col bg-card/50 backdrop-blur border-border/50">
        <div className="flex items-center gap-2 mb-4">
          <Icon name="Wand2" className="text-primary" size={24} />
          <h3 className="text-xl font-semibold">Создать сайт</h3>
          {step > 1 && step < 6 && (
            <Badge variant="outline" className="ml-auto">
              Шаг {step}/5
            </Badge>
          )}
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
          {messages.map((message) => (
            <div key={message.id}>
              <div
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                </div>
              </div>
              {message.sender === 'assistant' && renderActionButtons(message)}
            </div>
          ))}
          {isCreating && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-2xl px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="animate-spin">
                    <Icon name="Loader2" size={16} />
                  </div>
                  <p className="text-sm">Создаю сайт...</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Напиши ответ..."
            className="flex-1 bg-background border-border"
            disabled={step >= 6 || isCreating}
          />
          <Button 
            onClick={handleSend} 
            size="icon" 
            className="bg-primary hover:bg-primary/90"
            disabled={step >= 6 || isCreating}
          >
            <Icon name="Send" size={20} />
          </Button>
        </div>
      </Card>

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Превью твоего сайта</DialogTitle>
          </DialogHeader>
          {createdProject && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Badge className="bg-primary/20 text-primary">
                  ID: {createdProject.project_id}
                </Badge>
                <p className="text-sm text-muted-foreground">
                  Создан: {new Date().toLocaleString('ru')}
                </p>
              </div>
              
              <div className="border border-border rounded-lg overflow-hidden">
                <iframe
                  srcDoc={`
                    <!DOCTYPE html>
                    <html>
                      <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                      </head>
                      <body style="margin: 0;">
                        <div style="padding: 2rem; text-align: center;">
                          <h1 style="color: ${config.colors?.primary};">${config.title}</h1>
                          <p style="font-size: 1.2rem;">${config.description}</p>
                          <p style="margin-top: 2rem; color: #666;">
                            Стиль: ${config.style} | Разделы: ${config.sections}
                          </p>
                        </div>
                      </body>
                    </html>
                  `}
                  className="w-full h-[400px] bg-white"
                  title="Website Preview"
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowPreview(false)}>
                  Закрыть
                </Button>
                <Button className="bg-primary hover:bg-primary/90">
                  <Icon name="Download" className="mr-2" size={16} />
                  Скачать код
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProjectCreator;
