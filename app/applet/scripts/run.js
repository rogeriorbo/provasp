const fs = require('fs');

const loginPath = 'src/components/LoginScreen.tsx';
const originalContent = fs.readFileSync(loginPath, 'utf-8');

const replacement = `  return (
    <div className="flex-1 w-full h-full flex flex-col items-center justify-center p-4 relative min-h-[calc(100vh-80px)]">
      {/* Background Imagem */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1513258496099-48168024aec0?q=80&w=2670&auto=format&fit=crop')" }}
        />
        <div className={\`absolute inset-0 \${theme === 'dark' ? 'bg-zinc-950/80 backdrop-blur-[2px]' : 'bg-zinc-900/40 backdrop-blur-[2px]'}\`} />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        className={\`relative z-10 w-full max-w-sm sm:max-w-md p-8 sm:p-10 rounded-[32px] border \${theme === 'dark' ? 'bg-zinc-900/90 border-zinc-800 shadow-2xl shadow-black/50' : 'bg-white/95 border-white shadow-2xl shadow-blue-900/20'} backdrop-blur-xl\`}
      >
        {onBack && (
          <button 
            onClick={onBack}
            className={\`absolute top-6 left-6 p-2.5 rounded-xl transition-colors inline-block \${theme === 'dark' ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-100' : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-900'}\`}
          >
            <ArrowLeft size={18} />
          </button>
        )}

        <div className="text-center mb-8 relative pt-2">
            <h2 className="text-2xl sm:text-3xl font-black mb-2">{mode === 'login' ? 'Bem-vindo(a)' : 'Criar nova conta'}</h2>
            <p className={\`\${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'} font-medium text-sm sm:text-base\`}>
              {mode === 'login' ? 'Faça login para continuar' : 'Cadastre-se e comece a estudar'}
            </p>
            
            <div className="absolute -top-6 right-0 flex items-center gap-1.5 px-2 py-1 rounded-full bg-black/5 dark:bg-white/5 border border-zinc-200 dark:border-zinc-800 hidden sm:flex">
              <div className={\`w-2 h-2 rounded-full \${dbStatus === 'online' ? 'bg-green-500' : dbStatus === 'offline' ? 'bg-red-500' : 'bg-zinc-400 animate-pulse'}\`} />
              <span className="text-[10px] font-bold uppercase tracking-tight text-zinc-500">
                {dbStatus === 'online' ? 'Online' : dbStatus === 'offline' ? 'Erro' : 'Checando'}
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
                        <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">Login (Usuário)</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="ex: deiorbo"
                                className={\`w-full pl-10 pr-4 py-3 rounded-xl border \${theme === 'dark' ? 'bg-zinc-800 border-zinc-700 focus:border-blue-500 text-white' : 'bg-zinc-50 border-zinc-200 focus:border-blue-500 text-black'} outline-none transition-colors\`}
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
                                className={\`w-full pl-10 pr-12 py-3 rounded-xl border \${theme === 'dark' ? 'bg-zinc-800 border-zinc-700 focus:border-blue-500 text-white' : 'bg-zinc-50 border-zinc-200 focus:border-blue-500 text-black'} outline-none transition-colors\`}
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
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-lg shadow-blue-600/30 mt-6 disabled:opacity-50"
                    >
                        {isLoading ? 'Verificando...' : 'Entrar na Plataforma'}
                    </button>
                    
                    <div className="text-center pt-6">
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
                            className={\`w-full px-4 py-3 rounded-xl border \${theme === 'dark' ? 'bg-zinc-800 border-zinc-700 focus:border-blue-500 text-white' : 'bg-zinc-50 border-zinc-200 focus:border-blue-500 text-black'} outline-none transition-colors\`}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-1">Data de Nascimento</label>
                        <input
                            type="date"
                            value={birthDate}
                            onChange={(e) => setBirthDate(e.target.value)}
                            className={\`w-full px-4 py-3 rounded-xl border \${theme === 'dark' ? 'bg-zinc-800 border-zinc-700 focus:border-blue-500 text-white' : 'bg-zinc-50 border-zinc-200 focus:border-blue-500 text-black'} outline-none transition-colors\`}
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
                            className={\`w-full px-4 py-3 rounded-xl border \${theme === 'dark' ? 'bg-zinc-800 border-zinc-700 focus:border-blue-500 text-white' : 'bg-zinc-50 border-zinc-200 focus:border-blue-500 text-black'} outline-none transition-colors\`}
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
                                className={\`w-full px-4 pr-12 py-3 rounded-xl border \${theme === 'dark' ? 'bg-zinc-800 border-zinc-700 focus:border-blue-500 text-white' : 'bg-zinc-50 border-zinc-200 focus:border-blue-500 text-black'} outline-none transition-colors\`}
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
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-lg shadow-green-600/30 mt-6 disabled:opacity-50"
                    >
                        {isLoading ? 'Criando...' : 'Criar e Entrar'}
                    </button>
                    
                    <div className="text-center pt-6">
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
  );
\`;

const startIndex = originalContent.indexOf('  return (');
if (startIndex !== -1) {
  const newContent = originalContent.substring(0, startIndex) + replacement + '\n}\n';
  fs.writeFileSync(loginPath, newContent);
  console.log('LoginScreen updated!');
} else {
  console.log('Could not find return statement');
}
