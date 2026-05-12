import React, { useEffect, useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, User, Target, BarChart2, CheckCircle, XCircle, Clock, LogOut, Camera, Edit2, Save, X, Eye, EyeOff, Trophy, List } from 'lucide-react';
import { Logo } from './Logo';
import { calculateAge } from './LoginScreen';
import { 
  getUserProfile, 
  getUserResults, 
  getAllResults, 
  getAllStudents, 
  saveUserProfile,
  UserProfile,
  ResultRecord 
} from '../lib/api';

export function StudentDashboard({ onBack, theme, userEmail: userUid }: { onBack: () => void, theme: string, userEmail: string }) {
  const [currentView, setCurrentView] = useState<'history' | 'ranking'>('history');
  const [myResults, setMyResults] = useState<ResultRecord[]>([]);
  const [allResults, setAllResults] = useState<ResultRecord[]>([]);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editFullName, setEditFullName] = useState('');
  const [editBirthDate, setEditBirthDate] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profile, results, globalResults, students] = await Promise.all([
          getUserProfile(userUid),
          getUserResults(userUid),
          getAllResults(),
          getAllStudents()
        ]);
        
        if (profile) {
          setUserProfile(profile);
          setEditFullName(profile.fullName);
          setEditBirthDate(profile.birthDate);
        }
        if (results) setMyResults(results);
        if (globalResults) setAllResults(globalResults);
        if (students) setAllUsers(students);
      } catch (error) {
        console.error("Error fetching student dashboard data:", error);
      }
    };
    
    fetchData();
  }, [userUid]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };

  const handleSaveProfile = async () => {
    if (!editFullName || !editBirthDate) {
      alert('Preencha os campos obrigatórios.');
      return;
    }

    if (userProfile) {
      const updatedProfile = { 
        ...userProfile, 
        fullName: editFullName, 
        birthDate: editBirthDate
      };
      
      try {
        await saveUserProfile(updatedProfile);
        setUserProfile(updatedProfile);
        setIsEditing(false);
      } catch (error: any) {
        console.error(error);
        alert(error.message || "Erro ao salvar perfil.");
      }
    }
  };

  const handlePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        if (userProfile) {
          const updatedProfile = { ...userProfile, profilePicture: base64String };
          try {
            await saveUserProfile(updatedProfile);
            setUserProfile(updatedProfile);
          } catch (error) {
            console.error(error);
            alert("Erro ao atualizar foto.");
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const totalSimulados = myResults.length;
  const totalQuestions = myResults.reduce((acc, curr) => acc + curr.total, 0);
  const totalScore = myResults.reduce((acc, curr) => acc + curr.score, 0);
  const averageObj = totalQuestions === 0 ? 0 : Math.round((totalScore / totalQuestions) * 100);

  const rankingData = useMemo(() => {
    const studentStats: Record<string, { totalScore: number, totalQuestions: number, totalSimulados: number }> = {};
    
    allResults.forEach(r => {
      if (!studentStats[r.uid]) {
        studentStats[r.uid] = { totalScore: 0, totalQuestions: 0, totalSimulados: 0 };
      }
      studentStats[r.uid].totalScore += r.score;
      studentStats[r.uid].totalQuestions += r.total;
      studentStats[r.uid].totalSimulados += 1;
    });

    const ranking = Object.entries(studentStats).map(([uid, stats]) => {
      const user = allUsers.find(u => u.uid === uid);
      const average = stats.totalQuestions === 0 ? 0 : Math.round((stats.totalScore / stats.totalQuestions) * 100);
      return {
        uid,
        name: user ? user.fullName : uid,
        average,
        totalSimulados: stats.totalSimulados
      };
    }).sort((a, b) => b.average - a.average);

    return ranking;
  }, [allResults, allUsers]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto w-full space-y-8 pb-12"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className={`p-3 rounded-xl transition-colors shrink-0 ${theme === 'dark' ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-100' : 'bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-900'}`}
          >
            <ArrowLeft size={20} />
          </button>
          
          {userProfile && (
            <div className="flex items-start md:items-center gap-4 flex-col md:flex-row">
              <div 
                className="relative group cursor-pointer w-16 h-16 rounded-full overflow-hidden border-2 border-zinc-200 dark:border-zinc-700 shrink-0"
                onClick={() => fileInputRef.current?.click()}
              >
                {userProfile.profilePicture ? (
                  <img src={userProfile.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className={`w-full h-full flex items-center justify-center ${theme === 'dark' ? 'bg-zinc-800' : 'bg-zinc-100'}`}>
                    <User size={32} className="text-zinc-500" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center transition-all">
                   <Camera size={20} className="text-white" />
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handlePictureChange} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>

              {isEditing ? (
                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    value={editFullName}
                    onChange={(e) => setEditFullName(e.target.value)}
                    placeholder="Nome Completo"
                    className={`px-3 py-1.5 text-lg font-bold rounded-lg border ${theme === 'dark' ? 'bg-zinc-800 border-zinc-700 focus:border-blue-500 text-white' : 'bg-white border-zinc-200 focus:border-blue-500 text-black'} outline-none`}
                  />
                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={editBirthDate}
                      onChange={(e) => setEditBirthDate(e.target.value)}
                      className={`px-3 py-1.5 text-sm rounded-lg border ${theme === 'dark' ? 'bg-zinc-800 border-zinc-700 focus:border-blue-500 text-white' : 'bg-white border-zinc-200 focus:border-blue-500 text-black'} outline-none`}
                    />
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={editPassword}
                        onChange={(e) => setEditPassword(e.target.value)}
                        placeholder="Nova Senha"
                        className={`px-3 pr-9 py-1.5 text-sm rounded-lg border ${theme === 'dark' ? 'bg-zinc-800 border-zinc-700 focus:border-blue-500 text-white' : 'bg-white border-zinc-200 focus:border-blue-500 text-black'} outline-none`}
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 pointer-events-auto"
                      >
                        {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col">
                  <Logo size="sm" variant="full" />
                  <p className="text-sm font-medium text-zinc-400 mt-1">{userProfile.fullName} • @{userProfile.username}</p>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2 mt-4 sm:mt-0">
          {isEditing ? (
            <>
              <button 
                onClick={() => {
                  setIsEditing(false);
                  if (userProfile) {
                    setEditFullName(userProfile.fullName);
                    setEditBirthDate(userProfile.birthDate);
                    setEditPassword(userProfile.password || '');
                  }
                }}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-xl transition-colors ${theme === 'dark' ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300' : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-600'}`}
              >
                 <X size={16} /> Cancelar
              </button>
              <button 
                onClick={handleSaveProfile}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-xl transition-colors bg-green-600 hover:bg-green-700 text-white`}
              >
                 <Save size={16} /> Salvar
              </button>
            </>
          ) : (
            <button 
                onClick={() => setIsEditing(true)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-xl transition-colors ${theme === 'dark' ? 'bg-blue-900/30 hover:bg-blue-900/50 text-blue-400' : 'bg-blue-50 hover:bg-blue-100 text-blue-600'}`}
            >
                <Edit2 size={16} /> Editar Perfil
            </button>
          )}

          <button 
              onClick={handleLogout}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-xl transition-colors ${theme === 'dark' ? 'bg-red-950/30 hover:bg-red-900/50 text-red-400' : 'bg-red-50 hover:bg-red-100 text-red-600'}`}
          >
              <LogOut size={16} /> Sair
          </button>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-100'}`}>
          <div className="flex items-center gap-3 text-zinc-400 mb-2">
            <Target size={18} />
            <p className="text-xs font-bold uppercase tracking-widest">Simulados Feitos</p>
          </div>
          <p className="text-3xl font-black">{totalSimulados}</p>
        </div>
        <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-100'}`}>
          <div className="flex items-center gap-3 text-zinc-400 mb-2">
            <CheckCircle size={18} />
            <p className="text-xs font-bold uppercase tracking-widest">Total de Acertos</p>
          </div>
          <p className="text-3xl font-black">{totalScore} <span className="text-sm font-medium text-zinc-500">/ {totalQuestions} questões</span></p>
        </div>
        <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-100'}`}>
          <div className="flex items-center gap-3 text-zinc-400 mb-2">
            <BarChart2 size={18} />
            <p className="text-xs font-bold uppercase tracking-widest">Taxa de Acerto</p>
          </div>
          <p className="text-3xl font-black">{averageObj}%</p>
        </div>
      </div>

      <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-2">
        <button
          onClick={() => setCurrentView('history')}
          className={`flex items-center gap-2 px-4 py-2 font-bold transition-all relative ${currentView === 'history' ? 'text-blue-500' : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'}`}
        >
          <List size={18} />
          Meu Histórico
          {currentView === 'history' && (
            <motion.div layoutId="activeTabIndicator" className="absolute bottom-[-9px] left-0 right-0 h-0.5 bg-blue-500" />
          )}
        </button>
        <button
          onClick={() => setCurrentView('ranking')}
          className={`flex items-center gap-2 px-4 py-2 font-bold transition-all relative ${currentView === 'ranking' ? 'text-blue-500' : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'}`}
        >
          <Trophy size={18} />
          Ranking Geral
          {currentView === 'ranking' && (
            <motion.div layoutId="activeTabIndicator" className="absolute bottom-[-9px] left-0 right-0 h-0.5 bg-blue-500" />
          )}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {currentView === 'history' && (
          <motion.div 
            key="history"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4 pt-4"
          >
             {myResults.length === 0 ? (
           <div className={`p-8 rounded-2xl border text-center ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-100'}`}>
              <p className="text-zinc-500 mb-4">Você ainda não realizou nenhum simulado.</p>
              <button 
                onClick={onBack}
                className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition"
              >
                Fazer meu primeiro simulado
              </button>
           </div>
         ) : (
           myResults.slice().reverse().map((result, i) => (
             <div key={i} className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-100'}`}>
                <div className="flex flex-col md:flex-row justify-between mb-4 pb-4 border-b border-zinc-200 dark:border-zinc-800 gap-4">
                  <div>
                    <h4 className="font-bold text-lg">{result.sessionTitle}</h4>
                    <p className="text-sm text-zinc-400 flex items-center gap-2 mt-1">
                      <Clock size={14}/> {new Date(result.date).toLocaleString('pt-BR')}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-center">
                    <div className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-4 py-2 rounded-xl">
                      <p className="text-xs font-bold uppercase">Acertos</p>
                      <p className="font-black text-xl">{result.score}</p>
                    </div>
                    <div className="bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 px-4 py-2 rounded-xl">
                      <p className="text-xs font-bold uppercase">Total</p>
                      <p className="font-black text-xl">{result.total}</p>
                    </div>
                  </div>
                </div>
                
                <details className="group">
                  <summary className="cursor-pointer text-sm font-bold uppercase tracking-wider text-blue-500 hover:text-blue-600 transition outline-none select-none list-none flex items-center gap-2">
                    <span className="group-open:hidden">Ver o que eu errei ▼</span>
                    <span className="hidden group-open:inline">Ocultar questões ▲</span>
                  </summary>
                  <div className="mt-4 space-y-3">
                    {result.answersMap.filter(a => !a.isCorrect).length === 0 ? (
                       <p className="text-sm text-green-600 font-bold p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">Impressionante! Você não errou nenhuma questão neste simulado.</p>
                    ) : (
                      result.answersMap.filter(a => !a.isCorrect).map((ans, j) => (
                        <div key={j} className={`p-4 rounded-xl text-sm flex flex-col gap-2 ${theme === 'dark' ? 'bg-red-950/20 text-red-100 border border-red-900/30' : 'bg-red-50 text-red-900 border border-red-100'}`}>
                          <p className="font-medium flex items-start gap-2">
                            <XCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                            {ans.questionText}
                          </p>
                          <div className="flex flex-wrap gap-4 mt-1 opacity-80 text-xs ml-6">
                            <span className="flex items-center gap-1">
                              <strong className="uppercase">Sua R.:</strong> {ans.userAnswer || 'Não respondida'}
                            </span>
                            <span className="flex items-center gap-1">
                              <strong className="uppercase">Correta:</strong> {ans.correctAnswer}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </details>
             </div>
           ))
         )}
          </motion.div>
        )}

        {currentView === 'ranking' && (
          <motion.div
            key="ranking"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4 pt-4"
          >
            {rankingData.length === 0 ? (
               <div className={`p-8 rounded-2xl border text-center ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-100'}`}>
                  <p className="text-zinc-500 mb-4">Nenhum simulado foi realizado ainda.</p>
               </div>
            ) : (
               <div className={`rounded-2xl border overflow-hidden ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-100'}`}>
                  <div className={`grid grid-cols-[3rem_1fr_6rem_6rem] gap-4 p-4 font-bold text-xs uppercase tracking-widest text-zinc-500 border-b ${theme === 'dark' ? 'border-zinc-800 bg-zinc-950' : 'border-zinc-100 bg-zinc-50'}`}>
                    <div className="text-center">#</div>
                    <div>Aluno</div>
                    <div className="text-center">Simulados</div>
                    <div className="text-center">Taxa Acerto</div>
                  </div>
                  {rankingData.map((student, idx) => (
                    <div 
                      key={student.uid} 
                      className={`grid grid-cols-[3rem_1fr_6rem_6rem] items-center gap-4 p-4 border-b last:border-b-0 transition-colors ${student.uid === userUid ? (theme === 'dark' ? 'bg-blue-900/20 border-blue-900/40' : 'bg-blue-50 border-blue-100') : (theme === 'dark' ? 'border-zinc-800 hover:bg-zinc-800/50' : 'border-zinc-100 hover:bg-zinc-50')}`}
                    >
                      <div className="text-center font-black text-lg">
                        {idx === 0 ? '🏆' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : idx + 1}
                      </div>
                      <div className="font-bold relative flex items-center gap-2">
                        {student.name}
                        {student.uid === userUid && (
                          <span className="text-[10px] bg-blue-500 text-white px-2 py-0.5 rounded-full uppercase tracking-wider font-black">Você</span>
                        )}
                      </div>
                      <div className="text-center font-bold text-zinc-500">
                        {student.totalSimulados}
                      </div>
                      <div className="text-center font-black">
                        {student.average}%
                      </div>
                    </div>
                  ))}
               </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
