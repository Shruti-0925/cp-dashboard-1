var express = require("express");
var app = express();
var bodyParser = require("body-parser");
const path=require("path");
var MongoClient = require('mongodb').MongoClient;
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
const publicdirectory = path.join(__dirname,'./public')
app.use(express.static(publicdirectory));
const url="mongodb+srv://cp-user:12345@cluster.ye5s9.mongodb.net/CP-Dashboard?retryWrites=true&w=majority"
const bcrypt = require('bcrypt');
const { error } = require("console");
const mongoose = require("mongoose");

mongoose.connect(String(url),{ useNewUrlParser: true , useUnifiedTopology: true});
app.use(bodyParser.json());

const userSchema = new mongoose.Schema(
	{
    cf_handle : {type : String, required:true, unique: true},
	cf_email : {type : String,required : true},
	inst_email : {type : String,required : true},
	password : {type : String,required : true},
	},
	{ collection: 'Password-Details'}
);
const User = mongoose.model('UserSchema', userSchema);

// app.get("/", function (req, res) {
    
//     res.render("index",{ message_login: ""});
// });
// app.get("/login", function (req, res) {
    
//     res.render("login",{ message_login: ""});
// });

app.post('/api/login', async (req, res) => {
	const { cf_handle, password } = req.body;
	const user = await User.findOne({ cf_handle }).lean()
	if (!user) {
		return res.json({ status: 'error', error: 'Invalid username/password' })
	}
	try {
		if (await bcrypt.compare(password, user.password)) {

			return res.json({ status: 'ok' })
		}
	} catch (error) {
		return res.json({ status: 'error', error: error })
	}

	return res.json({ status: 'error', error: 'Invalid username/password' });


})
app.post('/api/register', async (req, res) => {
	// console.log(req.body)
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
	// if (plainTextPassword.length < 5) {
	// 	return res.json({
	// 		status: 'error',
	// 		error: 'Password too small. Should be atleast 6 characters'
	// 	})
	// }

	const password = await bcrypt.hash(plainTextPassword, 10);
	let message = "";
	try {
		const response = await User.create({
			cf_handle,
			cf_email,
			inst_email,
			password
		})
		console.log('User created successfully: ', response)
		return res.json({ status : 'ok' });
	} catch (error) {
		if (error.code === 11000) {
			// duplicate key
			return res.json({ status: 'error', error: 'CF Handle already in use' })
		}
		throw error
	}
})

var port = process.env.PORT || 5000;
app.listen(port, function () {
    console.log("Server started at: http://localhost:" + String(port) + "/");
});
