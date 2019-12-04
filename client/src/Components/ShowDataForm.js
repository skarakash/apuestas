import React, { Component } from 'react';
import Over from './Total/Over';
import Under from './Total/Under';
import { removeFalsy } from '../utils/utils';

class ShowDataForm extends Component {
    constructor(){
        super();
        this.state = {
            inputs: {
                'event.30': 0,
                'event.35': 0,
                'event.40': 0,
                'event.45': 0,
                'event.50': 0,
                'event.55': 0,
            },
            buttons: {
                buttonHT: true,
                button35: true,
                button40: true,
                button45: false,
                button50: false,
                button55: false,
            },
            matches: []
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleClick = this.handleClick.bind(this);
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
        const { inputs } = this.state;
        e.preventDefault();
        this.fetchData(inputs);
    }

    handleClick(button, input, e){
        e.preventDefault();
        this.setState({
            buttons : {
                ...this.state.buttons,
                [button]: !this.state.buttons[button]
            },
            inputs : {
                ...this.state.inputs,
                [input]: 0
            }
        });
    }

    render(){
        const { matches } = this.state;
        const ftResults = matches.map(match => (match.ft)).sort();
        return (
            <div className="container">
            <form onSubmit={this.handleSubmit}>
                <span className="formtext">Enter data</span>
                <div className="input-group-prepend">
                    <input
                        type="number"
                        placeholder="@HT"
                        onChange={e => this.setState({inputs : { ...this.state.inputs, 'events.30': Number(e.target.value)}})}
                        disabled={this.state.buttons.buttonHT}
                        className="form-control"
                    />
                    <button
                        onClick={(e) => this.handleClick('buttonHT', 'event.30', e)}
                        className={`btn ${this.state.buttons.buttonHT ? 'btn-danger': 'btn-primary'}`}
                    >
                        { this.state.buttons.buttonHT ? 'Enable' : 'Disable' }
                    </button>
                </div>

                <div className="input-group-prepend">
                    <input
                        type="number"
                        placeholder="@35"
                        onChange={e => this.setState({inputs : { ...this.state.inputs, 'events.35': Number(e.target.value)}})}
                        disabled={this.state.buttons.button35}
                        className="form-control"
                    />
                    <button
                        onClick={(e) => this.handleClick('button35', 'events.35', e)}
                        className={`btn ${this.state.buttons.button35 ? 'btn-danger': 'btn-primary'}`}
                    >
                        { this.state.buttons.button35 ? 'Enable' : 'Disable' }
                    </button>
                </div>

                <div className="input-group-prepend">
                    <input
                        type="number"
                        placeholder="@40"
                        onChange={e => this.setState({inputs : { ...this.state.inputs, 'events.40': Number(e.target.value)}})}
                        disabled={this.state.buttons.button40}
                        className="form-control"
                    />
                    <button
                        onClick={(e) => this.handleClick('button40', 'events.40', e)}
                        className={`btn ${this.state.buttons.button40 ? 'btn-danger': 'btn-primary'}`}
                    >
                        { this.state.buttons.button40 ? 'Enable' : 'Disable' }
                    </button>
                </div>

                <div className="input-group-prepend">
                    <input
                        type="number"
                        placeholder="@45"
                        onChange={e => this.setState({inputs : { ...this.state.inputs, 'events.45': Number(e.target.value)}})}
                        disabled={this.state.buttons.button45}
                        className="form-control"
                    />
                    <button
                        onClick={(e) => this.handleClick('button45', 'events.45', e)}
                        className={`btn ${this.state.buttons.button45 ? 'btn-danger': 'btn-primary'}`}
                    >
                        { this.state.buttons.button45 ? 'Enable' : 'Disable' }
                    </button>
                </div>

                <div className="input-group">
                    <input
                        type="number"
                        placeholder="@50"
                        onChange={e => this.setState({inputs : { ...this.state.inputs, 'events.50': Number(e.target.value)}})}
                        disabled={this.state.buttons.button50}
                        className="form-control"
                    />
                    <button
                        onClick={(e) => this.handleClick('button50', 'events.50', e)}
                        className={`btn ${this.state.buttons.button50 ? 'btn-danger': 'btn-primary'}`}
                    >
                        { this.state.buttons.button50 ? 'Enable' : 'Disable' }
                    </button>
                </div>

                <div className="input-group-prepend">
                    <input
                        type="number"
                        placeholder="@55"
                        onChange={e => this.setState({inputs : { ...this.state.inputs, 'events.55': Number(e.target.value)}})}
                        disabled={this.state.buttons.button55}
                        className="form-control"
                    />
                    <button
                        onClick={(e) => this.handleClick('button55', 'events.55',  e)}
                        className={`btn ${this.state.buttons.button55 ? 'btn-danger': 'btn-primary'}`}
                    >
                        { this.state.buttons.button55 ? 'Enable' : 'Disable' }
                    </button>
                </div>
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