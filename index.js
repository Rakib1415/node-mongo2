const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

// DataBase connection
const uri = process.env.DB_PATH;
let client = new MongoClient(uri, { useNewUrlParser: true });

app.get('/products', (req, res) => {
  client = new MongoClient(uri, { useNewUrlParser: true });
  client.connect(err => {
    const collection = client.db("onlineStore").collection("products");
    
    collection.find().toArray((err, documents) => {
      console.log('inserted...');
      if (err) {
        console.log(err);
      }
      else {
        res.send(documents);
      }
        
    })
    // perform actions on the collection object
    client.close();
  });
});

app.get('/product/:key', (req, res) => {
    const key = req.params.key;
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
      const collection = client.db("onlineStore").collection("products");
      
      collection.find({key}).toArray((err, documents) => {
        console.log('inserted...');
        if (err) {
          console.log(err);
        }
        else {
          res.send(documents[0]);
        }
          
      })
      // perform actions on the collection object
      client.close();
    });
})

app.post('/getProductByKey', (req, res) => {
  const key = req.params.key;
  const productKeys = req.body;
  client = new MongoClient(uri, { useNewUrlParser: true });
  client.connect(err => {
    const collection = client.db("onlineStore").collection("products");
    
    collection.find({key : {$in : productKeys}}).toArray((err, documents) => {
      console.log('inserted...');
      if (err) {
        console.log(err);
      }
      else {
        res.send(documents);
      }
        
    })
    // perform actions on the collection object
    client.close();
  });
})

// post 

app.post('/addProduct', (req, res) => {
  client = new MongoClient(uri, { useNewUrlParser: true });
  const product = req.body;
  client.connect(err => {
    const collection = client.db("onlineStore").collection("products");
    
    collection.insert(product, (err, result) => {
      console.log('inserted...');
      if (err) {
        console.log(err);
      }
      else {
        res.send(result.ops[0]);
      }
        
    })

    // perform actions on the collection object
    client.close();
  });
   
})

app.post('/placeOrder', (req, res) => {
  client = new MongoClient(uri, { useNewUrlParser: true });
  const orderDetails = req.body;
  orderDetails.orderTime = new Date();
  client.connect(err => {
    const collection = client.db("onlineStore").collection("orders");
    
    collection.insertOne(orderDetails, (err, result) => {
      console.log('inserted...');
      if (err) {
        console.log(err);
      }
      else {
        res.send(result.ops[0]);
      }
        
    })
    
    // perform actions on the collection object
    client.close();
  });
   
})


const port = process.env.PORT || 8800;

app.listen(port, () => console.log('Listen to port 8800'));
