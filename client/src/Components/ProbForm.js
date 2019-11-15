import React, { Component } from 'react';
import { propb } from '../utils';

class ProbForm extends Component {
    constructor(){
        super();
        this.state = {
            value: '',
            finalRes: null
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e){
        e.preventDefault();
        this.setState({
            value: e.target.value
        })
    }

    handleSubmit(e){
        e.preventDefault();
        const {results} = this.props;
        const { value } = this.state;
        if (value && results) {
            const res = propb(results, value);
            this.setState({
                finalRes: res
            })
        }
    }


    render() {
        return(
            <div className="container">
                <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="over">Over</label>
                        <input type="number" className="form-control" id="over"
                               aria-describedby="Over" placeholder="Over" onChange={this.handleChange}/>
                    </div>
                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>
                <div>{this.state.finalRes}</div>
            </div>
        )
    }
}


export default ProbForm;