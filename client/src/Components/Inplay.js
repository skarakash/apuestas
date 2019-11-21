import React, { Component } from 'react';
import { inplay, getAllById, getGameData } from '../utils';


class Inplay extends Component {
    constructor(){
        super();
        this.state = {
            ids: [],
            matches: []
        };

        this.getGames = this.getGames.bind(this);
    }

    getIds = () => inplay()
        .then((data) => {
            this.setState({
                ids: data
            })
        })
        .catch(err => console.log(err));

    getGames = () => getAllById(this.state.ids).then(
        data => {
            const matches = data.filter(game => Number(game.time_status === '1') && game.timer.tm >= 45).map(game => getGameData(game));
            this.setState({
                matches
            }, () => console.log(this.state.matches))
        }
    );

    render(){
        const { ids, matches } = this.state;
        return <div className="container">
            <button className="btn btn-success" onClick={() => this.getIds()}>LIVE</button>
            <button className="btn btn-info" onClick={() => this.getGames()}>Display live</button>
            { matches.length > 0 && matches.map(match => <div key={match.teams}>{match.teams} {match['HT']}   {match['@35']}  {match['@40']}  {match['@45']}  {match['@50'] || 0}  {match['@55'] || 0} FT: {match['FT'] || 0} --- TIME: {match.time}</div>) }
        </div>
    }
}

export default Inplay;