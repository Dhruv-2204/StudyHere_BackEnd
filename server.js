var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');
var morgan = require('morgan');
var dotenv = require('dotenv');
const PORT = process.env.PORT || 3000;
const {MongoClient} = require('mongodb');
const routes = require('./routes');

dotenv.config();

// MongoDb Connection URI
const uri = dotenv.config().parsed.MONGO_URI;
const client = new MongoClient(uri);
let db;

// Connect to MongoDB
async function connectToDB() {
    try {
        await client.connect();
        db = client.db('LessonShop');
        console.log('Connected to MongoDB successfully');
    } catch (err) {
        console.error('Failed to connect to MongoDB', err);
    }
};

function getDatabase() {
    return db;
}

// Initialize DB connection
module.exports = { getDatabase};

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));


//Middleware
app.use(cors());
app.use(express.json()); 
app.use(morgan('dev'));

// Sample route
app.get('/', function(req, res) {
    res.json({ message: 'Hello, World!' });
    res.end();
    
});

// load something from db to test
app.get('/lessons', async function(req, res) {
    try {
        const lessonsCollection = getDatabase().collection('lessons');
        const lessons = await lessonsCollection.find({}).toArray();
        res.json(lessons);
    } catch (err) {
        console.error('Error fetching lessons:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    res.end();
});


app.get('/status', function(req, res) {
    res.json({ status: 'Server is running smoothly!' });
    res.end();
});

// Use routes
app.use('/api', routes);

// Start server
async function startServer() {
    await connectToDB();
    app.listen(PORT, function() {
        console.log(`Server is running on http://localhost:${PORT}/api`);
    });
}

startServer();