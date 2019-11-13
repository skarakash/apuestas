const express = require('express');
const request = require('request');
const { token } = require('./config');
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


app.post('/allData', (req,res) => {
    const requestData = req.body;
    if (Object.getOwnPropertyNames(requestData).length > 0) {
        Match.findAll({
            where: requestData
        }).then(result => {
            res.json(result)
        }).catch(err => res.send(`Error happened: ${err}`));
    } else {
        res.json([])
    }
});

app.post('/byDate', (req,res) => {
    const url = `https://api.betsapi.com/v2/events/ended?sport_id=78&token=${token}&day=${req.body.date}&league_id=${req.body.league_id}`;
    if (req.body.date.length === 8){
        request(
            { url },
            (error, response, body) => {
                if (error || response.statusCode !== 200) {
                    return res.status(500).json({ type: 'error', message: err.message });
                }

                res.json(JSON.parse(body));
            }
        )
    } else {
        res.json("Not valid date format")
    }
});

app.post('/byId', (req,res) => {
   const url = `https://api.betsapi.com/v1/event/view?token=${token}&event_id=${req.body.id}`;
    request(
        { url },
        (error, response, body) => {
            if (error || response.statusCode !== 200) {
                return res.status(500).json({ type: 'error', message: err.message });
            }

            res.json(JSON.parse(body));
        }
    )
});

app.listen(port, ()=> console.log(`running on ${port}`));

