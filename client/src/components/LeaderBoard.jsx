import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { TailSpin } from  'react-loader-spinner'
class LeaderBoard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            users_data: [],
            DataisLoaded: false
        };
    }
    componentDidMount() {
        //$(this.refs.list).fadeOut(); // version 1
        // $(this.refs.list).fadeOut();
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
        function logout()
        {
            sessionStorage.clear();
            history.pushState('','','')
            window.location.reload();
        }
        if (!DataisLoaded)
        {
            return(
                <div style={{marginTop:'45vh',marginLeft:'45vw'}}>
                    <TailSpin
                        heigth="10vh"
                        width="10vw"
                        color='grey'
                        ariaLabel='loading'
                    />
                </div>
            )
        }
        else {

            return (
                <div className="all">
                    <nav>
                        <a href="">LeaderBoard</a>
                        <a href="#/PrevStandings">Contests Standings</a>
                        <a className="logout-button" 
                            onClick={logout}
                        >Logout</a>
                        <div class="animation start-home"></div>
                    </nav>

                    <div className="container animate-bottom">
                        <div id="toolbar">
                            <select className="form-control">
                                <option value="">All Batches</option>
                                <option value="2018">2018</option>
                                <option value="2019">2019</option>
                                <option value="2020">2020</option>
                                <option value="2021">2021</option>
                                <option value="2022">2022</option>

                            </select>
                        </div>
                        <table id="table"
                            data-toggle="table"
                            data-search="true"
                            data-filter-control="true"
                            data-toolbar="#toolbar">
                            <thead>
                                <tr>
                                    <th data-field="cf_handle" data-sortable="false">CF Handle</th>
                                    <th data-field="batch" data-sortable="false" data-filter-control="select">Batch</th>
                                    <th data-field="questions" data-sortable="true">Questions</th>
                                    <th data-field="contests" data-sortable="true">Contests</th>
                                    <th data-field="rating" data-sortable="true">Max Rating</th>
                                    <th data-field="rating2" data-sortable="true">Current Rating</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users_data.map(user => {
                                    if (user.cf_handle == sessionStorage.getItem("userName")){
                                        if(user.curr_rating < 1200)
                                        return <tr class='active' id={user.cf_handle}>
                                            <td><a href={'https://codeforces.com/profile/' + user.cf_handle} target="_blank" class='user1200'>{user.cf_handle}</a></td>
                                            <td>{user.batch}</td>
                                            <td>{user.num_of_questions}</td>
                                            <td>{user.num_of_contests}</td>
                                            <td>{user.max_rating}</td>
                                            <td>{user.curr_rating}</td>
                                        </tr>
                                        else if(user.curr_rating < 1400)
                                        return <tr class='active' id={user.cf_handle}>
                                            <td><a href={'https://codeforces.com/profile/' + user.cf_handle} target="_blank" class='user1400'>{user.cf_handle}</a></td>
                                            <td>{user.batch}</td>
                                            <td>{user.num_of_questions}</td>
                                            <td>{user.num_of_contests}</td>
                                            <td>{user.max_rating}</td>
                                            <td>{user.curr_rating}</td>
                                        </tr> 
                                        else if(user.curr_rating < 1600)
                                        return <tr class='active' id={user.cf_handle}>
                                            <td><a href={'https://codeforces.com/profile/' + user.cf_handle} target="_blank" class='user1600'>{user.cf_handle}</a></td>
                                            <td>{user.batch}</td>
                                            <td>{user.num_of_questions}</td>
                                            <td>{user.num_of_contests}</td>
                                            <td>{user.max_rating}</td>
                                            <td>{user.curr_rating}</td>
                                        </tr>
                                        else if(user.curr_rating < 1900)
                                        return <tr class='active' id={user.cf_handle}>
                                            <td><a href={'https://codeforces.com/profile/' + user.cf_handle} target="_blank" class='user1900'>{user.cf_handle}</a></td>
                                            <td>{user.batch}</td>
                                            <td>{user.num_of_questions}</td>
                                            <td>{user.num_of_contests}</td>
                                            <td>{user.max_rating}</td>
                                            <td>{user.curr_rating}</td>
                                        </tr>    
                                        else if(user.curr_rating < 2200)
                                        return <tr class='active' id={user.cf_handle}>
                                            <td><a href={'https://codeforces.com/profile/' + user.cf_handle} target="_blank" class='user2200'>{user.cf_handle}</a></td>
                                            <td>{user.batch}</td>
                                            <td>{user.num_of_questions}</td>
                                            <td>{user.num_of_contests}</td>
                                            <td>{user.max_rating}</td>
                                            <td>{user.curr_rating}</td>
                                        </tr> 
                                        else if(user.curr_rating < 2400)
                                        return <tr class='active' id={user.cf_handle}>
                                            <td><a href={'https://codeforces.com/profile/' + user.cf_handle} target="_blank" class='user2400'>{user.cf_handle}</a></td>
                                            <td>{user.batch}</td>
                                            <td>{user.num_of_questions}</td>
                                            <td>{user.num_of_contests}</td>
                                            <td>{user.max_rating}</td>
                                            <td>{user.curr_rating}</td>
                                        </tr>    
                                        else 
                                        return <tr class='active' id={user.cf_handle}>
                                            <td><a href={'https://codeforces.com/profile/' + user.cf_handle} target="_blank" class='user2901'>{user.cf_handle}</a></td>
                                            <td>{user.batch}</td>
                                            <td>{user.num_of_questions}</td>
                                            <td>{user.num_of_contests}</td>
                                            <td>{user.max_rating}</td>
                                            <td>{user.curr_rating}</td>
                                        </tr>    
                                               
                                    }
                                    else{
                                        if(user.curr_rating < 1200)
                                        return <tr id={user.cf_handle}>
                                            <td><a href={'https://codeforces.com/profile/' + user.cf_handle} target="_blank" class='user1200'>{user.cf_handle}</a></td>
                                            <td>{user.batch}</td>
                                            <td>{user.num_of_questions}</td>
                                            <td>{user.num_of_contests}</td>
                                            <td>{user.max_rating}</td>
                                            <td>{user.curr_rating}</td>
                                        </tr>
                                        else if(user.curr_rating < 1400)
                                        return <tr id={user.cf_handle}>
                                            <td><a class='user1400' href={'https://codeforces.com/profile/' + user.cf_handle} target="_blank" >{user.cf_handle}</a></td>
                                            <td>{user.batch}</td>
                                            <td>{user.num_of_questions}</td>
                                            <td>{user.num_of_contests}</td>
                                            <td>{user.max_rating}</td>
                                            <td>{user.curr_rating}</td>
                                        </tr> 
                                        else if(user.curr_rating < 1600)
                                        return <tr id={user.cf_handle}>
                                            <td ><a href={'https://codeforces.com/profile/' + user.cf_handle} target="_blank" class='user1600'>{user.cf_handle}</a></td>
                                            <td>{user.batch}</td>
                                            <td>{user.num_of_questions}</td>
                                            <td>{user.num_of_contests}</td>
                                            <td>{user.max_rating}</td>
                                            <td>{user.curr_rating}</td>
                                        </tr>
                                        else if(user.curr_rating < 1900)
                                        return <tr id={user.cf_handle}>
                                            <td ><a href={'https://codeforces.com/profile/' + user.cf_handle} target="_blank" class='user1900'>{user.cf_handle}</a></td>
                                            <td>{user.batch}</td>
                                            <td>{user.num_of_questions}</td>
                                            <td>{user.num_of_contests}</td>
                                            <td>{user.max_rating}</td>
                                            <td>{user.curr_rating}</td>
                                        </tr>    
                                        else if(user.curr_rating < 2200)
                                        return <tr id={user.cf_handle}>
                                            <td ><a href={'https://codeforces.com/profile/' + user.cf_handle} target="_blank" class='user2200'>{user.cf_handle}</a></td>
                                            <td>{user.batch}</td>
                                            <td>{user.num_of_questions}</td>
                                            <td>{user.num_of_contests}</td>
                                            <td>{user.max_rating}</td>
                                            <td>{user.curr_rating}</td>
                                        </tr>       
                                        else if(user.curr_rating < 2400)
                                        return <tr id={user.cf_handle}>
                                            <td ><a href={'https://codeforces.com/profile/' + user.cf_handle} class='user2400' target="_blank">{user.cf_handle}</a></td>
                                            <td>{user.batch}</td>
                                            <td>{user.num_of_questions}</td>
                                            <td>{user.num_of_contests}</td>
                                            <td>{user.max_rating}</td>
                                            <td>{user.curr_rating}</td>
                                        </tr>  
                                        else
                                        return <tr id={user.cf_handle}>
                                            <td ><a href={'https://codeforces.com/profile/' + user.cf_handle} class='user2901' target="_blank">{user.cf_handle}</a></td>
                                            <td>{user.batch}</td>
                                            <td>{user.num_of_questions}</td>
                                            <td>{user.num_of_contests}</td>
                                            <td>{user.max_rating}</td>
                                            <td>{user.curr_rating}</td>
                                        </tr> 
                                    }
                                        
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

export default LeaderBoard;