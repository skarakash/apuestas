import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Loader from 'react-loader-spinner';

import { getEventOdds,  getLiveGamesIDs} from '../../utils/asyncUtils';
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
        this.getLive = this.getLive.bind(this);
    }

    getLive = () => {
        getLiveGamesIDs()
        .then( data => this.setState({ids: data}))
    } 

    getOdds = () => {
        const { ids } = this.state;
        getEventOdds(ids)
        .then(data => this.setState({odds: data}))
    }

    render(){
        const {ids, odds, loader } = this.state;
        const divStyle = {
            border: '1px solid grey',
            padding: '0 5px'
        };
        return <div className="container inplay-container">
            <div className="buttons">
                <button className="btn btn-success" onClick={() => this.getLive()}>LIVE</button>
                {ids.length > 0 && <button className='btn btn-info' onClick={() => this.getOdds()}>Get odds</button>}
                <button className='btn btn-info' onClick={()=> this.setState({ids: [], matches: [], odds: []})}>Clear</button>
                <Link to="/endedevents">
                    <button className="btn btn-info">Ended Events</button>
                </Link>
            </div>
                {odds.length > 0  && odds.map(odd => odd ?
                    <div key={odd.id} style={divStyle}><InplayItem odd={odd}/></div> :
                null)}
                {this.state.error.length > 0 && this.state.error}
           <div className="loading_indicator"><Loader type="Puff" color="#00BFFF" height={80} width={80} visible={loader}/></div>
        </div>
    }
}

export default Inplay;