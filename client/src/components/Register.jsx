import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import { Helmet } from "react-helmet";
var otp1 = ''; var otp2 = '';

function Register() {
    const [cf_handle, setCFHandle] = useState("");
    const [cf_email, setCFEmail] = useState("");
    const [inst_email, setInstEmail] = useState("");
    const [password, setPassword] = useState("");
    const [instotp, setInstotp] = useState("");
    const [cfotp, setCfotp] = useState("");
    const [confirmpassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [show, setShow] = useState(false);
    const loggined = sessionStorage.getItem("authToken");
    if(loggined)
    {
        return <Navigate to="/"></Navigate>
    }
    const registerHandler = async (e) => {
        e.preventDefault();
        const check = validateOTP();
        /* console.log(cfotp)
         console.log(instotp)*/
        console.log(check)
        if (check) {
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
            console.log("20" + inst_email.slice(1, 3));
            if (inst_email.slice(7) != "students.iitmandi.ac.in") {
                setPassword("");
                setConfirmPassword("");
                setTimeout(() => {
                    setError("");
                }, 5000);
                return setError("Enter correct educational id");
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
                                password,
                                instotp,
                                cfotp,
                            },
                            config
                        );
                        console.log(fetched_data.data);
                        if (fetched_data.data.status === 'error') {
                            return setError(fetched_data.data.error);
                        }
                        else {
                            var token = fetched_data.data.token;
                            sessionStorage.setItem("authToken", token);
                            console.log(history);
                            history.pushState({ urlPath: '/register' }, '', "/");
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
        }
    };
    const validateOTP = () => {
        if (cfotp == otp1 && instotp == otp2 && instotp !== "" && cfotp != "") {
            console.log('true')
            sessionStorage.setItem("userName",cf_handle);
            return true;
        }
        return false; //to be changed to false 
    };
    const OTPgen = () => {
        alert("debug")
        setShow(true);
        otp1 = (Math.floor(900000 * Math.random()) + 100000).toString();
        otp2 = (Math.floor(900000 * Math.random()) + 100000).toString();
        console.log(otp1);
        console.log(otp2);
        console.log(typeof otp1);
        console.log(typeof cfotp);
        //     console.log("email try1")
        let details1 = {
            email: cf_email,
            message: otp1,
            message: "OTP for CP DashBoard is "+otp1,
            sub:"CP DashBoard: OTP Verification",
        };
        let details2 = {
            email: inst_email,
            message: otp2,
            message: "OTP for CP DashBoard is "+otp2,
            sub:"CP DashBoard: OTP Verification",
        };

        fetch("/api/send_email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify(details1),
        });
        fetch("/api/send_email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify(details2),
        });

    };

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
            <form onSubmit={registerHandler}>
                {error && <span className="error-message">{error}</span>}
                {!show ? <div className="input-group">
                    <div id="user-text">CF-Handle</div>
                    <input
                        id="cf_handle"
                        type="text"
                        name="cf_handle"
                        value={cf_handle}
                        onChange={(e) => setCFHandle(e.target.value)}
                    />
                </div> : null}

                {!show ? <div className="input-group">
                    <div id="user-text">CF Email</div>
                    <input
                        id="cf_email"
                        type="email"
                        name="cf_email"
                        value={cf_email}
                        onChange={(e) => setCFEmail(e.target.value)}
                    />
                </div>
                    : null}

                {!show ? <div className="input-group">
                    <div id="user-text">Inst Email</div>
                    <input
                        id="inst_email"
                        type="email"
                        name="inst_email"
                        value={inst_email}
                        onChange={(e) => setInstEmail(e.target.value)}
                    />
                </div> : null}

                {!show ? <div className="input-group">
                    <div id="pwd-text">Password</div>
                    <input
                        id="pw"
                        type="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div> : null}
                {!show ? <div className="input-group">
                    <div id="pwd-text-2">Confirm Password</div>
                    <input
                        id="pw-2"
                        type="password"
                        name="password"
                        value={confirmpassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div> : null}
                {show ? <div className="input-group">
                    <div id="cfotp-text-2">OTP sent on cf mail ID.</div>
                    <input
                        id="cfotp"
                        type="text"
                        name="cfotp"
                        value={cfotp}
                        onChange={(e) => setCfotp(e.target.value)}
                    />
                </div> : null}
                {show ? <div className="input-group">
                    <div id="instotp-text-2">OTP sent on institue mail ID.</div>
                    <input
                        id="instotp"
                        type="text"
                        name="instotp"
                        value={instotp}
                        onChange={(e) => setInstotp(e.target.value)}
                    />
                </div> : null}

                {!show ? <button
                    onClick={OTPgen}
                    id="signup"
                >
                    Register
                </button> : null}
                {show ? <button
                    type="submit"
                    id="signup"
                >
                    Submit OTP.
                </button> : null}
                <br />
                <span>Already have an account? <Link className="lreg" to="/login">Login</Link> </span>
            </form>
            <ul class="box-area">
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

export default Register;
