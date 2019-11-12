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


app.get(`/home`, (req,res) => {
	res.send('Home');
});


app.get('/match', (req,res) => {
    Match.findAll({
        where: {
            id: 2000
        }
    }).then(result => {
        res.json(result)
    }).catch(err => res.send(`Error happened: ${err}`));
});

app.listen(port, ()=> console.log(`running on ${port}`));

