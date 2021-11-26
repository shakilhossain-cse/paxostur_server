const express = require("express");
const { MongoClient } = require("mongodb");
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;
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
    // connect database 
    await client.connect();
    const database = client.db("Paxos");
    const destinationCollection = database.collection("Destination");
    const bookingCollection = database.collection("BookedPlaces");
    // create a document to insert
    app.post("/adddestination", async (req, res) => {
      const destination = req.body;
      const result = await destinationCollection.insertOne(destination);
      res.json(result);
    });

    // get document from database
    app.get("/alldestination", async (req, res) => {
      const cursor = destinationCollection.find({});
      const destination = await cursor.toArray();
      res.json(destination);
    });

    app.delete("/destination/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await destinationCollection.deleteOne(query);
      res.json(result);
    });

    app.get("/destination/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const Destination = await destinationCollection.findOne(query);
      res.json(Destination);
    });

    // booking order user order
    app.post("/bookingplace", async (req, res) => {
      const ride = req.body;
      const result = await bookingCollection.insertOne(ride);
      res.json(result);
    });

    // specifiq user Place
    app.get("/bookingplace/:email", async (req, res) => {
      const email = req.params.email;
      const result = bookingCollection.find({ email: email });
      const order = await result.toArray();
      res.json(order);
    });

    // get document from database
    app.get("/allorders", async (req, res) => {
      const cursor = bookingCollection.find({});
      const order = await cursor.toArray();
      res.json(order);
    });

    // delete order item
    app.delete("/order/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await bookingCollection.deleteOne(query);
      res.json(result);
    });
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
