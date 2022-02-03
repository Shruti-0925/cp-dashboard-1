import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

function ContestStandings(props) {
    const contest_id = useParams().id;
    console.log(contest_id)
    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         contests_data: [],
    //         DataisLoaded: false,
    //         selectedOption: 'None',
    //     };
    // }
    // componentDidMount() {
    //     //$(this.refs.list).fadeOut(); // version 1
    //     // $(this.refs.list).fadeOut();
    //     fetch(
    //         "/get-contests")
    //         .then((res) => res.json())
    //         .then((json) => {
    //             this.setState({
    //                 contests_data: json,
    //                 DataisLoaded: true
    //             });
    //         })
    // }
    // handleChange = ({ target }) => {
    //     this.setState({
    //         selectedOption: target.value,
    //     });
    // }
        //     const { DataisLoaded, contests_data, selectedOption } = this.state;
            
        //     if (!DataisLoaded) return <div>
        //     <h1> Pleses wait some time.... </h1> </div>;
        // else {
            
            return (
                <div>
                    <h1>Yo</h1>
                </div>
            )
        // }
}

export default ContestStandings;