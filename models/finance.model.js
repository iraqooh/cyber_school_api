module.exports = (sequelize, DataTypes) => {
    const Finance = sequelize.define('finance', {
      finance_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      student_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'students',
          key: 'student_id',
        },
      },
      fees: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
    }, {
      defaultScope: {
        attributes: { exclude: ['finance_id', 'createdAt', 'updatedAt'] },
      },
    });
  
    return Finance;
  };
  