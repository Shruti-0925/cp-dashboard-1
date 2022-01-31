import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet";
function Login() {
    const [isMouseover, setMouseover] = useState(false);
    const [cf_handle, setCFHandle] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const loginHandler = async (e) => {
        e.preventDefault();

        const result = await fetch("/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                cf_handle,
                password,
            }),
        }).then((res) => res.json());

        if (result.status === "ok") {
            console.log(result)
            var token = result.token;
            localStorage.setItem("authToken", token);
            console.log(history);
            history.pushState({urlPath:'/login'}, '',"/");
            window.location.reload();
        } else {
            alert(result.error);
        }
    }

    function hob() {
        setMouseover(true);
    }
    function hot() {
        setMouseover(false);
    }

    return (
        <div>
        <Helmet>
        <link rel="stylesheet" href="login.css" />
      </Helmet>
            <h1> Welcome</h1>
            <img
                className="circle-img"
                src="https://iitmandi.ac.in/institute/images/iitmandi_logo.png"
                alt="avatar_img"
            />
            <form onSubmit={loginHandler}>
                {error && <span className="error-message">{error}</span>}
                <div className="input-group">
                    <div id="user-text">CF-Handle</div>
                    <input
                        id="cf_handle"
                        type="text"
                        name="cf_handle"
                        value={cf_handle}
                        onChange={(e) => setCFHandle(e.target.value)}
                    />
                </div>

                <div className="input-group">
                    <div id="pwd-text">Password</div>
                    <input
                        id="pw"
                        type="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <button
                    type="submit"
                    id="login"
                >
                Login
                </button>
                <br/>
                <span>
                    Don't have account? <Link to="/register">Register</Link>
                </span>
            </form>
        </div>
    );
}

export default Login;
