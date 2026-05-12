import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Users, Clock, LogOut, BookOpen, User, Edit2, Save, X, Eye, EyeOff, ChevronDown, ChevronUp, Trash2, Globe, BarChart, Settings, HelpCircle, Layers, BookMarked, Server, Upload, CheckCircle2 } from 'lucide-react';
import { Logo } from './Logo';
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
  saveSubject,
  updateSubject,
  deleteSubject,
  UserProfile,
  ResultRecord,
  getQuestionsData,
  saveQuestion
} from '../lib/api';

export function AdminDashboard({ onBack, theme, currentUser }: { onBack: () => void, theme: string, currentUser: UserProfile | null }) {
  const [results, setResults] = useState<ResultRecord[]>([]);
  const [students, setStudents] = useState<UserProfile[]>([]);
  const [questionsData, setQuestionsData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'results' | 'students' | 'questions' | 'modules' | 'subjects' | 'settings'>('results');
  
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
    options: ['', '', '', ''],
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
    videoUrl: '',
    period: 'P2'
  });

  // Subject Form State
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [editingSubjectId, setEditingSubjectId] = useState<string | null>(null);
  const [newSubject, setNewSubject] = useState({
    id: '',
    title: '',
    icon: '',
    color: ''
  });

  const [editFullName, setEditFullName] = useState('');
  const [editBirthDate, setEditBirthDate] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [editRole, setEditRole] = useState<'masteradmin' | 'teacher' | 'student'>('student');

  const [expandedResultIdx, setExpandedResultIdx] = useState<number | null>(null);
  const [deleteConfirmResult, setDeleteConfirmResult] = useState<ResultRecord | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!moduleFilter) {
      alert("Por favor, selecione um MÓDULO específico no filtro acima antes de enviar o arquivo.");
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('moduleId', moduleFilter.toString());

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/upload-questions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      const data = await res.json();
      
      if (res.ok) {
        alert(`Sucesso! ${data.count} questões foram adicionadas ao módulo.`);
        const updatedQuestions = await getQuestionsData();
        setQuestionsData(updatedQuestions);
      } else {
        alert(data.message || "Erro ao processar o arquivo.");
      }
    } catch (err) {
      alert("Erro ao enviar o arquivo.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
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
      alert("Preencha os campos obrigatórios");
      return;
    }

    const validOptions = newQuestion.options.filter(o => o.trim() !== '');
    if (validOptions.length !== 4) {
      alert("A questão deve ter exatamente 4 opções de resposta preenchidas.");
      return;
    }

    const uniqueOptions = new Set(validOptions.map(o => o.trim()));
    if (uniqueOptions.size !== 4) {
      alert("As opções de resposta não podem ser repetidas. Forneça 4 opções únicas.");
      return;
    }

    if (!uniqueOptions.has(newQuestion.correct.trim())) {
      alert("A resposta correta deve ser exatamente igual a uma das 4 opções.");
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
        options: ['', '', '', ''],
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
    const paddedOptions = [...(q.options || [])];
    while(paddedOptions.length < 4) paddedOptions.push('');

    setNewQuestion({
        id: q.id,
        moduleId: modId,
        type: q.type,
        question: q.question,
        options: paddedOptions.slice(0, 4),
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
        videoUrl: '',
        period: 'P2'
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
        videoUrl: mod.videoUrl || '',
        period: mod.period || 'P2'
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

  const handleAddSubject = async () => {
    if (!newSubject.title || !newSubject.id) {
      alert("Preecha os campos obrigatórios (ID/Chave e Título)");
      return;
    }

    try {
      if (editingSubjectId) {
        await updateSubject(editingSubjectId, newSubject);
        alert("Matéria atualizada!");
      } else {
        await saveSubject(newSubject);
        alert("Matéria criada!");
      }
      setShowAddSubject(false);
      setEditingSubjectId(null);
      setNewSubject({
        id: '',
        title: '',
        icon: '',
        color: ''
      });
      const updatedQuestions = await getQuestionsData();
      setQuestionsData(updatedQuestions);
    } catch (e) {
      alert("Erro ao salvar matéria");
    }
  };

  const handleEditSubject = (subj: any, subjId: string) => {
    setEditingSubjectId(subjId);
    setNewSubject({
        id: subjId,
        title: subj.title,
        icon: subj.icon || '',
        color: subj.color || ''
    });
    setShowAddSubject(true);
  };

  const handleDeleteSubject = async (id: string) => {
    if (!confirm("Deseja realmente excluir esta matéria? Todos os módulos e questões vinculados serão apagados!")) return;
    try {
      await deleteSubject(id);
      const updatedQuestions = await getQuestionsData();
      setQuestionsData(updatedQuestions);
    } catch (e) {
      alert("Erro ao excluir matéria");
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
    setDeleteConfirmResult(resultToDelete);
  };

  const confirmDeleteResult = async () => {
    if (deleteConfirmResult?.id) {
      try {
        await deleteResult(deleteConfirmResult.id);
        setResults(prev => prev.filter(r => r.id !== deleteConfirmResult.id));
        setExpandedResultIdx(null);
        setDeleteConfirmResult(null);
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
      className="w-full flex justify-center pb-12"
    >
      <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-8">
        
        {/* Modern Sidebar */}
        <div className="w-full lg:w-64 shrink-0 flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className={`p-3 rounded-xl transition-colors ${theme === 'dark' ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-100' : 'bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-900'}`}
              title="Voltar"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex flex-col">
              <Logo size="sm" variant="full" />
              <p className="text-[10px] uppercase tracking-wider font-bold text-blue-600 mt-1">Painel Administrativo</p>
            </div>
          </div>

          <div className={`flex flex-col gap-1 p-3 rounded-2xl border ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}>
            <p className="text-[10px] font-black tracking-widest uppercase text-zinc-400 px-3 py-2">Visão Geral</p>
            <button
              onClick={() => setActiveTab('results')}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'results' ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-black/5 dark:hover:bg-white/5 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'}`}
            >
              <BarChart size={16} /> Dashboard
            </button>
            <button
              onClick={() => setActiveTab('students')}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'students' ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-black/5 dark:hover:bg-white/5 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'}`}
            >
              <Users size={16} /> Alunos
            </button>

            <div className="h-px w-full bg-zinc-200 dark:bg-zinc-800 my-2" />

            <p className="text-[10px] font-black tracking-widest uppercase text-zinc-400 px-3 py-2">Conteúdo</p>
            <button
              onClick={() => setActiveTab('subjects')}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'subjects' ? 'bg-purple-600 text-white shadow-md' : 'hover:bg-black/5 dark:hover:bg-white/5 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'}`}
            >
              <BookMarked size={16} /> Matérias
            </button>
            <button
              onClick={() => setActiveTab('modules')}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'modules' ? 'bg-purple-600 text-white shadow-md' : 'hover:bg-black/5 dark:hover:bg-white/5 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'}`}
            >
              <Layers size={16} /> Módulos
            </button>
            <button
              onClick={() => setActiveTab('questions')}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'questions' ? 'bg-purple-600 text-white shadow-md' : 'hover:bg-black/5 dark:hover:bg-white/5 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'}`}
            >
              <HelpCircle size={16} /> Banco de Questões
            </button>

            <div className="h-px w-full bg-zinc-200 dark:bg-zinc-800 my-2" />
            
            <p className="text-[10px] font-black tracking-widest uppercase text-zinc-400 px-3 py-2">Sistema</p>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'settings' ? 'bg-zinc-800 text-white shadow-md dark:bg-white dark:text-black' : 'hover:bg-black/5 dark:hover:bg-white/5 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'}`}
            >
              <Server size={16} /> Hospedagem & Deploy
            </button>
          </div>

          <button 
             onClick={handleLogout}
             className={`flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-bold rounded-2xl transition-colors ${theme === 'dark' ? 'bg-red-950/30 hover:bg-red-900/50 text-red-400' : 'bg-red-50 hover:bg-red-100 text-red-600'}`}
          >
             <LogOut size={16} /> Sair do Painel
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 w-full min-w-0">
          {selectedStudent ? (
        <div className="space-y-8 animate-in slide-in-from-bottom-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => { setSelectedStudent(null); setIsEditingStudent(false); setExpandedResultIdx(null); }}
              className={`p-3 rounded-xl transition-colors ${theme === 'dark' ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-100' : 'bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-900'}`}
            >
              <ArrowLeft size={20} />
            </button>
            <h3 className="text-xl font-bold">Perfil do Aluno</h3>
          </div>

          <div className={`p-6 sm:p-8 rounded-[32px] border flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8 ${theme === 'dark' ? 'bg-zinc-900/80 border-zinc-800' : 'bg-white border-zinc-100 shadow-xl shadow-black/5'}`}>
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-[6px] border-zinc-100 dark:border-zinc-800 shrink-0 shadow-md">
              {selectedStudent.profilePicture ? (
                <img src={selectedStudent.profilePicture} alt={selectedStudent.fullName} className="w-full h-full object-cover" />
              ) : (
                <div className={`w-full h-full flex items-center justify-center ${theme === 'dark' ? 'bg-zinc-800' : 'bg-zinc-100'}`}>
                  <User size={48} className="text-zinc-500" />
                </div>
              )}
            </div>
            
            <div className="flex-1 w-full flex flex-col items-center sm:items-start text-center sm:text-left">
              {isEditingStudent ? (
                <div className="w-full space-y-4">
                  <div className="w-full">
                    <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">Nome Completo</label>
                    <input
                      type="text"
                      value={editFullName}
                      onChange={(e) => setEditFullName(e.target.value)}
                      placeholder="Nome Completo"
                      className={`px-4 py-3 text-base font-bold rounded-xl border ${theme === 'dark' ? 'bg-zinc-800 border-zinc-700 focus:border-blue-500 text-white' : 'bg-zinc-50 border-zinc-200 focus:border-blue-500 text-black'} outline-none w-full transition-colors`}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                    <div>
                      <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">Data Nasc.</label>
                      <input
                        type="date"
                        value={editBirthDate}
                        onChange={(e) => setEditBirthDate(e.target.value)}
                        className={`px-4 py-3 text-sm rounded-xl border ${theme === 'dark' ? 'bg-zinc-800 border-zinc-700 focus:border-blue-500 text-white' : 'bg-zinc-50 border-zinc-200 focus:border-blue-500 text-black'} outline-none w-full transition-colors`}
                      />
                    </div>
                    <div className="relative w-full">
                      <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">Nova Senha</label>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={editPassword}
                        onChange={(e) => setEditPassword(e.target.value)}
                        placeholder="Deixe em branco para manter"
                        className={`w-full px-4 pr-10 py-3 text-sm rounded-xl border ${theme === 'dark' ? 'bg-zinc-800 border-zinc-700 focus:border-blue-500 text-white' : 'bg-zinc-50 border-zinc-200 focus:border-blue-500 text-black'} outline-none transition-colors`}
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-[34px] text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 pointer-events-auto"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {(currentUser?.role === 'masteradmin' || currentUser?.username === 'deiorbo') && (
                      <div>
                        <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">Cargo</label>
                        <select
                          value={editRole}
                          onChange={(e) => setEditRole(e.target.value as 'masteradmin' | 'teacher' | 'student')}
                          className={`px-4 py-3 text-sm rounded-xl border ${theme === 'dark' ? 'bg-zinc-800 border-zinc-700 focus:border-blue-500 text-white' : 'bg-zinc-50 border-zinc-200 focus:border-blue-500 text-black'} outline-none w-full transition-colors`}
                        >
                          <option value="student">Aluno</option>
                          <option value="teacher">Professor</option>
                          <option value="masteradmin">Master Admin</option>
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center sm:items-start w-full">
                  <div className="flex flex-col sm:flex-row items-center sm:items-baseline gap-3 mb-2">
                    <h3 className="text-3xl font-black">{selectedStudent.fullName}</h3>
                    <span className={`px-2.5 py-1 text-[10px] uppercase tracking-wider font-extrabold rounded-lg ${
                      selectedStudent.role === 'masteradmin' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                      selectedStudent.role === 'teacher' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : 
                      'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    }`}>
                      {selectedStudent.role === 'masteradmin' ? 'Master Admin' :
                       selectedStudent.role === 'teacher' ? 'Professor' : 'Aluno'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-6">
                    <span className="text-zinc-500 font-medium">@{selectedStudent.username}</span>
                    <span className="text-zinc-300 dark:text-zinc-700">•</span>
                    <span className="text-zinc-500 font-medium">{calculateAge(selectedStudent.birthDate)} anos</span>
                  </div>
                  
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
                    <div className={`px-4 py-2.5 rounded-xl border ${theme === 'dark' ? 'bg-zinc-800/50 border-zinc-700' : 'bg-zinc-50 border-zinc-200'}`}>
                      <p className="text-[10px] uppercase font-bold text-zinc-500 mb-0.5">Simulados</p>
                      <p className="text-lg font-black">{currentStudentResults.length}</p>
                    </div>
                    {selectedStudent.lastAccess && (
                      <div className={`px-4 py-2.5 rounded-xl border ${theme === 'dark' ? 'bg-zinc-800/50 border-zinc-700' : 'bg-zinc-50 border-zinc-200'}`}>
                        <p className="text-[10px] uppercase font-bold text-zinc-500 mb-0.5">Último Login</p>
                        <p className="text-sm font-bold mt-1.5">{new Date(selectedStudent.lastAccess).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex w-full justify-center sm:justify-start gap-3 mt-8">
                {isEditingStudent ? (
                  <>
                    <button onClick={() => setIsEditingStudent(false)} className={`flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold rounded-xl transition-colors ${theme === 'dark' ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300' : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-600'}`}><X size={16}/> Cancelar</button>
                    <button onClick={handleSaveStudentProfile} className={`flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold rounded-xl transition-all shadow-lg active:scale-95 bg-green-600 hover:bg-green-700 text-white`}><Save size={16}/> Salvar Perfil</button>
                  </>
                ) : (
                  <button onClick={() => {
                    setEditFullName(selectedStudent.fullName);
                    setEditBirthDate(selectedStudent.birthDate);
                    setEditPassword(selectedStudent.password || '');
                    setEditRole(selectedStudent.role);
                    setIsEditingStudent(true);
                  }} className={`flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold rounded-xl transition-all shadow-lg active:scale-95 bg-blue-600 hover:bg-blue-700 text-white`}><Edit2 size={16}/> Editar Perfil</button>
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
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-lg truncate">{result.sessionTitle}</h4>
                        <p className="text-sm text-zinc-400 flex items-center gap-2 mt-1">
                          <Clock size={14} className="shrink-0"/> <span className="truncate">{new Date(result.date).toLocaleString('pt-BR')}</span>
                        </p>
                      </div>
                      <div className="flex items-center gap-4 justify-between md:justify-end shrink-0 w-full md:w-auto">
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
          ) : activeTab === 'results' ? (
            <div className="space-y-8">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className={`p-5 rounded-2xl border ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-100'}`}>
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Total de Simulados</p>
                  <p className="text-3xl font-black mt-2">{results.length}</p>
                </div>
                <div className={`p-5 rounded-2xl border ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-100'}`}>
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Alunos Registrados</p>
                  <p className="text-3xl font-black mt-2">{students.length}</p>
                </div>
                <div className={`p-5 rounded-2xl border ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-100'}`}>
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Alunos Ativos</p>
                  <p className="text-3xl font-black mt-2">{new Set(results.map(r => r.uid)).size}</p>
                </div>
                <div className={`p-5 rounded-2xl border ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-100'}`}>
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Média Geral</p>
                  <p className="text-3xl font-black mt-2">
                    {results.length ? Math.round(results.reduce((acc, r) => acc + (r.score / r.total) * 100, 0) / results.length) : 0}%
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-bold text-lg border-b border-zinc-200 dark:border-zinc-800 pb-2">Últimos Simulados</h4>
                {results.length === 0 ? (
                  <p className="text-zinc-500">Nenhum simulado realizado.</p>
                ) : (
                  results.slice().reverse().slice(0, 10).map((result, i) => {
                    const studentInfo = students.find(s => s.uid === result.uid);
                    return (
                      <div key={i} className={`rounded-2xl border overflow-hidden ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-100 shadow-sm'}`}>
                        <div 
                          className="flex flex-col md:flex-row justify-between md:items-center gap-4 p-4 sm:p-5 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                          onClick={() => setExpandedResultIdx(expandedResultIdx === i ? null : i)}
                        >
                         <div className="flex items-center gap-4">
                           <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-zinc-200 dark:border-zinc-700 shrink-0">
                             {studentInfo?.profilePicture ? (
                               <img src={studentInfo.profilePicture} alt="" className="w-full h-full object-cover" />
                             ) : (
                               <div className={`w-full h-full flex items-center justify-center ${theme === 'dark' ? 'bg-zinc-800' : 'bg-zinc-100'}`}>
                                 <User size={20} className="text-zinc-500" />
                               </div>
                             )}
                           </div>
                           <div>
                             <h4 className="font-bold">{studentInfo?.fullName || 'Aluno Desconhecido'}</h4>
                             <p className="text-xs text-zinc-400 font-medium">
                               {result.sessionTitle} • {new Date(result.date).toLocaleString('pt-BR')}
                             </p>
                           </div>
                         </div>
                         <div className="flex items-center gap-4 justify-between md:justify-end shrink-0 w-full md:w-auto mt-2 md:mt-0">
                            <div className="flex gap-2">
                              <div className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-3 py-1 bg-opacity-50 border border-green-500/20 rounded-lg flex items-center gap-2">
                                <span className="text-[10px] font-black uppercase hidden sm:block">Acertos</span>
                                <span className="font-black text-sm">{result.score}</span>
                              </div>
                              <div className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 px-3 py-1 bg-opacity-50 border border-red-500/20 rounded-lg flex items-center gap-2">
                                <span className="text-[10px] font-black uppercase hidden sm:block">Erros</span>
                                <span className="font-black text-sm">{result.total - result.score}</span>
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
                    );
                  })
                )}
              </div>
            </div>
            ) : activeTab === 'students' ? (
              <div className="space-y-6">
                <h3 className="text-xl font-bold">{(currentUser?.role === 'masteradmin' || currentUser?.username === 'deiorbo') ? 'Gerenciar Usuários (Professores/Alunos)' : 'Gerenciar Alunos'}</h3>
                {students.length === 0 ? (
                  <p className="text-zinc-500">Nenhum aluno cadastrado.</p>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {students.map((student, i) => (
                      <div key={i} className={`p-4 sm:p-5 rounded-2xl flex flex-col justify-between border hover:border-blue-500/30 transition-all shadow-sm ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-100'}`}>
                        <div className="flex items-center gap-4 mb-4">
                           <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-zinc-200 dark:border-zinc-700 shrink-0">
                             {student.profilePicture ? (
                               <img src={student.profilePicture} alt={student.fullName} className="w-full h-full object-cover" />
                             ) : (
                               <div className={`w-full h-full flex items-center justify-center ${theme === 'dark' ? 'bg-zinc-800' : 'bg-zinc-100'}`}>
                                 <User size={20} className="text-zinc-500" />
                               </div>
                             )}
                           </div>
                           <div className="flex-1 min-w-0">
                              <h4 className="font-bold truncate text-sm sm:text-base">{student.fullName}</h4>
                              <p className="text-xs text-zinc-500 truncate">@{student.username}</p>
                           </div>
                        </div>

                        <div className="flex gap-2">
                          <button 
                             onClick={() => setSelectedStudent(student)}
                             className="flex-1 py-2 text-xs font-bold rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 transition-colors flex items-center justify-center gap-2"
                          >
                            <Eye size={14} /> Ver Perfil
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : activeTab === 'questions' ? (
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
                <div className="relative">
                  <input 
                    type="file" 
                    accept=".doc,.docx,.xls,.xlsx,.pdf,image/png,image/jpeg,image/webp,.txt" 
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={isUploading}
                  />
                  <button 
                    onClick={() => {
                        if (!moduleFilter) {
                           alert("Por favor, selecione um MÓDULO específico no filtro ao lado (Selecione a Matéria e então o Módulo) antes de enviar o arquivo de questões.");
                           return;
                        }
                        fileInputRef.current?.click();
                    }}
                    disabled={isUploading}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold ${isUploading ? 'bg-zinc-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'} text-white shadow-lg text-sm transition-colors`}
                  >
                    {isUploading ? (
                      <span className="flex items-center gap-2"><ArrowLeft size={16} className="animate-spin" /> Processando IA...</span>
                    ) : (
                      <span className="flex items-center gap-2"><Upload size={16} /> Importar Arquivo (IA)</span>
                    )}
                  </button>
                </div>
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                    <label className="text-xs font-bold uppercase text-zinc-500">Período</label>
                    <select 
                      className={`w-full p-2.5 rounded-xl border ${theme === 'dark' ? 'bg-zinc-800 border-zinc-700' : 'bg-zinc-50 border-zinc-200'}`}
                      value={newModule.period || 'P2'}
                      onChange={(e) => setNewModule({...newModule, period: e.target.value})}
                    >
                      <option value="P1">P1</option>
                      <option value="P2">P2</option>
                      <option value="P3">P3</option>
                      <option value="P4">P4</option>
                      <option value="P5">P5</option>
                      <option value="P6">P6</option>
                      <option value="P7">P7</option>
                      <option value="P8">P8</option>
                      <option value="P9">P9</option>
                      <option value="P10">P10</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-zinc-500">Chave Única</label>
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
                        <p className="text-xs text-zinc-500">
                           <span className="font-black text-purple-500 mr-2">{mod.period || 'P2'}</span>
                           {mod.moduleKey}
                        </p>
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
        ) : activeTab === 'subjects' ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold">Gerenciar Matérias</h3>
              <button 
                onClick={() => setShowAddSubject(!showAddSubject)}
                className={`px-4 py-2 rounded-xl font-bold bg-purple-600 text-white shadow-lg`}
              >
                {showAddSubject ? 'Fechar Formulário' : '+ Adicionar Matéria'}
              </button>
            </div>

            {showAddSubject && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className={`p-6 rounded-2xl border space-y-4 ${theme === 'dark' ? 'bg-zinc-900 border-zinc-700' : 'bg-white border-zinc-200 shadow-sm'}`}
              >
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-black text-purple-500 uppercase tracking-tighter">
                    {editingSubjectId ? 'Editar Matéria' : 'Nova Matéria'}
                  </h4>
                  {editingSubjectId && (
                    <button 
                      onClick={() => { setEditingSubjectId(null); setShowAddSubject(false); }}
                      className="text-xs text-zinc-500 hover:text-red-500 underline"
                    >
                      Cancelar Edição
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-zinc-500">ID / Chave Única (ex: anatomia, clinica)</label>
                    <input 
                      className={`w-full p-2.5 rounded-xl border ${theme === 'dark' ? 'bg-zinc-800 border-zinc-700' : 'bg-zinc-50 border-zinc-200'}`}
                      value={newSubject.id}
                      onChange={(e) => setNewSubject({...newSubject, id: e.target.value})}
                      disabled={!!editingSubjectId}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-zinc-500">Título</label>
                    <input 
                      className={`w-full p-2.5 rounded-xl border ${theme === 'dark' ? 'bg-zinc-800 border-zinc-700' : 'bg-zinc-50 border-zinc-200'}`}
                      value={newSubject.title}
                      onChange={(e) => setNewSubject({...newSubject, title: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-zinc-500">Ícone (Emoji, ex: 🧬, 🩺, 🦷)</label>
                    <input 
                      className={`w-full p-2.5 rounded-xl border ${theme === 'dark' ? 'bg-zinc-800 border-zinc-700' : 'bg-zinc-50 border-zinc-200'}`}
                      value={newSubject.icon}
                      onChange={(e) => setNewSubject({...newSubject, icon: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-zinc-500">Cor Hexadecimal (Opção, ex: #3b82f6)</label>
                    <input 
                      className={`w-full p-2.5 rounded-xl border ${theme === 'dark' ? 'bg-zinc-800 border-zinc-700' : 'bg-zinc-50 border-zinc-200'}`}
                      value={newSubject.color}
                      onChange={(e) => setNewSubject({...newSubject, color: e.target.value})}
                    />
                  </div>
                </div>

                <button 
                  onClick={handleAddSubject}
                  className="w-full py-3 rounded-xl font-bold bg-green-600 text-white shadow-xl"
                >
                  Salvar Matéria
                </button>
              </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {questionsData && Object.entries(questionsData).map(([subjKey, subj]: any) => (
                <div key={subjKey} className={`p-4 rounded-2xl border flex justify-between items-center ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{subj.icon}</span>
                    <div>
                      <p className="font-bold">{subj.title}</p>
                      <p className="text-xs text-zinc-500">Chave: {subjKey} • Módulos: {Object.keys(subj.modules).length}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                     <button onClick={() => handleEditSubject(subj, subjKey)} className="p-2 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white transition-all">
                       <Edit2 size={16} />
                     </button>
                     <button onClick={() => handleDeleteSubject(subjKey)} className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all">
                       <Trash2 size={16} />
                     </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : activeTab === 'settings' ? (
          <div className="space-y-6">
            <h3 className="text-xl font-bold">Configuração de Hospedagem (aaPanel)</h3>
            
            <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}>
              <h4 className="font-bold mb-4 flex items-center gap-2">
                <Globe size={18} className="text-blue-500" /> Domínio Principal: provas.deioinfo.com.br
              </h4>
              
              <div className="space-y-4 text-sm font-medium">
                <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                  <p className="font-bold text-blue-600 mb-1">Passo 1: Zona DNS da Cloudflare (ou provedor de domínio)</p>
                  <p>Aponte o domínio <strong>provas.deioinfo.com.br</strong> criando uma entrada do tipo <strong>A</strong> apontando para o IP do seu servidor: <strong>128.140.1.235</strong></p>
                  <p className="text-xs text-blue-500/70 mt-1">Dica: Se usar Cloudflare, deixe a nuvenzinha ligada (Proxied) para habilitar o SSL gratuitamente.</p>
                </div>

                <div className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/20">
                  <p className="font-bold text-orange-600 mb-1">Passo 2: Baixando os Arquivos para o Servidor</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Exporte o projeto usando a opção <strong>Export to GitHub</strong> ou <strong>Download ZIP</strong>.</li>
                    <li>No aaPanel, vá em <strong>Files</strong> e faça o upload/clone do projeto para <code>/www/wwwroot/provas.deioinfo.com.br</code></li>
                    <li><em>Não se esqueça de copiar o arquivo <code className="bg-orange-500/20 px-1 rounded">firebase-applet-config.json</code> se houver, pois ele guarda a conexão com o banco!</em></li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/20">
                  <p className="font-bold text-purple-600 mb-1">Passo 3: Configurando no Node.js Manager (aaPanel)</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Abra o <strong>App Store</strong> e encontre o <strong>Node.js Manager</strong>.</li>
                    <li>Clique em <strong>Add project</strong>.</li>
                    <li><strong>Project directory:</strong> <code>/www/wwwroot/provas.deioinfo.com.br</code></li>
                    <li><strong>Run command:</strong> <code>npm run build && npm run start</code> (ou apenas <code>npm run start</code> se já buildou).</li>
                    <li><strong>Port:</strong> <code>3000</code>.</li>
                    <li>Em <em>Domain</em>, coloque <code>provas.deioinfo.com.br</code> para o painel já criar o proxy reverso.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/20">
                  <p className="font-bold text-green-600 mb-1">Passo 4: Atualizando as Questões e o Visual</p>
                  <p className="mb-2"><strong>Questões e Simulados:</strong> Como usamos um banco Firebase externo, qualquer questão que você alterar neste painel atualizará para todos <strong>imediatamente</strong> sem precisar fazer deploy novamente.</p>
                  <p><strong>Atualizações de Código/Design:</strong></p>
                  <ol className="list-decimal list-inside space-y-1 text-zinc-500">
                    <li>Faça o export do código novo para o GitHub.</li>
                    <li>No aaPanel (Node.js Manager), vá no seu projeto configurado e clique em <strong>Git Pull</strong>.</li>
                    <li>Reinicie o App Node.js para que as novidades entrem no ar.</li>
                  </ol>
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-xl border border-dashed flex items-center justify-center gap-2 ${theme === 'dark' ? 'border-zinc-800 bg-zinc-900/50' : 'border-zinc-300 bg-zinc-50'}`}>
              <CheckCircle2 size={18} className="text-green-500" />
              <p className="text-zinc-600 dark:text-zinc-400 text-sm font-bold">Seu aplicativo está com arquitetura pronta para milhões de acessos devido ao Firestore Serverless.</p>
            </div>
          </div>
        ) : null}
        </div>
      </div>

      {deleteConfirmResult && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`w-full max-w-sm rounded-3xl overflow-hidden p-6 shadow-2xl ${theme === 'dark' ? 'bg-zinc-900 border border-zinc-800' : 'bg-white'}`}
          >
            <div className="w-12 h-12 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-4 mx-auto">
              <Trash2 size={24} />
            </div>
            <h3 className="text-xl font-bold text-center mb-2">Excluir Simulado?</h3>
            <p className="text-center text-sm text-zinc-500 dark:text-zinc-400 mb-6">
              Esta ação é permanente e removerá o simulado selecionado. Você tem certeza?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirmResult(null)}
                className={`flex-1 py-3 rounded-xl font-bold text-sm ${theme === 'dark' ? 'bg-zinc-800 hover:bg-zinc-700' : 'bg-zinc-100 hover:bg-zinc-200'} transition-colors`}
              >
                Cancelar
              </button>
              <button
                onClick={confirmDeleteResult}
                className="flex-1 py-3 rounded-xl font-bold text-sm bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/20 transition-all"
              >
                Excluir
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
