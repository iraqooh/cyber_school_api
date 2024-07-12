const { Sequelize, DataTypes } = require('sequelize');
const db_config = require('../config/db.config')

const sequelize = new Sequelize(db_config.database, db_config.user, db_config.password, {
    host: db_config.host,
    port: db_config.port,
    dialect: db_config.dialect,
    pool: db_config.pool,
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.Student = require('./student.model.js')(sequelize, DataTypes);
db.Finance = require('./finance.model.js')(sequelize, DataTypes);
db.Payment = require('./payment.model.js')(sequelize, DataTypes);

db.Student.hasMany(db.Finance, { foreignKey: 'student_id' });
db.Finance.belongsTo(db.Student, { foreignKey: 'student_id' });
db.Student.hasMany(db.Payment, { foreignKey: 'student_id' });
db.Payment.belongsTo(db.Student, { foreignKey: 'student_id' });

module.exports = db;
