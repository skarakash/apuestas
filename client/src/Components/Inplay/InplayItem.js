import React, { Component } from 'react';
import {
    teamsStyles,
    scoreStyles,
    buttonStyles,
    oddsStyles,
    oddButton,
    pStylesHigh
} from './InplayItemStyles'

import { findSimilar,insertbet } from '../../utils/asyncUtils';

class InplayItem extends Component{
    constructor(){
        super();
        this.state ={
            probability: {},
            generated: [],
            errors: [],
            requestOn: false,
        };
        this.saveToDB = this.saveToDB.bind(this);
    }

    getOutcomeProb = () => {
        const { odds, match } = this.props;
        const {events} = match;
        const data = {
            "total": Number(odds.handicap),
            "events.40": events['40'],
            "events.44": events['44'],
            "events.48": events['48']
        };
        findSimilar(data)
            .then(data => this.setState({probability: data}))
            .catch(error => {this.setState({errors: this.state.errors.concat(error)})})
    };


    saveToDB =() => {
        const { probability } = this.state;
        const { match, odds } = this.props;
        this.setState({requestOn: true});
        const bet = {};
        bet['id'] = match.id;
        bet['teams'] = `${match.home.name} - ${match.away.name}`;
        bet['total'] = Number(odds.handicap);
        bet['%'] = Number(probability.toFixed(2));
        bet['odds'] = Number(odds.over_od);
        bet['added'] = new Date().toLocaleDateString();
        bet['result'] = 'null';
        insertbet(bet).then(() => this.setState({requestOn: false})).catch(err => {
            this.setState({
                errors: this.state.errors.push(err)
            })
        })
    };

    render(){
        const { match, odds } = this.props;
        const {probability, generated} = this.state;
        return(
            <div>
                <div style={teamsStyles}>{match.home.name}  [{match.ss}]  {match.away.name}</div>
                { match.timer &&
                odds !== undefined && Number(match.timer.tm) >= 45 && Number(match.timer.tm) <= 55 &&
                <button style={buttonStyles} onClick={() => this.getOutcomeProb()}>{probability.total ? probability.total: 'Get %'}</button>
                }
                { Object.keys(probability).filter(key => key !== 'total').map(key => <span key={key}>{`${key}:[${probability[key]}] ` }</span>) }
                { odds &&
                <div style={oddsStyles}>
                    <button
                        style={oddButton}
                        onClick={() => this.setState({ generated: this.state.generated.concat([`${match.league.name}, ${match.home.name} - ${match.away.name}, over ${odds.handicap}@${odds.over_od} [bet365] ${probability}%`])})}
                    >
                        {odds.over_od ? odds.over_od : '0.00'}
                        </button>
                    <span>{odds.handicap}</span>
                    <button
                        style={oddButton}
                        onClick={() => this.setState({ generated: this.state.generated.concat([`${match.league.name}, ${match.home.name} - ${match.away.name}, under ${odds.handicap}@${odds.under_od} [bet365]`])})}
                    >
                        {odds.under_od ? odds.under_od : '0.00'}
                    </button>
                </div>
                }
                <div style={scoreStyles}>{match.timer ? match.timer.tm : null} : {match.timer ? match.timer.ts : null}</div>
                <button onClick={() => this.saveToDB()}>Save</button>
                {generated.length > 0 && generated.map(item => <div key={item}>{item}</div>)}
            </div>
        )
    }
}

export default InplayItem;