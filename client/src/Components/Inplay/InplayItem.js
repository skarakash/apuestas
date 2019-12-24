import React, { Component } from 'react';
import {
    scoreStyles,
    oddsStyles,
    oddButton,
    inplayWrapperStyles
} from './InplayItemStyles'


class InplayItem extends Component{
    constructor(){
        super();
        this.state ={
            probability: {},
            generated: [],
            errors: [],
            requestOn: false,
        };
    }

    render(){
        const { match, odds } = this.props;
        const {probability, generated} = this.state;
        return(
            <div style={inplayWrapperStyles}>
                <div>{`${match.id} ${match.ss}`}</div>
                { match.currentBookieTotal ? `total: ${match.currentBookieTotal}` : 0}
                { Object.keys(probability).filter(key => key !== 'total').map(key => <span key={key}>{`${key}:[${probability[key]}]` }</span>) }
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
                {generated.length > 0 && generated.map(item => <div key={item}>{item}</div>)}
            </div>
        )
    }
}

export default InplayItem;