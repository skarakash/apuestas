const express = require('express');
const router = express.Router();
const request = require('request');
const { token } = require('../config');
const Game = require('../Models/Game');
const BetM = require('../Models/MongoBet');



router.post('/eventsended', (req,res) => {
    const url = `https://api.betsapi.com/v2/events/ended?sport_id=78&token=${token}&day=${req.body.date}&league_id=${req.body.tournamentId}`;
    if (req.body.date.length === 8){
        request(
            { url },
            (error, response, body) => {
                if (error || response.statusCode !== 200) {
                    return res.status(500).json(error);
                }
                res.json(JSON.parse(body));
            }
        )
    } else {
        res.json("Not valid date format")
    }
});

router.post('/eventview', (req,res) => {
    const url = `https://api.betsapi.com/v1/event/view?token=${token}&event_id=${req.body.id}`;
    const p = new Promise((resolve,reject) => {
        request(
            { url },
            (error, response, body) => {
                if (error || response.statusCode !== 200) {
                    console.log(error);
                    return reject(error)
                }
                resolve(JSON.parse(body))
            }
        )
    });
    p.then(data => {
        let match = data.results[0];
        res.json(match)
    }).catch(err => {
        console.log(err);
        res.json(err);
    });

});

router.get('/inplayevents', (req,res) => {
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
            let games = data.results.filter(game => Number(game.timer.tm) >= 47);
            res.json(games);
        }
    ).catch(err => {
        console.log(err);
        res.json(err);
    });

});

router.post('/eventodds', (req,res) => {
    const url = `https://api.betsapi.com/v2/event/odds?token=${token}&event_id=${req.body.id}&source=bet365&odds_market=3`;
    const p = new Promise((resolve, reject) => {
    request(
        { url },
        (error, response, body) => {
            if (error || response.statusCode !== 200) {
                res.json(reject(error))
            }
            resolve(JSON.parse(body));
        }
    )
    });

    p.then(
        data => {
            let odds = data.results.odds['78_3'][0];
            res.json(odds)
        }
    ).catch(err => {
        console.log(err);
        res.json(err);
    });
});


router.post('/insert', async (req,res) => {
    const saved = await Game.insertMany(req.body);
    res.json(saved)
});

router.post('/insertbet', async (req,res) => {
    const promise = BetM.create({
        id: req.body.id,
        teams: req.body.teams,
        total: req.body.total,
        '%': req.body['%'],
        odds: req.body.odds,
        added: req.body.added
    });

    promise.then(
        data => {
            res.json(data)
        }
    )
    .catch(err => {
        console.log(err);
        res.json(err)
    })

});


router.get('/getlast', async (req,res) => {
    const query = Game.find().sort({ _id: -1 }).limit(10);
    const promise = query.exec();
    promise.then(data => {
        return new Promise(resolve => {
            let ids = data.map(match => {
                return {
                    time: match.time, league: match.league.name, leagueId: match.league.id
                }
            });
            return resolve(ids);
        }).then(data => res.json(data));
    })
    .catch(err => {
        console.log(err);
        res.json(err);
    });
});

router.post('/probability', async (req, res) => {
    const totalGames = await Game.find({ "events.30": {$eq: 22}}).count();
    const totalGamesOver = await Game.find({$and: [{ "events.30": {$eq: 22}}, {"ft": {$gte: 43.5}}]}).count();
    const totalGamesUnder = await Game.find({$and: [{ "events.30": {$eq: 22}}, {"ft": {$lte: 43.5}}]}).count();
    const result = await Promise.all([totalGames, totalGamesOver, totalGamesUnder]);
    res.json(result)
});

module.exports = router;