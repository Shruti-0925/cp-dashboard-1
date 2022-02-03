import React, { useState } from "react";

class PrevStandings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            contests_data: [],
            DataisLoaded: false,
            selectedOption: 'None',
            contestId: '',
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
                        DataisLoaded: true,
                        contestId: id,
                    });
                })
        }
    }
    handleChange = ({ target }) => {
        this.setState({
            selectedOption: target.value,
        });
    }
    render() {

        const { DataisLoaded, contests_data, selectedOption, contestId } = this.state;

        if (!DataisLoaded) return <div>
            <h1> Pleses wait some time.... </h1> </div>;
        else if (contestId === '') {
            function getRating() {
                console.log("hi")
            }
            return (
                <div>
                    <select
                        value={selectedOption}
                        onChange={this.handleChange}
                    >
                        <option value="None">------</option>
                        {contests_data.map((contest) => <option value={contest.contest_id} key={contest.contest_id}>{contest.contest_name}</option>)}
                    </select>
                    <span>{selectedOption}</span>
                    <br />
                    <br />
                    <br />
                    <button
                        onClick={getRating}>
                        Get Ratings
                    </button>
                </div>
            )
        }
        else {
            return (
                <div>
                    <h1>Yo</h1>
                    <span>{contestId}</span>
                </div>
            )
        }
    };
}

export default PrevStandings;