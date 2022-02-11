import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({ component: Component, ...rest }) => {
    let auth = sessionStorage.getItem("authToken");
    let loggedinuser=sessionStorage.getItem("userName")
    return auth ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
