const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9lqzgjv.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const toysCollection = client.db('allToys').collection('toys');

    // get method
    app.get('/allToys', async (req, res) => {
      const result = await toysCollection.find().toArray();
      console.log(result);
      res.send(result);
    })


    // post method
    app.post('/addToys', async (req, res) => {
      const add = req.body;
      console.log(add);
      const result = await toysCollection.insertOne(add);
      res.send(result);
    })

    // // update method
    app.put('/myToys/:id', async (req, res) => {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const updateToys = req.body;
      console.log(updateToys);
      const updateDoc = {
        $set:{
         ...updateToys
        }
      } 
      const result = await toysCollection.updateOne(filter, updateDoc)
      console.log({result});
      res.send(result)
    })

//     app.put('/myToys/:id', async (req, res) => {
 
//     const id = req.params.id;
//     const filter = { _id: new ObjectId(id) };
//     const updateToys = req.body;
//     console.log(updateToys);
//     const updateDoc = {
//       $set: { ...updateToys }
//     };
//     const result = await toysCollection.updateOne(filter, updateDoc);
//     console.log(result);
//     res.send(result);

//     // if (result.matchedCount === 1) {
//     //   res.status(200).json({ message: 'Toy updated successfully' });
//     // } else {
//     //   res.status(404).json({ message: 'Toy not found' });
//     // }

//   // catch (error) {
//   //   console.error(error);
//   //   res.status(500).json({ message: 'Internal server error' });
//   // }
// });




    // delete method  
    app.delete('/myToys/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await toysCollection.deleteOne(query);
      console.log(result);
      res.send(result);
    })





    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




console.log(process.env.DB_USER);

app.get('/', (req, res) => {
  res.send('amake khuje pawa gese')
})

app.listen(port, () => {
  console.log(`Server listening on ${port}`);
})