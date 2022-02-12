import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import ReactDOM from "react-dom";
var otp = '';
var check = true;
var pswd = '';
var check1 = true;
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
       if(!check){ matchpswd();}
        validate();
        console.log("status")
        console.log(check);
        console.log(check1);
        if ((check && check1) ||  check1) {
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
        check1=true;
        if(cf_handle==""){
        setTimeout(() => {
            ReactDOM.render("", document.getElementById("cf_handleE"));
        }, 5000);
        check1=false;
        ReactDOM.render("Please enter your CF handle.", document.getElementById("cf_handleE"));
        }
       // validate();
        if(check1){
        check = false;
        console.log("forget pswd")
        setIslogin(false);
        setIsmail(true);}
    }
    const rpswd = () => {
        validate();
        if(check1){
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
    }}
    const validateOTP = () => {
        console.log("validating otp")
        if(instotp==""){
            setTimeout(() => {
                ReactDOM.render("", document.getElementById("instotpE"));
            }, 5000);
            ReactDOM.render("OTP can not be empty.", document.getElementById("instotpE"));
            return false
        }
        if (instotp != otp) {
            setTimeout(() => {
                ReactDOM.render("", document.getElementById("instotpE"));
            }, 5000);
            ReactDOM.render("OTP couldn't verify.", document.getElementById("instotpE"));
            return false;
        }
        return true;
    };
    const subOTP = () => {
        validate();
        if(check1){
        console.log("submit otp")
        var check = validateOTP();
        if (check) {
            setIsotp(false);
            setIsnewpwd(true);
        }
        else {
            console.log("invalid otp");
        }}
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
        if (new_password.length == 0) {
            setTimeout(() => {
                ReactDOM.render("", document.getElementById("n_passwordE"));
            }, 5000);
            console.log(new_password.length)
            ReactDOM.render("Password can not be empty.", document.getElementById("n_passwordE"));
            return false;
        }
        if (new_password.length < 6) {
            setTimeout(() => {
                ReactDOM.render("", document.getElementById("n_passwordE"));
            }, 5000);
            ReactDOM.render("Password should be atleast 6 characters.", document.getElementById("n_passwordE"));
            return false;
        }
        return true;

    }
    const validate=()=>{
        check1=true;
        if(islogin){
        if(cf_handle=="" ){
        
            setTimeout(() => {
                ReactDOM.render("", document.getElementById("cf_handleE"));
            }, 5000);
            check1=false;
            ReactDOM.render("CF handle can not be empty.", document.getElementById("cf_handleE"));
        }
        if(password==""){
            setTimeout(() => {
                ReactDOM.render("", document.getElementById("passwordE"));
            }, 5000);
            check1=false;
            ReactDOM.render("Password can not be empty.", document.getElementById("passwordE"));
        }}if(ismail){
        if(!CheckinstEmail()){
            check1=false;
        }}if(isotp){
        if(!validateOTP() ){check1=false;}}
        if(isnewpwd){
        if (!CheckPassword()) { check1 = false; }
        if (new_password != c_password && CheckPassword() ) {
            setTimeout(() => {
                ReactDOM.render("", document.getElementById("c_passwordE"));
            }, 5000);
            check1 = false;
            ReactDOM.render("Confirm password doesn't matches with password.", document.getElementById("c_passwordE"));

        }}

    }
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
                <div id="cf_handleE" style={{ fontSize: 14, color: "white" }}></div>
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
                <div id="passwordE" style={{ fontSize: 14, color: "white" }}></div>
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
                <div id="inst_emailE" style={{ fontSize: 14, color: "white" }}></div>
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
                    <div id="instotpE" style={{ fontSize: 14, color: "white" }}></div>
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
                        <div id="n_passwordE" style={{ fontSize: 14, color: "white" }}></div>
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
                    <div id="c_passwordE" style={{ fontSize: 14, color: "white" }}></div>
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