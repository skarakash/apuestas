import React, { Component } from 'react';
import { getAllLive, getAllById, getGameData, over } from '../utils/utils';
import { getOdds, fetchDataFromDB, insertRows } from '../asyncUtils';


class Inplay extends Component {
    constructor(){
        super();
        this.state = {
            ids: [],
            matches: [],
            error: ''
        };

        this.getGames = this.getGames.bind(this);
        this.getIds = this.getIds.bind(this);
        this.getMatchOdds = this.getMatchOdds.bind(this);
        this.calculateProbability = this.calculateProbability.bind(this);
        this.save = this.save.bind(this);
    }

    getIds = () => getAllLive()
        .then((data) => {
            if (data) {
                this.setState({
                    ids: data
                })
            }
        })
        .catch(error => {
            this.setState({error})
        });

    getGames = () => {
        const { ids } = this.state;
        if (ids.length > 0) {
            getAllById(this.state.ids)
                .then(
                    data => {
                        const matches = data
                            .filter(game => game.time_status === '1')
                            .map(game => getGameData(game, 'bets'));
                        this.setState({
                            matches
                        })
                    }
                )
                .catch(error => this.setState({error}));
        }
    };

    getMatchOdds = (id) => getOdds(id)
        .then(data => {
            if (data.results.odds) {
                this.setState( state => {
                    const items = state.matches.map(match => {
                        if (Number(match.id) === Number(id)) {
                            return Object.assign({}, match, {odds: data.results.odds['78_3'][0]})
                        } else {
                            return match
                        }
                    });
                    return state.matches = items;
                })
            }
        })
        .catch(error => this.setState({error}));

    calculateProbability  = (id, total)  => {
        const { matches } = this.state;
        let requestData = {};

        let match = matches.filter(item => item.id === id)[0];

        if (match.min >= 47 && match.min <= 53) {
            requestData = {'@45': match['@45'], '@50': match['@50']}
        }
        fetchDataFromDB(requestData)
            .then(data => {
                data = data.map(item => item['FT']);
                const prob = over(data, total);
                this.setState(state => {
                    const items = state.matches.map(match => {
                        if (Number(match.id) === Number(id) && match.odds){
                            return Object.assign({}, match, {persentage: prob.probability, total})
                        } else {
                            return match
                        }
                    });
                    return state.matches = items;
                })
            })
            .catch(error => {
                this.setState({
                    error
                })
            });
    };

    save = match => {
        const obj = {
            league_name: match.league,
            teams: match.teams,
            match_id: match.id,
            over_od: match.odds.over_od,
            under_od: match.odds.under_od,
            total: match.odds.handicap,
            probab: match.persentage || 0
        };
        console.log(match);
        insertRows(obj).catch(error => this.setState({error}))
    };




    render(){
        const {ids, matches } = this.state;
        return <div className="container">
            <button className="btn btn-success" onClick={() => this.getIds()}>LIVE</button>
            {ids.length > 0 && <button className="btn btn-info" onClick={() => this.getGames()}>Update</button>}
            { matches.length > 0 && matches.map(match => <div key={match.teams}> {match.league}: {match.teams} || {match.min >= 45 ? match['@45'] : null}  {match.min >= 50 ?  match['@50'] : null}  || TIME: {match.min}: {match.sec} || SCORE: {match.score}
            {match.odds ? <span> Under: ~{match.odds.under_od}~   [ {match.odds.handicap} ]   Over: ~{match.odds.over_od}~</span>: null}
            <button className='btn btn-info' onClick={() => this.getMatchOdds(match.id)}>Get odds</button>
                {match.min >=45 && <button className='btn btn-danger' onClick={()=> match.odds ? this.calculateProbability(match.id, match.odds.handicap): () => {}}>Calc</button>} {match.persentage ? Math.floor(match.persentage) : null}
                <button onClick={() => this.save(match)}>Save</button>
            </div>)
            }
            {this.state.error.length > 0 && this.state.error}
        </div>
    }
}

export default Inplay;