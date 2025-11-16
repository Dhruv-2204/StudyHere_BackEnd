var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');
var morgan = require('morgan');
const PORT = process.env.PORT || 3000;


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


app.get('/status', function(req, res) {
    res.json({ status: 'Server is running smoothly!' });
    res.end();
});

app.listen(PORT, function() {
    console.log(`Server is running on port http://localhost:${PORT}`);
});