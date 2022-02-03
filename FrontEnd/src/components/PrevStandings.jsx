import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

class PrevStandings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            contests_data: [],
            DataisLoaded: false,
            selectedOption: 'None',
        };
    }
    componentDidMount() {
        //$(this.refs.list).fadeOut(); // version 1
        // $(this.refs.list).fadeOut();
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
    handleChange = ({ target }) => {
        this.setState({
            selectedOption: target.value,
        });
    }
        render() {
            
            const { DataisLoaded, contests_data, selectedOption } = this.state;
            
            if (!DataisLoaded) return <div>
            <h1> Pleses wait some time.... </h1> </div>;
        else {
            
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
                    <br/>
                    <br/>
                    <br/>
                    <button
                        onClick={getRating}>
                        Get Ratings
                    </button>
                </div>
            )
        }
    };
}

export default PrevStandings;