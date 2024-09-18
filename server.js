const express = require('express')

const app = express()
const port = 3001

const db = require('./models')
const bodyParser = require('body-parser')
const cors = require('cors');
const cors_options = {
  origin: '*', // Allows all origins. For production, replace with specific domains.
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Specify the HTTP methods to allow
  allowedHeaders: ['Content-Type', 'Authorization', 'Access-Control-Allow-Origin'], // Specify allowed headers
};
app.use(cors(cors_options));

const populateDatabase = require('./models/populate')

app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extendend: true }));
app.use(cors(cors_options))


// Sample route to test database connection
app.get('/test-db', async (req, res) => {
  try {
    await db.sequelize.authenticate()
    res.json({ message: 'Connection has been established successfully.' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Sync database
db.sequelize.sync({ force: false }).then(async () => {
  console.log('Database synced')

  if (process.env.POPULATE_DATA === 'true') {
    await populateDatabase()
  }

  require('./routes')(app)

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
  })

}).catch((error) => {
  console.error('Unable to synchronize the database:', error)
})