import React, { Component } from 'react';
import {removeFalsy} from "../utils";

class Inplay extends Component {
    constructor(){
        super();
        this.state = {
            time: new Date().toLocaleString(),
            games: {}
        };

        this.getGames = this.getGames.bind(this);
        this.renderData = this.renderData.bind(this);
    }

    componentDidMount(){
        this.intervalID = setInterval(
            () => this.getGames(),
            5000
        )
    }

    getGames(){
        this.inplay();
    }


    async inplay(){
        try {
            const response = await fetch('/live');
            const data = await response.json();
            console.log(data);
            this.setState({
                games: data
            })
        }
        catch (err) {
            console.log('fetch failed', err);
        }
    }

    renderData(){
        const { games } = this.state;
        if (games.results && games.results.length > 0) {
            const { results } = games;
            return results.map(res => <div key={res.id}>{res.home.name} - {res.away.name} ||  {res.ss} || {res.timer.tm}: {res.timer.ts}</div>)
        } else {
            return <div>some...</div>
        }
    }

    componentWillUnmount() {
        clearInterval(this.intervalID);
    }

    render(){
        return <div className="container">{this.renderData()}</div>
    }
}

export default Inplay;