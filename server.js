const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const routes = require('./routes/routes');

const app = express();
const port = 5000;


app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

app.use('/', routes); 

mongoose.connect(
    'mongodb+srv://serg_ka:highbury@apuestas-ysqq3.mongodb.net/Stats?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
)
    .then(() => console.log('Mongo connected'))
    .catch(err => console.log(err));

app.listen(port, ()=> console.log(`running on ${port}`));

