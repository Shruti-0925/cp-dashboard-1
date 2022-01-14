var express = require("express");
var app = express();
var bodyParser = require("body-parser");
const path=require("path");
var MongoClient = require('mongodb').MongoClient;
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
const publicdirectory = path.join(__dirname,'./public')
app.use(express.static(publicdirectory));
const url="mongodb+srv://cp-user:12345@cluster.ye5s9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
const bcrypt = require('bcrypt');
const { error } = require("console");


app.use(bodyParser.json());
app.get("/", function (req, res) {
    
    res.render("index",{ message_login: ""});
});
app.get("/login", function (req, res) {
    
    res.render("login",{ message_login: ""});
});

app.post('/api/login', async (req, res) => {
	const { cf_handle, password } = req.body;
	var message = ""
	MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		var dbo = db.db("CP-Dashbaord");
		var myobj = { _id:cf_handle, };
		console.log(message);
		dbo.collection("Password-Details").findOne(myobj, function(err, found_user) {
			if (err)
			{
				message=err;
			}
			else
			{
				let fd = bcrypt.compareSync(password,found_user.password);
				if(fd===true)
					message="ok";
				else
				{
					message="Password doesn't match";
				}
				db.close();
			}
			return res.json({ status: message });
		});
	});
})
app.post('/api/register', async (req, res) => {
	console.log(req.body)
	const { cf_handle,cf_email,inst_email, password: plainTextPassword } = req.body

	if (!cf_handle || typeof cf_handle !== 'string') {
		return res.json({ status: 'error', error: 'Invalid cf_handle' })
	}
	if (!cf_email || typeof cf_email !== 'string') {
		return res.json({ status: 'error', error: 'Invalid cf_email' })
	}
	if (!inst_email || typeof inst_email !== 'string') {
		return res.json({ status: 'error', error: 'Invalid inst_email' })
	}

	if (!plainTextPassword || typeof plainTextPassword !== 'string') {
		return res.json({ status: 'error', error: 'Invalid password' })
	}

	/* Will be uncommented later */
	if (plainTextPassword.length < 5) {
		return res.json({
			status: 'error',
			error: 'Password too small. Should be atleast 6 characters'
		})
	}

	const password = await bcrypt.hash(plainTextPassword, 10);
	let message = "";
	MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		var dbo = db.db("CP-Dashbaord");
		var myobj = { _id:cf_handle,cf_handle:cf_handle, cf_email:cf_email,inst_email:inst_email,password:password };
		console.log(message);
		dbo.collection("Password-Details").insertOne(myobj, function(err, new_res) {
			if (err)
			{
				if(err.code===11000)
				{
					message = "User already exists";
					console.log(message);
				}
				else
				{
					message=err;
				}
			}
			else
			{
				message="ok";
				db.close();
			}
			res.json({ status: message })
		});
	});
})

var port = process.env.PORT || 5000;
app.listen(port, function () {
    console.log("Server started at: http://localhost:" + String(port) + "/");
});
