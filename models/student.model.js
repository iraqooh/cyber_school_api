module.exports = (sequelize, DataTypes) => {
    const Student = sequelize.define('student', {
      student_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      gender: {
        type: DataTypes.ENUM('M', 'F'),
        defaultValue: 'M',
      },
      date_of_birth: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      parents_contact: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      physical_address: {
        type: DataTypes.STRING
      },
      category: {
        type: DataTypes.ENUM('Day', 'Boarding'),
        allowNull: false,
      },
      class: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    });
  
    return Student;
  };
  