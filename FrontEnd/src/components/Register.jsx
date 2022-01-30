import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Register() {
    const [cf_handle, setCFHandle] = useState("");
    const [cf_email, setCFEmail] = useState("");
    const [inst_email, setInstEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmpassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    
    const registerHandler = async (e) => {
        e.preventDefault();
        const url = "https://codeforces.com/api/user.info?handles=" + cf_handle;
        const config = {
            header: {
                "Content-Type": "application/json",
            },
        };

        if (password !== confirmpassword) {
            setPassword("");
            setConfirmPassword("");
            setTimeout(() => {
                setError("");
            }, 5000);
            return setError("Passwords do not match");
        }
        var getJSON = function (url, callback) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.responseType = 'json';
            xhr.onload = function () {
                var status = xhr.status;
                if (status === 200) {
                    callback(null, xhr.response);
                } else {
                    callback(status, xhr.response);
                }
            };
            xhr.send();
        };
        getJSON(url, async function (err, data) {
            if (err !== null) {
                return setError('Invalid Codeforces Handle');
            } else {
                if (data["result"][0]['email'] == null) {
                    setPassword("");
                    setConfirmPassword("");
                    setTimeout(() => {
                        setError("");
                    }, 5000);
                    return setError("Make id visible in settings");
                }
                else if (data["result"][0]['email'] === cf_email) {
                    const fetched_data = await axios.post(
                        "/api/register",
                        {
                            cf_handle,
                            cf_email,
                            inst_email,
                            password
                        },
                        config
                    );
                    console.log(fetched_data.data);
                    if (fetched_data === undefined)
                    {
                        console.log("Nope");
                    }
                    else if (fetched_data.data.status === 'error') {
                        return setError(fetched_data.data.error);
                    }
                    else 
                    {
                        var token = fetched_data.data.token;
                        localStorage.setItem("authToken", token);
                        console.log(history);
                        history.pushState({urlPath:'/register'}, '',"/");
                        window.location.reload();
                    }
                }
                else {
                    setPassword("");
                    setConfirmPassword("");
                    setTimeout(() => {
                        setError("");
                    }, 5000);
                    return setError("CF Handle doesn't refer to provided cf email")
                }
            }
        });
    };

    return (
        <div>

            <h1> Welcome</h1>
            <img
                className="circle-img"
                src="https://iitmandi.ac.in/institute/images/iitmandi_logo.png"
                alt="avatar_img"
            />
            <form onSubmit={registerHandler}>
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
                    <div id="user-text">CF Email</div>
                    <input
                        id="cf_email"
                        type="email"
                        name="cf_email"
                        value={cf_email}
                        onChange={(e) => setCFEmail(e.target.value)}
                    />
                </div>

                <div className="input-group">
                    <div id="user-text">Inst Email</div>
                    <input
                        id="inst_email"
                        type="email"
                        name="inst_email"
                        value={inst_email}
                        onChange={(e) => setInstEmail(e.target.value)}
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
                <div className="input-group">
                    <div id="pwd-text-2">Confirm Password</div>
                    <input
                        id="pw-2"
                        type="password"
                        name="password"
                        value={confirmpassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>

                <button
                    type="submit"
                    id="signup"
                >
                Register
                </button>
                <br/>
                <span>Already have an account? <Link to="/login">Login</Link> </span>
            </form>
        </div>
    );
}

export default Register;
