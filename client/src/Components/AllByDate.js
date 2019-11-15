import React, { Component } from 'react';
import { finalview, getGameData } from '../utils';

class AllByDate extends Component{
    constructor(){
        super();
        this.state = {
            date: null,
            tournamentId: null,
            matchesIds: [],
            matches:[],
            dbSpinner:  false
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.fetchData = this.fetchData.bind(this);
        this.getAllMatchesDetailsById = this.getAllMatchesDetailsById.bind(this);
        this.insertMatches = this.insertMatches.bind(this);
    }

    handleSubmit(e){
        const { date, tournamentId } = this.state;
        e.preventDefault();
        if(date){
            this.fetchData(date, tournamentId);
        }
    }

    handleChange(e, name){
        e.preventDefault();
        this.setState({
           [name]: e.target.value
        });
    }

    async fetchData(date, league_id){
        try {
            const response = await fetch('/byDate', {
                method: 'POST',
                body: JSON.stringify({date, league_id}),
                headers: {"Content-Type": "application/json"}
            });
            let data = await response.json();
            data = data.results.map(match => match.id);
            this.setState({
                matchesIds: data
            })
        } catch (e) {
            console.log(`Error happened: ${e}`)
        }
    }

    async insertRows(arr){
        this.setState({
            dbSpinner: true
        });
        const promises = arr.map( async match => {
            const response = await fetch('/insert', {
                method: 'POST',
                body: JSON.stringify({match}),
                headers: {"Content-Type": "application/json"}
            });
            this.setState({
                dbSpinner: false
            })
            return await response.json();

        });
        const res =  await Promise.all(promises);
    }

    async getAllById(arr){
        const promises = arr.map( async id => {
            const response = await fetch('/byId', {
                method: 'POST',
                body: JSON.stringify({id}),
                headers: {"Content-Type": "application/json"}
            });
            let data =  await response.json();
            return data.results[0];
        });
        const res =  await Promise.all(promises);
        this.setState({
            matches: res
        })
    }

    insertMatches(){
        const { matches, date } = this.state;
        if (matches.length > 0) {
          let data =  matches.map(match => getGameData(match, date)).filter(item => item['FT'] !== 0);
          this.insertRows(data);
        }
    }



    renderData(){
        const {matches, date} = this.state;
        let matchesToRender = matches.filter(match => match.events && match.events.length > 0);
       return matchesToRender.map(match => <div key={match.id}>{finalview(match,date)}</div>)
    }

    getAllMatchesDetailsById(){
        const { matchesIds } = this.state;
        this.getAllById(matchesIds);
    }

    render(){
        const { matchesIds, matches } = this.state;
        return (
            <div className="container">
            <form className="container" onSubmit={this.handleSubmit}>
                <div className="form-group">
                    <label htmlFor="date">Enter date</label>
                    <input type="number" className="form-control" id="date"
                           placeholder="Enter date" onChange={(e) => this.setState({ date: e.target.value })}/>
                </div>
                <div className="form-group">
                    <label htmlFor="tournament">Tournament ID</label>
                    <input type="number" className="form-control" id="tournament"
                           placeholder="Tournament ID" onChange={(e) => this.setState({ tournamentId: e.target.value })}/>
                </div>
                <button type="submit" className="btn btn-primary">Get</button>
            </form>
                <br/>
                {matchesIds.length > 0 &&
                <button
                    className="btn btn-success"
                    onClick={this.getAllMatchesDetailsById}
                >
                    Get all by id
                </button>}
                <br/>
                {this.renderData()}

                {matches.length > 0 &&
                <button
                    className={this.state.dbSpinner ? 'btn btn-danger' : 'btn btn-success'}
                    onClick={this.insertMatches}
                >
                    Insert in DB
                </button>}
            </div>
        )
    }
}

export default AllByDate;