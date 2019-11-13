import React, { Component } from 'react';

class ShowDataForm extends Component {
    constructor(){
        super();
        this.state = {
            matches: []
        };
        this.handleClick = this.handleClick.bind(this);
    }

    async handleClick(){
        const response = await fetch('/match',{
            headers : {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        const data = await response.json();
        this.setState({
            matches: data
        });
    }

    render(){
        const { matches } = this.state;

        return (
            <div>
                <button
                    onClick={this.handleClick}
                >
                    Go
                </button>
                {matches.length > 0 && matches.map(match => <div  key={match.id}>{match.teams}</div>)}
            </div>
        )
    }
}

export default ShowDataForm;