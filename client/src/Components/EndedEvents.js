import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Loader from 'react-loader-spinner';

import { fetchEndedMatches, validateRow, getEventOdds, insertRows} from '../utils/asyncUtils'
import { getMatchScore } from '../utils/utils';

class EndedEvents extends Component{
    constructor(){
        super();
        this.state = {
            date: null,
            matches:[],
            loader: false,
            error: ''
        };
        this.getOdds = this.getOdds.bind(this);
    }

    handleSubmit(e){
        const { date } = this.state;
        e.preventDefault();
        this.setState({error: null, loader: true});
        if (date.length === 8) {
            fetchEndedMatches(date)
            .then( matches => this.setState({matches, loader: false}))
            .then(() => this.getOdds())
        }
    }

    getOdds = () => {
        const { matches } = this.state;
        matches.forEach( match => {
            getEventOdds(match.id).then(
                res => {
                    this.setState( prevState => {
                        let matches = prevState.matches.map( match => Number(match.id) === Number(res.id) ? {...match, odds: res.odds} : match)
                        return {matches}
                    })
                }
            )
        })
    }

    filterMatchesWitoutOdds = () => {
        this.setState({
            matches: this.state.matches.filter( match => match.odds && match.odds.length > 15)
        })
    }

    validateMatches = () => {
        this.filterMatchesWitoutOdds();
        this.state.matches.forEach(match => {
            validateRow(match.id)
                .then( res => {
                    if (res.length > 0) {
                        this.setState( prevState => {
                            let matches = prevState.matches.filter( match => !match.id);
                            return ({ matches })
                        })
                    }
                })
        });
        const { matches } = this.state;
        let dataForDB = matches.map( match => Object.assign({}, match, {ss: getMatchScore(match.ss)})).filter(match => match.odds.length > 0);
        if (dataForDB.length > 0){
            insertRows(dataForDB)
        }
    }



    render(){
        const { matches, error, loader } = this.state;
        return (
            <div className="container">
                <Link to="/inplay">
                    <button className="btn btn-info">Inplay</button>
                </Link>
            <form className="container" onSubmit={(e) => this.handleSubmit(e)}>
                <div className="form-group">
                    <label htmlFor="date">Enter date</label>
                    <input 
                        type="text"
                        className="form-control" 
                        id="date"
                        placeholder="Enter date" 
                        onChange={(e) => this.setState({ date: e.target.value })}
                    />
                </div>
                <button type="submit" className="btn btn-primary">Get</button>
            </form>
                <br/>
                {matches.length}
                {matches.length > 0 &&  <button  className="btn btn-info" onClick={this.validateMatches}>Validate and Store in DB</button>}
                {error && <div>Error: {error}</div>}
                <div className="loading_indicator"><Loader type="Puff" color="#00BFFF" height={80} width={80} visible={loader}/></div>
            </div>
        )
    }
}

export default EndedEvents;