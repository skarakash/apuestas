import React, { Component } from 'react';


class ShowDataForm extends Component {
    constructor(){
        super();
        this.state = {
            match: []
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
        console.log(data);
        this.setState({
            match: data
        });
    }

    render(){
        return (
            <button
                onClick={this.handleClick}
            >Go</button>
        )
    }
}

export default ShowDataForm;