function SignUp() {   
    const cf_handle = document.getElementById("cf_handle").value
    const cf_email = document.getElementById("cf_email").value
    const inst_email = document.getElementById("inst_email").value
    const password = document.getElementById("pw").value
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
            else if(data["result"][0]['email']===cf_email)
            {
                ;
            }
            else{
                alert("CF Handle doesn't refer to provided cf id")
            }
        }
    });
}


















document.getElementById('signup').addEventListener('click', SignUp)