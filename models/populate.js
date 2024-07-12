const Chance = require('chance');
const chance = new Chance();
const db = require('./index');

async function populateDatabase() {
  try {
    // Create 20 students
    const students = [];
    for (let i = 0; i < 20; i++) {
      const student = await db.Student.create({
        first_name: chance.first(),
        last_name: chance.last(),
        gender: chance.pickone(['M', 'F']),
        date_of_birth: chance.birthday({ string: true, year: chance.year({ min: 2004, max: 2010 }) }),
        parents_contact: chance.phone(),
        physical_address: chance.address(),
        category: chance.pickone(['Day', 'Boarding']),
        class: chance.pickone([
          'Primary 1', 'Primary 2', 'Primary 3', 'Primary 4', 'Primary 5', 'Primary 6', 'Primary 7',
          'Senior 1', 'Senior 2', 'Senior 3', 'Senior 4', 'Senior 5', 'Senior 6'
        ]),
        status: chance.bool()
      });
      students.push(student);
    }

    // Create random fees and payments for each student
    for (const student of students) {
      const fees = chance.integer({ min: 500000, max: 5000000 });
      await db.Finance.create({
        student_id: student.student_id,
        fees: fees,
      });

      let totalPayments = 0;
      const paymentsCount = chance.integer({ min: 0, max: 3 });
      for (let j = 0; j < paymentsCount; j++) {
        const remainingFees = fees - totalPayments;
        if (remainingFees <= 0) break;

        const paymentAmount = chance.integer({ min: 1, max: remainingFees });
        totalPayments += paymentAmount;

        await db.Payment.create({
          student_id: student.student_id,
          amount: paymentAmount,
        });
      }
    }

    console.log('Database populated with data');
  } catch (error) {
    console.error('Error populating the database:', error);
  }
}

module.exports = populateDatabase;
