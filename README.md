# Cyber School Management System

Welcome to the Cyber School Management System repository! This project is designed to manage student information, school fees, and payments for a fictional school.

## Table of Contents

[Introduction](#introduction)

[Features](#features)

[Technologies Used](#technologies)

[Getting Started](#getstarted)

[Prerequisites](#prerequisites)

[Installation](#installation)

[Database Configuration](#configuration)

[Usage](#usage)

[Endpoints](#endpoints)

[Contributing](#contribute)

[License](#license)

[Authors](#authors)

## Introduction
<a name="introduction"></a>

The Cyber School Management System provides a backend API to manage student records, school fees, payments, and related operations. It includes endpoints for adding, retrieving, updating, and deleting student data, making payments, and fetching complex data analytics.

## Features
<a name="features"></a>

Student Management: CRUD operations for student records.
Financial Management: Track school fees, payments, and outstanding balances.
Analytics: Calculate total expected fees, total payments, percentage paid, and outstanding fees.
Flexible Endpoint: Fetch detailed student data including biodata, fees, payments, and outstanding fees in a single request.

## Technologies Used
<a name="technologies"></a>

Node.js

Express.js

Sequelize (ORM for MySQL)

MySQL

Joi (for data validation)

Other dependencies listed in package.json

## Getting Started
<a name="getstarted"></a>

To get a local copy up and running, follow these steps:

### Prerequisites
<a name="prerequisites"></a>

Node.js installed
MySQL database server

### Installation
<a name="installation"></a>

Clone the repository:

```git clone https://github.com/your-username/cyber-school.git```

```cd cyber-school```

### Install dependencies:
<a name="dependencies"></a>

```npm install```

### Database Configuration
<a name="configuration"></a>

Configure your database connection parameters in config/db.config.js.

## Usage
<a name="usage"></a>

Start the server:

Run ```npm run start:populate``` to automatically fill all the database tables with dummy data.

Run ```npm run start``` for the normal execution.

Access the API endpoints as described in Endpoints section.

## Endpoints
<a name="endpoints"></a>

POST /api/cyber_school/students: Add a new student.

GET /api/cyber_school/students: Find students by various query parameters.

PUT /api/cyber_school/students/:id Update a student by ID.

DELETE /api/cyber_school/students/:id Delete a student by ID.

POST /api/cyber_school/payments: Make a payment for a student.

GET /api/cyber_school/students-details: Fetch detailed student data including fees and payments.

GET /api/cyber_school/financials: Fetch school financial data (registered students count, total fees, total payments, percentage paid, outstanding fees).

Refer to routes.js and cyberschool.controller.js for detailed implementation of each endpoint.

## Contributing
<a name="contribute"></a>

Contributions are welcome! Please fork the repository and submit a pull request with your improvements.

## License
<a name="license"></a>

This project is licensed under the MIT License.

## Authors
<a name="authors"></a>

[Iraku Harry](https://github.com/iraqooh/)

[Atong Abraham Kur](https://github.com/Abram-MrRight)

[Akoldou Samuel](https://github.com/Akoldou)

[Ngong Abraham Kon](https://github.com/Ngongkon)

[Afiti Andrew](https://github.com/1efitiAnndrew)

[Geriga Sunday Drago](https://github.com/SundayDrago)

[Bill Cheptoyek](https://github.com/BILL-CHEPTOYEK)
