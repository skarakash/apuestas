import React, { Component } from 'react';
import { getAllLive, getAllById, getGameData } from '../utils';
import { getOdds } from '../asyncUtils';


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
                        const matches = data.map(game => getGameData(game));
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
                }, ()=> console.log(this.state.matches))
            }
        })
        .catch(err => console.log(err));



    render(){
        const {ids, matches } = this.state;
        return <div className="container">
            <button className="btn btn-success" onClick={() => this.getIds()}>LIVE</button>
            {ids.length > 0 && <button className="btn btn-info" onClick={() => this.getGames()}>Display live</button>}
            { matches.length > 0 && matches.map(match => <div key={match.teams}>{match.teams} || {match['@45']}  {match['@50'] || 0}  {match['@55'] || 0} FT: {match['FT'] || 0} --- TIME: {match.time} ||
            {match.odds ? <span> Under :{match.odds.under_od}   [ {match.odds.handicap} ]   Over: {match.odds.over_od}</span>: null}
            <button className='btn btn-info' onClick={() => this.getMatchOdds(match.id)}>Odds</button></div>) }
        </div>
    }
}

export default Inplay;