import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Привет! Я DUWDU - твой AI-ассистент для создания проектов. Расскажи, что хочешь создать? 🚀',
      sender: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [activeSection, setActiveSection] = useState('home');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [suggestions] = useState([
    'Создать лендинг для бизнеса',
    'Разработать интернет-магазин',
    'Сделать портфолио',
    'Построить SaaS-приложение'
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages([...messages, userMessage]);

    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: generateResponse(input),
        sender: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
    }, 1000);

    setInput('');
  };

  const generateResponse = (userInput: string): string => {
    const responses = [
      'Отличная идея! Давай уточним детали. Какой стиль дизайна тебе нравится?',
      'Понял тебя! А какие основные разделы должны быть на сайте?',
      'Супер! Расскажи больше о целевой аудитории проекта.',
      'Замечательно! Нужна ли интеграция с платежными системами?'
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center animate-glow">
                <span className="text-2xl">🚀</span>
              </div>
              <h1 className="text-2xl font-bold text-primary">DUWDU</h1>
            </div>
            
            <div className="hidden md:flex items-center gap-6">
              {['home', 'about', 'features', 'contact'].map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    activeSection === section ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  {section === 'home' && 'Главная'}
                  {section === 'about' && 'О проекте'}
                  {section === 'features' && 'Возможности'}
                  {section === 'contact' && 'Контакты'}
                </button>
              ))}
            </div>

            <Button size="sm" className="bg-primary hover:bg-primary/90">
              Начать
            </Button>
          </div>
        </div>
      </nav>

      <section id="home" className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 animate-fade-in">
            <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">
              Powered by AI
            </Badge>
            <h2 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Создавай проекты
              <br />
              через диалог
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              DUWDU помогает собрать все требования к твоему проекту через естественный диалог.
              Просто расскажи, что хочешь создать.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            <Card className="p-6 animate-slide-up bg-card/50 backdrop-blur border-border/50">
              <div className="flex items-center gap-2 mb-4">
                <Icon name="Sparkles" className="text-primary" size={24} />
                <h3 className="text-xl font-semibold">Интерактивный сбор требований</h3>
              </div>
              <p className="text-muted-foreground mb-6">
                Отвечай на умные вопросы, прикрепляй изображения для референсов,
                получай персонализированные рекомендации
              </p>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                  <Icon name="Check" className="text-primary mt-1" size={20} />
                  <div>
                    <p className="font-medium">Пошаговые вопросы</p>
                    <p className="text-sm text-muted-foreground">Система задаёт уточняющие вопросы</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                  <Icon name="Image" className="text-primary mt-1" size={20} />
                  <div>
                    <p className="font-medium">Загрузка изображений</p>
                    <p className="text-sm text-muted-foreground">Прикрепляй референсы дизайна</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                  <Icon name="Lightbulb" className="text-primary mt-1" size={20} />
                  <div>
                    <p className="font-medium">Умные подсказки</p>
                    <p className="text-sm text-muted-foreground">Suggestions для быстрого старта</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 animate-slide-up animation-delay-200 h-[600px] flex flex-col bg-card/50 backdrop-blur border-border/50">
              <div className="flex items-center gap-2 mb-4">
                <Icon name="MessageSquare" className="text-primary" size={24} />
                <h3 className="text-xl font-semibold">Демо чата</h3>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
                {messages.map((message) => (
                  <div
                    key={message.id}
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
                ))}
                <div ref={messagesEndRef} />
              </div>

              {suggestions.length > 0 && messages.length < 3 && (
                <div className="mb-4">
                  <p className="text-xs text-muted-foreground mb-2">Попробуй спросить:</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="text-xs hover:bg-primary/10 hover:text-primary hover:border-primary"
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Напиши своё сообщение..."
                  className="flex-1 bg-background border-border"
                />
                <Button onClick={handleSend} size="icon" className="bg-primary hover:bg-primary/90">
                  <Icon name="Send" size={20} />
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section id="about" className="py-20 px-4 bg-card/30">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-secondary/20 text-secondary border-secondary/30">
              О проекте
            </Badge>
            <h2 className="text-4xl font-bold mb-4">Что такое DUWDU?</h2>
            <p className="text-lg text-muted-foreground">
              Интеллектуальный ассистент для сбора требований к веб-проектам
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                <Icon name="Target" className="text-primary" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Наша миссия</h3>
              <p className="text-muted-foreground">
                Упростить процесс создания технических заданий и конфигураций проектов
                через естественный диалог с AI
              </p>
            </Card>

            <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                <Icon name="Zap" className="text-primary" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Как это работает</h3>
              <p className="text-muted-foreground">
                AI анализирует твои ответы, задаёт уточняющие вопросы и формирует
                полную конфигурацию проекта автоматически
              </p>
            </Card>

            <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                <Icon name="Users" className="text-primary" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Для кого</h3>
              <p className="text-muted-foreground">
                Для стартапов, фрилансеров, агентств и всех, кто хочет быстро
                и структурированно описать свой проект
              </p>
            </Card>

            <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                <Icon name="Rocket" className="text-primary" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Результат</h3>
              <p className="text-muted-foreground">
                Получаешь готовую спецификацию проекта с описанием функционала,
                дизайна, структуры и технических деталей
              </p>
            </Card>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">
              Возможности
            </Badge>
            <h2 className="text-4xl font-bold mb-4">Что умеет DUWDU</h2>
            <p className="text-lg text-muted-foreground">
              Полный набор инструментов для создания проектной документации
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: 'MessageCircle',
                title: 'Диалоговый интерфейс',
                description: 'Общайся с AI как с живым консультантом'
              },
              {
                icon: 'Image',
                title: 'Загрузка файлов',
                description: 'Прикрепляй изображения, макеты, референсы'
              },
              {
                icon: 'Lightbulb',
                title: 'Умные подсказки',
                description: 'Система предлагает варианты ответов'
              },
              {
                icon: 'FileText',
                title: 'Генерация ТЗ',
                description: 'Автоматическое создание документации'
              },
              {
                icon: 'Palette',
                title: 'Анализ дизайна',
                description: 'AI распознаёт стили и цветовые схемы'
              },
              {
                icon: 'Settings',
                title: 'Конфигурация',
                description: 'Детальная настройка всех параметров'
              }
            ].map((feature, index) => (
              <Card
                key={index}
                className="p-6 hover:scale-105 transition-transform duration-300 bg-card/50 backdrop-blur border-border/50 hover:border-primary/50"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4 animate-glow">
                  <Icon name={feature.icon as any} className="text-primary" size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="py-20 px-4 bg-card/30">
        <div className="container mx-auto max-w-2xl text-center">
          <Badge className="mb-4 bg-secondary/20 text-secondary border-secondary/30">
            Контакты
          </Badge>
          <h2 className="text-4xl font-bold mb-4">Готов начать?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Присоединяйся к сообществу разработчиков и начни создавать проекты быстрее
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8">
              <Icon name="Rocket" className="mr-2" size={20} />
              Попробовать сейчас
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 border-border hover:bg-muted">
              <Icon name="Github" className="mr-2" size={20} />
              GitHub
            </Button>
          </div>

          <div className="flex gap-6 justify-center">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Icon name="Twitter" size={24} />
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Icon name="Github" size={24} />
            </a>
            <a href="https://t.me/+QgiLIa1gFRY4Y2Iy" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
              <Icon name="Send" size={24} />
            </a>
          </div>
        </div>
      </section>

      <footer className="py-8 px-4 border-t border-border">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>© 2024 DUWDU. Создано с 🚀 на базе poehali.dev</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
