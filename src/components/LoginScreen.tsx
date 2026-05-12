import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, User, Lock, Trophy, BookOpen, Target, CheckCircle2, Eye, EyeOff, Instagram, Facebook, Youtube, Linkedin } from 'lucide-react';
import { loginUser, registerUser, UserProfile } from '../lib/api';

import { Logo } from './Logo';
import { ParticleBackground } from './ParticleBackground';

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
    <div className="w-full h-screen flex flex-col relative overflow-hidden bg-black">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <ParticleBackground />
        {/* Main Background Image - with a more techy overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-60 transition-transform duration-[20s] animate-pulse-slow"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2670&auto=format&fit=crop')",
            transform: 'scale(1.1)'
          }}
        />
        
        {/* Animated Gradient Blobs */}
        <motion.div 
          animate={{ 
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/4 -right-1/4 w-[60%] h-[60%] rounded-full bg-blue-600/30 blur-[120px]"
        />
        <motion.div 
          animate={{ 
            x: [0, -80, 0],
            y: [0, 60, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-1/4 -left-1/4 w-[50%] h-[50%] rounded-full bg-indigo-600/20 blur-[100px]"
        />
        <motion.div 
          animate={{ 
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-950/10 blur-[80px]"
        />

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

        {/* Dimming Layer */}
        <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-zinc-950/80' : 'bg-blue-950/70'} backdrop-blur-[2px]`} />
      </div>

      {/* Floating Decorative Icons */}
      <div className="absolute inset-0 z-[5] pointer-events-none overflow-hidden">
        {[BookOpen, Target, Trophy, Lock].map((Icon, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0, 0.15, 0],
              scale: [0.8, 1.2, 0.8],
              x: [Math.random() * 20 - 10, Math.random() * 20 - 10],
              y: [Math.random() * 20 - 10, Math.random() * 20 - 10],
            }}
            transition={{ 
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: i * 2,
              ease: "easeInOut"
            }}
            className="absolute text-blue-400"
            style={{ 
              left: `${15 + Math.random() * 70}%`,
              top: `${15 + Math.random() * 70}%`,
            }}
          >
            <Icon size={32 + Math.random() * 24} strokeWidth={1} />
          </motion.div>
        ))}
      </div>

      <div className="flex-1 w-full flex flex-col lg:flex-row items-center justify-start lg:justify-center p-4 pt-10 sm:pt-12 lg:pt-16 lg:px-12 xl:px-24 relative gap-4 lg:gap-12 z-10 overflow-y-auto lg:overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative flex-1 max-w-2xl text-white text-center lg:text-left space-y-4 lg:space-y-6"
        >
            <Logo size="lg" className="mb-4 justify-center lg:justify-start" />
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black leading-tight max-w-xl mx-auto lg:mx-0 font-display">
                Acelere seu aprendizado com nossa plataforma.
              </h1>
          
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1 max-w-xl mx-auto lg:mx-0">
            <div className="space-y-1">
               <div className="flex items-center gap-3 justify-center lg:justify-start">
                 <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md">
                    <BookOpen className="text-blue-300" size={18} />
                 </div>
                 <h3 className="text-base lg:text-lg font-bold">Módulos Didáticos</h3>
               </div>
               <p className="text-white/70 text-xs sm:text-sm">Material de apoio e aulas em vídeo para fixação.</p>
            </div>
            
            <div className="space-y-1">
               <div className="flex items-center gap-3 justify-center lg:justify-start">
                 <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md">
                    <Target className="text-green-300" size={18} />
                 </div>
                 <h3 className="text-base lg:text-lg font-bold">Simulados Dinâmicos</h3>
               </div>
               <p className="text-white/70 text-xs sm:text-sm">Milhares de questões atualizadas de todas as matérias.</p>
            </div>

            <div className="space-y-1">
               <div className="flex items-center gap-3 justify-center lg:justify-start">
                 <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md">
                    <Trophy className="text-yellow-300" size={18} />
                 </div>
                 <h3 className="text-base lg:text-lg font-bold">Desempenho Detalhado</h3>
               </div>
               <p className="text-white/70 text-xs sm:text-sm">Acompanhe seus acertos e veja os gabaritos comentados.</p>
            </div>
          </div>

          <p className="text-sm font-medium text-white/80 pt-2 hidden lg:block">
            Faça o login ao lado para ter acesso VIP a todos os conteúdos
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          className={`relative w-full max-w-[340px] sm:max-w-[400px] shrink-0 p-6 sm:p-8 rounded-[32px] border ${theme === 'dark' ? 'bg-zinc-900/90 border-zinc-800 shadow-2xl shadow-black/50' : 'bg-white/95 border-white shadow-2xl shadow-blue-900/20'} backdrop-blur-xl`}
        >
          {onBack && (
            <button 
              onClick={onBack}
              className={`absolute top-6 left-6 p-2.5 rounded-xl transition-colors inline-block ${theme === 'dark' ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-100' : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-900'}`}
            >
              <ArrowLeft size={18} />
            </button>
          )}

          <div className="text-center mb-6 relative pt-0">
              <h2 className="text-2xl sm:text-3xl font-black mb-1">{mode === 'login' ? 'Bem-vindo(a)' : 'Criar nova conta'}</h2>
              <p className={`${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'} font-medium text-xs sm:text-sm`}>
                {mode === 'login' ? 'Faça login para continuar' : 'Cadastre-se e comece a estudar'}
              </p>
              
              <div className="absolute -top-6 right-0 flex items-center gap-1.5 px-2 py-1 rounded-full bg-black/5 dark:bg-white/5 border border-zinc-200 dark:border-zinc-800 hidden sm:flex">
                <div className={`w-2 h-2 rounded-full ${dbStatus === 'online' ? 'bg-green-500' : dbStatus === 'offline' ? 'bg-red-500' : 'bg-zinc-400 animate-pulse'}`} />
                <span className="text-[10px] font-bold uppercase tracking-tight text-zinc-500">
                  {dbStatus === 'online' ? 'Online' : dbStatus === 'offline' ? 'Erro' : 'Checando...'}
                </span>
              </div>
          </div>
          
          <AnimatePresence mode="wait">
              {errorMsg && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mb-6 p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-bold flex flex-col items-center gap-2"
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
                          <label className="block text-sm font-bold text-zinc-600 dark:text-zinc-200 mb-2">Login (Usuário)</label>
                          <div className="relative">
                              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                              <input
                                  type="text"
                                  value={username}
                                  onChange={(e) => setUsername(e.target.value)}
                                  placeholder="ex: username"
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
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg shadow-blue-600/30 mt-4 disabled:opacity-50"
                      >
                          {isLoading ? 'Verificando...' : 'Entrar na Plataforma'}
                      </button>
                      
                      <div className="text-center pt-4">
                          <button 
                              type="button"
                              onClick={() => { setMode('register'); setUsername(''); setPassword(''); }}
                              className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
                          >
                              Ainda não tem conta? Criar agora
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
                          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg shadow-green-600/30 mt-4 disabled:opacity-50"
                      >
                          {isLoading ? 'Criando...' : 'Criar e Entrar'}
                      </button>
                      
                      <div className="text-center pt-4">
                          <button 
                              type="button"
                              onClick={() => { setMode('login'); setUsername(''); setPassword(''); }}
                              className="text-sm font-bold text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
                          >
                              Já tem conta? Fazer login
                          </button>
                      </div>
                  </motion.form>
              )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Footer Addition */}
      <footer className="relative z-10 py-4 px-4 sm:px-8 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/5 bg-black/20 backdrop-blur-md">
        <div className="flex flex-col items-center sm:items-start gap-2">
          <div>
            <h4 className="text-white/80 font-black uppercase tracking-[0.3em] text-[10px] sm:text-xs">Déio Informática</h4>
            <p className="text-white/40 text-[9px] sm:text-xs italic font-medium select-none">O mundo em suas mãos!</p>
          </div>
          <div className="flex items-center gap-4 text-white/40">
            <a href="#" className="hover:text-blue-400 transition-colors"><Instagram size={14} /></a>
            <a href="#" className="hover:text-blue-600 transition-colors"><Facebook size={14} /></a>
            <a href="#" className="hover:text-red-500 transition-colors"><Youtube size={14} /></a>
            <a href="#" className="hover:text-blue-300 transition-colors"><Linkedin size={14} /></a>
          </div>
        </div>
        <div className="text-white/30 text-[10px] sm:text-xs font-medium text-center sm:text-right">
          © 2026 Déio Informática. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
}