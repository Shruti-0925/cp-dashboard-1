import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";



function Form(props) {
  const [isMouseover, setMouseover] = useState(false);
  
  async function registerUser() {
    const cf_handle = document.getElementById("cf_handle").value
    const cf_email = document.getElementById("cf_email").value
    const inst_email = document.getElementById("inst_email").value
    const password = document.getElementById("pw").value
  
    const result = await fetch('/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            cf_handle,
            cf_email,
            inst_email,
            password
        })
    }).then((res) => res.json())
  
    if (result.status === 'ok') {
        alert('Success')
    } else {
        alert(result.error)
    }
  }
  async function Login() {   
    const cf_handle = document.getElementById("cf_handle").value
    const password = document.getElementById("pw").value
  
    const result = await fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            cf_handle,
            password
        })
    }).then((res) => res.json())
  
    if (result.status === 'ok') {
      console.log("HI");
      return <Navigate to="/leaderboard"></Navigate>;
    } else {
        alert(result.error)
    }
  }
  function auth(task) {  
    var task = document.getElementsByClassName("auth")[0].id; 
    const cf_handle = document.getElementById("cf_handle").value
    const password = document.getElementById("pw").value
    if(task==="signup")
    {
      const cf_email = document.getElementById("cf_email").value
      const inst_email = document.getElementById("inst_email").value
      const password2 = document.getElementById("pw-2").value
      const url="https://codeforces.com/api/user.info?handles="+cf_handle;
      var getJSON = function(url, callback) {
          var xhr = new XMLHttpRequest();
          xhr.open('GET', url, true);
          xhr.responseType = 'json';
          xhr.onload = function() {
              var status = xhr.status;
              if (status === 200) {
                  callback(null, xhr.response);
              } else {
                  callback(status, xhr.response);
              }
          };
          xhr.send();
      };
      getJSON(url,function(err, data) {
          if (err !== null) {
              alert('Invalid Codeforces Handle');
          } else {
              if(data["result"][0]['email']==null)
                  alert("Make id visible in settings");
              else if(password !== password2)
                  alert("Passwords don't match")
              else if(data["result"][0]['email']===cf_email)
              {
                  registerUser();
              }
              else{
                  alert("CF Handle doesn't refer to provided cf id")
              }
          }
      });
    }
    else
    {
      Login();
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

      <h1> Welcome</h1>
      <img
        className="circle-img"
        src="https://iitmandi.ac.in/institute/images/iitmandi_logo.png"
        alt="avatar_img"
      />

      <div className="input-group">
        <div id="user-text">CF-Handle</div>
        <input id="cf_handle" type="text" name="cf_handle"/>
      </div>
        
      {!props.isRegistered && (<div className="input-group">
        <div id="user-text">CF Email</div>
        <input id="cf_email" type="email" name="cf_email"/>
      </div>)}
        
      {!props.isRegistered && (<div className="input-group">
        <div id="user-text">Inst Email</div>
        <input id="inst_email" type="email" name="inst_email"></input>
      </div>)}
        
      <div className="input-group">
        <div id="pwd-text">Password</div>
        <input id="pw" type="password" name="password"/>
      </div>
      {!props.isRegistered && (<div className="input-group">
        <div id="pwd-text-2">Confirm Password</div>
        <input id="pw-2" type="password" name="password"/>
      </div>)}
        
      <input 
        className="auth"
        type="button" 
        id= {props.isRegistered ? "login" : "signup"}
        value={props.isRegistered ? "Log In" : "Sign Up"} 
        onClick={auth} 
        style={{ backgroundColor: isMouseover ? "black" : "white" }}
        onMouseOut={hot}
        onMouseOver={hob}
      >

      </input>
      {props.isRegistered ? (<span>Don't have account? <Link to="/register">Register</Link> </span>) : (<span>Already have an account? <Link to="/login">Login</Link> </span>)}
    </div>
  );
}

export default Form;
