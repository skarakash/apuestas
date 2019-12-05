import React, { Component } from 'react';
import Over from './Total/Over';
import Under from './Total/Under';
import { removeFalsy } from '../utils/utils';

class ShowDataForm extends Component {
    constructor(){
        super();
        this.state = {
            matches: []
        };

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async fetchData(formData){
        const dataEdited = removeFalsy(formData);
        try {
            const response = await fetch('/getdata', {
                method: 'POST',
                body: JSON.stringify(dataEdited),
                headers: {"Content-Type": "application/json"}
            });
            const data = await response.json();
            this.setState({
                matches: data
            });
        }
        catch (err) {
            console.log('fetch failed', err);
        }
    }

    handleSubmit(e){
        e.preventDefault();
    }



    render(){
        const { matches } = this.state;
        const ftResults = matches.map(match => (match.ft)).sort();
        return (
            <div className="container">
            <form onSubmit={this.handleSubmit}>

                <button
                    className="btn btn-success"
                >Go</button>
            </form>
                <div
                    className="container results"
                >
                    { matches.length > 0 && matches.map(match => match['ft']).sort().join()}
                </div>
                <Over results={ftResults} />
                <Under results={ftResults}/>
            </div>
        )
    }
}

export default ShowDataForm;