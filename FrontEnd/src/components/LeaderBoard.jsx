import React from "react";
import { Navigate } from "react-router-dom";
const axios = require('axios');

class LeaderBoard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            users_data: [],
            DataisLoaded: false
        };
    }
    componentDidMount() {
        fetch(
            "/leaderboard")
            .then((res) => res.json())
            .then((json) => {
                this.setState({
                    users_data: json,
                    DataisLoaded: true
                });
            })
    }
    render() {
        const { DataisLoaded, users_data } = this.state;
        if (!DataisLoaded) return <div>
            <h1> Pleses wait some time.... </h1> </div>;
        else
        {
            return (
                <div>
                    <table id="table"
                        data-toggle="table"
                        data-toolbar="#toolbar">
                        <thead>
                            <tr>
                                <th data-field="name" data-sortable="false">CF Handle</th>
                                <th data-field="questions" data-sortable="true">Questions</th>
                                <th data-field="contests" data-sortable="true">Contests</th>
                                <th data-field="rating" data-sortable="true">Rating</th>
                            </tr>
                        </thead>
                        <tbody>
                        {users_data.map(user => (<tr>
                            <td>{user.cf_handle}</td>
                            <td>{user.num_of_questions}</td>
                            <td>{user.contests}</td>
                            <td>{user.max_rating}</td>
                        </tr>))}
                        </tbody>
                    </table>
                </div>
            )
        }
    };
}

export default LeaderBoard;