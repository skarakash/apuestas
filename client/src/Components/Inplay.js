import React, { Component } from 'react';
import { getAllLive, getAllById, getGameData, over } from '../utils';
import { getOdds, fetchDataFromDB } from '../asyncUtils';


class Inplay extends Component {
    constructor(){
        super();
        this.state = {
            ids: [],
            matches: []
        };

        this.getGames = this.getGames.bind(this);
        this.getIds = this.getIds.bind(this);
        this.getMatchOdds = this.getMatchOdds.bind(this);
        this.calculateProbability = this.calculateProbability.bind(this);
    }

    getIds = () => getAllLive()
        .then((data) => {
            if (data) {
                this.setState({
                    ids: data
                })
            }
        })
        .catch(err => console.log(err));

    getGames = () => {
        const { ids } = this.state;
        if (ids.length > 0) {
            getAllById(this.state.ids)
                .then(
                    data => {
                        const matches = data.filter(game => game.time_status === '1').map(game => getGameData(game));
                        this.setState({
                            matches
                        })
                    }
                )
                .catch(err => console.log(err));
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
        .catch(err => console.log(err));

    calculateProbability  = (id, total)  => {
        const { matches } = this.state;
        let requestData;

        let match = matches.filter(item => item.id === id)[0];
        if (match.min >= 45 && match.min <= 49) {
            requestData = {'@45': match['@45']}
        } else if (match.min >= 50 && match.min <= 54) {
            requestData = {'@45': match['@45'], '@50': match['@50']}
        } else {
            requestData = {'@45': match['@45'], '@50': match['@50'],'@55': match['@55']}
        }
        fetchDataFromDB(requestData)
            .then(data => {
                data = data.map(item => item['FT']);
                const prob = over(data, total);
                this.setState(state => {
                    const items = state.matches.map(match => {
                        if (Number(match.id) === Number(id)){
                            return Object.assign({}, match, {persentage: prob.probability, total})
                        } else {
                            return match
                        }
                    });
                    return state.matches = items;
                }, () => console.log(this.state.matches))
            })
            .catch(err => console.log(err));
    };


    render(){
        const {ids, matches } = this.state;
        return <div className="container">
            <button className="btn btn-success" onClick={() => this.getIds()}>LIVE</button>
            {ids.length > 0 && <button className="btn btn-info" onClick={() => this.getGames()}>Display live</button>}
            { matches.length > 0 && matches.map(match => <div key={match.teams}>{match.teams} || {match.min >= 45 ? match['@45'] : null}  {match.min >= 50 ?  match['@50'] : null}  {match.min >= 55 ? match['@55']: null } --- TIME: {match.min}: {match.sec} ||
            {match.odds ? <span> Under: ~{match.odds.under_od}~   [ {match.odds.handicap} ]   Over: ~{match.odds.over_od}~</span>: null}
            <button className='btn btn-info' onClick={() => this.getMatchOdds(match.id)}>Get odds</button>
                {match.min >=45 && <button className='btn btn-danger' onClick={()=> this.calculateProbability(match.id, match.odds.handicap)}>Calc</button>} {match.persentage ? Math.floor(match.persentage) : null}
            </div>)
            }
        </div>
    }
}

export default Inplay;