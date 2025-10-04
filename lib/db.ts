import mysql from 'mysql2/promise';

export const db = mysql.createPool({
  host: 'mysql.vps103344.mylogin.co',
  user: 'thomasrlee42_calllabs',
  password: 'qwerpoiu0042!!',
  database: 'thomasrlee42_calllabs',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
