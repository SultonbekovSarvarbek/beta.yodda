import { Card } from '@/components/ui/card';
import { PlayCircle } from 'lucide-react';

export default function MiniLessons() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">
          Мини-уроки от репетиторов
        </h1>
        <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
          <p>
            Короткие образовательные видео, где репетиторы объясняют одну маленькую тему простым языком.
            Это быстрые, понятные и полезные мини-разборы длительностью 30–60 секунд — ровно столько, сколько нужно, чтобы уловить суть.
          </p>
        </div>
      </div>

      {/* Features Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">На странице вы можете:</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="mt-1">
                <PlayCircle className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Смотреть мини-уроки по разным предметам</h3>
                <p className="text-sm text-muted-foreground">
                  Получите быстрое объяснение конкретной темы от опытных репетиторов
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="mt-1">
                <PlayCircle className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Узнавать сильные стороны репетитора</h3>
                <p className="text-sm text-muted-foreground">
                  Увидите, как преподаватель объясняет материал в реальном формате
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="mt-1">
                <PlayCircle className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Оценивать стиль объяснения до пробного урока</h3>
                <p className="text-sm text-muted-foreground">
                  Познакомьтесь с подходом репетитора перед бронированием занятия
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="mt-1">
                <PlayCircle className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Быстрее находить подходящего преподавателя</h3>
                <p className="text-sm text-muted-foreground">
                  Сэкономьте время на поиске идеального репетитора для ваших целей
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Bottom Description */}
      <div className="mb-12 p-6 bg-muted/50 rounded-lg">
        <p className="text-center text-muted-foreground">
          Мини-уроки помогают вам познакомиться с репетитором ещё до бронирования занятия — без риска и без лишних диалогов.
        </p>
      </div>

      {/* Placeholder Sections */}
      <div className="space-y-12">
        {/* Popular Mini Lessons */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Популярные мини-уроки</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="overflow-hidden">
                <div className="aspect-video bg-muted flex items-center justify-center">
                  <PlayCircle className="h-12 w-12 text-muted-foreground" />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-2">Название урока</h3>
                  <p className="text-sm text-muted-foreground mb-3">Имя репетитора</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Предмет</span>
                    <span>60 сек</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* By Subject */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">По предметам</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {['Математика', 'Физика', 'Химия', 'Биология', 'История', 'Литература'].map((subject) => (
              <Card key={subject} className="p-4 text-center hover:bg-muted/50 cursor-pointer transition-colors">
                <PlayCircle className="h-8 w-8 mx-auto mb-2 text-primary" />
                <p className="font-medium text-sm">{subject}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* From Top Tutors */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">От лучших репетиторов</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="overflow-hidden">
                <div className="aspect-video bg-muted flex items-center justify-center">
                  <PlayCircle className="h-12 w-12 text-muted-foreground" />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-2">Название урока</h3>
                  <p className="text-sm text-muted-foreground mb-3">Имя репетитора</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Предмет</span>
                    <span>60 сек</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
