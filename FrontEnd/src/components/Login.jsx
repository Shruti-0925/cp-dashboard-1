import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet";
var otp = '';
var check = true;
var pswd = '';

function Login() {
    const [isMouseover, setMouseover] = useState(false);
    const [cf_handle, setCFHandle] = useState("");
    const [password, setPassword] = useState("");
    const [inst_email, setInstEmail] = useState("");
    const [instotp, setInstotp] = useState("");
    const [error, setError] = useState("");
    const [new_password, setnewPassword] = useState("");
    const [c_password, setcPassword] = useState("");
    const [islogin, setIslogin] = useState(true);
    const [ismail, setIsmail] = useState(false);
    const [isotp, setIsotp] = useState(false);
    const [isnewpwd, setIsnewpwd] = useState(false);
    const loggined = sessionStorage.getItem("authToken");
    if(loggined)
    {
        return <Navigate to="/"></Navigate>
    }
    const loginHandler = async (e) => {
        e.preventDefault();
        if (check) { pswd = password; } else { pswd = new_password; }
        console.log("paswd")
        console.log(pswd);
        console.log("updating password")
        const check1 = matchpswd();
        console.log("status")
        console.log(check);
        console.log(check1);
        if (check || check1) {
            console.log("login")
            let details = {
                cf_handle: cf_handle,
                password: pswd,
            };
            const result = await fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(details),
            }).then((res) => res.json());

            if (result.status === "ok") {
                console.log(result)
                var token = result.token;
                sessionStorage.setItem("authToken", token);
                sessionStorage.setItem("userName",cf_handle);
                console.log(history);
                history.pushState({ urlPath: '/login' }, '', "/");
                window.location.reload();
            } else {
                alert(result.error);
            }
        }
    }

    function hob() {
        setMouseover(true);
    }
    function hot() {
        setMouseover(false);
    }
    const fpswd = () => {
        check = false;
        console.log("forget pswd")
        setIslogin(false);
        setIsmail(true);
    }
    const rpswd = () => {
        console.log("reset pswd")
        setIsmail(false);
        setIsotp(true);
        otp = (Math.floor(900000 * Math.random()) + 100000).toString();
        console.log(otp);
        console.log(inst_email);
        let details = {
            email: inst_email,
            message: "OTP for resetting password is " + otp,
            sub: "CP DashBoard: OTP Verification for Reset Password",

        };
        fetch("/api/send_email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify(details),
        });
        console.log("mail sent")
    }
    const validateOTP = () => {
        console.log("validating otp")
        if (instotp == otp && instotp !== "") {
            console.log('true')
            return true;
        }
        return false;
    };
    const subOTP = () => {
        console.log("submit otp")
        var check = validateOTP();
        if (check) {
            setIsotp(false);
            setIsnewpwd(true);
        }
        else {
            console.log("invalid otp");
        }
    }
    const matchpswd = async () => {
        if (new_password == c_password && new_password != "") {
            console.log("new pswd")
            console.log(new_password);
            console.log("old pswd");
            console.log(password);
            let details = {
                cf_handle: cf_handle,
                new_pswd: new_password,
            };
            fetch("/api/reset", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json;charset=utf-8",
                },
                body: JSON.stringify(details),
            });
            return true;
        }
        return false;
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
            <br></br>
            <br></br>
            <form onSubmit={loginHandler}>
                {error && <span className="error-message">{error}</span>}
                {islogin ? <div className="input-group">
                    <div id="user-text">CF-Handle</div>
                    <input
                        id="cf_handle"
                        type="text"
                        name="cf_handle"
                        value={cf_handle}
                        onChange={(e) => setCFHandle(e.target.value)}
                    />
                </div> : null}

                {islogin ? <div className="input-group">
                    <div id="pwd-text">Password</div>
                    <input
                        id="pw"
                        type="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div> : null}

                {ismail ? <div className="input-group">
                    <div id="user-text">Institute Email</div>
                    <input
                        id="inst_email"
                        type="email"
                        name="inst_email"
                        value={inst_email}
                        onChange={(e) => setInstEmail(e.target.value)}
                    />
                </div> : null}
                {ismail ?
                    <button
                        onClick={rpswd}
                        id="login"
                    >
                        Reset Password
                    </button> : null}
                {isotp ?
                    <div className="input-group">
                        <div id="instotp-text-2">OTP sent on institue mail ID.</div>
                        <input
                            id="instotp"
                            type="text"
                            name="instotp"
                            value={instotp}
                            onChange={(e) => setInstotp(e.target.value)}
                        />
                    </div> : null}
                {isotp ?
                    <button
                        onClick={subOTP}
                        id="login"
                    >
                        Submit OTP
                    </button> : null}  {isnewpwd ?
                        <div className="input-group">
                            <div id="pwd-text">New Password</div>
                            <input
                                id="pw"
                                type="password"
                                name="password"
                                value={new_password}
                                onChange={(e) => setnewPassword(e.target.value)}
                            />
                        </div> : null}
                {isnewpwd ?
                    <div className="input-group">
                        <div id="pwd-text">Confirm Password</div>
                        <input
                            id="pw"
                            type="password"
                            name="password"
                            value={c_password}
                            onChange={(e) => setcPassword(e.target.value)}
                        />
                    </div> : null}
                {isnewpwd ?
                    <button
                        type="submit"
                        id="login"
                    >
                        Update Password
                    </button> : null}
                <br />
                {islogin ?
                    <p
                        onClick={fpswd}
                        id="fgpsd"
                    >
                        Forgot Password?
                    </p> : null}<br />
                {islogin ? <button
                    type="submit"
                    id="login"
                >
                    Login
                </button> : null}
                <br /> 
                {islogin ? <span>
                    Don't have account? <Link className="lreg" to="/register">Register</Link>
                </span> : null}
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
export const userlogged=sessionStorage.getItem("userName");
export default Login;