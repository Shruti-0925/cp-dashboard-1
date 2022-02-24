import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import { Helmet } from "react-helmet";
import ReactDOM from "react-dom";
var otp1 = ''; var otp2 = '';

function Register() {

    var check1 = true;
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
    if (loggined) {
        return <Navigate to="/"></Navigate>
    }
    const registerHandler = async (e) => {
        e.preventDefault();
        check1 = true;
        validate();
        if (check1) {
            const check = validateOTP();
            /* console.log(cfotp)
             console.log(instotp)*/
            console.log(check)
            if (check) {
                const config = {
                    header: {
                        "Content-Type": "application/json",
                    },
                };

                /*if (password !== confirmpassword) {
                    setPassword("");
                    setConfirmPassword("");
                    setTimeout(() => {
                        setError("");
                    }, 5000);
                    return setError("Passwords do not match");
                }*/
                /* console.log("20" + inst_email.slice(1, 3));
                 if (inst_email.slice(7) != "students.iitmandi.ac.in") {
                     setPassword("");
                     setConfirmPassword("");
                     setTimeout(() => {
                         setError("");
                     }, 5000);
                     return setError("Enter correct educational id");
                }*/

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
        }
    };

    const Checkcf_handle = () => {
        if (cf_handle == "") {
            setTimeout(() => {
                ReactDOM.render("", document.getElementById("cf_handleE"));
            }, 5000); console.log("cfhandle");
            ReactDOM.render("CF handle can not be empty.", document.getElementById("cf_handleE"));
            return false;
        }
        const url = "https://codeforces.com/api/user.info?handles=" + cf_handle;
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
        /*  */
        getJSON(url, async function (err, data) {
            if (err != null) {
                setTimeout(() => {
                    ReactDOM.render("", document.getElementById("cf_handleE"));
                }, 5000); console.log(err);
                ReactDOM.render("Invalid codeforces handle.", document.getElementById("cf_handleE"));
                return false;
            }
        });

        fetch("/api/cf_handle_check", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({cf_handle:cf_handle}),
        }).then(() => {
            setTimeout(() => {
                ReactDOM.render("", document.getElementById("cf_handleE"));
            }, 5000);
             ReactDOM.render("CF handle already in use.", document.getElementById("cf_handleE")); return false;
        });
        return true;
    }
    const ValidatecfEmail = () => {
        if (cf_email == "") {
            setTimeout(() => {
                ReactDOM.render("", document.getElementById("cf_emailE"));
            }, 5000);
            ReactDOM.render("CF Email can not be empty.", document.getElementById("cf_emailE"));
            return false;
        }
        if (!(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(cf_email))) {
            setTimeout(() => {
                ReactDOM.render("", document.getElementById("cf_emailE"));
            }, 5000);
            ReactDOM.render("Please enter a valid email.", document.getElementById("cf_emailE"));
            return false;
        }
        const url = "https://codeforces.com/api/user.info?handles=" + cf_handle;
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
            if (data["result"][0]['email'] == null) {
                setTimeout(() => {
                    ReactDOM.render("", document.getElementById("cf_emailE"));
                }, 5000);
                ReactDOM.render("Make id visible in settings.", document.getElementById("cf_emailE"));
                return false;
            }
            if (data["result"][0]['email'] !== cf_email) {
                setTimeout(() => {
                    ReactDOM.render("", document.getElementById("cf_emailE"));
                }, 5000);
                ReactDOM.render("CF Handle doesn't refer to provided cf email.", document.getElementById("cf_emailE"));
                return false;
            }
        })
        return true;
    }
    const CheckinstEmail = () => {
        if (inst_email == "") {
            setTimeout(() => {
                ReactDOM.render("", document.getElementById("inst_emailE"));
            }, 5000);
            ReactDOM.render("Inst Email can not be empty.", document.getElementById("inst_emailE"));
            return false;
        }
        if (inst_email.slice(7) != "students.iitmandi.ac.in") {
            setTimeout(() => {
                ReactDOM.render("", document.getElementById("inst_emailE"));
            }, 5000);
            ReactDOM.render("Please enter valid institute email.", document.getElementById("inst_emailE"));
            return false;
        }
        return true;
    }
    const CheckPassword = () => {
        if (password.length == 0) {
            setTimeout(() => {
                ReactDOM.render("", document.getElementById("passwordE"));
            }, 5000);
            console.log(password.length)
            ReactDOM.render("Password can not be empty.", document.getElementById("passwordE"));
            return false;
        }
        if (password.length < 6) {
            setTimeout(() => {
                ReactDOM.render("", document.getElementById("passwordE"));
            }, 5000);
            ReactDOM.render("Password should be atleast 6 characters.", document.getElementById("passwordE"));
            return false;
        }
        return true;

    }
    const validate = () => {
        if (!show) {
            if (!Checkcf_handle()) { console.log("cfhandle"); check1 = false; }
            if (!ValidatecfEmail()) { check1 = false; }
            if (!CheckinstEmail()) { check1 = false; }
            if (!CheckPassword()) { check1 = false; }
            if (password != confirmpassword) {
                setTimeout(() => {
                    ReactDOM.render("", document.getElementById("c_passwordE"));
                }, 5000);
                check1 = false;
                ReactDOM.render("Confirm password doesn't matches with password.", document.getElementById("c_passwordE"));

            }
        }
        else {
            if (cfotp == "") {
                setTimeout(() => {
                    ReactDOM.render("", document.getElementById("cfotpE"));
                }, 5000); check1 = false;
                ReactDOM.render("OTP can not be empty.", document.getElementById("cfotpE"));

            }
            if (instotp == "") {
                setTimeout(() => {
                    ReactDOM.render("", document.getElementById("instotpE"));
                }, 5000); check1 = false;
                ReactDOM.render("OTP can not be empty.", document.getElementById("instotpE"));

            }
        }


    };

    const validateOTP = () => {
        if (cfotp == otp1 && instotp == otp2 && instotp !== "" && cfotp != "") {
            console.log('true')
            sessionStorage.setItem("userName", cf_handle);
            return true;
        }
        setTimeout(() => {
            ReactDOM.render("", document.getElementById("otpE"));
        }, 5000);
        ReactDOM.render("OTP's couldn't verify.", document.getElementById("otpE"));
        return false; //to be changed to false 
    };
    const OTPgen = () => {
        check1 = true;
        validate();
        if (check1) {
            setShow(true);
            otp1 = (Math.floor(900000 * Math.random()) + 100000).toString();
            otp2 = (Math.floor(900000 * Math.random()) + 100000).toString();
            //console.log(otp1);
            //console.log(otp2);
            console.log(typeof otp1);
            console.log(typeof cfotp);
            //     console.log("email try1")
            let details1 = {
                email: cf_email,
                message: otp1,
                message: "OTP for CP DashBoard is " + otp1,
                sub: "CP DashBoard: OTP Verification",
            };
            let details2 = {
                email: inst_email,
                message: otp2,
                message: "OTP for CP DashBoard is " + otp2,
                sub: "CP DashBoard: OTP Verification",
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
        }

    };

    return (
        <div>
            <Helmet>
                <link rel="stylesheet" href="login.css" />
            </Helmet>
            <h1> Welcome</h1>
            <img
                className="circle-img"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRdUlMhsNL6zpyimr31JEbtBgqgqjorc9l5gJFAFgwdQMr7z43oiLoQIgWQ7txEOJcg4g&usqp=CAU"
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
                <div id="cf_handleE" style={{ fontSize: 14, color: "white" }}></div>

                {!show ? <div className="input-group">
                    <div id="user-text">CF Email</div>
                    <input
                        id="cf_email"
                        type="text"
                        name="cf_email"
                        value={cf_email}
                        onChange={(e) => setCFEmail(e.target.value)}
                    />
                </div>
                    : null}
                <div id="cf_emailE" style={{ fontSize: 14, color: "white" }}></div>

                {!show ? <div className="input-group">
                    <div id="user-text">Inst Email</div>
                    <input
                        id="inst_email"
                        type="text"
                        name="inst_email"
                        value={inst_email}
                        onChange={(e) => setInstEmail(e.target.value)}
                    />
                </div> : null}
                <div id="inst_emailE" style={{ fontSize: 14, color: "white" }}></div>
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
                <div id="passwordE" style={{ fontSize: 14, color: "white" }}></div>
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
                <div id="c_passwordE" style={{ fontSize: 14, color: "white" }}></div>
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
                <div id="cfotpE" style={{ fontSize: 14, color: "white" }}></div>
                <br />
                {show ? <div className="input-group">
                    <div id="instotp-text-2">OTP sent on institute mail ID.</div>
                    <input
                        id="instotp"
                        type="text"
                        name="instotp"
                        value={instotp}
                        onChange={(e) => setInstotp(e.target.value)}
                    />
                </div> : null}
                <div id="instotpE" style={{ fontSize: 14, color: "white" }}></div>
                <div id="otpE" style={{ fontSize: 14, color: "white" }}></div>
                <br />
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
                <span>Already have an account? <Link className="lreg" to="#/login">Login</Link> </span>
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