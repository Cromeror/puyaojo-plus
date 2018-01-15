module.exports = {
  development: {
    username: process.env.PGUSER || 'root',
    password: '/4dm1n*',
    database: 'jetsemani_clean',
    host: '127.0.0.1',
    dialect: 'mysql'
  },
  test: {
    username: process.env.PGUSER || 'root',
    password: null,
    database: 'jetsemani_clean2',
    host: '127.0.0.1',
    dialect: 'mysql'
  },
  production: {
    use_env_variable: 'POSTGRES_DB_URL',
    username: process.env.PGUSER || 'root',
    password: null,
    database: 'jetsemani_clean2',
    host: '127.0.0.1',
    dialect: 'mysql'
  }
};
