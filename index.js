const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

console.log(process.env.DB_USER);

app.get('/', (req, res) => {
  res.send('amake khuje pawa gese')
})

app.listen(port, () => {
  console.log(`Server listening on ${port}`);
})