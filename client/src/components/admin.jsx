import React, { useState } from "react";
import { Helmet } from "react-helmet";
function Admin() {
    const [isMouseover, setMouseover] = useState(false);
    const [user_name, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const loginHandler = async (e) => {
        e.preventDefault();
        if(user_name === 'CP-Dashboard' && password==='A@12345')
        {
            const result = await fetch("/update_contests", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((res) => res.json());
            if(result.status === 'ok')
            {
                alert("Updated successfully");
            }
            else
            {
                alert("Some error is there");
            }
        }
        else
        {
            alert("Invalid Credentials");
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
                    <div id="user-text">User Name</div>
                    <input
                        id="user_name"
                        type="text"
                        name="user_name"
                        value={user_name}
                        onChange={(e) => setUserName(e.target.value)}
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
                    Update Ratings
                </button>
                <br />
            </form>
            <ul className="box-area">
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
            </ul>
        </div>
    );
}

export default Admin;
