import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Loader from 'react-loader-spinner';

import { fetchEndedMatches, getEventOdds, insertMatch} from '../utils/asyncUtils'

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

    async handleSubmit(e){
        const { date } = this.state;
        e.preventDefault();
        this.setState({error: null, loader: true});
        if (date.length === 8) {
            const matches = await fetchEndedMatches(date);
            if (matches.length > 0) {
                this.setState({matches, loader: false})
                this.getOdds()
            }
        }
    }

    async getOdds() {
        const { matches } = this.state;
        matches.map(async match => {
           const inPlayodds = await getEventOdds(match.id);
            this.setState( prevState => {
              let newMatches = prevState.matches.map( game => Number(game.id) === Number(match.id) ? 
                {...game, 
                    start: inPlayodds.odds.start > 0 ? Number(inPlayodds.odds.start) : null, 
                    mid: inPlayodds.odds.mid > 0 ? Number(inPlayodds.odds.mid) : null, 
                    ht: inPlayodds.odds.ht > 0 ? Number(inPlayodds.odds.ht) : null
                } :
                 game);
              return { matches: newMatches }
            })
        });
    }


    validateMatches = () => {
        const { matches } = this.state;
        matches.forEach( match => insertMatch(match))
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
                {matches.length > 0 &&  <button  className="btn btn-info" onClick={this.validateMatches}>Store in DB</button>}
                {error && <div>Error: {error}</div>}
                <div className="loading_indicator"><Loader type="Puff" color="#00BFFF" height={80} width={80} visible={loader}/></div>
            </div>
        )
    }
}

export default EndedEvents;