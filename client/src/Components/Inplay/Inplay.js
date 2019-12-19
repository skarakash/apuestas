import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Loader from 'react-loader-spinner';

import { getOdds,  getLiveGamesIDs, insertRows} from '../../utils/asyncUtils';
import getAllById from '../../utils/getGamesById';
import InplayItem from './InplayItem';

class Inplay extends Component {
    constructor(){
        super();
        this.state = {
            ids: [],
            matches: [],
            error: '',
            odds: [],
            loader: false,
        };

        this.getGames = this.getGames.bind(this);
        this.save = this.save.bind(this);
    }

    getLiveGames = () => {
        const { ids } = this.state;
        this.setState({loader: true});
        getLiveGamesIDs()
            .then((data) => {
                if (data) {
                    this.setState({
                        ids: data
                    })
                }
            })
            .then(() => {
                if (ids.length > 0) {
                    this.getGames()
                }
            })
            .then(() => {
                if (this.state.ids.length > 0){
                    this.getMatchOdds(this.state.ids);
                }
            })
            .then(() => this.setState({loader: false}));
    };

    getGames = () => getAllById(this.state.ids).then(data => { this.setState({matches: data })});

    getMatchOdds = (ids) => getOdds(ids).then(data => {this.setState({odds: data,loader: false })});

    save = match => {
        this.setState({loader: true});
        const obj = {
            league_name: match.league,
            teams: match.teams,
            match_id: match.id,
            over_od: match.odds.over_od,
            under_od: match.odds.under_od,
            total: match.odds.handicap,
            probab: match.persentage || 0
        };
        insertRows(obj).then(()=> this.setState({loader: false})).catch(error => this.setState({error}))
    };




    render(){
        const {ids, matches, odds,loader } = this.state;
        const divStyle = {
            border: '1px solid grey',
            padding: '0 5px'
        };


        return <div className="container inplay-container">
            <div className="buttons">
                <button className="btn btn-success" onClick={() => this.getLiveGames()}>LIVE</button>
                {ids.length > 0 && <button className='btn btn-info' onClick={() => this.getMatchOdds(ids)}>Get odds</button>}
                <button className='btn btn-info' onClick={()=> this.setState({ids: [], matches: [], odds: []})}>Clear</button>
                <Link to="/endedevents">
                    <button className="btn btn-info">Ended Events</button>
                </Link>
            </div>
                {matches.length > 0  && matches.map(match => match ?
                    <div key={match.id} style={divStyle}><InplayItem match={match} odds={odds.filter(odd => odd.matchId === match.id)[0]}/></div> :
                null)}
                {this.state.error.length > 0 && this.state.error}
           <div className="loading_indicator"><Loader type="Puff" color="#00BFFF" height={80} width={80} visible={loader}/></div>
        </div>
    }
}

export default Inplay;