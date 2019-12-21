import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Loader from 'react-loader-spinner';

import { insertRows, validateRows,fetchEndedMatches,getEventOdds } from '../utils/asyncUtils'

class EndedEvents extends Component{
    constructor(){
        super();
        this.state = {
            dates: null,
            tournamentId: null,
            matches:[],
            loader: false,
            error: ''
        };

        this.insertMatches = this.insertMatches.bind(this);
        this.validateMatches = this.validateMatches.bind(this);
        this.getEventOdds = this.getEventOdds.bind(this);
    }

    handleSubmit(e){
        const { dates, tournamentId } = this.state;
        e.preventDefault();
        this.setState({error: null, loader: true});
        if(dates){
            let datesSet = dates.split(',').map(item => item.trim());
            fetchEndedMatches(datesSet, tournamentId)
                .then( matches => {
                    matches = [].concat.apply([], matches);
                    this.setState({matches});
                })
                .then(() => {
                    this.getEventOdds()
                })
        }
    }

    getEventOdds = () => {
        this.state.matches.map(match => {
            getEventOdds(match.id).then((data) => {
                this.setState(prevState => {
                    let newData =  prevState.matches.map(
                        match => (data.odds).hasOwnProperty("ht") && Number(data.id) === Number(match.id) ?
                            {
                                away: match.away,
                                home: match.home,
                                league: match.league,
                                id: match.id,
                                preBookieTotal: data.odds.pre.bookieTotal,
                                htBookieTotal: data.odds.ht.bookieTotal,
                                ht: data.odds.ht.matchTotal,
                                ft: match.ss ? match['ss'].split("-").reduce((a, c) => Number(a) + Number(c)) : 0,
                                time: new Date(Number(match.time) * 1000),
                            } :
                            match
                    );
                    return {matches: newData, loader: false};
                })
            });
        })
    };

    validateMatches(){
        const { matches } = this.state;
        let ids = matches.filter(match => match.ht).map(match => match.id);
        this.setState({loader: true});
        validateRows(ids).then(
            data => {
                if (data.length > 0){
                    let ids = [].concat.apply([], data).map(item => item.id);
                    this.setState({matches: this.state.matches.filter(match => match.ht && !ids.includes(match.id))});
                }
                this.insertMatches()
            }
        );
    }

    insertMatches(){
        const { matches } = this.state;
        this.setState({loader: true});
        if (matches.length > 0) {
          insertRows(matches)
              .then(data => {
                    if(data.errors) {
                        throw new Error(data.message)
                    } else {
                        this.setState({
                            matches: [],
                            loader: false
                        })
                    }
          }).catch(error => {
              this.setState({
                  error: JSON.stringify(error.message)
              })
          });
        } else {
            this.setState({loader: false})
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
                    <input type="text" className="form-control" id="date"
                           placeholder="Enter date" onChange={(e) => this.setState({ dates: e.target.value })}/>
                </div>
                <div className="form-group">
                    <label htmlFor="tournament">Tournament ID</label>
                    <input type="number" className="form-control" id="tournament"
                           placeholder="Tournament ID" onChange={(e) => this.setState({ tournamentId: e.target.value })}/>
                </div>
                <button type="submit" className="btn btn-primary">Get</button>
            </form>
                <br/>
                {matches.length}

                {matches.length > 0 &&
                <button
                    onClick={this.validateMatches}
                >
                    Insert in DB
                </button>}
                {error && <div>Error: {error}</div>}
                <div className="loading_indicator"><Loader type="Puff" color="#00BFFF" height={80} width={80} visible={loader}/></div>
            </div>
        )
    }
}

export default EndedEvents;