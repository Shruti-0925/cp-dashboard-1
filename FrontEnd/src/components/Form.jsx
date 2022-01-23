import React, { useState } from "react";

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
      alert('Success')
  } else {
      alert(result.error)
  }
}
function SignUp(task) {  
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


function Form(props) {
  const [isMouseover, setMouseover] = useState(false);

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
      {/* <form className="form" >
        <input type="text" id="cf_handle" placeholder="Cf_Handle" />

        {!props.isRegistered && (
          <input type="email" id="cf_email" placeholder="Cf_email" />
        )}
        {!props.isRegistered && (
          <input type="email" id="inst_email" placeholder="Institute_email" />
        )}
        <input type="password" id="pw" placeholder="Password" />
        {!props.isRegistered && (
          <input type="password" placeholder="Confirm Password" />
        )}

        <button
          style={{ backgroundColor: isMouseover ? "black" : "white" }}
          type="submit"
          id="signup"
          value="Sign Up"
          onMouseOver={hob}
          onMouseOut={hot}
          onClick={SignUp}
        >
          {props.isRegistered ? "Login" : "Register"}
        </button>
      </form> */}
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
        
      <a href="leaderboard.html">
      <input 
        className="auth"
        type="button" 
        id= {props.isRegistered ? "login" : "signup"}
        value={props.isRegistered ? "Log In" : "Sign Up"} 
        onClick={SignUp} 
        style={{ backgroundColor: isMouseover ? "black" : "white" }}           onMouseOver={hob}
        onMouseOut={hot}
        onMouseOver={hob}
      >
      </input>
      </a>
        
    </div>
  );
}

export default Form;
