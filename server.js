const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const routes = require('./routes/routes');

const { mongo_uri } = require('./config');

const app = express();
const port = 5000;


app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

app.use('/', routes); 


const startServer = () => {
    app.listen(port);
    console.log(`App started on port ${port}`)
};

const connectDb = () => {
    mongoose.Promise = require('bluebird');
    const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true
    };

    mongoose.connect(mongo_uri, options);
    mongoose.set('useCreateIndex', true);
    return mongoose.connection;
};


connectDb()
    .on('error', console.log)
    .on('disconnected', connectDb)
    .on('open', startServer)