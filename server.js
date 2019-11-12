const express = require('express');
const app = express();
const port = 5000;

const Match = require('./Models/Match');



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});


app.get(`/`, (req,res) => {
	res.send('Home');
});


app.listen(port, ()=> console.log(`running on ${port}`));

