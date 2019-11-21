import React, { Component } from 'react';
import { inplay, getAllById, getGameData } from '../utils';


class Inplay extends Component {
    constructor(){
        super();
        this.state = {
            ids: [],
            matches: []
        };

        this.getGames = this.getGames.bind(this);
    }

    getIds = () => inplay().then((data) => {
        this.setState({
            ids: data
        })
    });

    getGames = () => getAllById(this.state.ids).then(
        (data) => {
            const matches = data.map(game => getGameData(game));
            this.setState({
                matches
            }, () => console.log(this.state.matches))
        }
    );


    componentWillUnmount() {
        clearInterval(this.intervalID);
    }

    render(){
        const { ids } = this.state;
        return <div className="container">
            {ids.length > 0 && ids.map(id => <div key={id}>{id}</div>)}
            <button className="btn btn-success" onClick={() => this.getIds()}>LIVE</button>
            <button className="btn btn-info" onClick={() => this.getGames()}>Display live</button>
        </div>
    }
}

export default Inplay;