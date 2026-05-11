import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, User, Lock, Trophy, BookOpen, Target, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { loginUser, registerUser, UserProfile } from '../lib/api';

export function calculateAge(birthDate: string): number {
  if (!birthDate) return 0;
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

export function LoginScreen({ 
  onLogin, 
  onBack, 
  theme 
}: { 
  onLogin: (user: UserProfile) => void, 
  onBack?: () => void, 
  theme: string 
}) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [dbStatus, setDbStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  React.useEffect(() => {
    const checkDb = async () => {
      try {
        const res = await fetch('/api/health');
        if (res.ok) setDbStatus('online');
        else setDbStatus('offline');
      } catch {
        setDbStatus('offline');
      }
    };
    checkDb();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const user = await loginUser(username.toLowerCase(), password);
      onLogin(user);
    } catch (error: any) {
      console.error(error);
      setErrorMsg(error.message || "Usuário ou senha incorretos.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password || !fullName || !birthDate) {
        alert("Preencha todos os campos.");
        return;
    }

    setIsLoading(true);
    try {
      const user = await registerUser({
        username: username.toLowerCase().trim(),
        password,
        fullName,
        birthDate
      });
      onLogin(user);
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Erro ao criar conta. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-5xl mx-auto w-full mt-4 md:mt-8 space-y-6"
    >
      {onBack && (
        <button 
          onClick={onBack}
          className={`p-3 rounded-xl transition-colors inline-block ${theme === 'dark' ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-100' : 'bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-900'}`}
        >
          <ArrowLeft size={20} />
        </button>
      )}

      <div className={`grid md:grid-cols-2 rounded-[32px] overflow-hidden border ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-100 shadow-2xl shadow-blue-900/5'}`}>
        
        {/* Promotional Side */}
        <div className={`p-8 md:p-12 relative overflow-hidden flex flex-col justify-center ${theme === 'dark' ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
          <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl ${theme === 'dark' ? 'bg-blue-600/20' : 'bg-blue-400/20'} -translate-y-1/2 translate-x-1/2`} />
          <div className={`absolute bottom-0 left-0 w-64 h-64 rounded-full blur-3xl ${theme === 'dark' ? 'bg-indigo-600/20' : 'bg-indigo-400/20'} translate-y-1/2 -translate-x-1/2`} />
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest mb-6 border border-blue-500">
              <Trophy size={14} /> Plataforma Completa
            </div>
            
            <h2 className="text-3xl lg:text-4xl font-black mb-6 leading-tight">
              Acelere seu aprendizado com nossa plataforma.
            </h2>
            
            <div className="space-y-6">
              {[
                { icon: <BookOpen className="text-blue-500" size={24} />, title: "Módulos Didáticos", desc: "Material de apoio e aulas em vídeo para fixação." },
                { icon: <Target className="text-green-500" size={24} />, title: "Simulados Dinâmicos", desc: "Milhares de questões atualizadas de todas as matérias." },
                { icon: <CheckCircle2 className="text-orange-500" size={24} />, title: "Desempenho Detalhado", desc: "Acompanhe seus acertos e veja os gabaritos comentados." }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${theme === 'dark' ? 'bg-zinc-800' : 'bg-white shadow-sm'}`}>
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg leading-snug mb-1">{item.title}</h3>
                    <p className={`text-sm ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}`}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <p className={`mt-8 text-sm font-medium ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-500'}`}>
              Faça o login ao lado para ter <span className="font-bold">acesso VIP a todos os conteúdos</span>!
            </p>
          </div>
        </div>

        {/* Form Side */}
        <div className={`p-8 md:p-12 flex flex-col justify-center ${theme === 'dark' ? 'bg-zinc-900/60 z-10' : 'bg-white z-10'} relative`}>
          <div className="text-center mb-8 relative">
              <h2 className="text-2xl font-black mb-2">{mode === 'login' ? 'Entrar no sistema' : 'Criar nova conta'}</h2>
              <p className="text-zinc-500 font-medium">Acesse seu painel e continue aprendendo</p>
              
              <div className="absolute -top-10 right-0 flex items-center gap-1.5 px-2 py-1 rounded-full bg-black/5 dark:bg-white/5 border border-zinc-200 dark:border-zinc-800">
                <div className={`w-2 h-2 rounded-full ${dbStatus === 'online' ? 'bg-green-500' : dbStatus === 'offline' ? 'bg-red-500' : 'bg-zinc-400 animate-pulse'}`} />
                <span className="text-[10px] font-bold uppercase tracking-tight text-zinc-500">
                  {dbStatus === 'online' ? 'Servidor Online' : dbStatus === 'offline' ? 'Erro Conexão' : 'Checando...'}
                </span>
              </div>
          </div>
          
          <AnimatePresence mode="wait">
              {errorMsg && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-bold flex flex-col items-center gap-2"
                >
                  <p>{errorMsg}</p>
                  {errorMsg === "Usuário não cadastrado" && (
                    <button 
                      onClick={() => { setMode('register'); setErrorMsg(null); }}
                      className="text-xs underline hover:text-red-600"
                    >
                      Deseja criar uma conta agora?
                    </button>
                  )}
                </motion.div>
              )}
              {mode === 'login' ? (
                  <motion.form 
                      key="login"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      onSubmit={handleLogin} 
                      className="space-y-4"
                  >
                      <div>
                          <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">Login (Usuário)</label>
                          <div className="relative">
                              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                              <input
                                  type="text"
                                  value={username}
                                  onChange={(e) => setUsername(e.target.value)}
                                  placeholder="ex: deiorbo"
                                  className={`w-full pl-10 pr-4 py-3 rounded-xl border ${theme === 'dark' ? 'bg-zinc-800 border-zinc-700 focus:border-blue-500 text-white' : 'bg-zinc-50 border-zinc-200 focus:border-blue-500 text-black'} outline-none transition-colors`}
                                  required
                              />
                          </div>
                      </div>
                      <div>
                          <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">Senha</label>
                          <div className="relative">
                              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                              <input
                                  type={showPassword ? "text" : "password"}
                                  value={password}
                                  onChange={(e) => setPassword(e.target.value)}
                                  placeholder="Sua senha secreta"
                                  className={`w-full pl-10 pr-12 py-3 rounded-xl border ${theme === 'dark' ? 'bg-zinc-800 border-zinc-700 focus:border-blue-500 text-white' : 'bg-zinc-50 border-zinc-200 focus:border-blue-500 text-black'} outline-none transition-colors`}
                                  required
                              />
                              <button 
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 pointer-events-auto"
                              >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                              </button>
                          </div>
                      </div>
                      
                      <button
                          type="submit"
                          disabled={isLoading}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-colors mt-4 disabled:opacity-50"
                      >
                          {isLoading ? 'Verificando...' : 'Entrar'}
                      </button>
                      
                      <div className="text-center pt-4">
                          <button 
                              type="button"
                              onClick={() => { setMode('register'); setUsername(''); setPassword(''); }}
                              className="text-sm font-bold text-blue-600 hover:text-blue-700"
                          >
                              Ainda não tem conta? Criar agora.
                          </button>
                      </div>
                  </motion.form>
              ) : (
                  <motion.form 
                      key="register"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      onSubmit={handleRegister} 
                      className="space-y-4"
                  >
                      <div>
                          <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-1">Nome Completo</label>
                          <input
                              type="text"
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                              placeholder="Seu nome"
                              className={`w-full px-4 py-3 rounded-xl border ${theme === 'dark' ? 'bg-zinc-800 border-zinc-700 focus:border-blue-500 text-white' : 'bg-zinc-50 border-zinc-200 focus:border-blue-500 text-black'} outline-none transition-colors`}
                              required
                          />
                      </div>
                      <div>
                          <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-1">Data de Nascimento</label>
                          <input
                              type="date"
                              value={birthDate}
                              onChange={(e) => setBirthDate(e.target.value)}
                              className={`w-full px-4 py-3 rounded-xl border ${theme === 'dark' ? 'bg-zinc-800 border-zinc-700 focus:border-blue-500 text-white' : 'bg-zinc-50 border-zinc-200 focus:border-blue-500 text-black'} outline-none transition-colors`}
                              required
                          />
                      </div>
                      <div>
                          <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-1">Login (Usuário)</label>
                          <input
                              type="text"
                              value={username}
                              onChange={(e) => setUsername(e.target.value)}
                              placeholder="Como você quer acessar"
                              className={`w-full px-4 py-3 rounded-xl border ${theme === 'dark' ? 'bg-zinc-800 border-zinc-700 focus:border-blue-500 text-white' : 'bg-zinc-50 border-zinc-200 focus:border-blue-500 text-black'} outline-none transition-colors`}
                              required
                          />
                      </div>
                      <div>
                          <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-1">Senha</label>
                          <div className="relative">
                              <input
                                  type={showPassword ? "text" : "password"}
                                  value={password}
                                  onChange={(e) => setPassword(e.target.value)}
                                  placeholder="Crie uma senha"
                                  className={`w-full px-4 pr-12 py-3 rounded-xl border ${theme === 'dark' ? 'bg-zinc-800 border-zinc-700 focus:border-blue-500 text-white' : 'bg-zinc-50 border-zinc-200 focus:border-blue-500 text-black'} outline-none transition-colors`}
                                  required
                              />
                              <button 
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 pointer-events-auto"
                              >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                              </button>
                          </div>
                      </div>
                      
                      <button
                          type="submit"
                          disabled={isLoading}
                          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-xl transition-colors mt-4 disabled:opacity-50"
                      >
                          {isLoading ? 'Criando...' : 'Criar Conta'}
                      </button>
                      
                      <div className="text-center pt-4">
                          <button 
                              type="button"
                              onClick={() => { setMode('login'); setUsername(''); setPassword(''); }}
                              className="text-sm font-bold text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                          >
                              Já tem conta? Fazer login.
                          </button>
                      </div>
                  </motion.form>
              )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
