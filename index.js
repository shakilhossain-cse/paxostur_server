const express = require('express')
const cors = require('cors')
const { MongoClient } = require('mongodb');
require('dotenv').config();

const app = express()
const port =process.env.PORT || 5000

// middleware 
app.use(cors())
app.use(express.json())

// database connection 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@shakil.qlmoh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Your server is running at http://localhost:${port}`)
})