import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';
import { toast } from '@/hooks/use-toast';

interface Notification {
  id: number;
  type: 'webinar' | 'deadline' | 'result';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

interface Student {
  id: number;
  name: string;
  email: string;
  registeredDate: string;
  coursesAccess: string[];
  avatar?: string;
}

interface StudentWork {
  id: number;
  studentId: number;
  studentName: string;
  assignmentId: number;
  assignmentTitle: string;
  submittedDate: string;
  status: 'pending' | 'checked';
  score?: number;
  comment?: string;
  workUrl?: string;
}

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isAddWebinarOpen, setIsAddWebinarOpen] = useState(false);
  const [isAddAssignmentOpen, setIsAddAssignmentOpen] = useState(false);
  const [isRegisterStudentOpen, setIsRegisterStudentOpen] = useState(false);
  const [isCheckWorkOpen, setIsCheckWorkOpen] = useState(false);
  const [selectedWork, setSelectedWork] = useState<StudentWork | null>(null);
  const [workScore, setWorkScore] = useState('');
  const [workComment, setWorkComment] = useState('');
  const [userRole] = useState<'teacher' | 'student'>('teacher');
  
  const [profile, setProfile] = useState({
    name: 'Анна Иванова',
    email: 'student@eduplatform.com',
    phone: '+7 (999) 123-45-67',
    city: 'Москва, Россия'
  });
  
  const [newWebinar, setNewWebinar] = useState({
    title: '',
    date: '',
    time: '',
    duration: '',
    speaker: '',
    videoUrl: '',
    isLive: false,
    courseAccess: 'free'
  });
  
  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    coursesAccess: [] as string[]
  });
  
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    course: '',
    deadline: ''
  });
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: 'webinar',
      title: 'Новый вебинар',
      message: 'Завтра в 15:00 - "React продвинутые паттерны"',
      time: '2 часа назад',
      read: false
    },
    {
      id: 2,
      type: 'deadline',
      title: 'Дедлайн приближается',
      message: 'Осталось 2 дня на сдачу задания "Хуки в React"',
      time: '4 часа назад',
      read: false
    },
    {
      id: 3,
      type: 'result',
      title: 'Задание проверено',
      message: 'Ваше задание "TypeScript Basics" - 95/100',
      time: '1 день назад',
      read: true
    }
  ]);

  const courses = [
    {
      id: 1,
      title: 'React & TypeScript',
      progress: 68,
      lessons: 24,
      completed: 16,
      nextLesson: 'Хуки в React',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      id: 2,
      title: 'Node.js Backend',
      progress: 42,
      lessons: 18,
      completed: 8,
      nextLesson: 'Express.js маршрутизация',
      gradient: 'from-pink-500 to-orange-500'
    },
    {
      id: 3,
      title: 'UI/UX Design',
      progress: 85,
      lessons: 20,
      completed: 17,
      nextLesson: 'Прототипирование в Figma',
      gradient: 'from-orange-500 to-purple-500'
    }
  ];

  const [webinars, setWebinars] = useState([
    {
      id: 1,
      title: 'React продвинутые паттерны',
      date: '15 декабря',
      time: '15:00',
      duration: '2 часа',
      speaker: 'Анна Петрова',
      status: 'upcoming',
      viewers: 0,
      videoUrl: '',
      isLive: false,
      courseAccess: 'React & TypeScript',
      assignmentId: 1
    },
    {
      id: 2,
      title: 'TypeScript Best Practices',
      date: '12 декабря',
      time: '18:00',
      duration: '1.5 часа',
      speaker: 'Иван Смирнов',
      status: 'live',
      viewers: 243,
      videoUrl: 'https://www.youtube.com/watch?v=example',
      isLive: true,
      courseAccess: 'React & TypeScript',
      assignmentId: 3
    },
    {
      id: 3,
      title: 'Оптимизация производительности',
      date: '8 декабря',
      time: '16:00',
      duration: '2 часа',
      speaker: 'Мария Козлова',
      status: 'recorded',
      viewers: 1024,
      videoUrl: 'https://www.youtube.com/watch?v=example2',
      isLive: false,
      courseAccess: 'free',
      assignmentId: 4
    }
  ]);

  const [assignments, setAssignments] = useState([
    {
      id: 1,
      title: 'Хуки в React',
      course: 'React & TypeScript',
      deadline: '3 декабря 2024',
      status: 'pending',
      daysLeft: 2,
      webinarId: 1,
      description: 'Создайте компонент используя useState и useEffect'
    },
    {
      id: 2,
      title: 'REST API разработка',
      course: 'Node.js Backend',
      deadline: '5 декабря 2024',
      status: 'pending',
      daysLeft: 4,
      webinarId: null,
      description: 'Разработайте REST API с использованием Express'
    },
    {
      id: 3,
      title: 'TypeScript Basics',
      course: 'React & TypeScript',
      deadline: '28 ноября 2024',
      status: 'checked',
      score: 95,
      webinarId: 2,
      description: 'Типизируйте React компонент'
    },
    {
      id: 4,
      title: 'UI компоненты',
      course: 'UI/UX Design',
      deadline: '25 ноября 2024',
      status: 'checked',
      score: 88,
      webinarId: 3,
      description: 'Создайте кнопку с анимацией'
    }
  ]);
  
  const [students, setStudents] = useState<Student[]>([
    {
      id: 1,
      name: 'Иван Петров',
      email: 'ivan@example.com',
      registeredDate: '15 октября 2024',
      coursesAccess: ['React & TypeScript', 'Node.js Backend']
    },
    {
      id: 2,
      name: 'Мария Сидорова',
      email: 'maria@example.com',
      registeredDate: '20 октября 2024',
      coursesAccess: ['React & TypeScript', 'UI/UX Design']
    },
    {
      id: 3,
      name: 'Алексей Козлов',
      email: 'alex@example.com',
      registeredDate: '1 ноября 2024',
      coursesAccess: ['Node.js Backend']
    }
  ]);
  
  const [studentWorks, setStudentWorks] = useState<StudentWork[]>([
    {
      id: 1,
      studentId: 1,
      studentName: 'Иван Петров',
      assignmentId: 3,
      assignmentTitle: 'TypeScript Basics',
      submittedDate: '27 ноября 2024',
      status: 'checked',
      score: 95,
      comment: 'Отличная работа! Все типы правильно определены.',
      workUrl: 'https://github.com/student/typescript-task'
    },
    {
      id: 2,
      studentId: 2,
      studentName: 'Мария Сидорова',
      assignmentId: 4,
      assignmentTitle: 'UI компоненты',
      submittedDate: '24 ноября 2024',
      status: 'checked',
      score: 88,
      comment: 'Хорошая анимация, но можно улучшить производительность',
      workUrl: 'https://codepen.io/student/button-animation'
    },
    {
      id: 3,
      studentId: 1,
      studentName: 'Иван Петров',
      assignmentId: 1,
      assignmentTitle: 'Хуки в React',
      submittedDate: '1 декабря 2024',
      status: 'pending',
      workUrl: 'https://github.com/student/react-hooks'
    },
    {
      id: 4,
      studentId: 3,
      studentName: 'Алексей Козлов',
      assignmentId: 2,
      assignmentTitle: 'REST API разработка',
      submittedDate: '2 декабря 2024',
      status: 'pending',
      workUrl: 'https://github.com/student/express-api'
    }
  ]);

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'webinar':
        return 'Video';
      case 'deadline':
        return 'Clock';
      case 'result':
        return 'CheckCircle';
      default:
        return 'Bell';
    }
  };

  const showToast = (title: string, description: string) => {
    toast({ title, description });
  };

  const handleSaveProfile = () => {
    setIsEditProfileOpen(false);
    toast({ title: 'Профиль обновлен', description: 'Ваши данные успешно сохранены' });
  };

  const handleAddWebinar = () => {
    if (!newWebinar.title || !newWebinar.date || !newWebinar.time) {
      toast({ title: 'Ошибка', description: 'Заполните все обязательные поля' });
      return;
    }
    
    const webinar = {
      id: Date.now(),
      title: newWebinar.title,
      date: newWebinar.date,
      time: newWebinar.time,
      duration: newWebinar.duration || '1 час',
      speaker: newWebinar.speaker || profile.name,
      status: newWebinar.isLive ? ('live' as const) : ('upcoming' as const),
      viewers: 0,
      videoUrl: newWebinar.videoUrl,
      isLive: newWebinar.isLive,
      courseAccess: newWebinar.courseAccess,
      assignmentId: null
    };
    
    setWebinars([webinar, ...webinars]);
    setNewWebinar({ title: '', date: '', time: '', duration: '', speaker: '', videoUrl: '', isLive: false, courseAccess: 'free' });
    setIsAddWebinarOpen(false);
    toast({ title: 'Вебинар добавлен', description: 'Новый вебинар успешно создан' });
  };

  const handleAddAssignment = () => {
    if (!newAssignment.title || !newAssignment.course || !newAssignment.deadline) {
      toast({ title: 'Ошибка', description: 'Заполните все поля' });
      return;
    }
    
    const deadline = new Date(newAssignment.deadline);
    const today = new Date();
    const daysLeft = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    const assignment = {
      id: Date.now(),
      title: newAssignment.title,
      course: newAssignment.course,
      deadline: deadline.toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' }),
      status: 'pending' as const,
      daysLeft
    };
    
    setAssignments([assignment, ...assignments]);
    setNewAssignment({ title: '', course: '', deadline: '' });
    setIsAddAssignmentOpen(false);
    toast({ title: 'Задание добавлено', description: 'Новое задание успешно создано' });
  };

  const handleDeleteWebinar = (id: number) => {
    setWebinars(webinars.filter(w => w.id !== id));
    toast({ title: 'Вебинар удален', description: 'Вебинар успешно удален' });
  };

  const handleDeleteAssignment = (id: number) => {
    setAssignments(assignments.filter(a => a.id !== id));
    toast({ title: 'Задание удалено', description: 'Задание успешно удалено' });
  };

  const handleRegisterStudent = () => {
    if (!newStudent.name || !newStudent.email || newStudent.coursesAccess.length === 0) {
      toast({ title: 'Ошибка', description: 'Заполните все поля и выберите хотя бы один курс' });
      return;
    }
    
    const student: Student = {
      id: Date.now(),
      name: newStudent.name,
      email: newStudent.email,
      registeredDate: new Date().toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' }),
      coursesAccess: newStudent.coursesAccess
    };
    
    setStudents([...students, student]);
    setNewStudent({ name: '', email: '', coursesAccess: [] });
    setIsRegisterStudentOpen(false);
    toast({ title: 'Студент зарегистрирован', description: `${student.name} успешно добавлен на платформу` });
  };

  const handleCheckWork = () => {
    if (!selectedWork || !workScore) {
      toast({ title: 'Ошибка', description: 'Укажите оценку' });
      return;
    }
    
    const updatedWorks = studentWorks.map(work => 
      work.id === selectedWork.id 
        ? { ...work, status: 'checked' as const, score: parseInt(workScore), comment: workComment }
        : work
    );
    
    setStudentWorks(updatedWorks);
    setIsCheckWorkOpen(false);
    setSelectedWork(null);
    setWorkScore('');
    setWorkComment('');
    toast({ title: 'Работа проверена', description: 'Оценка и комментарий сохранены' });
  };

  const openCheckWork = (work: StudentWork) => {
    setSelectedWork(work);
    setWorkScore(work.score?.toString() || '');
    setWorkComment(work.comment || '');
    setIsCheckWorkOpen(true);
  };

  const pendingWorksCount = studentWorks.filter(w => w.status === 'pending').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <header className="bg-white/80 backdrop-blur-md border-b border-purple-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Icon name="GraduationCap" className="text-white" size={24} />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                EduPlatform
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => setActiveTab('notifications')}
              >
                <Icon name="Bell" size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-pink-500 to-orange-500 text-white text-xs rounded-full flex items-center justify-center animate-scale-in">
                    {unreadCount}
                  </span>
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setActiveTab('profile')}
              >
                <Icon name="User" size={20} />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-9 mb-8 bg-white/50 backdrop-blur-sm p-1">
            <TabsTrigger value="home" className="flex items-center gap-2">
              <Icon name="Home" size={16} />
              <span className="hidden sm:inline">Главная</span>
            </TabsTrigger>
            <TabsTrigger value="courses" className="flex items-center gap-2">
              <Icon name="BookOpen" size={16} />
              <span className="hidden sm:inline">Курсы</span>
            </TabsTrigger>
            <TabsTrigger value="webinars" className="flex items-center gap-2">
              <Icon name="Video" size={16} />
              <span className="hidden sm:inline">Вебинары</span>
            </TabsTrigger>
            <TabsTrigger value="assignments" className="flex items-center gap-2">
              <Icon name="ClipboardList" size={16} />
              <span className="hidden sm:inline">Задания</span>
            </TabsTrigger>
            {userRole === 'teacher' && (
              <>
                <TabsTrigger value="students" className="flex items-center gap-2">
                  <Icon name="Users" size={16} />
                  <span className="hidden sm:inline">Студенты</span>
                </TabsTrigger>
                <TabsTrigger value="check-works" className="flex items-center gap-2 relative">
                  <Icon name="CheckSquare" size={16} />
                  <span className="hidden sm:inline">Проверка</span>
                  {pendingWorksCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-pink-500 to-orange-500 text-white text-xs rounded-full flex items-center justify-center">
                      {pendingWorksCount}
                    </span>
                  )}
                </TabsTrigger>
              </>
            )}
            <TabsTrigger value="statistics" className="flex items-center gap-2">
              <Icon name="BarChart3" size={16} />
              <span className="hidden sm:inline">Статистика</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <Icon name="User" size={16} />
              <span className="hidden sm:inline">Профиль</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2 relative">
              <Icon name="Bell" size={16} />
              <span className="hidden sm:inline">Уведомления</span>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-pink-500 to-orange-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="home" className="space-y-8 animate-fade-in">
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="p-6 bg-gradient-to-br from-purple-500 to-pink-500 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <Icon name="BookOpen" size={32} />
                  <Badge className="bg-white/20 text-white border-0">Активно</Badge>
                </div>
                <h3 className="text-3xl font-bold mb-1">3</h3>
                <p className="text-purple-100">Активных курса</p>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-pink-500 to-orange-500 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <Icon name="Trophy" size={32} />
                  <Badge className="bg-white/20 text-white border-0">65%</Badge>
                </div>
                <h3 className="text-3xl font-bold mb-1">65%</h3>
                <p className="text-orange-100">Средний прогресс</p>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-orange-500 to-purple-500 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <Icon name="Clock" size={32} />
                  <Badge className="bg-white/20 text-white border-0">2 дня</Badge>
                </div>
                <h3 className="text-3xl font-bold mb-1">2</h3>
                <p className="text-purple-100">Задания до дедлайна</p>
              </Card>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Ближайшие вебинары
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                {webinars.slice(0, 2).map((webinar) => (
                  <Card key={webinar.id} className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-purple-100">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-lg mb-2">{webinar.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                          <Icon name="Calendar" size={14} />
                          <span>{webinar.date} в {webinar.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Icon name="Clock" size={14} />
                          <span>{webinar.duration}</span>
                        </div>
                      </div>
                      {webinar.status === 'live' && (
                        <Badge className="bg-gradient-to-r from-pink-500 to-orange-500 text-white border-0 animate-pulse">
                          <Icon name="Radio" size={12} className="mr-1" />
                          LIVE
                        </Badge>
                      )}
                      {webinar.status === 'upcoming' && (
                        <Badge className="bg-purple-100 text-purple-700 border-0">
                          Скоро
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Icon name="User" size={14} />
                        <span>{webinar.speaker}</span>
                      </div>
                      <Button
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                        onClick={() => showToast('Вебинар', 'Вы записаны на вебинар!')}
                      >
                        {webinar.status === 'live' ? 'Присоединиться' : 'Записаться'}
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-2">
                Расписание недели 🐱
              </h2>
              <div className="grid gap-3">
                {['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'].map((day, index) => {
                  const dayWebinars = webinars.filter((_, i) => i % 7 === index).slice(0, 1);
                  const catEmojis = ['😺', '😸', '😹', '😻', '😼', '😽', '🙀'];
                  return (
                    <Card key={day} className="p-4 hover:shadow-lg transition-all duration-300 border-purple-100">
                      <div className="flex items-center gap-4">
                        <div className="text-4xl">{catEmojis[index]}</div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg mb-1">{day}</h3>
                          {dayWebinars.length > 0 ? (
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Icon name="Clock" size={14} />
                                <span>{dayWebinars[0].time}</span>
                              </div>
                              <span>{dayWebinars[0].title}</span>
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500">Выходной - отдыхаем! 😴</p>
                          )}
                        </div>
                        {dayWebinars.length > 0 && (
                          <Badge className="bg-purple-100 text-purple-700 border-0">
                            {dayWebinars[0].duration}
                          </Badge>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="courses" className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Мои курсы
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => (
                <Card key={course.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-purple-100">
                  <div className={`h-32 bg-gradient-to-r ${course.gradient} flex items-center justify-center`}>
                    <Icon name="BookOpen" size={48} className="text-white" />
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-xl mb-3">{course.title}</h3>
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>Прогресс</span>
                        <span className="font-semibold">{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-2" />
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>Уроков пройдено</span>
                        <span>{course.completed} из {course.lessons}</span>
                      </div>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-3 mb-4">
                      <p className="text-sm text-gray-600 mb-1">Следующий урок:</p>
                      <p className="font-semibold text-purple-700">{course.nextLesson}</p>
                    </div>
                    <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                      Продолжить обучение
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="webinars" className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Вебинары
              </h2>
              <Dialog open={isAddWebinarOpen} onOpenChange={setIsAddWebinarOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                    <Icon name="Plus" size={16} className="mr-2" />
                    Добавить вебинар
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Новый вебинар</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div>
                      <Label htmlFor="webinar-title">Название *</Label>
                      <Input
                        id="webinar-title"
                        value={newWebinar.title}
                        onChange={(e) => setNewWebinar({ ...newWebinar, title: e.target.value })}
                        placeholder="React продвинутые паттерны"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="webinar-date">Дата *</Label>
                        <Input
                          id="webinar-date"
                          value={newWebinar.date}
                          onChange={(e) => setNewWebinar({ ...newWebinar, date: e.target.value })}
                          placeholder="15 декабря"
                        />
                      </div>
                      <div>
                        <Label htmlFor="webinar-time">Время *</Label>
                        <Input
                          id="webinar-time"
                          value={newWebinar.time}
                          onChange={(e) => setNewWebinar({ ...newWebinar, time: e.target.value })}
                          placeholder="15:00"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="webinar-duration">Длительность</Label>
                        <Input
                          id="webinar-duration"
                          value={newWebinar.duration}
                          onChange={(e) => setNewWebinar({ ...newWebinar, duration: e.target.value })}
                          placeholder="2 часа"
                        />
                      </div>
                      <div>
                        <Label htmlFor="webinar-speaker">Спикер</Label>
                        <Input
                          id="webinar-speaker"
                          value={newWebinar.speaker}
                          onChange={(e) => setNewWebinar({ ...newWebinar, speaker: e.target.value })}
                          placeholder={profile.name}
                        />
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <Label htmlFor="webinar-video">Ссылка на видео / эфир</Label>
                      <Input
                        id="webinar-video"
                        value={newWebinar.videoUrl}
                        onChange={(e) => setNewWebinar({ ...newWebinar, videoUrl: e.target.value })}
                        placeholder="https://youtube.com/watch?v=..."
                      />
                      <p className="text-xs text-gray-500 mt-1">YouTube, Twitch, или прямая ссылка на видео</p>
                    </div>
                    <div>
                      <Label htmlFor="webinar-course">Доступ к курсу</Label>
                      <Select value={newWebinar.courseAccess} onValueChange={(value) => setNewWebinar({ ...newWebinar, courseAccess: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите курс" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="free">Бесплатный доступ</SelectItem>
                          <SelectItem value="React & TypeScript">React & TypeScript</SelectItem>
                          <SelectItem value="Node.js Backend">Node.js Backend</SelectItem>
                          <SelectItem value="UI/UX Design">UI/UX Design</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="webinar-live"
                        checked={newWebinar.isLive}
                        onChange={(e) => setNewWebinar({ ...newWebinar, isLive: e.target.checked })}
                        className="w-4 h-4 text-purple-600"
                      />
                      <Label htmlFor="webinar-live" className="cursor-pointer">
                        🔴 Это прямой эфир (LIVE)
                      </Label>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Button variant="outline" onClick={() => setIsAddWebinarOpen(false)}>
                        Отмена
                      </Button>
                      <Button 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                        onClick={handleAddWebinar}
                      >
                        Создать
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div className="grid gap-4">
              {webinars.map((webinar) => (
                <Card key={webinar.id} className="p-6 hover:shadow-lg transition-all duration-300 border-purple-100">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4 flex-1">
                      <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${
                        webinar.status === 'live' ? 'from-pink-500 to-orange-500 animate-pulse' :
                        webinar.status === 'upcoming' ? 'from-purple-500 to-pink-500' :
                        'from-gray-400 to-gray-500'
                      } flex items-center justify-center flex-shrink-0`}>
                        <Icon name="Video" size={28} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-bold text-xl">{webinar.title}</h3>
                          {webinar.status === 'live' && (
                            <Badge className="bg-gradient-to-r from-pink-500 to-orange-500 text-white border-0 animate-pulse">
                              <Icon name="Radio" size={12} className="mr-1" />
                              LIVE
                            </Badge>
                          )}
                        </div>
                        <div className="space-y-2 mb-3">
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Icon name="Calendar" size={14} />
                              <span>{webinar.date}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Icon name="Clock" size={14} />
                              <span>{webinar.time}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Icon name="Timer" size={14} />
                              <span>{webinar.duration}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Icon name="User" size={14} />
                            <span>Спикер: {webinar.speaker}</span>
                          </div>
                          {webinar.viewers > 0 && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Icon name="Users" size={14} />
                              <span>{webinar.viewers} участников</span>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            className={
                              webinar.status === 'live'
                                ? 'bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600'
                                : webinar.status === 'upcoming'
                                ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
                                : 'bg-gray-500 hover:bg-gray-600'
                            }
                            onClick={() => showToast(
                              webinar.status === 'recorded' ? 'Запись' : 'Вебинар',
                              webinar.status === 'recorded' ? 'Открываю запись вебинара...' : 'Вы записаны на вебинар!'
                            )}
                          >
                            {webinar.status === 'live' ? (
                              <>
                                <Icon name="Play" size={16} className="mr-2" />
                                Смотреть сейчас
                              </>
                            ) : webinar.status === 'upcoming' ? (
                              <>
                                <Icon name="Calendar" size={16} className="mr-2" />
                                Записаться
                              </>
                            ) : (
                              <>
                                <Icon name="PlayCircle" size={16} className="mr-2" />
                                Смотреть запись
                              </>
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="border-red-300 text-red-600 hover:bg-red-50"
                            onClick={() => handleDeleteWebinar(webinar.id)}
                          >
                            <Icon name="Trash2" size={16} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="assignments" className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Домашние задания
              </h2>
              <Dialog open={isAddAssignmentOpen} onOpenChange={setIsAddAssignmentOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                    <Icon name="Plus" size={16} className="mr-2" />
                    Добавить задание
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Новое задание</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div>
                      <Label htmlFor="assignment-title">Название *</Label>
                      <Input
                        id="assignment-title"
                        value={newAssignment.title}
                        onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                        placeholder="Хуки в React"
                      />
                    </div>
                    <div>
                      <Label htmlFor="assignment-course">Курс *</Label>
                      <Input
                        id="assignment-course"
                        value={newAssignment.course}
                        onChange={(e) => setNewAssignment({ ...newAssignment, course: e.target.value })}
                        placeholder="React & TypeScript"
                      />
                    </div>
                    <div>
                      <Label htmlFor="assignment-deadline">Дедлайн *</Label>
                      <Input
                        id="assignment-deadline"
                        type="date"
                        value={newAssignment.deadline}
                        onChange={(e) => setNewAssignment({ ...newAssignment, deadline: e.target.value })}
                      />
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Button variant="outline" onClick={() => setIsAddAssignmentOpen(false)}>
                        Отмена
                      </Button>
                      <Button 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                        onClick={handleAddAssignment}
                      >
                        Создать
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div className="grid gap-4">
              {assignments.map((assignment) => (
                <Card key={assignment.id} className="p-6 hover:shadow-lg transition-all duration-300 border-purple-100">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="font-bold text-xl">{assignment.title}</h3>
                        {assignment.status === 'pending' && (
                          <Badge className={
                            assignment.daysLeft && assignment.daysLeft <= 2
                              ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white border-0'
                              : 'bg-purple-100 text-purple-700 border-0'
                          }>
                            {assignment.daysLeft} {assignment.daysLeft === 1 ? 'день' : 'дня'}
                          </Badge>
                        )}
                        {assignment.status === 'checked' && (
                          <Badge className="bg-green-100 text-green-700 border-0">
                            <Icon name="CheckCircle" size={12} className="mr-1" />
                            Проверено
                          </Badge>
                        )}
                      </div>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Icon name="BookOpen" size={14} />
                          <span>{assignment.course}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Icon name="Calendar" size={14} />
                          <span>Дедлайн: {assignment.deadline}</span>
                        </div>
                        {assignment.status === 'checked' && assignment.score && (
                          <div className="flex items-center gap-2">
                            <Icon name="Award" size={14} className="text-purple-600" />
                            <span className="font-semibold text-purple-600">Оценка: {assignment.score}/100</span>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {assignment.status === 'pending' ? (
                          <Button
                            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                            onClick={() => showToast('Задание', 'Открываю задание...')}
                          >
                            <Icon name="FileEdit" size={16} className="mr-2" />
                            Выполнить задание
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            className="border-purple-300 text-purple-700 hover:bg-purple-50"
                            onClick={() => showToast('Результаты', 'Открываю результаты проверки...')}
                          >
                            <Icon name="Eye" size={16} className="mr-2" />
                            Посмотреть результаты
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="icon"
                          className="border-red-300 text-red-600 hover:bg-red-50"
                          onClick={() => handleDeleteAssignment(assignment.id)}
                        >
                          <Icon name="Trash2" size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="statistics" className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Статистика обучения
            </h2>
            
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="p-6 border-purple-100">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Icon name="TrendingUp" size={20} className="text-purple-600" />
                  Прогресс по курсам
                </h3>
                <div className="space-y-4">
                  {courses.map((course) => (
                    <div key={course.id}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{course.title}</span>
                        <span className="text-sm font-semibold text-purple-600">{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-2" />
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6 border-purple-100">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Icon name="Award" size={20} className="text-purple-600" />
                  Последние оценки
                </h3>
                <div className="space-y-3">
                  {assignments.filter(a => a.status === 'checked').map((assignment) => (
                    <div key={assignment.id} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{assignment.title}</p>
                        <p className="text-xs text-gray-600">{assignment.course}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg text-purple-600">{assignment.score}</p>
                        <p className="text-xs text-gray-600">из 100</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6 border-purple-100">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Icon name="Target" size={20} className="text-purple-600" />
                  Общая статистика
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                        <Icon name="BookOpen" size={20} className="text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Уроков завершено</p>
                        <p className="font-bold text-xl">41</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-pink-50 to-orange-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
                        <Icon name="CheckCircle" size={20} className="text-pink-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Заданий выполнено</p>
                        <p className="font-bold text-xl">24</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-purple-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                        <Icon name="Clock" size={20} className="text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Часов обучения</p>
                        <p className="font-bold text-xl">127</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-purple-100">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Icon name="Trophy" size={20} className="text-purple-600" />
                  Достижения
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-3 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg">
                    <div className="text-3xl mb-1">🏆</div>
                    <p className="text-xs font-medium">Первый курс</p>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-br from-pink-100 to-orange-100 rounded-lg">
                    <div className="text-3xl mb-1">⭐</div>
                    <p className="text-xs font-medium">10 заданий</p>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-br from-orange-100 to-purple-100 rounded-lg">
                    <div className="text-3xl mb-1">🎯</div>
                    <p className="text-xs font-medium">100 часов</p>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg">
                    <div className="text-3xl mb-1">📚</div>
                    <p className="text-xs font-medium">Книжный червь</p>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-br from-pink-100 to-orange-100 rounded-lg">
                    <div className="text-3xl mb-1">🔥</div>
                    <p className="text-xs font-medium">7 дней подряд</p>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-br from-orange-100 to-purple-100 rounded-lg opacity-50">
                    <div className="text-3xl mb-1">🎓</div>
                    <p className="text-xs font-medium">Выпускник</p>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6 animate-fade-in">
            <Card className="p-8 border-purple-100">
              <div className="flex items-start gap-6 mb-8">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-3xl font-bold">
                  {profile.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2">{profile.name}</h2>
                  <p className="text-gray-600 mb-4">{profile.email}</p>
                  <div className="flex items-center gap-4">
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                      Премиум аккаунт
                    </Badge>
                    <Badge className="bg-purple-100 text-purple-700 border-0">
                      Студент с марта 2024
                    </Badge>
                  </div>
                </div>
                <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="border-purple-300 text-purple-700 hover:bg-purple-50">
                      <Icon name="Settings" size={16} className="mr-2" />
                      Редактировать
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Редактировать профиль</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div>
                        <Label htmlFor="profile-name">Имя</Label>
                        <Input
                          id="profile-name"
                          value={profile.name}
                          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="profile-email">Email</Label>
                        <Input
                          id="profile-email"
                          type="email"
                          value={profile.email}
                          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="profile-phone">Телефон</Label>
                        <Input
                          id="profile-phone"
                          value={profile.phone}
                          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="profile-city">Город</Label>
                        <Input
                          id="profile-city"
                          value={profile.city}
                          onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                        />
                      </div>
                      <div className="flex gap-2 justify-end">
                        <Button variant="outline" onClick={() => setIsEditProfileOpen(false)}>
                          Отмена
                        </Button>
                        <Button 
                          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                          onClick={handleSaveProfile}
                        >
                          Сохранить
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="font-bold text-lg mb-4">Личная информация</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <Icon name="User" size={16} className="text-gray-400" />
                      <span className="text-gray-600">Имя:</span>
                      <span className="font-medium">{profile.name}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Icon name="Mail" size={16} className="text-gray-400" />
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">{profile.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Icon name="Phone" size={16} className="text-gray-400" />
                      <span className="text-gray-600">Телефон:</span>
                      <span className="font-medium">{profile.phone}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Icon name="MapPin" size={16} className="text-gray-400" />
                      <span className="text-gray-600">Город:</span>
                      <span className="font-medium">{profile.city}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-4">Настройки уведомлений</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Icon name="Video" size={16} className="text-purple-600" />
                        <span className="text-sm">Новые вебинары</span>
                      </div>
                      <div className="w-10 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-end px-1">
                        <div className="w-4 h-4 bg-white rounded-full"></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Icon name="Clock" size={16} className="text-purple-600" />
                        <span className="text-sm">Дедлайны заданий</span>
                      </div>
                      <div className="w-10 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-end px-1">
                        <div className="w-4 h-4 bg-white rounded-full"></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Icon name="CheckCircle" size={16} className="text-purple-600" />
                        <span className="text-sm">Результаты проверки</span>
                      </div>
                      <div className="w-10 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-end px-1">
                        <div className="w-4 h-4 bg-white rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="students" className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Студенты курса
              </h2>
              <Dialog open={isRegisterStudentOpen} onOpenChange={setIsRegisterStudentOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                    <Icon name="UserPlus" size={16} className="mr-2" />
                    Зарегистрировать студента
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Регистрация студента</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div>
                      <Label htmlFor="student-name">Имя *</Label>
                      <Input
                        id="student-name"
                        value={newStudent.name}
                        onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                        placeholder="Иван Петров"
                      />
                    </div>
                    <div>
                      <Label htmlFor="student-email">Email *</Label>
                      <Input
                        id="student-email"
                        type="email"
                        value={newStudent.email}
                        onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                        placeholder="ivan@example.com"
                      />
                    </div>
                    <div>
                      <Label>Доступ к курсам *</Label>
                      <div className="space-y-2 mt-2">
                        {courses.map((course) => (
                          <div key={course.id} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id={`course-${course.id}`}
                              checked={newStudent.coursesAccess.includes(course.title)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setNewStudent({ ...newStudent, coursesAccess: [...newStudent.coursesAccess, course.title] });
                                } else {
                                  setNewStudent({ ...newStudent, coursesAccess: newStudent.coursesAccess.filter(c => c !== course.title) });
                                }
                              }}
                              className="w-4 h-4 text-purple-600"
                            />
                            <Label htmlFor={`course-${course.id}`} className="cursor-pointer">
                              {course.title}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Button variant="outline" onClick={() => setIsRegisterStudentOpen(false)}>
                        Отмена
                      </Button>
                      <Button 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                        onClick={handleRegisterStudent}
                      >
                        Зарегистрировать
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div className="grid gap-4">
              {students.map((student) => (
                <Card key={student.id} className="p-6 hover:shadow-lg transition-all duration-300 border-purple-100">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                      {student.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-xl mb-2">{student.name}</h3>
                      <div className="space-y-2 mb-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Icon name="Mail" size={14} />
                          <span>{student.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Icon name="Calendar" size={14} />
                          <span>Зарегистрирован: {student.registeredDate}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {student.coursesAccess.map((course) => (
                          <Badge key={course} className="bg-purple-100 text-purple-700 border-0">
                            <Icon name="BookOpen" size={12} className="mr-1" />
                            {course}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="check-works" className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Проверка работ
            </h2>
            <div className="grid gap-4">
              {studentWorks.map((work) => (
                <Card key={work.id} className={`p-6 hover:shadow-lg transition-all duration-300 ${
                  work.status === 'pending' ? 'border-orange-300 bg-orange-50/30' : 'border-purple-100'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="font-bold text-xl">{work.assignmentTitle}</h3>
                        {work.status === 'pending' ? (
                          <Badge className="bg-gradient-to-r from-orange-500 to-pink-500 text-white border-0">
                            <Icon name="Clock" size={12} className="mr-1" />
                            Ожидает проверки
                          </Badge>
                        ) : (
                          <Badge className="bg-green-100 text-green-700 border-0">
                            <Icon name="CheckCircle" size={12} className="mr-1" />
                            Проверено - {work.score}/100
                          </Badge>
                        )}
                      </div>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Icon name="User" size={14} />
                          <span>Студент: {work.studentName}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Icon name="Calendar" size={14} />
                          <span>Сдано: {work.submittedDate}</span>
                        </div>
                        {work.workUrl && (
                          <div className="flex items-center gap-2 text-sm">
                            <Icon name="Link" size={14} className="text-purple-600" />
                            <a href={work.workUrl} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">
                              {work.workUrl}
                            </a>
                          </div>
                        )}
                        {work.status === 'checked' && work.comment && (
                          <div className="mt-3 p-3 bg-purple-50 rounded-lg">
                            <p className="text-sm text-gray-700">
                              <strong>Комментарий:</strong> {work.comment}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                          onClick={() => openCheckWork(work)}
                        >
                          <Icon name="Edit" size={16} className="mr-2" />
                          {work.status === 'pending' ? 'Проверить работу' : 'Изменить оценку'}
                        </Button>
                        {work.workUrl && (
                          <Button
                            variant="outline"
                            className="border-purple-300 text-purple-700 hover:bg-purple-50"
                            onClick={() => window.open(work.workUrl, '_blank')}
                          >
                            <Icon name="ExternalLink" size={16} className="mr-2" />
                            Открыть работу
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            
            <Dialog open={isCheckWorkOpen} onOpenChange={setIsCheckWorkOpen}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Проверка работы</DialogTitle>
                </DialogHeader>
                {selectedWork && (
                  <div className="space-y-4 mt-4">
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Задание:</p>
                      <p className="font-semibold">{selectedWork.assignmentTitle}</p>
                      <p className="text-sm text-gray-600 mt-2 mb-1">Студент:</p>
                      <p className="font-semibold">{selectedWork.studentName}</p>
                    </div>
                    <div>
                      <Label htmlFor="work-score">Оценка (0-100) *</Label>
                      <Input
                        id="work-score"
                        type="number"
                        min="0"
                        max="100"
                        value={workScore}
                        onChange={(e) => setWorkScore(e.target.value)}
                        placeholder="85"
                      />
                    </div>
                    <div>
                      <Label htmlFor="work-comment">Комментарий к работе</Label>
                      <Textarea
                        id="work-comment"
                        value={workComment}
                        onChange={(e) => setWorkComment(e.target.value)}
                        placeholder="Отличная работа! Обратите внимание на..."
                        rows={4}
                      />
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Button variant="outline" onClick={() => setIsCheckWorkOpen(false)}>
                        Отмена
                      </Button>
                      <Button 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                        onClick={handleCheckWork}
                      >
                        Сохранить оценку
                      </Button>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Уведомления
              </h2>
              {unreadCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  className="border-purple-300 text-purple-700 hover:bg-purple-50"
                  onClick={() => setNotifications(notifications.map(n => ({ ...n, read: true })))}
                >
                  Отметить все как прочитанные
                </Button>
              )}
            </div>
            <div className="space-y-3">
              {notifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={`p-4 transition-all duration-300 cursor-pointer ${
                    notification.read
                      ? 'bg-white border-gray-200'
                      : 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 hover:shadow-lg'
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      notification.type === 'webinar'
                        ? 'bg-gradient-to-br from-purple-500 to-pink-500'
                        : notification.type === 'deadline'
                        ? 'bg-gradient-to-br from-pink-500 to-orange-500'
                        : 'bg-gradient-to-br from-green-500 to-emerald-500'
                    }`}>
                      <Icon name={getNotificationIcon(notification.type)} size={20} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-bold">{notification.title}</h3>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full animate-pulse"></div>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Icon name="Clock" size={12} />
                        <span>{notification.time}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="bg-white/80 backdrop-blur-md border-t border-purple-100 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <h3 className="font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Поддержка
              </h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Icon name="Mail" size={14} />
                  <span>support@eduplatform.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="Phone" size={14} />
                  <span>8 (800) 555-35-35</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="MessageCircle" size={14} />
                  <span>Онлайн чат 24/7</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Быстрые ссылки
              </h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="hover:text-purple-600 cursor-pointer transition-colors">О платформе</div>
                <div className="hover:text-purple-600 cursor-pointer transition-colors">FAQ</div>
                <div className="hover:text-purple-600 cursor-pointer transition-colors">Условия использования</div>
                <div className="hover:text-purple-600 cursor-pointer transition-colors">Политика конфиденциальности</div>
              </div>
            </div>
            <div>
              <h3 className="font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Мы в соцсетях
              </h3>
              <div className="flex gap-3">
                <Button
                  size="icon"
                  variant="outline"
                  className="border-purple-300 hover:bg-purple-50"
                  onClick={() => showToast('Социальные сети', 'Открываю VK...')}
                >
                  <Icon name="Share2" size={18} />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  className="border-purple-300 hover:bg-purple-50"
                  onClick={() => showToast('Социальные сети', 'Открываю Telegram...')}
                >
                  <Icon name="Send" size={18} />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  className="border-purple-300 hover:bg-purple-50"
                  onClick={() => showToast('Социальные сети', 'Открываю YouTube...')}
                >
                  <Icon name="Youtube" size={18} />
                </Button>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-purple-100 text-center text-sm text-gray-600">
            © 2024 EduPlatform. Все права защищены.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;