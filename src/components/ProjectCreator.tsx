import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import ProjectViewer from '@/components/ProjectViewer';

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
      text: 'Привет! Как назовём твой сайт?',
      sender: 'assistant'
    }
  ]);
  const [input, setInput] = useState('');
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState<Partial<ProjectConfig>>({});
  const [sessionId] = useState(() => `session-${Date.now()}`);
  const [createdProject, setCreatedProject] = useState<any>(null);
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
        assistantResponse = 'Опиши, что будет делать сайт';
        break;
      
      case 2:
        setConfig(prev => ({ ...prev, description: userInput }));
        assistantResponse = 'Выбери стиль:';
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
        assistantResponse = 'Какие разделы? (home, about, contact)';
        break;
      
      case 4:
        setConfig(prev => ({ ...prev, sections: userInput }));
        assistantResponse = 'Выбери цвет:';
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
        assistantResponse = 'Создаю сайт...';
        nextStep = 6;
        
        setTimeout(async () => {
          await createProject({
            title: config.title || 'Новый сайт',
            description: config.description || '',
            style: config.style || 'modern',
            sections: config.sections || 'home,about,contact',
            colors
          });
        }, 1000);
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
      'синий': { primary: '#0EA5E9', secondary: '#0284C7' },
      'зелёный': { primary: '#10B981', secondary: '#059669' },
      'фиолетовый': { primary: '#9b87f5', secondary: '#7E69AB' },
      'красный': { primary: '#EF4444', secondary: '#DC2626' }
    };

    const normalized = input.toLowerCase();
    for (const [key, value] of Object.entries(colorMap)) {
      if (normalized.includes(key)) return value;
    }

    return { primary: '#0EA5E9', secondary: '#0284C7' };
  };

  const handleStyleClick = (style: string) => {
    setInput(style);
    setTimeout(() => handleSend(), 100);
  };

  const handleColorClick = (colorName: string) => {
    setInput(colorName);
    setTimeout(() => handleSend(), 100);
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
        text: `Готово! Сайт "${projectConfig.title}" создан 🎉`,
        sender: 'assistant'
      }]);
      
    } catch (error) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        text: 'Ошибка создания. Попробуй ещё раз',
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
          {['Минималистичный', 'Современный', 'Яркий'].map((style) => (
            <Button
              key={style}
              variant="outline"
              size="sm"
              onClick={() => handleStyleClick(style)}
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
            { name: 'Синий', color: '#0EA5E9' },
            { name: 'Зелёный', color: '#10B981' },
            { name: 'Фиолетовый', color: '#9b87f5' },
            { name: 'Красный', color: '#EF4444' }
          ].map((colorOption) => (
            <Button
              key={colorOption.name}
              variant="outline"
              size="sm"
              onClick={() => handleColorClick(colorOption.name)}
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

  if (createdProject) {
    return <ProjectViewer project={createdProject} config={config} />;
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card className="p-6 h-[600px] flex flex-col">
        <h3 className="text-lg font-semibold mb-4">Создание сайта</h3>

        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.map((message) => (
            <div key={message.id}>
              <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
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
              <div className="bg-muted rounded-lg px-4 py-2 flex items-center gap-2">
                <Icon name="Loader2" size={16} className="animate-spin" />
                <p className="text-sm">Создаю...</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Твой ответ..."
            disabled={step >= 6 || isCreating}
          />
          <Button onClick={handleSend} size="icon" disabled={step >= 6 || isCreating}>
            <Icon name="Send" size={20} />
          </Button>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Как это работает</h3>
        <div className="space-y-4">
          {[
            { step: 1, title: 'Название', desc: 'Как назовём сайт?' },
            { step: 2, title: 'Описание', desc: 'Что он будет делать?' },
            { step: 3, title: 'Стиль', desc: 'Выбери готовый дизайн' },
            { step: 4, title: 'Разделы', desc: 'Какие страницы нужны' },
            { step: 5, title: 'Цвет', desc: 'Выбери цветовую схему' }
          ].map((item) => (
            <div key={item.step} className={`flex gap-3 ${step >= item.step ? 'opacity-100' : 'opacity-40'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                step > item.step ? 'bg-primary text-primary-foreground' : 
                step === item.step ? 'bg-primary/20 text-primary' : 'bg-muted'
              }`}>
                {step > item.step ? <Icon name="Check" size={16} /> : item.step}
              </div>
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default ProjectCreator;
