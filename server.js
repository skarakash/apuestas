const express = require('express');

const mongoose = require('mongoose');
const routes = require('./routes/routes');

const app = express();
const port = 5000;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

app.use('/', routes);

mongoose.connect(
    'mongodb+srv://skarakash:highbury@handballstats-rylsw.mongodb.net/test?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
)
    .then(() => console.log('Mongo connected'))
    .catch(err => console.log(err));

app.listen(port, ()=> console.log(`running on ${port}`));

