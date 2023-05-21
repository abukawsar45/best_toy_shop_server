const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());



// const uri = 'mongodb://0.0.0.0:27017/'
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
      // console.log(result);
      res.send(result);
    })
    app.get('/allToysWithLimit', async (req, res) => {
      const result = await toysCollection.find().limit(20).toArray();
      // console.log(result);
      res.send(result);
    })
//  
    // app.get('/myToys/:email', async (req, res) => {
      // console.log(req.params.email);
    //   const result = await toysCollection.find({ postBy: req.params.email }).toArray(); 
    //   res.send(result)
    // })
app.get('/myToys/:email', async (req, res) => {
  const email = req.params.email;
  const sortBy = req.query.sortBy || 'ascending'; // Default to ascending order if sortBy parameter is not provided

  let sortOption;
  if (sortBy === 'descending') {
    sortOption = { price: -1 }; // Sort by price in descending order
  } else {
    sortOption = { price: 1 }; // Sort by price in ascending order
  }

  try {
    const result = await toysCollection
      .find({ postBy: email })
      .sort(sortOption)
      .toArray();

    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});



    app.get('/allToys/:id',async (req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await toysCollection.findOne(query);
      // console.log(result);
      res.send(result)

    })

    app.get('/Carnameby/:name',async (req, res) =>{
      const name = req.params.name.toLocaleLowerCase();
      
      const result = await toysCollection.find({ carName: { $regex: name, $options: "i" } }).toArray();
      res.send(result)
    })

app.get('/subCategoryName/:searchSubCategory', async (req, res) => {
  const searchSubCategory = req.params.searchSubCategory; 
  // console.log(searchSubCategory);

  const regex = new RegExp(`^${searchSubCategory}$`, 'i'); 

  const result = await toysCollection.find({ subCategory: { $regex: regex } }).toArray();

  if (result.length === 0) {
    // Handle invalid category here
    const allResults = await toysCollection.find({}).toArray();
    return res.send(allResults);
  }

  // console.log(result);
  return res.send(result);
});

    // post method
    app.post('/addToys', async (req, res) => {
      const add = req.body;
      add.postedTime = new Date()
      // console.log(add);
      const result = await toysCollection.insertOne(add);
      res.send(result);
    })

    // // update method
    app.put('/myToys/:id', async (req, res) => {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const updateToys = req.body;
      // console.log(updateToys);
      const updateDoc = {
        $set:{
         ...updateToys
        }
      } 
      const result = await toysCollection.updateOne(filter, updateDoc)
      // console.log({result});
      res.send(result)
    })


    // delete method  
    app.delete('/myAllToys/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await toysCollection.deleteOne(query);
      // console.log(result);
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




// console.log(process.env.DB_USER);

app.get('/', (req, res) => {
  res.send('Server connected')
})

app.listen(port, () => {
  // console.log(`Server listening on ${port}`);
})