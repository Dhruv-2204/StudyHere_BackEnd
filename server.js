var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Sample route
app.get('/', function(req, res) {
    res.json({ message: 'Hello, World!' });
    
});

var PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
    console.log(`Server is running on port http://localhost:${PORT}`);
});