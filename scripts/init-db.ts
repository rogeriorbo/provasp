import knex from 'knex';
import dotenv from 'dotenv';

dotenv.config();

const db = knex({
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  },
});

async function init() {
  console.log('Iniciando criação de tabelas...');

  try {
    const hasUsers = await db.schema.hasTable('users');
    if (!hasUsers) {
      await db.schema.createTable('users', (table) => {
        table.string('uid').primary();
        table.string('username').unique().notNullable();
        table.string('password').notNullable();
        table.string('fullName').notNullable();
        table.string('birthDate');
        table.string('role').defaultTo('student');
        table.text('profilePicture');
        table.timestamp('lastAccess').defaultTo(db.fn.now());
      });
      console.log('Tabela "users" criada.');
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
        table.text('answersMap'); // Store as JSON string
      });
      console.log('Tabela "results" criada.');
    }

    // Create default admin if not exists
    const adminExists = await db('users').where({ username: 'deiorbo' }).first();
    if (!adminExists) {
        const bcrypt = await import('bcryptjs');
        const hashedPassword = await bcrypt.default.hash('Deio@2409', 10);
        await db('users').insert({
            uid: 'admin-1',
            username: 'deiorbo',
            password: hashedPassword,
            fullName: 'Rogerio Bastos de Oliveira',
            role: 'admin',
            birthDate: '1986-09-24'
        });
        console.log('Admin padrão criado: deiorbo');
    }

    console.log('Banco de dados inicializado com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('Erro ao inicializar banco de dados:', error);
    process.exit(1);
  }
}

init();
