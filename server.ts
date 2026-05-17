import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import cors from "cors";
import knex from "knex";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import multer from "multer";
import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import { periodDatabases } from "./src/data/questions";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

// Database Client
const dbConfig = {
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    charset: 'utf8mb4',
    connectTimeout: 10000, 
  },
  pool: { min: 0, max: 7 },
};

if (dbConfig.connection.host === 'estudos') {
  console.error("🚨 ERRO CRÍTICO: Você configurou o 'DB_HOST' como 'estudos'. O Host deve ser o IP (128.140.1.235). Verifique o menu Settings.");
}

const db = knex(dbConfig);

console.log(`[DB] Tentando conexão em: ${dbConfig.connection.host}:${dbConfig.connection.port}`);

async function bootstrap() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json({ limit: '50mb' }));

  const upload = multer({ dest: 'uploads/' });
  let ai: GoogleGenAI | null = null;
  if (process.env.GEMINI_API_KEY) {
    ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }

  // API Routes

  // Table Creation Helper
  const initDb = async () => {
    try {
      console.log(`[DB] Iniciando conexão...`);
      console.log(`[DB] Host: ${process.env.DB_HOST}`);
      console.log(`[DB] Banco: ${process.env.DB_NAME}`);
      console.log(`[DB] Usuário: ${process.env.DB_USER}`);

      const hasUsers = await db.schema.hasTable('users');
      if (!hasUsers) {
        await db.schema.createTable('users', (table) => {
          table.string('uid').primary();
          table.string('username').unique().notNullable();
          table.string('password').notNullable();
          table.string('fullName').notNullable();
          table.string('birthDate');
          table.string('role').defaultTo('student');
          table.text('profilePicture', 'longtext');
          table.timestamp('lastAccess').defaultTo(db.fn.now());
        });
        console.log('Tabela "users" criada com sucesso.');
      }

      // Criar admin padrão se o usuário deiorbo não existir
      const adminUser = await db('users').where({ username: 'deiorbo' }).first();
      
      if (!adminUser) {
        console.log('[DB] Administrador "deiorbo" não encontrado. Criando...');
        console.log('Banco de dados vazio. Criando administrador padrão...');
        const hashedPassword = await bcrypt.hash('Deio@2409', 10);
        await db('users').insert({
          uid: 'admin-01',
          username: 'deiorbo',
          password: hashedPassword,
          fullName: 'Rogerio Bastos de Oliveira',
          role: 'masteradmin',
          birthDate: '1986-09-24'
        });
        console.log('Administrador "deiorbo" criado com sucesso.');
      } else if (adminUser.role !== 'masteradmin') {
        await db('users').where({ username: 'deiorbo' }).update({ role: 'masteradmin' });
        console.log('Role de "deiorbo" atualizado para "masteradmin".');
      }

      const hasSubjects = await db.schema.hasTable('subjects');
      if (!hasSubjects) {
        await db.schema.createTable('subjects', (table) => {
          table.string('id').primary();
          table.string('title').notNullable();
          table.string('icon');
          table.string('color');
        });
        console.log('Tabela "subjects" criada com sucesso.');
      }

      const hasModules = await db.schema.hasTable('modules');
      if (!hasModules) {
        await db.schema.createTable('modules', (table) => {
          table.increments('id').primary();
          table.string('subjectId').references('id').inTable('subjects').onDelete('CASCADE');
          table.string('moduleKey').notNullable();
          table.string('title').notNullable();
          table.string('period').notNullable().defaultTo('P2');
          table.text('description');
          table.text('studyContent', 'longtext');
          table.string('videoUrl');
        });
        console.log('Tabela "modules" criada com sucesso.');
      } else {
        const hasPeriodCol = await db.schema.hasColumn('modules', 'period');
        if (!hasPeriodCol) {
          await db.schema.alterTable('modules', (table) => {
            table.string('period').notNullable().defaultTo('P2');
          });
          console.log('Coluna "period" adicionada à tabela "modules".');
        }
      }

      const hasQuestions = await db.schema.hasTable('questions');
      if (!hasQuestions) {
        await db.schema.createTable('questions', (table) => {
          table.increments('id').primary();
          table.integer('moduleId').unsigned().references('id').inTable('modules').onDelete('CASCADE');
          table.string('type').defaultTo('choice');
          table.text('question').notNullable();
          table.text('options', 'longtext'); // JSON stringified
          table.string('correct').notNullable();
          table.text('explanation');
          table.string('difficulty');
        });
        console.log('Tabela "questions" criada com sucesso.');
      }

      // Importar ou Sincronizar dados do banco de questões
      try {
        const sourceData = periodDatabases.p2; 
        
        console.log('[DB] Sincronizando banco de questões...');
        
        for (const [subjKey, subjData] of Object.entries(sourceData)) {
          // Verificar se matéria existe
          let subject = await db('subjects').where({ id: subjKey }).first();
          if (!subject) {
            await db('subjects').insert({
              id: subjKey,
              title: (subjData as any).title,
              icon: (subjData as any).icon,
              color: (subjData as any).color
            });
            console.log(`[DB] Matéria criada: ${subjKey}`);
          } else {
            // Update icon and title if they changed
            await db('subjects').where({ id: subjKey }).update({
              title: (subjData as any).title,
              icon: (subjData as any).icon,
              color: (subjData as any).color
            });
            console.log(`[DB] Matéria atualizada: ${subjKey} (Icon: ${(subjData as any).icon})`);
          }

          for (const [modKey, modData] of Object.entries((subjData as any).modules)) {
            // Verificar se módulo existe
            let module = await db('modules').where({ subjectId: subjKey, moduleKey: modKey }).first();
            let moduleId;
            
            if (!module) {
              const [id] = await db('modules').insert({
                subjectId: subjKey,
                moduleKey: modKey,
                title: (modData as any).title,
                description: (modData as any).description,
                studyContent: (modData as any).studyContent,
                videoUrl: (modData as any).videoUrl,
                period: 'P2'
              });
              moduleId = id;
              console.log(`[DB] Módulo criado: ${modKey} em ${subjKey}`);
            } else {
              moduleId = module.id;
            }

            // Sincronizar questões (apenas as que não existem via texto da pergunta)
            const baseQuestions = (modData as any).questions;
            for (const q of baseQuestions) {
              const existingQ = await db('questions').where({ 
                moduleId, 
                question: q.question 
              }).first();
              
              if (!existingQ) {
                await db('questions').insert({
                  moduleId,
                  type: q.type,
                  question: q.question,
                  options: JSON.stringify(q.options || []),
                  correct: q.correct,
                  explanation: q.explanation,
                  difficulty: q.difficulty
                });
              }
            }
          }
        }
        console.log('[DB] Sincronização concluída!');
      } catch (err) {
        console.error('[DB] Erro na sincronização:', err);
      }

      const hasResults = await db.schema.hasTable('results');
      if (!hasResults) {
        await db.schema.createTable('results', (table) => {
          table.increments('id').primary();
          table.string('uid').references('uid').inTable('users');
          table.string('username');
          table.timestamp('date').defaultTo(db.fn.now());
          table.string('sessionTitle');
          table.integer('score');
          table.integer('total');
          table.text('answersMap', 'longtext');
        });
        console.log('Tabela "results" criada com sucesso.');
      }
    } catch (e: any) {
      if (e.code === 'EAI_AGAIN' || e.code === 'ENOTFOUND') {
        console.error("ERRO DE CONEXÃO: O endereço do banco de dados (DB_HOST) está incorreto ou inacessível.");
      } else if (e.code === 'ER_ACCESS_DENIED_ERROR') {
        console.error("ERRO DE CONEXÃO: Usuário ou Senha do banco de dados estão incorretos.");
      } else {
        console.error("Erro ao inicializar banco de dados:", e);
      }
    }
  };
  
  // Health check
  app.get("/api/health", async (req, res) => {
    try {
      await db.raw('SELECT 1');
      res.json({ status: "ok", database: "connected" });
    } catch (e) {
      res.status(500).json({ status: "error", database: "disconnected" });
    }
  });

  // DB Debug info
  app.get("/api/db-status", async (req, res) => {
    try {
      const users = await db('users').count('uid as count').first();
      const questions = await db('questions').count('id as count').first();
      res.json({ 
        users: (users as any).count, 
        questions: (questions as any).count,
        host: dbConfig.connection.host,
        db: dbConfig.connection.database
      });
    } catch (e) {
      res.status(500).json({ error: "Could not query DB" });
    }
  });

  const checkTeacher = (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "Não autorizado" });
    
    try {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      if (decoded.role === 'teacher' || decoded.role === 'admin' || decoded.role === 'masteradmin') {
        req.user = decoded;
        next();
      } else {
        res.status(403).json({ message: "Acesso negado. Apenas professores podem realizar esta ação." });
      }
    } catch (e) {
      res.status(401).json({ message: "Sessão inválida" });
    }
  };

  // Auth: Me
  app.get("/api/auth/me", async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "Não autorizado" });
    
    try {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      const user = await db('users').where({ uid: decoded.uid }).first();
      if (!user) return res.status(404).json({ message: "Usuário não encontrado" });
      
      const { password, ...safeUser } = user;
      res.json(safeUser);
    } catch (e) {
      res.status(401).json({ message: "Token inválido" });
    }
  });

  // Auth: Login
  app.post("/api/auth/login", async (req, res) => {
    const { username, password } = req.body;
    try {
      const user = await db('users').where({ username }).first();
      if (!user) return res.status(401).json({ message: "Usuário não cadastrado" });

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) return res.status(401).json({ message: "Senha incorreta" });

      const token = jwt.sign({ uid: user.uid, role: user.role, username: user.username }, JWT_SECRET);
      res.json({ token, user: { ...user, password: Array(user.password.length).fill('*').join('') } });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro no servidor" });
    }
  });

  // Auth: Register
  app.post("/api/auth/register", async (req, res) => {
    const { username, password, fullName, birthDate } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const uid = Math.random().toString(36).substring(2, 15);
      
      await db('users').insert({
        uid,
        username,
        password: hashedPassword,
        fullName,
        birthDate,
        role: 'student',
        lastAccess: new Date()
      });

      const token = jwt.sign({ uid, role: 'student', username }, JWT_SECRET);
      res.json({ token, user: { uid, username, fullName, birthDate, role: 'student' } });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao registrar usuário. O nome de usuário pode já estar em uso." });
    }
  });

  // Users
  app.get("/api/users", async (req, res) => {
    try {
      const users = await db('users').select('uid', 'username', 'fullName', 'birthDate', 'role', 'lastAccess');
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar usuários" });
    }
  });

  app.put("/api/users/:uid", async (req, res) => {
    const { uid } = req.params;
    const { role, password, uid: bodyUid, ...rest } = req.body;
    
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "Não autorizado" });
    
    try {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      const isMaster = decoded.role === 'masteradmin' || decoded.username === 'deiorbo';
      const isSelf = decoded.uid === uid;

      if (!isMaster && !isSelf) {
        return res.status(403).json({ message: "Sem permissão" });
      }

      const updateData: any = { ...rest };
      
      // Remove campos que não devem ser atualizados via formulário simples ou pelo próprio usuário
      delete updateData.username;
      delete updateData.lastAccess;
      delete updateData.uid;

      // Se não for mestre, remover campos sensíveis de cargos
      if (!isMaster) {
        delete updateData.role;
      } else if (role) {
        updateData.role = role;
      }

      if (password) {
        updateData.password = await bcrypt.hash(password, 10);
      }

      await db('users').where({ uid }).update(updateData);
      res.json({ success: true });
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      res.status(401).json({ message: "Sessão inválida ou erro no servidor" });
    }
  });

  // Results
  app.get("/api/results", async (req, res) => {
    const { uid } = req.query;
    try {
      let query = db('results').select('*').orderBy('date', 'desc');
      if (uid) query = query.where({ uid });
      const results = await query;
      // Parse answersMap from string if it was stored as JSON string
      const parsedResults = results.map(r => ({
        ...r,
        answersMap: typeof r.answersMap === 'string' ? JSON.parse(r.answersMap) : r.answersMap
      }));
      res.json(parsedResults);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar resultados" });
    }
  });

  app.post("/api/results", async (req, res) => {
    const result = req.body;
    try {
      const dataToInsert = {
        ...result,
        answersMap: JSON.stringify(result.answersMap),
        date: new Date(result.date)
      };
      await db('results').insert(dataToInsert);
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao salvar resultado" });
    }
  });

  app.delete("/api/results/:id", async (req, res) => {
    const { id } = req.params;
    try {
      await db('results').where({ id }).delete();
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Erro ao excluir resultado" });
    }
  });

  // Subjects & Questions from DB
  app.get("/api/questions-data", async (req, res) => {
    try {
      const subjects = await db('subjects').select('*');
      const modules = await db('modules').select('*');
      const questions = await db('questions').select('*');

      // Reconstruct the structure similar to static questions.ts
      const database: any = {};

      for (const subj of subjects) {
        database[subj.id] = {
          ...subj,
          modules: {}
        };

        const subjModules = modules.filter(m => m.subjectId === subj.id);
        for (const mod of subjModules) {
          const modQuestions = questions
            .filter(q => q.moduleId === mod.id)
            .map(q => ({
              ...q,
              options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options
            }));

          database[subj.id].modules[mod.moduleKey] = {
            ...mod,
            questions: modQuestions
          };
        }
      }

      res.json(database);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao buscar banco de questões" });
    }
  });

  app.post("/api/questions", checkTeacher, async (req, res) => {
    const { moduleId, type, question, options, correct, explanation, difficulty } = req.body;
    try {
      await db('questions').insert({
        moduleId,
        type: type || 'choice',
        question,
        options: JSON.stringify(options || []),
        correct,
        explanation,
        difficulty
      });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Erro ao adicionar questão" });
    }
  });

  app.put("/api/questions/:id", checkTeacher, async (req, res) => {
    const { id } = req.params;
    const { type, question, options, correct, explanation, difficulty } = req.body;
    try {
      await db('questions').where({ id }).update({
        type,
        question,
        options: JSON.stringify(options || []),
        correct,
        explanation,
        difficulty
      });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Erro ao atualizar questão" });
    }
  });

  app.delete("/api/questions/:id", checkTeacher, async (req, res) => {
    const { id } = req.params;
    try {
      await db('questions').where({ id }).delete();
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Erro ao excluir questão" });
    }
  });

  app.post("/api/upload-questions", checkTeacher, upload.single('file'), async (req, res) => {
    try {
      if (!ai) {
         return res.status(500).json({ message: "Gemini AI não está configurado." });
      }
      const { moduleId } = req.body;
      if (!moduleId) {
         return res.status(400).json({ message: "moduleId é obrigatório." });
      }
      
      const file = req.file;
      if (!file) {
         return res.status(400).json({ message: "Nenhum arquivo enviado." });
      }

      console.log(`[Upload] Processando arquivo: ${file.originalname}`);

      // Usar a API FileManager do Gemini 
      const uploadResp = await ai.files.upload({
        file: file.path,
        mimeType: file.mimetype,
      });

      const prompt = `Você é um professor extraindo questões de um arquivo.
O usuário quer adicionar estas questões a um módulo do sistema.
Por favor, analise o documento fornecido e extraia TODAS as questões de múltipla escolha. Se houver outro tipo de questão, adapte para múltipla escolha.
CRÍTICO:
1. Retorne APENAS um JSON array.
2. Cada questão OBRIGATORIAMENTE DEVE TER EXATAMENTE 4 OPÇÕES DE RESPOSTA (1 correta e 3 erradas). NUNCA mais e NUNCA menos.
3. Não repita opções, cada uma das 4 opções deve ser única e diferente das outras.
4. O formato do array de objetos JSON deve ser EXATAMENTE:
[
  {
    "question": "texto da pergunta",
    "options": ["Opcao A", "Opcao B", "Opcao C", "Opcao D"],
    "correct": "texto exato da opcao correta (deve existir na lista de options)",
    "explanation": "Pequena explicacao da resposta certa",
    "difficulty": "Moderado"
  }
]
`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: [
            uploadResp,
            prompt
        ]
      });

      let text = response.text || '';
      text = text.replace(/```json/gi, '').replace(/```/g, '').trim();
      const newQs: any[] = JSON.parse(text);

      if (Array.isArray(newQs) && newQs.length > 0) {
           const inserts = newQs.map(q => ({
             moduleId: Number(moduleId),
             type: 'choice',
             question: q.question,
             options: JSON.stringify(q.options),
             correct: q.correct,
             explanation: q.explanation || '',
             difficulty: q.difficulty || 'Moderado'
           }));
           
           await db('questions').insert(inserts);
           res.json({ success: true, count: inserts.length });
      } else {
           res.status(400).json({ message: "Não foi possível extrair questões válidas do arquivo." });
      }
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ message: "Erro ao processar arquivo: " + error.message });
    } finally {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
    }
  });

  // Modules CRUD
  app.post("/api/modules", checkTeacher, async (req, res) => {
    const { subjectId, moduleKey, title, description, studyContent, videoUrl, period } = req.body;
    try {
      const [id] = await db('modules').insert({
        subjectId,
        moduleKey,
        title,
        description,
        studyContent,
        videoUrl,
        period: period || 'P2'
      });
      res.json({ success: true, id });
    } catch (error) {
      res.status(500).json({ message: "Erro ao criar módulo" });
    }
  });

  app.put("/api/modules/:id", checkTeacher, async (req, res) => {
    const { id } = req.params;
    const { title, description, studyContent, videoUrl, period } = req.body;
    try {
      await db('modules').where({ id }).update({
        title,
        description,
        studyContent,
        videoUrl,
        period: period || 'P2'
      });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Erro ao atualizar módulo" });
    }
  });

  app.delete("/api/modules/:id", checkTeacher, async (req, res) => {
    const { id } = req.params;
    try {
      await db('modules').where({ id }).delete();
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Erro ao excluir módulo" });
    }
  });

  app.put("/api/students/:uid/role", async (req, res) => {
    const { uid } = req.params;
    const { role } = req.body;
    
    // Apenas o masteradmin pode mudar cargos
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "Não autorizado" });
    
    try {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      if (decoded.role !== 'masteradmin' && decoded.username !== 'deiorbo') {
        return res.status(403).json({ message: "Apenas o usuário Master pode alterar cargos" });
      }

      await db('users').where({ uid }).update({ role });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Erro ao atualizar cargo" });
    }
  });

  // Subjects CRUD
  app.post("/api/subjects", checkTeacher, async (req, res) => {
    const { id, title, icon, color } = req.body;
    try {
      await db('subjects').insert({
        id,
        title,
        icon,
        color
      });
      res.json({ success: true, id });
    } catch (error) {
      res.status(500).json({ message: "Erro ao criar matéria" });
    }
  });

  app.put("/api/subjects/:id", checkTeacher, async (req, res) => {
    const { id } = req.params;
    const { title, icon, color } = req.body;
    try {
      await db('subjects').where({ id }).update({
        title,
        icon,
        color
      });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Erro ao atualizar matéria" });
    }
  });

  app.delete("/api/subjects/:id", checkTeacher, async (req, res) => {
    const { id } = req.params;
    try {
      await db('subjects').where({ id }).delete();
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Erro ao excluir matéria" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        allowedHosts: true
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
    // Initialize DB in background to avoid blocking port binding
    initDb().catch(err => {
      console.error('Failed to initialize database in background:', err);
    });
  });
}

bootstrap();
