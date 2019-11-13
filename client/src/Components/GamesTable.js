import React, { Component } from 'react';


class GamesTable extends Component{
    render(){
        const { matches } = this.props;
        return (
            <table className="table table-bordered table-hover">
                <caption>Exact Stats</caption>
                <thead>
                <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Tournament</th>
                    <th scope="col">Season</th>
                    <th scope="col">Teams</th>
                    <th scope="col">HT</th>
                    <th scope="col">35</th>
                    <th scope="col">40</th>
                    <th scope="col">45</th>
                    <th scope="col">50</th>
                    <th scope="col">55</th>
                    <th scope="col">FT</th>
                </tr>
                </thead>
                <tbody>
                {matches.map(game => {
                    return (

                        <tr key={game.id}>
                            <td>{<game className="id">{Number(game.id)}</game>}</td>
                            <td>{game.tournament}</td>
                            <td>{game.season}</td>
                            <td>{game.teams}</td>
                            <td>{game['HT']}</td>
                            <td>{game['@35']}</td>
                            <td>{game['@40']}</td>
                            <td>{game['@45']}</td>
                            <td>{game['@50']}</td>
                            <td>{game['@55']}</td>
                            <td>{game['FT']}</td>
                        </tr>
                    )
                })}
                </tbody>
            </table>
        )
    }
}

export default GamesTable;