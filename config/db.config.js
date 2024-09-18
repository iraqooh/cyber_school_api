const db_config = {
    host: 'localhost',
    user: 'root',
    password: 'kaspastinski',
    database: 'cyber_school',
    dialect: 'mysql',
    port: 3306,
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000,
    }
};

// Export the pool for use in other parts of the application
module.exports = db_config;
