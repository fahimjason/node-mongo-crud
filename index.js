const express = require('express');

const MongoClient = require('mongodb').MongoClient;
const objectId = require('mongodb').ObjectID

const uri = "mongodb+srv://firstProjectUser:4VKVfCRUtZPdjLAQ@cluster0.4i8kb.mongodb.net/firstprojectdb?retryWrites=true&w=majority";

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})


client.connect(err => {
    const collection = client.db("firstprojectdb").collection("items");
    //Read
    app.get('/items', (req, res) => {
        collection.find()
            .toArray((err, doc) => {
                res.send(doc);
            })
    })

    // Create an item
    app.post("/addItem", (req, res) => {
        const item = req.body;
        collection.insertOne(item)
            .then(result => {
                console.log('Item successfully Added')
                res.redirect('/');
            })
    })

    // Load single an item
    app.get('/item/:id', (req, res) => {
        collection.find({ _id: objectId(req.params.id) })
            .toArray((err, doc) => {
                res.send(doc[0]);
            })
    })


    // Update an item
    app.patch('/updateItem/:id', (req, res) => {
        collection.updateOne({ _id: objectId(req.params.id) },
            {
                $set: { price: req.body.price, quantity: req.body.quantity }
            })
            .then(result => {
                res.send(result.modifiedCount > 0);
            })
    })


    // Delete an item
    app.delete('/delete/:id', (req, res) => {
        collection.deleteOne({ _id: objectId(req.params.id) })
            .then(result => {
                res.send(result.deletedCount > 0)
            })
    })
});

app.listen(3000);