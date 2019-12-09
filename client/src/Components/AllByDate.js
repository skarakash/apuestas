import React, { Component } from 'react';
import { finalview, getGameData } from '../utils/utils';
import {transformMatchData} from '../utils/transformGameObj';
import getAllById from '../utils/getGamesById';

class AllByDate extends Component{
    constructor(){
        super();
        this.state = {
            date: null,
            tournamentId: null,
            matchesIds: [],
            matches:[],
            dbSpinner:  false,
            allByIdSpinner: false,
            error: ''
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
        try {
            const response = await fetch('/insert', {
                method: 'POST',
                body: JSON.stringify(arr),
                headers: {"Content-Type": "application/json"}
            });
            return await response.json();
        } catch (e) {
            console.log(e)
        }
    }

    insertMatches(){
        const { matches } = this.state;
        if (matches.length > 0) {
          this.insertRows(matches)
              .then(data => {
                  this.setState({
                      dbSpinner: false,
                      matches: []
                  })
          }).catch(error => {
              this.setState({
                  error: JSON.stringify(error)
              })
          });
        }
    }



    renderData(){
        const {matches} = this.state;
        return (
            <div>{matches.length}</div>
        )
    }

    getAllMatchesDetailsById(){
        const { matchesIds } = this.state;
        getAllById(matchesIds)
            .then( data => {
                this.setState({
                    allByIdSpinner: false,
                    matches: data
                })
            });
    }

    render(){
        const { matchesIds, matches, error } = this.state;
        return (
            <div className="container">
            <form className="container" onSubmit={this.handleSubmit}>
                <div className="form-group">
                    <label htmlFor="date">Enter date</label>
                    <input type="text" className="form-control" id="date"
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
                    className={this.state.allByIdSpinner ? 'btn btn-danger' : 'btn btn-success'}
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
                {error && <div>Error: {error}</div>}
            </div>
        )
    }
}

export default AllByDate;