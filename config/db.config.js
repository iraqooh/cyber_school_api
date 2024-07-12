const db_config = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'cyber_school',
    dialect: 'mysql',
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000,
    }
};

// Export the pool for use in other parts of the application
module.exports = db_config;
