import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Loader from 'react-loader-spinner';

import {getLiveGamesIDs} from '../../utils/asyncUtils';
import InplayItem from './InplayItem';

class Inplay extends Component {
    constructor(){
        super();
        this.state = {
            ids: [],
            matches: [],
            error: '',
            loader: false,
            localStorage: []
        };
        this.getLive = this.getLive.bind(this);
    }

    getLive = () => {
        getLiveGamesIDs()
        .then( data => this.setState({ids: data}))
    } 

    render(){
        const {ids, loader } = this.state;
        const divStyle = {
            border: '1px solid grey',
            padding: '0 5px'
        };
        return <div className="container inplay-container">
            <div className="buttons">
                <button className="btn btn-success" onClick={() => this.getLive()}>LIVE</button>
                <button className='btn btn-info' onClick={()=> this.setState({ids: [], matches: [], odds: []})}>Clear</button>
                <Link to="/endedevents">
                    <button className="btn btn-info">Ended Events</button>
                </Link>
            </div>
                {ids.length > 0  && ids.map(id => <div key={id} style={divStyle}><InplayItem id={id}/></div>)}
                {this.state.error.length > 0 && this.state.error}
           <div className="loading_indicator"><Loader type="Puff" color="#00BFFF" height={80} width={80} visible={loader}/></div>
        </div>
    }
}

export default Inplay;