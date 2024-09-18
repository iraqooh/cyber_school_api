module.exports = app => {
    var router = require("express").Router();

    const cyberschoolController = require('./controllers/cyberschool.controller');

    // add a student
    router.post('/students', cyberschoolController.addStudent);

    // find a student by student_id
    router.get('/students', cyberschoolController.findStudent);

    // update a student by student_id
    router.put('/students/:id', cyberschoolController.updateStudent);

    // delete a student by student_id
    router.delete('/students/:id', cyberschoolController.deleteStudent);

    // make a payment
    router.post('/payments', cyberschoolController.makePayment);

    // fetch school financial data
    router.get('/financials', cyberschoolController.getSchoolFinancialData);

    // fetch detailed student data
    router.get('/students-details', cyberschoolController.getStudentDetails);

    // fetch detailed payment data
    router.get('/payments-details', cyberschoolController.getPaymentDetails);

    app.use('/api/cyber_school', router)
}
