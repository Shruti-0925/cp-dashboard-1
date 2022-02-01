// Importing Modules
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
const path=require("path");
const bcrypt = require('bcrypt');
const mongoose = require("mongoose");
const axios = require('axios');

// Connecting with database
const url="mongodb+srv://cp-user:12345@cluster.ye5s9.mongodb.net/CP-Dashboard?retryWrites=true&w=majority"
mongoose.connect(String(url),{ useNewUrlParser: true , useUnifiedTopology: true});

// Cofiguring app
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
const publicdirectory = path.join(__dirname,'./public')
app.use(express.static(publicdirectory));
app.use(bodyParser.json());

// Defining Schema
const userSchema = new mongoose.Schema(
	{
		cf_handle : {type : String, required:true, unique: true},
		cf_email : {type : String,required : true},
		inst_email : {type : String,required : true},
		password : {type : String,required : true},
		contests : {type : String,required : true},
		max_rating : {type : String,required : true},
		num_of_questions : {type : String,required : true},
		batch : {type : String, required : true},
	},
	{ collection: 'Password-Details'}
);
const User = mongoose.model('UserSchema', userSchema);

// Main Work

// Function for getting details of a user while registering
async function make_api_call(cf_handle) {
	const cf_api="https://codeforces.com/api/";
	const req1= await axios.get(cf_api + "user.status?handle=" + cf_handle); 
	const req2= await axios.get(cf_api + "user.rating?handle=" + cf_handle); 
	const req3= await axios.get(cf_api + "user.info?handles=" + cf_handle); 
	let number_of_solved_questions=0;
	let max_rating=0;
	let number_of_contests=0;
	async function get_details () {
		try
		{
			let res = await axios.all([req1,req2, req3]).then(axios.spread((...responses) => {
				const responseOne = responses[0];
				const responseTwo = responses[1];
				const responesThree = responses[2];
				let all_attempted_questions = [];
				for(let i=0;i<responseOne.data.result.length;i++)
				{
					if(responseOne.data.result[i].verdict === 'OK')
					{
						let str = String(responseOne.data.result[i].problem.contestId) + '-'+ responseOne.data.result[i].problem.index;
						all_attempted_questions.push(str);
					}
				}
				number_of_solved_questions = [...new Set(all_attempted_questions)].length;
				number_of_contests = responseTwo.data.result.length;
				max_rating = responesThree.data.result[0].maxRating;
			}))
		}
		catch(err){
			console.log(err);
		}
	}
	await get_details();
	return {num_of_questions : number_of_solved_questions , num_of_contests : number_of_contests , max_rating : max_rating};
}

// Useless but helpful
// app.get("/login", async (req, res) => {
// 	const cursor = User.find().cursor();

// 	for (let user = await cursor.next(); user != null; user = await cursor.next())
// 	{
// 		let result;
// 		await make_api_call(user.cf_handle).then((response) => {
// 			result=response;
// 		});
// 		console.log("IN route /login",result);
// 	}
//     res.render("login");
// });

app.post('/api/login', async (req, res) => {
	const { cf_handle, password } = req.body;
	const user = await User.findOne({ cf_handle }).lean()
	if (!user) {
		return res.json({ status: 'error', error: 'Invalid username/password' })
	}
	try {
		if (await bcrypt.compare(password, user.password)) {

			return res.json({ status: 'ok', token : '123' })
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
	let result;
	await make_api_call(cf_handle).then((response) => {
		result=response;
	});
	let num_of_questions = result.num_of_questions;
	let max_rating = result.max_rating;
	let contests = result.num_of_contests;
	let batch = "20"+inst_email.slice(1,3);
	try {
		const response = await User.create({
			cf_handle,
			cf_email,
			inst_email,
			password,
			contests,
			max_rating,
			num_of_questions,
			batch
		})
		console.log('User created successfully: ', response)
		return res.json({ status : 'ok', token : '123' });
	} catch (error) {
		if (error.code === 11000) {
			// duplicate key
			return res.json({ status: 'error', error: 'CF Handle already in use' })
		}
		throw error
	}
})


app.get("/leaderboard", async (req, res) => {
	const data = await User.find({}).lean();
	res.send(data);
});


// Hosting it
var port = process.env.PORT || 5000;
app.listen(port, function () {
    console.log("Server started at: http://localhost:" + String(port) + "/");
});
