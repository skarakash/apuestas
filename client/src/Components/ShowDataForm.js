import React, { Component } from 'react';
import Over from './Over';
import Under from './Under';
import { removeFalsy } from '../utils';

class ShowDataForm extends Component {
    constructor(){
        super();
        this.state = {
            inputs: {
                'HT':  0,
                '@35': 0,
                '@40': 0,
                '@45': 0,
                '@50': 0,
                '@55': 0,
            },
            buttons: {
                buttonHT: true,
                button35: true,
                button40: true,
                button45: true,
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
            const response = await fetch(`/allData`, {
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
        const ftResults = matches.map(match => match['FT']).sort();
        return (
            <div className="container">
            <form onSubmit={this.handleSubmit}>
                <span className="formtext">Enter data</span>
                <div className="input-group-prepend">
                    <input
                        type="number"
                        placeholder="@HT"
                        onChange={e => this.setState({inputs : { ...this.state.inputs, 'HT': Number(e.target.value)}})}
                        disabled={this.state.buttons.buttonHT}
                        className="form-control"
                    />
                    <button
                        onClick={(e) => this.handleClick('buttonHT', 'HT', e)}
                        className={`btn ${this.state.buttons.buttonHT ? 'btn-danger': 'btn-primary'}`}
                    >
                        { this.state.buttons.buttonHT ? 'Enable' : 'Disable' }
                    </button>
                </div>

                <div className="input-group-prepend">
                    <input
                        type="number"
                        placeholder="@35"
                        onChange={e => this.setState({inputs : { ...this.state.inputs, '@35': Number(e.target.value)}})}
                        disabled={this.state.buttons.button35}
                        className="form-control"
                    />
                    <button
                        onClick={(e) => this.handleClick('button35', '@35', e)}
                        className={`btn ${this.state.buttons.button35 ? 'btn-danger': 'btn-primary'}`}
                    >
                        { this.state.buttons.button35 ? 'Enable' : 'Disable' }
                    </button>
                </div>

                <div className="input-group-prepend">
                    <input
                        type="number"
                        placeholder="@40"
                        onChange={e => this.setState({inputs : { ...this.state.inputs, '@40': Number(e.target.value)}})}
                        disabled={this.state.buttons.button40}
                        className="form-control"
                    />
                    <button
                        onClick={(e) => this.handleClick('button40', '@40', e)}
                        className={`btn ${this.state.buttons.button40 ? 'btn-danger': 'btn-primary'}`}
                    >
                        { this.state.buttons.button40 ? 'Enable' : 'Disable' }
                    </button>
                </div>

                <div className="input-group-prepend">
                    <input
                        type="number"
                        placeholder="@45"
                        onChange={e => this.setState({inputs : { ...this.state.inputs, '@45': Number(e.target.value)}})}
                        disabled={this.state.buttons.button45}
                        className="form-control"
                    />
                    <button
                        onClick={(e) => this.handleClick('button45', '@45', e)}
                        className={`btn ${this.state.buttons.button45 ? 'btn-danger': 'btn-primary'}`}
                    >
                        { this.state.buttons.button45 ? 'Enable' : 'Disable' }
                    </button>
                </div>

                <div className="input-group">
                    <input
                        type="number"
                        placeholder="@50"
                        onChange={e => this.setState({inputs : { ...this.state.inputs, '@50': Number(e.target.value)}})}
                        disabled={this.state.buttons.button50}
                        className="form-control"
                    />
                    <button
                        onClick={(e) => this.handleClick('button50', '@50', e)}
                        className={`btn ${this.state.buttons.button50 ? 'btn-danger': 'btn-primary'}`}
                    >
                        { this.state.buttons.button50 ? 'Enable' : 'Disable' }
                    </button>
                </div>

                <div className="input-group-prepend">
                    <input
                        type="number"
                        placeholder="@55"
                        onChange={e => this.setState({inputs : { ...this.state.inputs, '@55': Number(e.target.value)}})}
                        disabled={this.state.buttons.button55}
                        className="form-control"
                    />
                    <button
                        onClick={(e) => this.handleClick('button55', '@55',  e)}
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
                    { matches.length > 0 && matches.map(match => match['FT']).sort().join()}
                </div>
                <Over results={ftResults} />
                <Under results={ftResults}/>
            </div>
        )
    }
}

export default ShowDataForm;