const express = require('express');
const router = express.Router();
const Match = require('../Models/Match');
const Bet = require('../Models/Bet');
const request = require('request');
const { token } = require('../config');
const Game = require('../Models/Game');



router.post('/allData', (req,res) => {
    const requestData = req.body;
    if (Object.getOwnPropertyNames(requestData).length > 0) {
        Match.findAll({
            where: requestData
        }).then(result => {
            res.json(result)
        }).catch(error => res.send(`Error happened: ${error}`));
    } else {
        res.json([])
    }
});



router.post('/byDate', (req,res) => {
    const url = `https://api.betsapi.com/v2/events/ended?sport_id=78&token=${token}&day=${req.body.date}&league_id=${req.body.league_id}`;
    if (req.body.date.length === 8){
        request(
            { url },
            (error, response, body) => {
                if (error || response.statusCode !== 200) {
                    return res.status(500).json({ type: 'error', message: error });
                }

                res.json(JSON.parse(body));
            }
        )
    } else {
        res.json("Not valid date format")
    }
});

router.post('/byId', (req,res) => {
    const url = `https://api.betsapi.com/v1/event/view?token=${token}&event_id=${req.body.id}`;
    request(
        { url },
        (error, response, body) => {
            if (error || response.statusCode !== 200) {
                return res.status(500).json({ type: 'error', message: error });
            }
            res.json(JSON.parse(body));
        }
    )
});

router.get('/live', (req,res) => {
    const url = `https://api.betsapi.com/v1/events/inplay?sport_id=78&token=${token}`;
    const p = new Promise((resolve, reject) => {
        request({url}, (error, response, body) => {
            if (error || response.statusCode !== 200) {
                return reject(error)
            }
            try {
                resolve(JSON.parse(body))
            } catch (e) {
                reject(e)
            }
        })
    });

    p.then(
        data => {
            let games = data.results.filter(game => Number(game.timer.tm) >= 40);
            res.json(games);
        }
    ).catch(err => res.json(err));
});

router.post('/odds', (req,res) => {
    const url = `https://api.betsapi.com/v2/event/odds?token=${token}&event_id=${req.body.id}&source=bet365&odds_market=3`;
    request(
        { url },
        (error, response, body) => {
            if (error || response.statusCode !== 200) {
                return res.status(500).json({ type: 'error', message: error });
            }
            res.json(JSON.parse(body));
        }
    )
});


router.post('/insertBet', (req, res) => {
    Bet.findOrCreate({ where : req.body.obj})
        .spread((match, created) => {
            console.log(created);
        }).then(match => {
        res.json('ok');
    }).catch(err => {
        res.json(err)
    })
});



router.post('/insert', async (req,res) => {
    const saved = await Game.insertMany(req.body);
    res.json(saved)
});


router.post('/getdata', async (req,res) => {
    try {
        const saved = await Game.find(req.body);
        res.json(saved)
    } catch (e) {
        res.sendStatus(500).json(e.message)
    }
});


router.get('/getlast', async (req,res) => {
    const query = Game.find().sort({ _id: -1 }).limit(10);
    const promise = query.exec();
    promise.then(data => {
        return new Promise(resolve => {
            let ids = data.map(match => match.time);
            return resolve(ids);
        }).then(data => res.json(data));
    })
        .catch(err => res.json(err));
});

module.exports = router;