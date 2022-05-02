const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;


// _______ MIDDLEWARE _________
app.use(cors());
app.use(express.json());

// module: 68; video: 7
function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    console.log('inside verifyJWT', authHeader)
}


// _______________ CONNECTED TO THE MONGODB PROJECT __________
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ve8da.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


// ______________ CREATE API ____________
async function run() {
    try {
        // _________ CONNECTED TO THE MONGODB DATABASE ______
        await client.connect();
        const serviceCollection = client.db('geniusCar').collection('service');
        const orderCollection = client.db('geniusCar').collection('order');


        // get or find a data from mongodb database
        app.get('/service/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await serviceCollection.findOne(query);
            res.send(result);

        })


        // get or find multiple data from mongodb database
        app.get('/service', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        })


        // post data in my mongodb database
        app.post('/service', async (req, res) => {
            const newService = req.body;
            const result = await serviceCollection.insertOne(newService);
            res.send(result);
        })

        // delete data in my mongodb database
        app.delete('/service/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await serviceCollection.deleteOne(query);
            res.send(result);
        })





        // brand new collection to insert order data
        // insert data in my mongodb database
        app.post('/order', async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.send(result);
        })


        // get or find order data of user
        app.get('/order', async (req, res) => {
            const email = req.query.email;
            // console.log(email)
            const query = { email: email };
            const cursor = orderCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })




        // Token
        app.post('/login', async (req, res) => {
            const user = req.body;
            // console.log(user)
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
            res.send({ accessToken });
        })



    }
    finally {

    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Hello World Amena!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})