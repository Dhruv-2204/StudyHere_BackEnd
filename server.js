var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');
var morgan = require('morgan');
// var dotenv = require('dotenv');
const path = require('path');
const PORT = process.env.PORT || 3000;
const {MongoClient} = require('mongodb');
// dotenv.config();

// MongoDb Connection URI
// const uri = dotenv.config().parsed.MONGO_URI;
// if (!uri) {
//   throw new Error('Missing MONGO_URI');
// }

// Load .env only in local development
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

// MongoDB Connection URI
const uri = process.env.MONGO_URI;

if (!uri) {
  throw new Error('Missing MONGO_URI environment variable');
}



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

// Serve images from the `images` directory using express.static
app.use('/images', express.static(path.join(__dirname, 'public/images'), {
    dotfiles: 'deny', //no dotfiles exposed
    index: false, 
    extensions: ['jpg','jpeg','png','gif','webp']
}));

// If static didn't find the file, respond with a JSON 404 for clarity
app.use('/images', (req, res) => {
    const filename = req.path.replace(/^\//, '');
    res.status(404).json({ error: 'Image not found', filename });
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
const routes = require('./routes'); // It is placed here and not at the top to avoid circular dependency issues
app.use('/api', routes);

// Start server
async function startServer() {
    await connectToDB();
    app.listen(PORT, function() {
        console.log(`Server is running on http://localhost:${PORT}/api`);
    });
}

startServer();