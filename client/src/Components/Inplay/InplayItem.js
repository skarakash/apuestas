import React, { Component } from 'react';
import {
    teamsStyles,
    scoreStyles,
    buttonStyles,
    oddsStyles,
    oddButton,
    probabilityStyles,
    probabilityStylesHigh
} from './InplayItemStyles'

import { findSimilar,insertbet } from '../../utils/asyncUtils';
import { over } from '../../utils/utils';

class InplayItem extends Component{
    constructor(){
        super();
        this.state ={
            probability: null,
            lxbet: null,
            lxbetCurrent: null,
            probabilityCurrent: null,
            generated: [],
            errors: []
        };
        this.calculate = this.calculate.bind(this);
        this.saveToDB = this.saveToDB.bind(this);
        this.getCurrent = this.getCurrent.bind(this);
        this.calculateWithCurrent = this.calculateWithCurrent.bind(this);
    }

    calculate = (eventsArr, handicap) => {
        const data = { 'events.45': eventsArr['45'], 'events.50': eventsArr['50'] };
        findSimilar(data)
            .then(data => {
                let results = data.map(item => item.ft).sort();
                let probability =  over(results, Number(handicap));
                let lxbet = over(results, Number(handicap) - 1);
                this.setState({probability, lxbet}) ;
            });
    };

    calculateWithCurrent = (currentMin, events, handicap) => {
        const key = 'events.' + currentMin;
        const data = { [key]: events[String(currentMin)] };
        findSimilar(data)
            .then(data => {
                let results = data.map(item => item.ft).sort();
                let probabilityCurrent =  over(results, Number(handicap));
                let lxbetCurrent = over(results, Number(handicap) - 1);
                this.setState({probabilityCurrent, lxbetCurrent}) ;
            });
    };

    saveToDB =() => {
        const { probability } = this.state;
        const { match, odds } = this.props;
        const bet = {};
        bet['id'] = match.id;
        bet['teams'] = `${match.home.name} - ${match.away.name}`;
        bet['total'] = Number(odds.handicap);
        bet['%'] = Number(probability.toFixed(2));
        bet['odds'] = Number(odds.over_od);
        bet['added'] = new Date().toLocaleDateString();
        bet['result'] = 'null';
        insertbet(bet).then().catch(err => {
            this.setState({
                errors: this.state.errors.push(err)
            })
        })
    };

    getCurrent = () => {
        const { match, odds } = this.props;
        const { handicap } = odds;
        const { events } = match;
        let currentMin =  Math.max(...Object.keys(events));
        this.calculateWithCurrent(currentMin, events, handicap)
    };

    render(){
        const { match, odds } = this.props;
        const { events } = match;
        const {probability, generated, lxbet, lxbetCurrent} = this.state;
        return(
            <div>
                <div style={teamsStyles}>{match.home.name}  [{match.ss}]  {match.away.name}</div>
                { match.timer &&
                odds !== undefined && Number(match.timer.tm) >= 50 && Number(match.timer.tm) <= 55 &&
                <button style={buttonStyles} onClick={() => this.calculate(events, odds.handicap)}>Calculate</button>
                }
                { odds &&
                <div style={oddsStyles}>
                    <button
                        style={oddButton}
                        onClick={() => this.setState({ generated: this.state.generated.concat([`${match.league.name}, ${match.home.name} - ${match.away.name}, over ${odds.handicap}@${odds.over_od} [bet365] ${probability}%`])})}
                    >
                        {odds.over_od}
                        </button>
                    <span>{odds.handicap}</span>
                    <button
                        style={oddButton}
                        onClick={() => this.setState({ generated: this.state.generated.concat([`${match.league.name}, ${match.home.name} - ${match.away.name}, under ${odds.handicap}@${odds.under_od} [bet365]`])})}
                    >
                        {odds.under_od}
                    </button>
                </div>
                }
                <div style={scoreStyles}>{match.timer ? match.timer.tm : null} : {match.timer ? match.timer.ts : null}</div>
                <span
                    style={probability && probability >= 70 ? probabilityStylesHigh : probabilityStyles}
                >
                    {probability ? `${Math.floor(probability)}%` :  null} {lxbet ? `(${Math.floor(lxbet)}%)` : null}
                </span>
                <button onClick={() => this.saveToDB()}>Save</button>
                <button onClick={() => this.getCurrent()}>{odds && lxbetCurrent ? Math.round(lxbetCurrent) : 'NO DATA'}</button>
                {generated.length > 0 && generated.map(item => <div key={item}>{item}</div>)}
            </div>
        )
    }
}

export default InplayItem;