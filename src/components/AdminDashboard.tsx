import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Users, Clock, LogOut, BookOpen, User, Edit2, Save, X, Eye, EyeOff, ChevronDown, ChevronUp, Trash2, Globe } from 'lucide-react';
import { calculateAge } from './LoginScreen';
import { 
  getAllStudents, 
  getAllResults, 
  deleteResult, 
  updateQuestion,
  deleteQuestion,
  saveUserProfile,
  saveModule,
  updateModule,
  deleteModule,
  UserProfile,
  ResultRecord,
  getQuestionsData,
  saveQuestion
} from '../lib/api';

export function AdminDashboard({ onBack, theme, currentUser }: { onBack: () => void, theme: string, currentUser: UserProfile | null }) {
  const [results, setResults] = useState<ResultRecord[]>([]);
  const [students, setStudents] = useState<UserProfile[]>([]);
  const [questionsData, setQuestionsData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'results' | 'students' | 'questions' | 'modules' | 'settings'>('results');
  
  const [subjectFilter, setSubjectFilter] = useState('');
  const [moduleFilter, setModuleFilter] = useState<number | 0>(0);
  
  const [selectedStudent, setSelectedStudent] = useState<UserProfile | null>(null);
  const [isEditingStudent, setIsEditingStudent] = useState(false);

  // Question Form State
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<number | null>(null);
  const [newQuestion, setNewQuestion] = useState({
    id: 0,
    moduleId: 0,
    type: 'choice',
    question: '',
    options: ['', '', ''],
    correct: '',
    explanation: '',
    difficulty: 'Fácil'
  });

  // Module Form State
  const [showAddModule, setShowAddModule] = useState(false);
  const [editingModuleId, setEditingModuleId] = useState<number | null>(null);
  const [newModule, setNewModule] = useState({
    subjectId: '',
    moduleKey: '',
    title: '',
    description: '',
    studyContent: '',
    videoUrl: ''
  });

  const [editFullName, setEditFullName] = useState('');
  const [editBirthDate, setEditBirthDate] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [editRole, setEditRole] = useState<'masteradmin' | 'teacher' | 'student'>('student');

  const [expandedResultIdx, setExpandedResultIdx] = useState<number | null>(null);

  const fetchAllData = async () => {
    try {
      const [fetchedResults, fetchedStudents, fetchedQuestions] = await Promise.all([
        getAllResults(),
        getAllStudents(),
        getQuestionsData()
      ]);
      
      if (fetchedResults) setResults(fetchedResults);
      if (fetchedStudents) setStudents(fetchedStudents);
      if (fetchedQuestions) setQuestionsData(fetchedQuestions);
    } catch (error) {
      console.error("Error fetching admin data:", error);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleLogout = () => {
    onBack(); // Or handle real logout via auth.signOut()
  };

  const handleAddQuestion = async () => {
    if (!newQuestion.question || !newQuestion.correct || newQuestion.moduleId === 0) {
      alert("Preecha os campos obrigatórios");
      return;
    }

    try {
      if (editingQuestionId) {
        await updateQuestion(editingQuestionId, newQuestion);
        alert("Questão atualizada!");
      } else {
        await saveQuestion(newQuestion);
        alert("Questão adicionada!");
      }
      setShowAddQuestion(false);
      setEditingQuestionId(null);
      setNewQuestion({
        id: 0,
        moduleId: 0,
        type: 'choice',
        question: '',
        options: ['', '', ''],
        correct: '',
        explanation: '',
        difficulty: 'Fácil'
      });
      const updatedQuestions = await getQuestionsData();
      setQuestionsData(updatedQuestions);
    } catch (e) {
      alert("Erro ao salvar questão");
    }
  };

  const handleEditQuestion = (q: any, modId: number) => {
    setEditingQuestionId(q.id);
    setNewQuestion({
        id: q.id,
        moduleId: modId,
        type: q.type,
        question: q.question,
        options: q.options,
        correct: q.correct,
        explanation: q.explanation || '',
        difficulty: q.difficulty || 'Fácil'
    });
    setShowAddQuestion(true);
  };

  const handleDeleteQuestion = async (id: number) => {
    if (!confirm("Deseja realmente excluir esta questão?")) return;
    try {
      await deleteQuestion(id);
      const updatedQuestions = await getQuestionsData();
      setQuestionsData(updatedQuestions);
    } catch (e) {
      alert("Erro ao excluir questão");
    }
  };

  const handleAddModule = async () => {
    if (!newModule.title || !newModule.subjectId || !newModule.moduleKey) {
      alert("Preecha os campos obrigatórios (Título, Matéria e Chave)");
      return;
    }

    try {
      if (editingModuleId) {
        await updateModule(editingModuleId, newModule);
        alert("Módulo atualizado!");
      } else {
        await saveModule(newModule);
        alert("Módulo criado!");
      }
      setShowAddModule(false);
      setEditingModuleId(null);
      setNewModule({
        subjectId: '',
        moduleKey: '',
        title: '',
        description: '',
        studyContent: '',
        videoUrl: ''
      });
      const updatedQuestions = await getQuestionsData();
      setQuestionsData(updatedQuestions);
    } catch (e) {
      alert("Erro ao salvar módulo");
    }
  };

  const handleEditModule = (mod: any, subjId: string) => {
    setEditingModuleId(mod.id);
    setNewModule({
        subjectId: subjId,
        moduleKey: mod.moduleKey,
        title: mod.title,
        description: mod.description || '',
        studyContent: mod.studyContent || '',
        videoUrl: mod.videoUrl || ''
    });
    setShowAddModule(true);
  };

  const handleDeleteModule = async (id: number) => {
    if (!confirm("Deseja realmente excluir este módulo? Todas as questões vinculadas serão apagadas.")) return;
    try {
      await deleteModule(id);
      const updatedQuestions = await getQuestionsData();
      setQuestionsData(updatedQuestions);
    } catch (e) {
      alert("Erro ao excluir módulo");
    }
  };

  const handleSaveStudentProfile = async () => {
    if (!selectedStudent || !editFullName || !editBirthDate) {
      alert('Preencha os campos obrigatórios.');
      return;
    }

    const updatedStudent: UserProfile = {
      ...selectedStudent,
      fullName: editFullName,
      birthDate: editBirthDate,
      role: editRole
    };

    try {
      await saveUserProfile(updatedStudent);
      setStudents(prev => prev.map(s => s.uid === updatedStudent.uid ? updatedStudent : s));
      setSelectedStudent(updatedStudent);
      setIsEditingStudent(false);
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Erro ao salvar perfil.");
    }
  };

  const handleDeleteResult = async (resultToDelete: ResultRecord, e: React.MouseEvent) => {
    e.stopPropagation();
    if (resultToDelete.id && confirm('Tem certeza que deseja excluir este simulado permanentemente?')) {
      try {
        await deleteResult(resultToDelete.id);
        setResults(prev => prev.filter(r => r.id !== resultToDelete.id));
        setExpandedResultIdx(null);
      } catch (error) {
        console.error(error);
        alert("Erro ao excluir simulado.");
      }
    }
  };

  const currentStudentResults = selectedStudent 
    ? results.filter(r => r.uid === selectedStudent.uid).slice().reverse()
    : [];

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
            className={`p-3 rounded-xl transition-colors ${theme === 'dark' ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-100' : 'bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-900'}`}
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
              <Users className="text-blue-500" /> Painel do Professor
            </h2>
            <p className="text-sm font-medium text-zinc-400">Acompanhamento de simulados e alunos</p>
          </div>
        </div>

        <button 
            onClick={handleLogout}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-xl transition-colors ${theme === 'dark' ? 'bg-red-950/30 hover:bg-red-900/50 text-red-400' : 'bg-red-50 hover:bg-red-100 text-red-600'}`}
        >
            <LogOut size={16} /> Sair
        </button>
      </div>

      {selectedStudent ? (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 mt-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => { setSelectedStudent(null); setIsEditingStudent(false); setExpandedResultIdx(null); }}
              className={`p-3 rounded-xl transition-colors ${theme === 'dark' ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-100' : 'bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-900'}`}
            >
              <ArrowLeft size={20} />
            </button>
            <h3 className="text-xl font-bold">Perfil do Aluno</h3>
          </div>

          <div className={`p-6 rounded-2xl border flex flex-col md:flex-row gap-6 ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-100'}`}>
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-zinc-200 dark:border-zinc-700 shrink-0">
              {selectedStudent.profilePicture ? (
                <img src={selectedStudent.profilePicture} alt={selectedStudent.fullName} className="w-full h-full object-cover" />
              ) : (
                <div className={`w-full h-full flex items-center justify-center ${theme === 'dark' ? 'bg-zinc-800' : 'bg-zinc-100'}`}>
                  <User size={36} className="text-zinc-500" />
                </div>
              )}
            </div>
            
            <div className="flex-1 space-y-4">
              {isEditingStudent ? (
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
                    {(currentUser?.role === 'masteradmin' || currentUser?.username === 'deiorbo') && (
                      <select
                        value={editRole}
                        onChange={(e) => setEditRole(e.target.value as 'masteradmin' | 'teacher' | 'student')}
                        className={`px-3 py-1.5 text-sm rounded-lg border ${theme === 'dark' ? 'bg-zinc-800 border-zinc-700 focus:border-blue-500 text-white' : 'bg-white border-zinc-200 focus:border-blue-500 text-black'} outline-none`}
                      >
                        <option value="student">Aluno</option>
                        <option value="teacher">Professor</option>
                        <option value="masteradmin">Master Admin</option>
                      </select>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-2xl font-black">{selectedStudent.fullName}</h3>
                    <span className={`px-2 py-0.5 text-xs font-bold rounded-lg ${
                      selectedStudent.role === 'masteradmin' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                      selectedStudent.role === 'teacher' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : 
                      'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    }`}>
                      {selectedStudent.role === 'masteradmin' ? 'Master Admin' :
                       selectedStudent.role === 'teacher' ? 'Professor' : 'Aluno'}
                    </span>
                  </div>
                  <p className="text-zinc-500 mb-2">@{selectedStudent.username} • {calculateAge(selectedStudent.birthDate)} anos</p>
                  <p className="text-sm">Total de Simulados: <strong>{currentStudentResults.length}</strong></p>
                  {selectedStudent.lastAccess && (
                    <p className="text-sm text-zinc-500">Último acesso: {new Date(selectedStudent.lastAccess).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</p>
                  )}
                </div>
              )}

              <div className="flex gap-2 pt-4 border-t border-zinc-200 dark:border-zinc-800 mt-4">
                {isEditingStudent ? (
                  <>
                    <button onClick={() => setIsEditingStudent(false)} className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-xl transition-colors ${theme === 'dark' ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300' : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-600'}`}><X size={16}/> Cancelar</button>
                    <button onClick={handleSaveStudentProfile} className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-xl transition-colors bg-green-600 hover:bg-green-700 text-white`}><Save size={16}/> Salvar</button>
                  </>
                ) : (
                  <button onClick={() => {
                    setEditFullName(selectedStudent.fullName);
                    setEditBirthDate(selectedStudent.birthDate);
                    setEditPassword(selectedStudent.password || '');
                    setEditRole(selectedStudent.role);
                    setIsEditingStudent(true);
                  }} className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-xl transition-colors ${theme === 'dark' ? 'bg-blue-900/30 hover:bg-blue-900/50 text-blue-400' : 'bg-blue-50 hover:bg-blue-100 text-blue-600'}`}><Edit2 size={16}/> Editar Perfil</button>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-lg border-b border-zinc-200 dark:border-zinc-800 pb-2">Histórico de Simulados</h4>
            {currentStudentResults.length === 0 ? (
              <p className="text-zinc-500">Nenhum simulado realizado ainda.</p>
            ) : (
               currentStudentResults.map((result, i) => (
                  <div key={i} className={`rounded-2xl border overflow-hidden ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-100'}`}>
                    <div 
                      className="p-4 sm:p-6 flex flex-col md:flex-row justify-between md:items-center gap-4 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                      onClick={() => setExpandedResultIdx(expandedResultIdx === i ? null : i)}
                    >
                      <div className="flex-1">
                        <h4 className="font-bold text-lg">{result.sessionTitle}</h4>
                        <p className="text-sm text-zinc-400 flex items-center gap-2 mt-1">
                          <Clock size={14}/> {new Date(result.date).toLocaleString('pt-BR')}
                        </p>
                      </div>
                      <div className="flex items-center gap-4 text-center justify-between md:justify-end">
                        <div className="flex gap-2">
                           <div className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-3 py-1.5 rounded-lg flex gap-2 items-center">
                             <p className="text-xs font-bold uppercase hidden sm:block">Acertos</p>
                             <p className="font-black">{result.score}</p>
                           </div>
                           <div className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 px-3 py-1.5 rounded-lg flex gap-2 items-center">
                             <p className="text-xs font-bold uppercase hidden sm:block">Erros</p>
                             <p className="font-black">{result.total - result.score}</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-2">
                           <button
                             onClick={(e) => handleDeleteResult(result, e)}
                             className="w-8 h-8 flex items-center justify-center rounded-full text-zinc-400 hover:text-white hover:bg-red-500 transition-colors"
                             title="Excluir simulado"
                           >
                             <Trash2 size={16} />
                           </button>
                           <div className="w-8 h-8 flex items-center justify-center rounded-full bg-black/5 dark:bg-white/5">
                               {expandedResultIdx === i ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                           </div>
                        </div>
                      </div>
                    </div>
                    
                    <AnimatePresence>
                      {expandedResultIdx === i && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="border-t border-zinc-200 dark:border-zinc-800 px-4 sm:px-6 py-4 space-y-3 bg-black/5 dark:bg-white/5"
                        >
                          <p className="text-sm font-bold uppercase text-zinc-400 tracking-wide mb-2 mt-2">Detalhes das Questões</p>
                           {result.answersMap.map((ans, j) => (
                             <div key={j} className={`p-4 rounded-xl text-sm flex flex-col gap-2 ${ans.isCorrect ? (theme === 'dark' ? 'bg-green-950/40 text-green-100' : 'bg-green-100 text-green-900') : (theme === 'dark' ? 'bg-red-950/40 text-red-100' : 'bg-red-100 text-red-900')}`}>
                               <p className="font-medium">{j + 1}. {ans.questionText}</p>
                               <div className="flex flex-wrap gap-4 mt-1 opacity-80 text-xs">
                                 <span className="flex items-center gap-1">
                                   <strong className="uppercase">Sua R.:</strong> {ans.userAnswer || 'Não respondida'}
                                 </span>
                                 {!ans.isCorrect && (
                                   <span className="flex items-center gap-1">
                                     <strong className="uppercase">Correta:</strong> {ans.correctAnswer}
                                   </span>
                                 )}
                               </div>
                             </div>
                           ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
               ))
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-100'}`}>
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Total de Simulados</p>
          <p className="text-3xl font-black mt-2">{results.length}</p>
        </div>
        <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-100'}`}>
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Alunos Registrados</p>
          <p className="text-3xl font-black mt-2">{students.length}</p>
        </div>
        <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-100'}`}>
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Alunos Ativos (Fizeram Simulado)</p>
          <p className="text-3xl font-black mt-2">{new Set(results.map(r => r.uid)).size}</p>
        </div>
        <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-100'}`}>
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Média Geral</p>
          <p className="text-3xl font-black mt-2">
            {results.length ? Math.round(results.reduce((acc, r) => acc + (r.score / r.total) * 100, 0) / results.length) : 0}%
          </p>
        </div>
      </div>

      <div className="flex gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-2">
        <button
          onClick={() => setActiveTab('results')}
          className={`pb-2 px-4 font-bold transition-all border-b-2 ${activeTab === 'results' ? 'border-blue-600 text-blue-600' : 'border-transparent text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'}`}
        >
          Últimos Resultados
        </button>
        <button
          onClick={() => setActiveTab('students')}
          className={`pb-2 px-4 font-bold transition-all border-b-2 ${activeTab === 'students' ? 'border-blue-600 text-blue-600' : 'border-transparent text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'}`}
        >
          {(currentUser?.role === 'masteradmin' || currentUser?.username === 'deiorbo') ? 'Usuários Cadastrados' : 'Alunos Cadastrados'}
        </button>
        <button
          onClick={() => setActiveTab('questions')}
          className={`pb-2 px-4 font-bold transition-all border-b-2 ${activeTab === 'questions' ? 'border-blue-600 text-blue-600' : 'border-transparent text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'}`}
        >
          Questões
        </button>
        <button
          onClick={() => setActiveTab('modules')}
          className={`pb-2 px-4 font-bold transition-all border-b-2 ${activeTab === 'modules' ? 'border-blue-600 text-blue-600' : 'border-transparent text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'}`}
        >
          Módulos
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`pb-2 px-4 font-bold transition-all border-b-2 ${activeTab === 'settings' ? 'border-blue-600 text-blue-600' : 'border-transparent text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'}`}
        >
          Hospedagem & Deploy
        </button>
      </div>

      <div className="space-y-4">
        {activeTab === 'questions' ? (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
              <h3 className="text-xl font-bold">Banco de Questões (DB)</h3>
              <div className="flex flex-wrap gap-2">
                <select 
                  className={`p-2 rounded-xl border text-xs font-bold ${theme === 'dark' ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-zinc-200'}`}
                  value={subjectFilter}
                  onChange={(e) => { setSubjectFilter(e.target.value); setModuleFilter(0); }}
                >
                  <option value="">Todas as Matérias</option>
                  {questionsData && Object.entries(questionsData).map(([id, subj]: any) => (
                    <option key={id} value={id}>{subj.title}</option>
                  ))}
                </select>

                <select 
                  className={`p-2 rounded-xl border text-xs font-bold ${theme === 'dark' ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-zinc-200'}`}
                  value={moduleFilter}
                  onChange={(e) => setModuleFilter(parseInt(e.target.value))}
                  disabled={!subjectFilter}
                >
                  <option value={0}>Todos os Módulos</option>
                  {subjectFilter && questionsData[subjectFilter] && Object.values(questionsData[subjectFilter].modules).map((mod: any) => (
                    <option key={mod.id} value={mod.id}>{mod.title}</option>
                  ))}
                </select>

                <button 
                  onClick={() => setShowAddQuestion(!showAddQuestion)}
                  className={`px-4 py-2 rounded-xl font-bold bg-blue-600 text-white shadow-lg text-sm`}
                >
                  {showAddQuestion ? 'Fechar Formulário' : '+ Adicionar Questão'}
                </button>
              </div>
            </div>

            {showAddQuestion && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className={`p-6 rounded-2xl border space-y-4 ${theme === 'dark' ? 'bg-zinc-900 border-zinc-700' : 'bg-white border-zinc-200 shadow-sm'}`}
              >
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-black text-blue-500 uppercase tracking-tighter">
                    {editingQuestionId ? 'Editar Questão' : 'Nova Questão'}
                  </h4>
                  {editingQuestionId && (
                    <button 
                      onClick={() => { setEditingQuestionId(null); setShowAddQuestion(false); }}
                      className="text-xs text-zinc-500 hover:text-red-500 underline"
                    >
                      Cancelar Edição
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-zinc-500">Módulo</label>
                    <select 
                      className={`w-full p-2.5 rounded-xl border ${theme === 'dark' ? 'bg-zinc-800 border-zinc-700' : 'bg-zinc-50 border-zinc-200'}`}
                      value={newQuestion.moduleId}
                      onChange={(e) => setNewQuestion({...newQuestion, moduleId: parseInt(e.target.value)})}
                    >
                      <option value={0}>Selecione um módulo...</option>
                      {questionsData && Object.values(questionsData).map((subj: any) => 
                        Object.values(subj.modules).map((mod: any) => (
                          <option key={mod.id} value={mod.id}>[{subj.title}] {mod.title}</option>
                        ))
                      )}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-zinc-500">Dificuldade</label>
                    <select 
                      className={`w-full p-2.5 rounded-xl border ${theme === 'dark' ? 'bg-zinc-800 border-zinc-700' : 'bg-zinc-50 border-zinc-200'}`}
                      value={newQuestion.difficulty}
                      onChange={(e) => setNewQuestion({...newQuestion, difficulty: e.target.value})}
                    >
                      <option value="Fácil">Fácil</option>
                      <option value="Moderado">Moderado</option>
                      <option value="Difícil">Difícil</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-zinc-500">Questão</label>
                  <textarea 
                    className={`w-full p-2.5 rounded-xl border ${theme === 'dark' ? 'bg-zinc-800 border-zinc-700' : 'bg-zinc-50 border-zinc-200'}`}
                    placeholder="Enunciado da questão..."
                    value={newQuestion.question}
                    onChange={(e) => setNewQuestion({...newQuestion, question: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {newQuestion.options.map((opt, idx) => (
                    <div key={idx} className="space-y-2">
                      <label className="text-xs font-bold uppercase text-zinc-500">Opção {idx + 1}</label>
                      <input 
                        className={`w-full p-2.5 rounded-xl border ${theme === 'dark' ? 'bg-zinc-800 border-zinc-700' : 'bg-zinc-50 border-zinc-200'}`}
                        value={opt}
                        onChange={(e) => {
                          const newOpts = [...newQuestion.options];
                          newOpts[idx] = e.target.value;
                          setNewQuestion({...newQuestion, options: newOpts});
                        }}
                      />
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-zinc-500">Resposta Correta (Exata)</label>
                    <input 
                      className={`w-full p-2.5 rounded-xl border ${theme === 'dark' ? 'bg-zinc-800 border-zinc-700' : 'bg-zinc-50 border-zinc-200'}`}
                      value={newQuestion.correct}
                      onChange={(e) => setNewQuestion({...newQuestion, correct: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-zinc-500">Explicação</label>
                    <input 
                      className={`w-full p-2.5 rounded-xl border ${theme === 'dark' ? 'bg-zinc-800 border-zinc-700' : 'bg-zinc-50 border-zinc-200'}`}
                      value={newQuestion.explanation}
                      onChange={(e) => setNewQuestion({...newQuestion, explanation: e.target.value})}
                    />
                  </div>
                </div>

                <button 
                  onClick={handleAddQuestion}
                  className="w-full py-3 rounded-xl font-bold bg-green-600 text-white shadow-xl"
                >
                  Salvar Nova Questão
                </button>
              </motion.div>
            )}

            <div className="space-y-6">
              {questionsData && Object.entries(questionsData)
                .filter(([subjKey]) => !subjectFilter || subjKey === subjectFilter)
                .map(([subjKey, subj]: any) => (
                <div key={subjKey} className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-100'}`}>
                  <h4 className="font-black text-lg mb-4 flex items-center gap-2 text-blue-500 uppercase tracking-tighter">
                    <span>{subj.icon}</span> {subj.title}
                  </h4>
                  <div className="space-y-4">
                    {Object.entries(subj.modules)
                      .filter(([, mod]: any) => !moduleFilter || mod.id === moduleFilter)
                      .map(([modKey, mod]: any) => (
                      <div key={modKey} className="p-4 rounded-xl bg-black/5 dark:bg-white/5 space-y-3">
                        <div className="flex justify-between items-center border-b border-black/5 dark:border-white/5 pb-2">
                          <span className="text-sm font-black uppercase text-zinc-500">{mod.title}</span>
                          <span className="text-xs font-black px-2 py-1 rounded-lg bg-blue-600/10 text-blue-500">
                            {mod.questions.length} Questões
                          </span>
                        </div>
                        <div className="grid gap-2">
                          {mod.questions.map((q: any) => (
                            <div key={q.id} className="flex items-center justify-between gap-4 p-3 rounded-xl bg-white/50 dark:bg-black/20 group hover:ring-1 hover:ring-blue-500/30 transition-all">
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold leading-relaxed line-clamp-2">{q.question}</p>
                                <div className="flex items-center gap-2 mt-1 text-[10px] font-black text-zinc-400 uppercase">
                                  <span className={`px-1.5 py-0.5 rounded ${q.difficulty === 'Fácil' ? 'bg-green-500/10 text-green-500' : q.difficulty === 'Moderado' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-red-500/10 text-red-500'}`}>
                                    {q.difficulty}
                                  </span>
                                  <span>•</span>
                                  <span>ID: {q.id}</span>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <button 
                                  onClick={() => handleEditQuestion(q, mod.id)} 
                                  className="p-2 rounded-lg hover:bg-blue-500 hover:text-white text-blue-500 transition-all"
                                  title="Editar questão"
                                >
                                  <Edit2 size={16} />
                                </button>
                                <button 
                                  onClick={() => handleDeleteQuestion(q.id)} 
                                  className="p-2 rounded-lg hover:bg-red-500 hover:text-white text-red-500 transition-all"
                                  title="Excluir questão"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>
                          ))}
                          {mod.questions.length === 0 && (
                            <p className="text-center text-xs text-zinc-500 py-4">Nenhuma questão neste módulo.</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : activeTab === 'modules' ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold">Módulos de Estudo</h3>
              <button 
                onClick={() => setShowAddModule(!showAddModule)}
                className={`px-4 py-2 rounded-xl font-bold bg-purple-600 text-white shadow-lg`}
              >
                {showAddModule ? 'Fechar Formulário' : '+ Adicionar Módulo'}
              </button>
            </div>

            {showAddModule && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className={`p-6 rounded-2xl border space-y-4 ${theme === 'dark' ? 'bg-zinc-900 border-zinc-700' : 'bg-white border-zinc-200 shadow-sm'}`}
              >
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-black text-purple-500 uppercase tracking-tighter">
                    {editingModuleId ? 'Editar Módulo' : 'Novo Módulo'}
                  </h4>
                  {editingModuleId && (
                    <button 
                      onClick={() => { setEditingModuleId(null); setShowAddModule(false); }}
                      className="text-xs text-zinc-500 hover:text-red-500 underline"
                    >
                      Cancelar Edição
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-zinc-500">Matéria</label>
                    <select 
                      className={`w-full p-2.5 rounded-xl border ${theme === 'dark' ? 'bg-zinc-800 border-zinc-700' : 'bg-zinc-50 border-zinc-200'}`}
                      value={newModule.subjectId}
                      onChange={(e) => setNewModule({...newModule, subjectId: e.target.value})}
                    >
                      <option value="">Selecione...</option>
                      {questionsData && Object.entries(questionsData).map(([id, subj]: any) => (
                        <option key={id} value={id}>{subj.title}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-zinc-500">Chave Única (ex: anatomia_1)</label>
                    <input 
                      className={`w-full p-2.5 rounded-xl border ${theme === 'dark' ? 'bg-zinc-800 border-zinc-700' : 'bg-zinc-50 border-zinc-200'}`}
                      value={newModule.moduleKey}
                      onChange={(e) => setNewModule({...newModule, moduleKey: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-zinc-500">Título</label>
                    <input 
                      className={`w-full p-2.5 rounded-xl border ${theme === 'dark' ? 'bg-zinc-800 border-zinc-700' : 'bg-zinc-50 border-zinc-200'}`}
                      value={newModule.title}
                      onChange={(e) => setNewModule({...newModule, title: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-zinc-500">Video URL (YouTube Embed)</label>
                  <input 
                    className={`w-full p-2.5 rounded-xl border ${theme === 'dark' ? 'bg-zinc-800 border-zinc-700' : 'bg-zinc-50 border-zinc-200'}`}
                    value={newModule.videoUrl}
                    onChange={(e) => setNewModule({...newModule, videoUrl: e.target.value})}
                    placeholder="https://www.youtube.com/embed/..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-zinc-500">Descrição Curta</label>
                  <textarea 
                    className={`w-full p-2.5 rounded-xl border ${theme === 'dark' ? 'bg-zinc-800 border-zinc-700' : 'bg-zinc-50 border-zinc-200'}`}
                    value={newModule.description}
                    onChange={(e) => setNewModule({...newModule, description: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-zinc-500">Conteúdo de Estudo (Markdown)</label>
                  <textarea 
                    className={`w-full p-2.5 rounded-xl border h-40 ${theme === 'dark' ? 'bg-zinc-800 border-zinc-700' : 'bg-zinc-50 border-zinc-200'}`}
                    value={newModule.studyContent}
                    onChange={(e) => setNewModule({...newModule, studyContent: e.target.value})}
                  />
                </div>

                <button 
                  onClick={handleAddModule}
                  className="w-full py-3 rounded-xl font-bold bg-green-600 text-white shadow-xl"
                >
                  Salvar Módulo
                </button>
              </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {questionsData && Object.entries(questionsData).map(([subjKey, subj]: any) => (
                <div key={subjKey} className="space-y-3">
                  <h4 className="font-bold text-zinc-500 uppercase text-xs tracking-widest">{subj.title}</h4>
                  {Object.entries(subj.modules).map(([modKey, mod]: any) => (
                    <div key={modKey} className={`p-4 rounded-2xl border flex justify-between items-center ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}>
                      <div>
                        <p className="font-bold">{mod.title}</p>
                        <p className="text-xs text-zinc-500">{mod.moduleKey}</p>
                      </div>
                      <div className="flex gap-2">
                         <button onClick={() => handleEditModule(mod, subjKey)} className="p-2 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white transition-all">
                           <Edit2 size={16} />
                         </button>
                         <button onClick={() => handleDeleteModule(mod.id)} className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all">
                           <Trash2 size={16} />
                         </button>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ) : activeTab === 'settings' ? (
          <div className="space-y-6">
            <h3 className="text-xl font-bold">Configuração de Hospedagem (aaPanel)</h3>
            
            <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}>
              <h4 className="font-bold mb-4 flex items-center gap-2">
                <Globe size={18} className="text-blue-500" /> Domínio: provas.deioinfo.com.br
              </h4>
              
              <div className="space-y-4 text-sm font-medium">
                <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                  <p className="font-bold text-blue-600 mb-1">Passo 1: DNS</p>
                  <p>Aponte o domínio <strong>provas.deioinfo.com.br</strong> (tipo A) para o IP do seu servidor: <strong>128.140.1.235</strong></p>
                </div>

                <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/20">
                  <p className="font-bold text-purple-600 mb-1">Passo 2: aaPanel Node.js Manager</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Vá em **App Store** {"->"} **Node.js Manager**.</li>
                    <li>Clique em **Add project**.</li>
                    <li>Escolha o diretório onde o código foi baixado.</li>
                    <li>Configure o **Run Command** como <code>npm run start</code>.</li>
                    <li>Configure a porta para <code>3000</code>.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/20">
                  <p className="font-bold text-green-600 mb-1">Passo 3: Como atualizar questões e o App</p>
                  <p className="mb-2">Como estamos usando banco de dados externo, as questões que você alterar neste painel são atualizadas **instantaneamente** para todos!</p>
                  <p>Para atualizar o visual do App:</p>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Use a função **Export to GitHub** no menu lateral do AI Studio.</li>
                    <li>No aaPanel, dentro do projeto Node, clique em **Git Pull** para baixar a nova versão.</li>
                  </ol>
                </div>
              </div>
            </div>

            <div className={`p-6 rounded-2xl border border-dashed text-center ${theme === 'dark' ? 'border-zinc-800' : 'border-zinc-200'}`}>
              <p className="text-zinc-500 text-sm">Seu app está pronto para rodar profissionalmente.</p>
            </div>
          </div>
        ) : activeTab === 'students' ? (
          students.length === 0 ? (
            <p className="text-zinc-500">Nenhum usuário registrado no sistema ainda.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {students.map((student, i) => (
                <div 
                  key={i} 
                  onClick={() => setSelectedStudent(student)}
                  className={`p-6 rounded-2xl border cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-100'}`}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-zinc-200 dark:border-zinc-700">
                      {student.profilePicture ? (
                        <img src={student.profilePicture} alt={student.fullName} className="w-full h-full object-cover" />
                      ) : (
                        <div className={`w-full h-full flex items-center justify-center ${theme === 'dark' ? 'bg-zinc-800' : 'bg-zinc-100'}`}>
                          <User size={24} className="text-zinc-500" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-lg leading-tight">{student.fullName}</h4>
                        <span className={`px-1.5 py-0.5 text-[8px] font-black rounded uppercase ${
                          student.role === 'masteradmin' ? 'bg-red-500 text-white' :
                          student.role === 'teacher' ? 'bg-purple-500 text-white' : 
                          'bg-blue-500 text-white'
                        }`}>
                          {student.role === 'masteradmin' ? 'Master' :
                           student.role === 'teacher' ? 'Prof' : 'Aluno'}
                        </span>
                      </div>
                      <p className="text-sm text-zinc-400">@{student.username} • {calculateAge(student.birthDate)} anos</p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex justify-between text-sm items-center">
                    <div className="text-zinc-500">
                      <span className="font-bold text-zinc-900 dark:text-zinc-100">{results.filter(r => r.uid === student.uid).length}</span> Simulados
                    </div>
                    {student.lastAccess && (
                      <div className="text-xs text-zinc-500 flex items-center gap-1">
                        <Clock size={12} />
                        {new Date(student.lastAccess).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          results.length === 0 ? (
            <p className="text-zinc-500">Nenhum simulado registrado no dispositivo.</p>
          ) : (
            results.slice().reverse().map((result, i) => (
                  <div key={i} className={`rounded-2xl border overflow-hidden ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-100'}`}>
                    <div 
                      className="p-4 sm:p-6 flex flex-col md:flex-row justify-between md:items-center gap-4 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                      onClick={() => setExpandedResultIdx(expandedResultIdx === i ? null : i)}
                    >
                      <div className="flex-1">
                        <h4 className="font-bold text-lg">{result.sessionTitle}</h4>
                        <p className="text-sm text-zinc-400 flex items-center gap-2 mt-1">
                          <Clock size={14}/> {new Date(result.date).toLocaleString('pt-BR')} • {result.username}
                        </p>
                      </div>
                      <div className="flex items-center gap-4 text-center justify-between md:justify-end">
                        <div className="flex gap-2">
                           <div className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-3 py-1.5 rounded-lg flex gap-2 items-center">
                             <p className="text-xs font-bold uppercase hidden sm:block">Acertos</p>
                             <p className="font-black">{result.score}</p>
                           </div>
                           <div className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 px-3 py-1.5 rounded-lg flex gap-2 items-center">
                             <p className="text-xs font-bold uppercase hidden sm:block">Erros</p>
                             <p className="font-black">{result.total - result.score}</p>
                           </div>
                        </div>
                        <div className="ml-2 flex items-center gap-2">
                           <button
                             onClick={(e) => handleDeleteResult(result, e)}
                             className="w-8 h-8 flex items-center justify-center rounded-full text-zinc-400 hover:text-white hover:bg-red-500 transition-colors"
                             title="Excluir simulado"
                           >
                             <Trash2 size={16} />
                           </button>
                           <div className="w-8 h-8 flex items-center justify-center rounded-full bg-black/5 dark:bg-white/5">
                               {expandedResultIdx === i ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                           </div>
                        </div>
                      </div>
                    </div>
                    
                    <AnimatePresence>
                      {expandedResultIdx === i && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="border-t border-zinc-200 dark:border-zinc-800 px-4 sm:px-6 py-4 space-y-3 bg-black/5 dark:bg-white/5"
                        >
                          <p className="text-sm font-bold uppercase text-zinc-400 tracking-wide mb-2 mt-2">Detalhes das Questões</p>
                           {result.answersMap.map((ans, j) => (
                             <div key={j} className={`p-4 rounded-xl text-sm flex flex-col gap-2 ${ans.isCorrect ? (theme === 'dark' ? 'bg-green-950/40 text-green-100' : 'bg-green-100 text-green-900') : (theme === 'dark' ? 'bg-red-950/40 text-red-100' : 'bg-red-100 text-red-900')}`}>
                               <p className="font-medium">{j + 1}. {ans.questionText}</p>
                               <div className="flex flex-wrap gap-4 mt-1 opacity-80 text-xs">
                                 <span className="flex items-center gap-1">
                                   <strong className="uppercase">Sua R.:</strong> {ans.userAnswer || 'Não respondida'}
                                 </span>
                                 {!ans.isCorrect && (
                                   <span className="flex items-center gap-1">
                                     <strong className="uppercase">Correta:</strong> {ans.correctAnswer}
                                   </span>
                                 )}
                               </div>
                             </div>
                           ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
            ))
          )
        )}
      </div>
      </>
      )}
    </motion.div>
  );
}
