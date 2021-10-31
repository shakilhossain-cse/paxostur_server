const express = require("express");
const { MongoClient } = require("mongodb");
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@shakil.qlmoh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("AmazingPark");
    const ridesCollection = database.collection("Rides");
    // create a document to insert
    app.post("/addride", async (req, res) => {
      const ride = req.body;
      const result = await ridesCollection.insertOne(ride);
      console.log(`A document was inserted with the _id: ${result.insertedId}`);
      res.json(result);
    });


    // get document from database
      app.get("/allride", async (req, res) => {
          const cursor = ridesCollection.find({});
          const rides = await cursor.toArray();
        
        
      // print a message if no documents were found
      if ((await cursor.count()) === 0) {
        console.log("No documents found!");
        }
        res.send(rides)
    });

    // app.delete("/ride/:id", async (req, res) => {
    //   const id = req.params.id;
    //   console.log(id);
    //   const query = { _id:ObjectId(id) };
    // const result = await ridesCollection.deleteOne(query);
    //   res.json(id)
    // })

    app.get("/ride/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id:ObjectId(id) };
      const Ride = await ridesCollection.findOne(query);
      res.json(Ride)
    })

  } finally {
    //   await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("hello world");
});

app.listen(port, () => {
  console.log("server started in ", port);
});
