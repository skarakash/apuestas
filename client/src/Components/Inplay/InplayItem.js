import React, { Component } from 'react';
import {
    inplayWrapperStyles
} from './InplayItemStyles'

import { getLatestOdds, getEventOdds, findSimilar, getEventView } from '../../utils/asyncUtils';

class InplayItem extends Component {
    constructor(){
        super();
        this.state = {
            latestOdd: null,
            time: null,
            allOdds: {},
            betString: null
        }
        this.getLatestOds = this.getLatestOds.bind(this);
    }

    getLatestOds(){
        const { id } = this.props;
        getLatestOdds(id)
        .then(latestOdd => 
            this.setState({latestOdd})    
        )
    }

    getAllOdds(){
        const { id } = this.props;
        getEventOdds(id)
            .then(allOdds => {
                let { odds } = allOdds;
                const someMissing = Object.keys(odds).some(key => !odds[key])
                if (someMissing){
                    return
                }

                odds.current = this.state.latestOdd.handicap
                return findSimilar(odds)
                    .then(toBet => this.setState({toBet}))
        })
    }

    getGameInfo(id) {
        getEventView(id)
        .then(res => {
            const { latestOdd } = this.state;
            if (!latestOdd) {
                return;
            }
            let betString = `${res.league.name}: ${res.home.name} - ${res.away.name} over ${latestOdd.handicap}@${latestOdd.over_od} ${new Date().toGMTString()} #bet365`;
            console.log(betString)
            this.setState({betString})
        })
    }


    render(){
        const { id } = this.props;
        const { latestOdd, toBet } = this.state;
        return(
            <div style={inplayWrapperStyles}>
               <button className="btn btn-warning" onClick={() => this.getGameInfo(id)}>{id}</button>
               <button type="button" className="btn btn-danger" onClick={() => this.getLatestOds()}>Latest</button>
                {latestOdd && <span>{latestOdd.handicap}</span>}
                {latestOdd &&  <span className="prefer-to-bet-on">{latestOdd.time_str}</span>}
                <button type="button" className="btn btn-danger" onClick={() => this.getAllOdds()}>Bet On</button>
                {toBet}
            </div>
        )
    }
}

export default InplayItem;