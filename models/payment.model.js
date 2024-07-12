module.exports = (sequelize, DataTypes) => {
    const Payment = sequelize.define('payment', {
      payment_id: {
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
      amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
    }, {
      defaultScope: {
        attributes: { exclude: ['updatedAt'] },
      },
    });
  
    return Payment;
  };
  