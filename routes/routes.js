const express = require('express');
const router = express.Router();
const request = require('request');
const { token } = require('../config');
const Match = require('../Models/Match');

const transformOddsArray = require('../utils/utils').transformOddsArray;
const filterGames = require('../utils/utils').filterGames;
const getNestedObject = require('../utils/utils').getNestedObject;
const getDesirable = require('../utils/utils').getDesirable;
const getMostFrequentOdd = require('../utils/utils').getMostFrequentOdd;

router.get('/eventsended', (req, res) => {
    const url = `https://api.betsapi.com/v2/events/ended?sport_id=78&token=${token}&day=${req.query.day}&page=${req.query.page}`
    request(url, (error, response, body) => {
        if (error || response.statusCode !== 200){
            res.json(error)
        }
        let data = JSON.parse(body);
        data = filterGames(data.results);
        res.json(data);
    })
});

router.get('/eventview', (req,res) => {
    const url = `https://api.betsapi.com/v1/event/view?token=${token}&event_id=${req.query.event_id}`;
    const p = new Promise((resolve,reject) => {
        request(
            { url },
            (error, response, body) => {
                if (error || response.statusCode !== 200) {
                    console.log(error);
                    res.json(reject(error))
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
                res.json(reject(error))
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
           let games = data.results.filter(game => Number(game.timer.tm) >= 44);
            res.json(games);
        }
    ).catch(err => {
        console.log(err);
        res.json(err); 
    });
});

router.get('/eventodds', (req,res) => {
    const url = `https://api.betsapi.com/v2/event/odds?token=${token}&event_id=${req.query.event_id}&source=bet365&odds_market=3`;
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
            let odds = transformOddsArray(data.results.odds);
            res.json({odds, id: req.query.event_id})
        }
    ).catch(err => {
        console.error(err);
        res.json(err);
    });
});

router.post('/insert', async (req, res) => {
        const data = req.body;
        const newMatch = new Match(data);
        try {
            const savedMatch = await newMatch.save() 
            res.json(savedMatch['_id'])
        } catch (error) {
            res.status(500).send(error)
        }
});

router.get('/getlast', async (req, res) => {
    const query = Stats.find().sort({ _id: -1 }).limit(10);
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

router.get('/validate', async (req, res) => {
    try {
       const response = Match.find({'id': req.query.id}, {'id': 1});
       const promise = response.exec();
       promise.then(data => res.json(data)).catch(err => res.json(err));
    } catch (e) {
        res.sendStatus(400).json({message: error.message});
    }
}); 

router.get('/probability', async (req, res) => {
    try {
        const current = req.query.current;
        let data = await Match.find({ $and: [ 
            { "start": Number(req.query.start)}, 
           // { "mid": Number(req.query.mid) }, 
            { "ht": Number(req.query.ht) } 
             ]}, {"ss": 1, "_id": 0});

        data = data.map(item => item.ss).sort();
        console.log(data)
        let p = getDesirable(data, current)
       res.json(p)
    }
    catch(error) {
        console.log(error)
        res.sendStatus(400).send(error)
    }
})

router.get('/latestodds', async (req, res) => {
    const url = `https://api.betsapi.com/v2/event/odds?token=${token}&event_id=${req.query.event_id}`; 
    request(url, (error, response, body) => {
        if (error || response.statusCode !== 200){
            res.sendStatus(400).json(error)
        }
        let data = JSON.parse(body);
        data = data.results.odds['78_3'][0];
        res.json(data);
    })
});

router.get('/mostfrequentodds', async (req, res) => {
    const url = `https://api.betsapi.com/v2/event/odds?token=${token}&event_id=${req.query.event_id}`; 
    request(url, (error, response, body) => {
        if (error || response.statusCode !== 200){
            res.sendStatus(400).json(error)
        }
        let data = JSON.parse(body);
        data = getMostFrequentOdd(data.results.odds['78_3']);
        res.json(data);
    })
});

module.exports = router;