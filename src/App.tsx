import React, { useState, useEffect } from 'react';
import { BookOpen, CheckCircle, AlertCircle, Trophy, Home, ArrowRight, ArrowLeft, SkipForward, Volume2, Send, Moon, Sun, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { periodDatabases, Question, Subject } from './data/questions';
import ReactMarkdown from 'react-markdown';
import { AdminDashboard } from './components/AdminDashboard';
import { StudentDashboard } from './components/StudentDashboard';

import { LoginScreen } from './components/LoginScreen';
import { saveResult, getMe, getQuestionsData, UserProfile } from './lib/api';

/**
 * Utility to shuffle an array and return a subset
 */
function getRandomQuestions(questions: Question[], count: number): Question[] {
  // Deduplicate before selecting questions
  const uniqueQuestions: Question[] = [];
  const seenTexts = new Set<string>();
  
  for (const q of questions) {
    const text = q.question.trim().toLowerCase();
    if (!seenTexts.has(text)) {
      seenTexts.add(text);
      uniqueQuestions.push(q);
    }
  }

  const shuffled = [...uniqueQuestions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(uniqueQuestions.length, count));
}

export default function App() {
  const [selectedPeriod, setSelectedPeriod] = useState<'p1' | 'p2' | 'p3' | 'p4' | 'p5' | 'p6' | 'p7' | 'p8' | 'p9'>('p2');
  const [dbData, setDbData] = useState<Record<string, Subject> | null>(null);
  const questionDatabase: Record<string, Subject> = dbData || periodDatabases[selectedPeriod];

  const [screen, setScreen] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('currentUser');
      return stored ? 'home' : 'login';
    }
    return 'login';
  });
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<'Fácil' | 'Moderado' | 'Difícil' | 'Todos'>('Todos');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') as 'light' | 'dark' || 'light';
    }
    return 'light';
  });
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [activeSession, setActiveSession] = useState<{
    title: string;
    questions: (Question & { subjectTitle?: string })[];
  } | null>(null);
  const [activeModule, setActiveModule] = useState<{
    subjectTitle: string;
    moduleTitle: string;
    studyContent?: string;
    videoUrl?: string;
  } | null>(null);
  
  // Track user choices: null means not answered yet
  const [userAnswers, setUserAnswers] = useState<(string | null)[]>([]);
  const [dictationInput, setDictationInput] = useState('');
  const [showUnansweredWarning, setShowUnansweredWarning] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const user = await getMe();
          if (user) {
            setCurrentUser(user);
            setScreen('home');
          } else {
            setScreen('login');
          }
        } catch (e) {
          console.error("Auth check failed", e);
          setScreen('login');
        }
      } else {
        setScreen('login');
      }
      setIsAuthReady(true);
    };

    const loadQuestions = async () => {
      try {
        const data = await getQuestionsData();
        if (data && Object.keys(data).length > 0) {
          setDbData(data);
        }
      } catch (error) {
        console.error("Erro ao carregar questões do banco:", error);
      } finally {
        setIsLoadingData(false);
      }
    };

    checkAuth();
    loadQuestions();
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const startModule = (subjectKey: string, moduleKey: string, difficulty?: 'Fácil' | 'Moderado' | 'Difícil' | 'Todos') => {
    if (!currentUser) {
      setScreen('login');
      return;
    }

    const subject = questionDatabase[subjectKey];
    const module = subject.modules[moduleKey];
    
    // Filter questions by difficulty if specified
    const filteredQuestions = (difficulty && difficulty !== 'Todos' 
      ? module.questions.filter(q => q.difficulty === difficulty)
      : module.questions).map(q => ({ ...q, subjectTitle: subject.title }));

    if (filteredQuestions.length === 0) {
      alert("Não há questões para este nível de dificuldade neste momento. Tente outro level!");
      return;
    }

    const sessionQuestions = getRandomQuestions(filteredQuestions, 20);
    
    setActiveSession({
      title: `${subject.title}: ${module.title}`,
      questions: sessionQuestions
    });
    
    setUserAnswers(new Array(sessionQuestions.length).fill(null));
    setCurrentQuestion(0);
    setDictationInput('');

    if (module.studyContent) {
      setActiveModule({
        subjectTitle: subject.title,
        moduleTitle: module.title,
        studyContent: module.studyContent,
        videoUrl: module.videoUrl
      });
      setScreen('study');
    } else {
      setScreen('quiz');
    }
  };

  const startSubjectQuiz = (subjectKey: string, modulesToInclude: string[]) => {
    if (!currentUser) {
      setScreen('login');
      return;
    }

    const subject = questionDatabase[subjectKey];
    const allQuestions = modulesToInclude.flatMap(modKey => 
      subject.modules[modKey].questions.map(q => ({ ...q, subjectTitle: subject.title }))
    );
    
    if (allQuestions.length === 0) return;

    const sessionQuestions = getRandomQuestions(allQuestions, 20);
    
    setActiveSession({
      title: `Simulado: ${subject.title}`,
      questions: sessionQuestions
    });
    
    setUserAnswers(new Array(sessionQuestions.length).fill(null));
    setScreen('quiz');
    setCurrentQuestion(0);
    setDictationInput('');
  };

  const startGeneralQuiz = (modulesMap: Record<string, string[]>) => {
    if (!currentUser) {
      setScreen('login');
      return;
    }

    const allQuestions = Object.entries(modulesMap).flatMap(([sKey, modKeys]) => 
      modKeys.flatMap(mKey => questionDatabase[sKey].modules[mKey].questions.map(q => ({ ...q, subjectTitle: questionDatabase[sKey].title })))
    );

    if (allQuestions.length === 0) return;

    const sessionQuestions = getRandomQuestions(allQuestions, 20);
    
    setActiveSession({
      title: "Simulado Geral Customizado",
      questions: sessionQuestions
    });
    
    setUserAnswers(new Array(sessionQuestions.length).fill(null));
    setScreen('quiz');
    setCurrentQuestion(0);
    setDictationInput('');
  };

  const goToConfig = (subjectKey: string | 'all') => {
    if (!currentUser) {
      setScreen('login');
      return;
    }

    if (subjectKey === 'all') {
      setSelectedSubject('all');
      // Por padrão, seleciona tudo exceto ditado
      const allMods: string[] = [];
      Object.entries(questionDatabase).forEach(([sKey, subject]) => {
        Object.keys(subject.modules).forEach(mKey => {
          if (mKey !== 'ditado') allMods.push(`${sKey}:${mKey}`);
        });
      });
      setSelectedModules(allMods);
    } else {
      setSelectedSubject(subjectKey);
      const subject = questionDatabase[subjectKey];
      // Seleciona todos os módulos do assunto, exceto ditado
      const subjectMods = Object.keys(subject.modules).filter(m => m !== 'ditado');
      setSelectedModules(subjectMods);
    }
    setScreen('config');
  };

  const handleAnswer = (option: string) => {
    if (!activeSession) return;
    
    const newAnswers = [...userAnswers];
    // Case insensitive check for dictation
    const isDictation = activeSession.questions[currentQuestion].type === 'dictation';
    if (isDictation) {
      newAnswers[currentQuestion] = option.trim();
    } else {
      newAnswers[currentQuestion] = option;
    }
    setUserAnswers(newAnswers);
  };

  const nextQuestion = async () => {
    if (!activeSession) return;
    if (currentQuestion + 1 < activeSession.questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const unanswered = userAnswers.filter(a => a === null).length;
      if (unanswered > 0) {
        setShowUnansweredWarning(true);
        setTimeout(() => setShowUnansweredWarning(false), 4000);
      } else {
        // Save result
        const finalScore = userAnswers.reduce((acc, ans, idx) => {
          const correct = activeSession.questions[idx].correct;
          if (activeSession.questions[idx].type === 'dictation') {
             return ans?.toLowerCase() === correct.toLowerCase() ? acc + 1 : acc;
          }
          return ans === correct ? acc + 1 : acc;
        }, 0);

        if (currentUser) {
            const answersMap = userAnswers.map((ans, idx) => {
                const q = activeSession.questions[idx];
                const isCorrect = q.type === 'dictation' ? ans?.toLowerCase() === q.correct.toLowerCase() : ans === q.correct;
                return {
                    questionId: q.id,
                    questionText: q.question,
                    userAnswer: ans,
                    correctAnswer: q.correct,
                    isCorrect,
                    subjectTitle: q.subjectTitle
                };
            });
            
            try {
                await saveResult({
                    uid: currentUser.uid,
                    username: currentUser.username,
                    date: new Date().toISOString(),
                    sessionTitle: activeSession.title,
                    score: finalScore,
                    total: activeSession.questions.length,
                    answersMap
                });
            } catch (error) {
                console.error("Error saving result to Firestore:", error);
                // Fallback or alert user
            }
        }

        setScreen('result');
      }
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    if (activeSession && activeSession.questions[currentQuestion]?.type === 'dictation') {
      setDictationInput(userAnswers[currentQuestion] || '');
      if (userAnswers[currentQuestion] === null) {
        speak(activeSession.questions[currentQuestion].correct);
      }
    } else {
      setDictationInput('');
    }
  }, [currentQuestion, activeSession]);

  const score = activeSession ? userAnswers.reduce((acc, ans, idx) => {
    const correct = activeSession.questions[idx].correct;
    if (activeSession.questions[idx].type === 'dictation') {
      return ans?.toLowerCase() === correct.toLowerCase() ? acc + 1 : acc;
    }
    return ans === correct ? acc + 1 : acc;
  }, 0) : 0;

  const unansweredCount = userAnswers.filter(ans => ans === null).length;

  const subjectStats = React.useMemo(() => {
    if (!activeSession) return [];
    const stats: Record<string, { total: number; correct: number }> = {};
    activeSession.questions.forEach((q, idx) => {
        const subject = q.subjectTitle || activeSession.title;
        if (!stats[subject]) stats[subject] = { total: 0, correct: 0 };
        stats[subject].total += 1;
        const ans = userAnswers[idx];
        const isCorrect = q.type === 'dictation' ? ans?.toLowerCase() === q.correct.toLowerCase() : ans === q.correct;
        if (isCorrect) stats[subject].correct += 1;
    });
    return Object.entries(stats).map(([subject, data]) => ({ subject, total: data.total, correct: data.correct }));
  }, [activeSession, userAnswers]);

  const [showOnlyErrors, setShowOnlyErrors] = useState(false);

  return (
    <div className={`min-h-screen transition-colors duration-500 overflow-hidden font-sans selection:bg-blue-200 ${theme === 'dark' ? 'bg-[#0A0A0A] text-zinc-100' : 'bg-[#FDFDFD] text-zinc-900'}`}>
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className={`absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full opacity-20 blur-[120px] transition-colors duration-1000 ${theme === 'dark' ? 'bg-blue-900' : 'bg-blue-100'}`} />
        <div className={`absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full opacity-20 blur-[100px] transition-colors duration-1000 ${theme === 'dark' ? 'bg-indigo-900' : 'bg-indigo-100'}`} />
      </div>

      <motion.div 
        className="relative z-10 max-w-5xl mx-auto min-h-screen flex flex-col px-4 sm:px-6 lg:px-8 py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Header */}
        {screen !== 'login' && (
        <header className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${theme === 'dark' ? 'bg-zinc-800' : 'bg-white shadow-sm border border-zinc-100'}`}>
              <BookOpen size={24} className="text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-display font-black tracking-tight uppercase">
                Prova <span className="text-blue-600 inline-block ml-1">{selectedPeriod.toUpperCase()}</span>
              </h1>
              <p className="text-[10px] font-bold text-zinc-400 tracking-[0.25em] uppercase leading-none mt-1">Plano de Estudos</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
               onClick={() => {
                 if (currentUser) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('currentUser');
                    setCurrentUser(null);
                    setScreen('login');
                 } else {
                    setScreen('login');
                 }
               }}
               className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all border ${theme === 'dark' ? 'bg-zinc-800 border-zinc-700 text-zinc-300' : 'bg-white border-zinc-200 text-zinc-600 shadow-sm'}`}
             >
                {currentUser?.role === 'masteradmin' ? 'Sair (Admin)' : (currentUser ? 'Sair: ' + currentUser.fullName.split(' ')[0] : 'Entrar')}
            </button>
            {(currentUser?.role === 'masteradmin' || currentUser?.role === 'teacher') && (
              <button 
                onClick={() => setScreen('admin')}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all bg-blue-600 text-white shadow-lg shadow-blue-600/20`}
              >
                Painel Admin
              </button>
            )}
            {currentUser && currentUser.role !== 'masteradmin' && currentUser.role !== 'teacher' && (
              <button 
                onClick={() => setScreen('student')}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all bg-blue-600 text-white shadow-lg shadow-blue-600/20`}
              >
                Meu Desempenho
              </button>
            )}
            <button 
              onClick={toggleTheme}
              className={`p-3 rounded-full transition-all border ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800 text-yellow-400' : 'bg-white border-zinc-100 text-zinc-400 shadow-sm'}`}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </header>
        )}

        {/* Content Area - Scrollable */}
        <div className="flex-grow flex flex-col">
          <AnimatePresence mode="wait">
            {screen === 'login' && (
              <LoginScreen 
                theme={theme}
                onBack={currentUser ? () => setScreen('home') : undefined}
                onLogin={(user) => {
                  setCurrentUser(user);
                  localStorage.setItem('currentUser', JSON.stringify(user));
                  setScreen(user.role === 'masteradmin' || user.role === 'teacher' ? 'admin' : 'student');
                }}
              />
            )}

            {screen === 'admin' && (currentUser?.role === 'teacher' || currentUser?.role === 'masteradmin') && (
              <AdminDashboard 
                theme={theme} 
                onBack={() => setScreen('home')}
                currentUser={currentUser}
              />
            )}

            {screen === 'student' && currentUser && currentUser.role !== 'masteradmin' && currentUser.role !== 'teacher' && (
              <StudentDashboard
                theme={theme}
                userEmail={currentUser.uid} 
                onBack={() => setScreen('home')}
              />
            )}
            
            {screen === 'home' && (
              <motion.div 
                key="home"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-12 max-w-4xl mx-auto w-full"
              >
                {!selectedSubject ? (
                  <div className="space-y-12">
                    {/* Period Selector */}
                    <div className="flex flex-col items-center gap-6">
                      <div className={`p-1 flex flex-wrap justify-center rounded-2xl border ${theme === 'dark' ? 'bg-zinc-900/50 border-zinc-800' : 'bg-zinc-50 border-zinc-100'}`}>
                        {(['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p9'] as const).map((p) => (
                          <button
                            key={p}
                            onClick={() => setSelectedPeriod(p)}
                            className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                              selectedPeriod === p 
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                                : 'text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                            }`}
                          >
                            {p.toUpperCase()}
                          </button>
                        ))}
                      </div>

                      <div className="text-center space-y-1">
                        <h2 className="text-3xl font-display font-black tracking-tight">Qual a missão de hoje?</h2>
                        <p className="text-zinc-500 font-medium text-sm">Selecione uma matéria ou o grande desafio.</p>
                      </div>
                    </div>

                    {Object.keys(questionDatabase).length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {Object.entries(questionDatabase).map(([key, subject]) => (
                          <button 
                            key={key}
                            onClick={() => setSelectedSubject(key)}
                            className={`group relative overflow-hidden p-6 rounded-[32px] transition-all border-2 active:scale-[0.98] text-left hover:shadow-2xl ${
                              theme === 'dark' 
                              ? 'bg-zinc-900 border-zinc-800 hover:border-zinc-700' 
                              : 'bg-white border-zinc-100 hover:border-blue-50 shadow-sm'
                            }`}
                          >
                            <div className="flex items-center gap-5 relative z-10">
                              <div className={`text-4xl p-4 rounded-2xl transition-transform group-hover:scale-110 ${theme === 'dark' ? 'bg-zinc-800' : 'bg-zinc-50'}`}>
                                {subject.icon}
                              </div>
                              <div>
                                <span className={`block font-black uppercase tracking-[0.15em] text-[10px] mb-1.5 ${
                                  key === 'portugues' ? 'text-orange-500' :
                                  key === 'matematica' ? 'text-blue-500' :
                                  key === 'historia' ? 'text-red-500' : 'text-green-500'
                                }`}>{subject.title}</span>
                                <h3 className="text-xl font-display font-bold">{Object.keys(subject.modules).length} Módulos</h3>
                              </div>
                              <div className={`ml-auto p-2 rounded-xl transition-all ${theme === 'dark' ? 'bg-zinc-800 group-hover:bg-zinc-700' : 'bg-zinc-50 group-hover:bg-blue-50'}`}>
                                <ArrowRight size={18} className="text-zinc-400 group-hover:text-blue-600 transition-colors" />
                              </div>
                            </div>
                          </button>
                        ))}

                        <button 
                          onClick={() => goToConfig('all')}
                          className={`md:col-span-2 group overflow-hidden p-6 rounded-[32px] transition-all border-2 active:scale-[0.98] text-left relative ${
                            theme === 'dark' 
                            ? 'bg-zinc-900 border-zinc-800 hover:border-blue-900/30' 
                            : 'bg-white border-blue-50 hover:border-blue-200 shadow-xl shadow-blue-600/5'
                          }`}
                        >
                          <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl ${theme === 'dark' ? 'bg-blue-600/10' : 'bg-blue-600/5'}`} />
                          <div className="flex items-center gap-5 relative z-10">
                            <div className="p-4 rounded-2xl bg-blue-600/10 text-blue-600 group-hover:scale-110 transition-transform">
                              <Trophy size={32} />
                            </div>
                            <div>
                              <span className="block font-black uppercase tracking-[0.15em] text-[10px] mb-1.5 text-blue-600">Conteúdo Completo</span>
                              <h3 className="text-xl font-display font-bold">Simulado Misto {selectedPeriod.toUpperCase()}</h3>
                              <p className="text-xs text-zinc-400 font-medium">Mistura randômica de todas as matérias</p>
                            </div>
                            <div className="ml-auto flex items-center gap-3">
                              <span className="hidden sm:inline-block text-[10px] font-black tracking-widest text-zinc-400 uppercase">Iniciar</span>
                              <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/30">
                                <ArrowRight size={18} />
                              </div>
                            </div>
                          </div>
                        </button>
                      </div>
                    ) : (
                      <div className={`p-16 rounded-[48px] border-2 border-dashed flex flex-col items-center justify-center space-y-8 text-center ${
                        theme === 'dark' ? 'border-zinc-800 bg-zinc-900/30' : 'border-zinc-100 bg-zinc-50/50'
                      }`}>
                        <div className="relative">
                          <div className="absolute inset-0 bg-blue-500/10 blur-2xl rounded-full" />
                          <BookOpen size={64} className="text-zinc-300 relative z-10 font-bold" />
                          <AlertCircle size={24} className="absolute -top-2 -right-2 text-amber-500" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-display font-black mb-3 text-zinc-400">Conteúdo Reservado</h3>
                          <p className="text-zinc-500 font-medium max-w-sm mx-auto">Os módulos deste período serão liberados em breve. Continue focado nos seus estudos!</p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-12">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={() => setSelectedSubject(null)}
                          className={`p-3 rounded-xl transition-all active:scale-95 border ${theme === 'dark' ? 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700' : 'bg-white border-zinc-100 text-zinc-400 hover:bg-zinc-50 shadow-sm'}`}
                        >
                          <ArrowLeft size={20} />
                        </button>
                        <div>
                          <h2 className="text-3xl font-display font-black tracking-tight">{questionDatabase[selectedSubject].title}</h2>
                          <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">{selectedPeriod.toUpperCase()} • {Object.keys(questionDatabase[selectedSubject].modules).length} Módulos</p>
                        </div>
                      </div>

                      <button 
                        onClick={() => goToConfig(selectedSubject)}
                        className={`px-6 py-4 rounded-2xl font-black flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl ${
                          selectedSubject === 'portugues' ? 'bg-orange-500 text-white shadow-orange-500/20' :
                          selectedSubject === 'matematica' ? 'bg-blue-600 text-white shadow-blue-600/20' :
                          selectedSubject === 'historia' ? 'bg-red-600 text-white shadow-red-600/20' :
                          'bg-green-600 text-white shadow-green-600/20'
                        }`}
                      >
                        <Trophy size={20} /> Simulado Completo
                      </button>
                    </div>

                    <div className="space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Praticar por Módulo</h3>
                        
                        <div className={`p-1 flex rounded-xl border ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-50 border-zinc-100'}`}>
                          {(['Todos', 'Fácil', 'Moderado', 'Difícil'] as const).map((d) => (
                            <button
                              key={d}
                              onClick={() => setSelectedDifficulty(d)}
                              className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                                selectedDifficulty === d 
                                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
                              }`}
                            >
                              {d}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {Object.entries(questionDatabase[selectedSubject].modules).map(([modKey, module]) => {
                          const availableQuestions = selectedDifficulty === 'Todos' 
                            ? module.questions 
                            : module.questions.filter(q => q.difficulty === selectedDifficulty);
                          
                          const hasQuestions = availableQuestions.length > 0;

                          return (
                            <button 
                              key={modKey}
                              onClick={() => startModule(selectedSubject, modKey, selectedDifficulty)}
                              disabled={!hasQuestions}
                              className={`group p-6 rounded-[32px] text-left transition-all border-2 active:scale-[0.98] hover:shadow-xl relative ${
                                !hasQuestions ? 'opacity-40 grayscale cursor-not-allowed' : ''
                              } ${
                                theme === 'dark' 
                                  ? 'bg-zinc-900 border-zinc-800 hover:border-zinc-700' 
                                  : 'bg-white border-zinc-50 hover:border-blue-50 shadow-sm'
                              }`}
                            >
                              <div className="flex justify-between items-start mb-6">
                                <div className={`p-3 rounded-2xl ${theme === 'dark' ? 'bg-zinc-800 text-zinc-400' : 'bg-zinc-50 text-blue-600'}`}>
                                  <BookOpen size={20} />
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border ${
                                    theme === 'dark' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-blue-50 text-blue-600 border-blue-100'
                                  }`}>
                                    {availableQuestions.length} Questões
                                  </span>
                                  {hasQuestions && <ArrowRight size={18} className="text-zinc-300 group-hover:text-blue-600 transition-colors" />}
                                </div>
                              </div>
                              <h4 className="text-xl font-display font-black mb-2">{module.title}</h4>
                              <p className="text-sm font-medium text-zinc-500 leading-relaxed">
                                {hasQuestions ? module.description : `Não há questões "${selectedDifficulty}" disponíveis para este módulo no momento.`}
                              </p>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                <div className={`pt-6 mt-8 border-t flex justify-center gap-12 transition-colors ${theme === 'dark' ? 'border-zinc-800' : 'border-gray-100'}`}>
                  <div className="text-center">
                    <p className={`text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-zinc-500' : 'text-gray-400'}`}>Banco Total</p>
                    <p className={`font-black text-2xl ${theme === 'dark' ? 'text-zinc-300' : 'text-blue-600'}`}>
                      {Object.values(questionDatabase).reduce((acc, s) => acc + Object.values(s.modules).reduce((mAcc, m) => mAcc + m.questions.length, 0), 0)}
                    </p>
                  </div>
                  <div className={`text-center border-l pl-12 transition-colors ${theme === 'dark' ? 'border-zinc-800' : 'border-gray-200'}`}>
                    <p className={`text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-zinc-500' : 'text-gray-400'}`}>Estudantes Ativos</p>
                    <p className="text-green-600 font-black text-2xl">1.2k</p>
                  </div>
                </div>
              </motion.div>
            )}

            {screen === 'study' && activeModule && (
              <motion.div
                key="study"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8 max-w-4xl mx-auto w-full"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => {
                        setScreen('home');
                        setActiveModule(null);
                      }}
                      className={`p-3 rounded-xl transition-all border ${theme === 'dark' ? 'bg-zinc-800 border-zinc-700 text-zinc-300' : 'bg-white border-zinc-100 text-zinc-400Shadow-sm'}`}
                    >
                      <ArrowLeft size={20} />
                    </button>
                    <div>
                      <h2 className="text-3xl font-display font-black tracking-tight">{activeModule.moduleTitle}</h2>
                      <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">{activeModule.subjectTitle} • Material de Apoio</p>
                    </div>
                  </div>
                </div>

                <div className={`rounded-[40px] p-8 md:p-12 border-2 transition-all ${theme === 'dark' ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-zinc-50 shadow-2xl shadow-blue-600/5'}`}>
                  <div className="max-w-none prose prose-zinc dark:prose-invert">
                    <div className="flex items-center gap-4 mb-10">
                      <div className="p-4 bg-blue-600/10 rounded-2xl text-blue-600">
                        <BookOpen size={32} />
                      </div>
                      <h3 className="text-2xl font-display font-black m-0">Explicação Didática</h3>
                    </div>
                    
                    <div className={`text-lg md:text-xl space-y-6 leading-relaxed ${theme === 'dark' ? 'text-zinc-300' : 'text-zinc-600'}`}>
                      <ReactMarkdown>
                        {activeModule.studyContent || ''}
                      </ReactMarkdown>
                    </div>

                    {activeModule.videoUrl && (
                      <div className="mt-12 space-y-6">
                        <div className="flex items-center gap-3 text-red-600">
                          <Volume2 size={24} />
                          <h4 className="text-lg font-black uppercase tracking-wider">Aula em Vídeo</h4>
                        </div>
                        <div className="aspect-video w-full overflow-hidden rounded-[32px] border-4 border-zinc-100 dark:border-zinc-800 shadow-2xl">
                          <iframe
                            className="w-full h-full"
                            src={activeModule.videoUrl}
                            title="Explicação em Vídeo"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                          ></iframe>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-center pt-8">
                  <button 
                    onClick={() => setScreen('quiz')}
                    className="group px-12 py-5 rounded-[24px] bg-blue-600 text-white font-black text-xl flex items-center gap-4 shadow-xl shadow-blue-600/20 active:scale-95 transition-all"
                  >
                    Pronto para o Desafio!
                    <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            )}

            {screen === 'config' && selectedSubject && (
              <motion.div 
                key="config"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="space-y-8 max-w-4xl mx-auto"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => {
                        setScreen('home');
                        if (selectedSubject === 'all') setSelectedSubject(null);
                      }}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all active:scale-95 shadow-sm border ${theme === 'dark' ? 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:text-white' : 'bg-white border-blue-100 text-blue-500 hover:bg-blue-50'}`}
                    >
                      <ArrowLeft size={18} /> Voltar
                    </button>
                    <div>
                      <h2 className={`text-3xl font-black transition-colors ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                        {selectedSubject === 'all' ? 'Configurar Simulado Geral' : `Simulado: ${questionDatabase[selectedSubject].title}`}
                      </h2>
                      <p className={`text-sm font-bold transition-colors ${theme === 'dark' ? 'text-zinc-500' : 'text-gray-400'}`}>
                        Selecione os módulos que deseja incluir
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button 
                        onClick={() => {
                        if (selectedSubject === 'all') {
                            const modulesMap: Record<string, string[]> = {};
                            selectedModules.forEach(composedKey => {
                            const [sKey, mKey] = composedKey.split(':');
                            if (!modulesMap[sKey]) modulesMap[sKey] = [];
                            modulesMap[sKey].push(mKey);
                            });
                            startGeneralQuiz(modulesMap);
                        } else {
                            startSubjectQuiz(selectedSubject, selectedModules);
                        }
                        }}
                        disabled={selectedModules.length === 0}
                        className={`px-6 py-3 md:px-8 md:py-4 rounded-2xl font-black flex items-center justify-center gap-3 transition-all border-b-4 active:border-b-0 active:translate-y-1 shadow-lg disabled:opacity-30 disabled:pointer-events-none ${
                            selectedSubject === 'portugues' ? 'bg-orange-500 text-white border-orange-700 hover:bg-orange-600' :
                            selectedSubject === 'matematica' ? 'bg-blue-600 text-white border-blue-800 hover:bg-blue-700' :
                            selectedSubject === 'historia' ? 'bg-red-600 text-white border-red-800 hover:bg-red-700' :
                            selectedSubject === 'geografia' ? 'bg-green-600 text-white border-green-800 hover:bg-green-700' :
                            'bg-zinc-100 text-black border-zinc-300 hover:bg-white'
                        }`}
                    >
                        <Trophy size={20} /> Começar Simulado ({selectedModules.length})
                    </button>
                  </div>
                </div>

                <div className="space-y-8">
                  {selectedSubject === 'all' ? (
                    Object.entries(questionDatabase).map(([sKey, subject]) => {
                      const subjectModKeys = Object.keys(subject.modules).filter(m => m !== 'ditado');
                      const subjectComposedKeys = subjectModKeys.map(m => `${sKey}:${m}`);
                      const isAllSelected = subjectComposedKeys.every(k => selectedModules.includes(k));

                      return (
                        <div key={sKey} className="space-y-4">
                          <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-50 dark:bg-zinc-900/50">
                            <h3 className={`text-sm font-black uppercase tracking-[0.2em] transition-colors ${
                              sKey === 'portugues' ? 'text-orange-500' :
                              sKey === 'matematica' ? 'text-blue-500' :
                              sKey === 'historia' ? 'text-red-500' :
                              'text-green-500'
                            }`}>{subject.title}</h3>
                            
                            <button 
                              onClick={() => {
                                if (isAllSelected) {
                                  setSelectedModules(prev => prev.filter(k => !subjectComposedKeys.includes(k)));
                                } else {
                                  setSelectedModules(prev => {
                                    const others = prev.filter(k => !subjectComposedKeys.includes(k));
                                    return [...others, ...subjectComposedKeys];
                                  });
                                }
                              }}
                              className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-md transition-colors ${
                                isAllSelected 
                                  ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20' 
                                  : 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20'
                              }`}
                            >
                              {isAllSelected ? 'Limpar Matéria' : 'Selecionar Tudo'}
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {Object.entries(subject.modules).map(([mKey, module]) => {
                              const composedKey = `${sKey}:${mKey}`;
                              const isSelected = selectedModules.includes(composedKey);
                              return (
                                <button
                                  key={mKey}
                                  onClick={() => {
                                    setSelectedModules(prev => 
                                      isSelected ? prev.filter(k => k !== composedKey) : [...prev, composedKey]
                                    );
                                  }}
                                  className={`p-4 rounded-2xl border-2 text-left transition-all font-bold text-sm shadow-sm flex items-center justify-between ${
                                    isSelected 
                                      ? (theme === 'dark' ? 'bg-white border-white text-black' : 'bg-blue-600 border-blue-600 text-white shadow-blue-200')
                                      : (theme === 'dark' ? 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:border-zinc-500' : 'bg-white border-gray-100 hover:border-blue-300 text-gray-700 hover:bg-blue-50/50')
                                  }`}
                                >
                                  <div className="flex flex-col gap-1">
                                    <span>{module.title}</span>
                                    <span className={`text-[9px] font-black uppercase tracking-wider ${isSelected ? 'opacity-80' : 'text-zinc-400'}`}>
                                      {module.questions.length} Questões
                                    </span>
                                  </div>
                                  {isSelected && <CheckCircle size={16} />}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="space-y-6">
                      <div className="flex justify-end">
                        <button 
                          onClick={() => {
                            const subjectMods = Object.keys(questionDatabase[selectedSubject].modules).filter(m => m !== 'ditado');
                            const isAllSelected = subjectMods.every(m => selectedModules.includes(m));
                            if (isAllSelected) {
                              setSelectedModules([]);
                            } else {
                              setSelectedModules(subjectMods);
                            }
                          }}
                          className={`text-xs font-black uppercase tracking-widest px-4 py-2 rounded-xl border-2 transition-all ${
                            theme === 'dark' ? 'bg-zinc-900 border-zinc-800 text-zinc-400' : 'bg-white border-gray-200 text-gray-500'
                          }`}
                        >
                          {Object.keys(questionDatabase[selectedSubject].modules).filter(m => m !== 'ditado').every(m => selectedModules.includes(m)) ? 'Desmarcar Todos' : 'Selecionar Todos os Módulos'}
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Object.entries(questionDatabase[selectedSubject].modules).map(([mKey, module]) => {
                          const isSelected = selectedModules.includes(mKey);
                          return (
                            <button
                              key={mKey}
                              onClick={() => {
                                setSelectedModules(prev => 
                                  isSelected ? prev.filter(k => k !== mKey) : [...prev, mKey]
                                );
                              }}
                              className={`p-4 md:p-5 rounded-2xl border-2 text-left transition-all font-bold text-base shadow-sm flex items-center justify-between ${
                                isSelected 
                                  ? (theme === 'dark' ? 'bg-white border-white text-black' : 'bg-blue-600 border-blue-600 text-white shadow-blue-200')
                                  : (theme === 'dark' ? 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:border-zinc-500' : 'bg-white border-gray-100 hover:border-blue-300 text-gray-700 hover:bg-blue-50/50')
                              }`}
                            >
                              <div className="flex flex-col gap-1 w-full">
                                  <div className="flex justify-between items-start">
                                    <span className="block text-xl mb-1">{module.title}</span>
                                  </div>
                                  <span className={`text-[10px] font-black uppercase tracking-widest ${isSelected ? 'opacity-70' : 'opacity-40'}`}>
                                      {module.questions.length} Questões
                                  </span>
                              </div>
                              {isSelected && <CheckCircle size={24} className="ml-4 flex-shrink-0" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {screen === 'quiz' && activeSession && (
              <motion.div 
                key="quiz"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-10 max-w-2xl mx-auto w-full"
              >
                {/* Minimal Quiz Header */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <button 
                      onClick={() => {
                        setScreen('home');
                        setSelectedSubject(null);
                        setActiveSession(null);
                      }}
                      className="p-2.5 rounded-xl border border-zinc-100 dark:border-zinc-800 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 transition-all"
                    >
                      <X size={20} />
                    </button>
                    <div className="text-center">
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Questão</span>
                      <p className="text-sm font-black">{currentQuestion + 1} de {activeSession.questions.length}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full border-2 border-blue-600/20 flex items-center justify-center">
                      <span className="text-[10px] font-black text-blue-600">{Math.round(((currentQuestion + 1) / activeSession.questions.length) * 100)}%</span>
                    </div>
                  </div>
                  
                  <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-blue-600"
                      initial={{ width: 0 }}
                      animate={{ width: `${((currentQuestion + 1) / activeSession.questions.length) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Content Area */}
                <div className={`p-10 rounded-[48px] border ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-50 shadow-2xl shadow-blue-600/5'}`}>
                  <h2 className="text-2xl font-display font-black leading-tight mb-10 text-center">
                    {activeSession.questions[currentQuestion].question}
                  </h2>

                  <div className="space-y-3">
                    {activeSession.questions[currentQuestion].type === 'choice' ? (
                      <div className="flex flex-col gap-3">
                        {activeSession.questions[currentQuestion].options?.map((option, idx) => {
                          const isSelected = userAnswers[currentQuestion] === option;
                          return (
                            <button
                              key={idx}
                              onClick={() => handleAnswer(option)}
                              className={`w-full p-6 text-left rounded-[24px] border-2 transition-all font-bold text-lg flex items-center justify-between group ${
                                isSelected 
                                  ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-600/20'
                                  : `${theme === 'dark' ? 'bg-zinc-800 border-zinc-700 hover:border-zinc-600 text-zinc-300' : 'bg-zinc-50 border-zinc-50 hover:border-blue-100 text-zinc-700'}`
                              }`}
                            >
                              <span>{option}</span>
                              <div className={`w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center ${isSelected ? 'bg-white border-white' : 'border-zinc-300 group-hover:border-blue-300'}`}>
                                {isSelected && <Check size={14} className="text-blue-600" strokeWidth={4} />}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-8 py-4">
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => speak(activeSession.questions[currentQuestion].correct)}
                          className={`p-10 rounded-full transition-all shadow-xl ${theme === 'dark' ? 'bg-zinc-800 text-zinc-100' : 'bg-blue-50 text-blue-600 shadow-blue-600/5'}`}
                        >
                          <Volume2 size={48} />
                        </motion.button>
                        
                        <div className="w-full relative max-w-sm">
                          <input
                            type="text"
                            value={dictationInput}
                            onChange={(e) => setDictationInput(e.target.value)}
                            placeholder="Escreva o que ouviu..."
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && dictationInput.trim() !== '') {
                                handleAnswer(dictationInput);
                                nextQuestion();
                              }
                            }}
                            className={`w-full p-5 rounded-2xl border-2 outline-none transition-all font-black text-center text-xl ${theme === 'dark' ? 'bg-zinc-800 border-zinc-700 text-white focus:border-blue-600' : 'bg-zinc-50 border-zinc-50 focus:border-blue-600 focus:bg-white'}`}
                          />
                          <p className="mt-4 text-center text-[10px] uppercase font-black tracking-widest text-zinc-400">Pressione Enter para confirmar</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {showUnansweredWarning && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl bg-red-100 text-red-700 border-2 border-red-200 font-bold flex items-center gap-3"
                  >
                    <AlertCircle size={24} className="text-red-600" />
                    Existem questões em branco! Você precisa responder todas para finalizar a missão.
                  </motion.div>
                )}

                {/* Nav Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={prevQuestion}
                    disabled={currentQuestion === 0}
                    className={`flex-1 p-5 flex items-center justify-center gap-2 rounded-2xl font-black transition-all border ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800 text-zinc-500' : 'bg-white border-zinc-100 text-zinc-400'}`}
                  >
                    <ArrowLeft size={18} /> Anterior
                  </button>
                  <button
                    onClick={nextQuestion}
                    className={`flex-[2] p-5 flex items-center justify-center gap-2 rounded-2xl font-black transition-all shadow-xl active:scale-95 ${
                      currentQuestion + 1 === activeSession.questions.length
                        ? 'bg-green-600 text-white'
                        : userAnswers[currentQuestion] === null 
                          ? 'bg-amber-500 text-white' 
                          : 'bg-blue-600 text-white shadow-blue-600/20'
                    }`}
                  >
                    {currentQuestion + 1 === activeSession.questions.length 
                      ? 'Finalizar Missão' 
                      : userAnswers[currentQuestion] === null ? 'Pular Questão' : 'Próxima Questão'}
                    <ArrowRight size={18} />
                  </button>
                </div>
              </motion.div>
            )}

            {screen === 'result' && activeSession && (
              <motion.div 
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-4xl mx-auto w-full space-y-10"
              >
                <div className={`p-12 md:p-16 rounded-[64px] border-2 text-center space-y-10 relative overflow-hidden transition-all ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-50 shadow-2xl shadow-blue-600/5'}`}>
                  <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-blue-400 via-blue-600 to-indigo-800" />
                  
                  <div className="space-y-4">
                    <div className="inline-block p-6 rounded-[32px] bg-blue-600/10 text-blue-600 relative">
                       <Trophy size={80} />
                       <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-2 -right-2 bg-green-500 text-white p-2 rounded-full shadow-lg"
                       >
                         <Check size={20} strokeWidth={4} />
                       </motion.div>
                    </div>
                    <div>
                      <h2 className="text-4xl font-display font-black tracking-tight">Missão Cumprida!</h2>
                      <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs mt-2">{activeSession.title}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      { icon: <CheckCircle size={24} />, label: 'Acertos', value: score, color: 'text-green-500', bg: 'bg-green-500/10' },
                      { icon: <AlertCircle size={24} />, label: 'Erros', value: activeSession.questions.length - score - unansweredCount, color: 'text-red-500', bg: 'bg-red-500/10' },
                      { icon: <SkipForward size={24} />, label: 'Puladas', value: unansweredCount, color: 'text-amber-500', bg: 'bg-amber-500/10' }
                    ].map((stat, i) => (
                      <div key={i} className={`p-8 rounded-[32px] flex flex-col items-center justify-center gap-3 ${theme === 'dark' ? 'bg-zinc-800' : 'bg-zinc-50'}`}>
                        <div className={`${stat.color} ${stat.bg} p-3 rounded-2xl`}>{stat.icon}</div>
                        <span className="text-4xl font-display font-black leading-none">{stat.value}</span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{stat.label}</span>
                      </div>
                    ))}
                  </div>

                  {subjectStats.length > 0 && (
                    <div className="space-y-4 pt-6">
                      <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Resumo por Matéria</h3>
                      <div className="flex flex-col gap-3">
                        {subjectStats.map((stat, i) => {
                           const percent = stat.total === 0 ? 0 : Math.round((stat.correct / stat.total) * 100);
                           return (
                             <div key={i} className={`p-4 rounded-2xl flex items-center justify-between ${theme === 'dark' ? 'bg-zinc-800' : 'bg-zinc-50'}`}>
                               <div>
                                 <p className="font-bold">{stat.subject}</p>
                                 <p className="text-xs text-zinc-500">{stat.correct} de {stat.total} acertos</p>
                               </div>
                               <div className="flex items-center gap-3">
                                 <div className="w-24 h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                                   <div className={`h-full ${percent >= 70 ? 'bg-green-500' : percent >= 40 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${percent}%` }}></div>
                                 </div>
                                 <span className="font-black text-sm">{percent}%</span>
                               </div>
                             </div>
                           );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="space-y-4 pt-6">
                    {activeSession.questions.filter((q, idx) => {
                      const ans = userAnswers[idx];
                      return q.type === 'dictation' ? ans?.toLowerCase() !== q.correct.toLowerCase() : ans !== q.correct;
                    }).length > 0 && (
                      <button 
                        onClick={() => {
                          const wrongQuestions = activeSession.questions.filter((q, idx) => {
                            const ans = userAnswers[idx];
                            return q.type === 'dictation' ? ans?.toLowerCase() !== q.correct.toLowerCase() : ans !== q.correct;
                          });
                          setActiveSession({
                            title: activeSession.title + " (Correção)",
                            questions: wrongQuestions
                          });
                          setUserAnswers(new Array(wrongQuestions.length).fill(null));
                          setScreen('quiz');
                          setCurrentQuestion(0);
                        }}
                        className="w-full py-6 rounded-[28px] bg-red-600 text-white font-black text-xl shadow-xl shadow-red-600/20 active:scale-95 transition-all"
                      >
                        Refazer Questões Erradas
                      </button>
                    )}
                    <button 
                      onClick={() => {
                        setScreen('home');
                        setSelectedSubject(null);
                        setActiveSession(null);
                      }}
                      className="w-full py-6 rounded-[28px] bg-blue-600 text-white font-black text-xl shadow-xl shadow-blue-600/20 active:scale-95 transition-all"
                    >
                      Voltar ao Início
                    </button>
                    <button 
                      onClick={() => setSelectedSubject(null)}
                      className={`w-full py-5 rounded-[28px] font-black text-[10px] uppercase tracking-[0.3em] transition-all ${theme === 'dark' ? 'text-zinc-500 hover:text-zinc-100' : 'text-zinc-400 hover:text-zinc-900'}`}
                    >
                      Trocar Matéria
                    </button>
                  </div>
                </div>

                {/* Question Review */}
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-4">
                    <h3 className="text-xl font-display font-black tracking-tight underline decoration-blue-600 decoration-4 underline-offset-8">Gabarito Detalhado</h3>
                    <button 
                      onClick={() => setShowOnlyErrors(!showOnlyErrors)}
                      className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors ${showOnlyErrors ? 'bg-red-500 text-white' : theme === 'dark' ? 'bg-zinc-800 text-zinc-400 hover:text-zinc-200' : 'bg-zinc-100 text-zinc-600 hover:text-zinc-900'}`}
                    >
                      {showOnlyErrors ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                      {showOnlyErrors ? 'Mostrar Todas' : 'Mostrar Apenas Erros'}
                    </button>
                  </div>
                  <div className="space-y-4">
                    {activeSession.questions.map((q, idx) => {
                      const ans = userAnswers[idx];
                      const isCorrect = q.type === 'dictation' ? ans?.toLowerCase() === q.correct.toLowerCase() : ans === q.correct;
                      if (showOnlyErrors && isCorrect) return null;
                      return (
                        <div key={idx} className={`p-8 rounded-[40px] border-2 transition-all ${isCorrect ? (theme === 'dark' ? 'bg-green-500/5 border-green-500/20' : 'bg-green-50/30 border-green-100') : (theme === 'dark' ? 'bg-red-500/5 border-red-500/20' : 'bg-red-50/30 border-red-100')}`}>
                          <div className="flex justify-between items-start mb-6">
                            <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg ${isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                              Questão {idx + 1}
                            </span>
                          </div>
                          <p className="text-xl font-black mb-6 leading-tight">{q.question}</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Sua Resposta</span>
                              <p className={`font-bold p-4 rounded-2xl ${isCorrect ? 'text-green-600 bg-green-500/5' : 'text-red-600 bg-red-500/5'}`}>{ans || '(Em branco)'}</p>
                            </div>
                            <div className="space-y-1">
                               <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Correta</span>
                               <p className="font-bold text-blue-600 p-4 rounded-2xl bg-blue-500/5">{q.correct}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {screen !== 'login' && (
        <footer className="mt-16 text-center pb-8 opacity-20 hover:opacity-100 transition-opacity">
           <p className="text-[10px] font-black uppercase tracking-[0.5em]">Eduque • Inove • Divirta-se</p>
        </footer>
        )}
      </motion.div>
    </div>
  );
}

