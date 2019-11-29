import React, { Component } from 'react';
import { under } from '../../utils/utils';

class Under extends Component {
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
            const res = under(results, value);
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
                        <label htmlFor="under">Under</label>
                        <input className="form-control" id="under"
                               aria-describedby="Under" placeholder="Under" onChange={this.handleChange}/>
                    </div>
                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>
                <div>{this.state.finalRes}</div>
            </div>
        )
    }
}


export default Under;