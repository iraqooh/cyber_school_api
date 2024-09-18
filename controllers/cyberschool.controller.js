const db = require('../models/index');
const { Op } = require('sequelize');
const Joi = require('joi');

// add a student
async function addStudent(req, res) {
    const studentSchema = Joi.object({
        first_name: Joi.string().required(),
        last_name: Joi.string().required(),
        gender: Joi.string().valid('M', 'F').default('M'),
        date_of_birth: Joi.date().max('now').required(),
        parents_contact: Joi.string().required(),
        physical_address: Joi.string().required(),
        category: Joi.string().valid('Day', 'Boarding').required(),
        class: Joi.string().required(),
        status: Joi.boolean().default(false),
        school_fees: Joi.number().positive().required(),
        initial_payment: Joi.number().positive()
      });

    try {
        const { error, value } = studentSchema.validate(
            req.body, { abortEarly: false }
        );

        if (error) {
            return res.status(400).json(
                { error: error.details.map(err => err.message) }
            );
        }

        const { school_fees, initial_payment, ...studentData } = value;

        const transaction = await db.sequelize.transaction();

        try {
            const newStudent = await db.Student.create(studentData, { transaction });

            await db.Finance.create({
                student_id: newStudent.student_id,
                fees: school_fees
            }, { transaction });
    
            if (initial_payment) {
            await db.Payment.create({
                student_id: newStudent.student_id,
                amount: initial_payment
            }, { transaction });
            }
    
            await transaction.commit();
    
            res.status(201).json(newStudent);

        } catch (error) {
            await transaction.rollback();
            throw error; // to be caught by outer try-catch block
        }

  } catch (error) {
    console.error('Error adding student:', error);
    res.status(500).json({ error: 'Failed to add student' });
  }
}

// Controller function to find a student by student_id
// async function findStudent(req, res) {
//   try {
//     const { 
//         id, first_name, last_name, 
//         physical_address, category, status, 
//         class: student_class, gender } = req.query;

//     const whereClause = {};

//     if (id) whereClause.student_id = id;
//     if (first_name) whereClause.first_name = { [Op.like]: `%${first_name}%` };
//     if (last_name) whereClause.last_name = { [Op.like]: `%${last_name}%` };
//     if (physical_address) whereClause.physical_address = { [Op.like]: `%${physical_address}%` };
//     if (category) whereClause.category = category;
//     if (status) whereClause.status = status;
//     if (student_class) whereClause.class = { [Op.like]: `%${student_class}%` };
//     if (gender) whereClause.gender = gender;

//     const students = await db.Student.findAll({
//         where: whereClause
//     });

//     if (!students || students.length === 0) {
//         return res.status(404).json({ error: 'No students found with the provided criteria' });
//     }

//     res.json(students);

//   } catch (error) {
//     console.error('Error finding students:', error);
//     res.status(500).json({ error: 'Failed to find students' });
//   }
// }

async function findStudent(req, res) {
  try {
    const { 
        id, first_name, last_name, 
        physical_address, category, status, 
        class: student_class, gender 
    } = req.query;

    const whereClause = {};

    if (id) whereClause.student_id = id;
    if (first_name) whereClause.first_name = { [Op.like]: `%${first_name}%` };
    if (last_name) whereClause.last_name = { [Op.like]: `%${last_name}%` };
    if (physical_address) whereClause.physical_address = { [Op.like]: `%${physical_address}%` };
    if (category) whereClause.category = category;
    if (status) whereClause.status = status;
    if (student_class) whereClause.class = { [Op.like]: `%${student_class}%` };
    if (gender) whereClause.gender = gender;

    const students = await db.Student.findAll({
      where: whereClause
    });

    const studentFees = await Promise.all(students.map(async (student) => {
      const fee = await db.Finance.findOne({
        where: { student_id: student.student_id}
      })
      const total_payments = await db.Payment.sum('amount', {
        where: { student_id: student.student_id}
      }) || 0
      const payments = await db.Payment.findAll({
        where: { student_id: student.student_id},
        attributes: ['payment_id', 'amount', 'createdAt']
      })
      return {
        ...student.dataValues,
        fees: fee.fees,
        total_payments: total_payments,
        outstanding_fees: fee.fees - total_payments,
        payments: payments
      };
    }))

    if (!students || students.length === 0) {
      return res.status(404).json({ error: 'No students found with the provided criteria' });
    }

    res.json(studentFees);
  } catch (error) {
    console.error('Error finding students:', error);
    res.status(500).json({ error: 'Failed to find students' });
  }
}


// update a student by student_id
async function updateStudent(req, res) {
    const studentSchema = Joi.object({
        first_name: Joi.string(),
        last_name: Joi.string(),
        gender: Joi.string().valid('M', 'F'),
        date_of_birth: Joi.date().max('now'),
        parents_contact: Joi.string(),
        physical_address: Joi.string(),
        category: Joi.string().valid('Day', 'Boarding'),
        class: Joi.string(),
        status: Joi.boolean()
    });

    try {
        const studentId = req.params.id;
        const { error, value } = studentSchema.validate(req.body, { abortEarly: false });

        if (error) {
            return res.status(400).json({ error: error.details.map(err => err.message) });
        }

        const { school_fees, initial_payment, ...studentData } = value;

        const student = await db.Student.findByPk(studentId);

        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        const transaction = await db.sequelize.transaction();

        try {
            await student.update(studentData, { transaction });

            await transaction.commit();

            res.json(student);
            
        } catch (error) {
            await transaction.rollback();
            throw error; // to be caught by outer try-catch block
        }

    } catch (error) {
        console.error('Error updating student:', error);
        res.status(500).json({ error: 'Failed to update student' });
    }
}

// delete a student by student_id
async function deleteStudent(req, res) {
  try {
    const studentId = req.params.id;

    const student = await db.Student.findByPk(studentId);

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    await student.destroy();

    res.status(204).end();

  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ error: 'Failed to delete student' });
  }
}

// Controller function to make a payment
async function makePayment(req, res) {
    try {
      const { student_id, amount } = req.body;
  
      // Find student by student_id
      const student = await db.Student.findByPk(student_id);
  
      if (!student) {
        return res.status(404).json({ error: 'Student not found' });
      }
  
      // Find outstanding fees for the student
      const finances = await db.Finance.findOne({
        where: { student_id: student_id }
      });
  
      if (!finances) {
        return res.status(404).json({ error: 'Financial records not found for the student' });
      }
  
      const { fees } = finances;
  
      // Check if amount to be paid exceeds outstanding fees
      if (amount > fees) {
        return res.status(400).json({ error: 'Payment amount exceeds outstanding fees' });
      }
  
      // Create payment record
      const newPayment = await db.Payment.create({
        student_id: student_id,
        amount: amount
      });
  
      res.status(201).json(newPayment);

    } catch (error) {
      console.error('Error making payment:', error);
      res.status(500).json({ error: 'Failed to make payment' });
    }
}

// Controller function to fetch complex data
async function getSchoolFinancialData(req, res) {
    try {
      // Number of registered students
      const registeredStudentsCount = await db.Student.count();
  
      // Total expected fees from all registered students
      const totalExpectedFees = await db.Finance.sum('fees');
  
      // Total payments from all registered students
      const totalPayments = await db.Payment.sum('amount');
  
      // Calculate percentage of total expected fees paid
      const percentagePaid = (totalPayments / totalExpectedFees) * 100 || 0;
  
      // Calculate outstanding fees
      const outstandingFees = totalExpectedFees - totalPayments;
  
      // Prepare response object
      const complexData = {
        registeredStudentsCount,
        totalExpectedFees: totalExpectedFees || 0,
        totalPayments: totalPayments || 0,
        percentagePaid,
        outstandingFees: outstandingFees || 0
      };
  
      res.json(complexData);

    } catch (error) {
      console.error('Error fetching complex data:', error);
      res.status(500).json({ error: 'Failed to fetch complex data' });
    }
}

// Controller function to fetch detailed student data
async function getStudentDetails(req, res) {
    try {
      // Fetch all students with their finance details (fees)
      const students = await db.Student.findAll({
        include: [
          {
            model: db.Finance,
            attributes: ['fees'],
            required: true // only students with finance records
          },
          {
            model: db.Payment,
            attributes: ['payment_id', 'amount', 'createdAt'],
            required: false // fetch students even if they have no payments
          }
        ]
      });
  
      // Format the response
      const detailedStudents = students.map(student => ({
        student_id: student.student_id,
        first_name: student.first_name,
        last_name: student.last_name,
        gender: student.gender,
        date_of_birth: student.date_of_birth,
        parents_contact: student.parents_contact,
        physical_address: student.physical_address,
        category: student.category,
        class: student.class,
        status: student.status,
        school_fees: student.finances[0].fees,
        total_payments: student.payments.reduce((total, payment) => total + payment.amount, 0),
        payments: student.payments.map(payment => ({
            payment_id: payment.payment_id,
            amount: payment.amount,
            createdAt: payment.createdAt
        })),
        outstanding_fees: student.finances[0].fees - student.payments.reduce((total, payment) => total + payment.amount, 0)
      }));
  
      res.json(detailedStudents);

    } catch (error) {
      console.error('Error fetching detailed student data:', error);
      res.status(500).json({ error: 'Failed to fetch detailed student data' });
    }
}

// Controller function to fetch detailed payment data
async function getPaymentDetails(req, res) {
  try {
    // Fetch all students with their finance and payment details
    const students = await db.Student.findAll({
      include: [
        {
          model: db.Finance,
          attributes: ['fees'],
          required: true // only students with finance records
        },
        {
          model: db.Payment,
          attributes: ['payment_id', 'amount', 'createdAt'],
          required: true // only students with payment records
        }
      ]
    });

    // Format the response
    const detailedPayments = students.flatMap(student =>
      student.payments.map(payment => ({
        payment_id: payment.payment_id,
        amount: payment.amount,
        createdAt: payment.createdAt,
        student: {
          student_id: student.student_id,
          first_name: student.first_name,
          last_name: student.last_name,
          gender: student.gender,
          date_of_birth: student.date_of_birth,
          parents_contact: student.parents_contact,
          physical_address: student.physical_address,
          category: student.category,
          class: student.class,
          status: student.status,
          school_fees: student.finances[0].fees,
          total_payments: student.payments.reduce((total, pay) => total + pay.amount, 0),
          outstanding_fees: student.finances[0].fees - student.payments.reduce((total, pay) => total + pay.amount, 0)
        }
      }))
    );

    res.json(detailedPayments);

  } catch (error) {
    console.error('Error fetching detailed payment data:', error);
    res.status(500).json({ error: 'Failed to fetch detailed payment data' });
  }
}


module.exports = {
  addStudent,
  findStudent,
  updateStudent,
  deleteStudent,
  makePayment,
  getSchoolFinancialData,
  getStudentDetails,
  getPaymentDetails
};
