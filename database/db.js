import { Sequelize } from 'sequelize';

const db = new Sequelize('database-app', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  port: '3307',
});

export default db;
