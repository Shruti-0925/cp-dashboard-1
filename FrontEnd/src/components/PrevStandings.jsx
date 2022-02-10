import React, { useState } from "react";
import { Helmet } from "react-helmet";
class PrevStandings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            contests_data: [],
            DataisLoaded: false,
            selectedOption: 'None',
            contestId: '',
            usersData: [],
            usersStatus: '',
            contestName: '',
        };
    }
    componentDidMount() {
        const search = window.location.search;
        const params = new URLSearchParams(search);
        const id = params.get('contest_id');
        if (id === null) {
            fetch(
                "/get-contests")
                .then((res) => res.json())
                .then((json) => {
                    this.setState({
                        contests_data: json,
                        DataisLoaded: true
                    });
                })
        }
        else {
            fetch(
                `/contest-info/${id}`)
                .then((res) => res.json())
                .then((json) => {
                    this.setState({
                        usersData: json.data,
                        usersStatus: json.status,
                        contestName: json.contest_name,
                        DataisLoaded: true,
                        contestId: id,
                    });
                    console.log(id);
                })
        }
    }
    handleChange = ({ target }) => {
        this.setState({
            selectedOption: target.value,
        });
    }
    render() {

        const { DataisLoaded, contests_data, selectedOption, contestId, usersData, usersStatus, contestName } = this.state;
        var ranks = []
        for (var i = 0; i < useState.length; i++) {
            ranks.push(i + 1);
        }

        function logout()
        {
            console.log("hi");
            sessionStorage.clear();
            history.pushState('','','/login')
            window.location.reload();
        }
        if (!DataisLoaded) return <div>
            <h1> Pleses wait some time.... </h1> </div>;
        else if (contestId === '') {
            return (
                <div>

                    <nav>
                        <a href="../">LeaderBoard</a>
                        <a href="/PrevStandings">Contests Standings</a>
                        <a className="logout-button" 
                            onClick={logout}
                        >Logout</a>

                        <div class="animation start-about"></div>
                    </nav>
                    <div class="content">
                        <select className="select-style"
                            value={selectedOption}
                            onChange={this.handleChange}
                        >
                            <option value="None">Select Contest</option>
                            {contests_data.map((contest) => <option value={contest.contest_id} key={contest.contest_id}>{contest.contest_name}</option>)}
                        </select>
                        <p className="p-styling"><a className="a-button" href={`prevstandings?contest_id=${selectedOption}`}>Get Ratings</a></p>
                        <Helmet><link type="text/css" rel="stylesheet" href="leaderboard.css" /></Helmet>
                    </div>
                </div>
            )
        }
        else if (contestId === 'None') {
            return (
                <div>
                    <nav>
                        <a href="../">LeaderBoard</a>
                        <a href="/PrevStandings">Contests Standings</a>
                        <a className="logout-button" href="/login">Logout</a>


                        {/* <a href="#">field3</a>
        <a href="#">field4</a>
        <a href="#">field5</a> */}
                        <div class="animation start-about"></div>
                    </nav>
                    <h1>Option to sahi se select karle</h1>
                    <Helmet><link type="text/css" rel="stylesheet" href="leaderboard.css" /></Helmet>
                </div>
            )
        }
        else {
            return (
                <div className="all">
                    <nav>
                        <a href="../">LeaderBoard</a>
                        <a href="/PrevStandings">Contests Standings</a>
                        <a className="logout-button" href="/login">Logout</a>


                        {/* <a href="#">field3</a>
        <a href="#">field4</a>
        <a href="#">field5</a> */}
                        <div class="animation start-about"></div>
                    </nav>
                    <div className="container">
                        <h1>Previous Standings</h1>
                        <h1>For Contest - {contestName}</h1>


                        {/* <div id="toolbar">
                            <select className="form-control">
                                <option value="">All Batches</option>
                                <option value="2018">2018</option>
                                <option value="2019">2019</option>
                                <option value="2020">2020</option>
                                <option value="2021">2021</option>
                                <option value="2022">2022</option>

                            </select>
                        </div> */}
                        {usersStatus !== 'ok' &&
                            <h2>No registered user participated in it</h2>
                        }

                        <table id="table"
                            data-toggle="table"
                            data-search="true"
                            data-filter-control="true"
                            data-toolbar="#toolbar">
                            <thead>
                                <tr>
                                    <th data-field="serial" data-sortable="true">Rank</th>
                                    <th data-field="cf_handle" data-sortable="false">CF Handle</th>
                                    <th data-field="rank" data-sortable="true">Rank</th>
                                    <th data-field="oldRating" data-sortable="true">Old Rating</th>
                                    <th data-field="newRating" data-sortable="true">New Rating</th>
                                </tr>
                            </thead>
                            <tbody>

                                {usersData.map((user, index) => {
                                    if (user.cf_handle == this.props.current_user)
                                        return <tr class='active' id={user.cf_handle}>
                                            <td>{index + 1}</td>
                                            <td><a href={'https://codeforces.com/profile/' + user.cf_handle} target="_blank" style={{ color: "white" }}>{user.cf_handle}</a></td>
                                            <td>{user.rank}</td>
                                            <td>{user.oldRating}</td>
                                            <td>{user.newRating}</td>
                                        </tr>
                                    else
                                        return <tr id={user.cf_handle}>
                                            <td>{index + 1}</td>
                                            <td><a href={'https://codeforces.com/profile/' + user.cf_handle} target="_blank" style={{ color: "white" }}>{user.cf_handle}</a></td>
                                            <td>{user.rank}</td>
                                            <td>{user.oldRating}</td>
                                            <td>{user.newRating}</td>
                                        </tr>
                                })}
                            </tbody>
                        </table>
                        <Helmet>

                            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous" />
                            <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.6.3/css/all.css" integrity="sha384-UHRtZLI+pbxtHCWp1t77Bi1L4ZtiqrqD80Kn4Z8NTSRyMA2Fd33n5dQ8lWUE00s/" crossorigin="anonymous" />
                            <link rel="stylesheet" href="https://unpkg.com/bootstrap-table@1.18.1/dist/bootstrap-table.min.css" />
                        </Helmet>
                        <Helmet>

                            <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js" integrity="sha512-bLT0Qm9VnAYZDflyKcBaQ2gg0hSYNQrJ8RilYldYQ1FxQYoCLtUjuuRuZo+fjqhx/qtq/1itJ0C2ejDxltZVFg==" crossorigin="anonymous" ></script>
                            <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
                            <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
                            <script src="https://unpkg.com/bootstrap-table@1.18.1/dist/bootstrap-table.min.js"></script>
                            <script src="filter.js"></script>
                            <link type="text/css" rel="stylesheet" href="leaderboard.css" />
                        </Helmet>

                    </div>
                </div>
            )
        }
    };
}

export default PrevStandings;
