import React from "react";
import { Navigate } from "react-router-dom";

function LeaderBoard(props) {
    console.log(props)
    if(Object.keys(props).length===0)
    {
        return <Navigate to="/login"></Navigate>;
    }
    return (
        <h1>Hierguifbhwuieofbhwlorem</h1>
    );
}

export default LeaderBoard;