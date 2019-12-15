import React, { Component } from 'react';
import { getOdds,  getAllLive, insertRows, fetchDataFromDB} from '../../utils/asyncUtils';
import getAllById from '../../utils/getGamesById';
import InplayItem from './InplayItem';

class Inplay extends Component {
    constructor(){
        super();
        this.state = {
            ids: [],
            matches: [],
            error: '',
            odds: []
        };

        this.getGames = this.getGames.bind(this);
        this.getIds = this.getIds.bind(this);
        this.getMatchOdds = this.getMatchOdds.bind(this);
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
        .then(() => this.getGames())
        .then(() => {
            if (this.state.ids.length > 0){
                this.getMatchOdds(this.state.ids)
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
                        this.setState({
                            matches: data
                        })
                    }
                )
                .catch(error => this.setState({error}));
        }
    };

    getMatchOdds = (ids) => getOdds(ids)
        .then(data => {
            this.setState({
                odds: data
            })
        })
        .catch(error => this.setState({error}));

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
        insertRows(obj).catch(error => this.setState({error}))
    };




    render(){
        const {ids, matches, odds } = this.state;
        const divStyle = {
            border: '1px solid grey',
            padding: '0 5px'
        };


        return <div className="container">
            <button className="btn btn-success" onClick={() => this.getIds()}>LIVE</button>
            {ids.length > 0 && <button className='btn btn-info' onClick={() => this.getMatchOdds(ids)}>Get odds</button>}
            <button className='btn btn-info' onClick={()=> this.setState({ids: [], matches: [], odds: []})}>Clear</button>
            {matches.length > 0 && matches.map(match => match ? <div key={match.id} style={divStyle}><InplayItem match={match} odds={odds.filter(odd => odd.matchId === match.id)[0]}/></div> : null)}
            {this.state.error.length > 0 && this.state.error}
        </div>
    }
}

export default Inplay;