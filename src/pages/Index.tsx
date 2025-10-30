import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import ProjectCreator from '@/components/ProjectCreator';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

const Index = () => {
  const [activeSection, setActiveSection] = useState('home');

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
                <h3 className="text-xl font-semibold">Как это работает</h3>
              </div>
              <p className="text-muted-foreground mb-6">
                Отвечай на простые вопросы в чате справа, и DUWDU создаст готовый сайт за минуту
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold">1</span>
                  </div>
                  <div>
                    <p className="font-medium mb-1">Назови проект</p>
                    <p className="text-sm text-muted-foreground">Просто введи название твоего сайта</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold">2</span>
                  </div>
                  <div>
                    <p className="font-medium mb-1">Опиши идею</p>
                    <p className="text-sm text-muted-foreground">Расскажи, что будет делать сайт</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold">3</span>
                  </div>
                  <div>
                    <p className="font-medium mb-1">Выбери стиль</p>
                    <p className="text-sm text-muted-foreground">Нажми на готовый вариант дизайна</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold">4</span>
                  </div>
                  <div>
                    <p className="font-medium mb-1">Укажи разделы</p>
                    <p className="text-sm text-muted-foreground">Какие страницы нужны на сайте</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold">5</span>
                  </div>
                  <div>
                    <p className="font-medium mb-1">Выбери цвета</p>
                    <p className="text-sm text-muted-foreground">Кликни на понравившуюся палитру</p>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-primary/10 border border-primary/30 mt-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name="Sparkles" className="text-primary" size={20} />
                    <p className="font-medium text-primary">Готово!</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Получишь превью сайта и сможешь скачать код
                  </p>
                </div>
              </div>
            </Card>

            <ProjectCreator />
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