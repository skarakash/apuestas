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
            generated: [],
            errors: [],
            requestOn: false,
        };
        this.saveToDB = this.saveToDB.bind(this);
    }


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
                odds !== undefined && Number(match.timer.tm) >= 47 && Number(match.timer.tm) <= 55 &&
                <button style={buttonStyles} onClick={() => {}}>Get %</button>
                }
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
                <span
                    style={probability && probability >= 70 ? probabilityStylesHigh : probabilityStyles}
                >
                    {probability ? `${Math.floor(probability)}%` :  null} {lxbet ? `(${Math.floor(lxbet)}%)` : null}
                </span>
                <button onClick={() => this.saveToDB()}>Save</button>
                {generated.length > 0 && generated.map(item => <div key={item}>{item}</div>)}
            </div>
        )
    }
}

export default InplayItem;