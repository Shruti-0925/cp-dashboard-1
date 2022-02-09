// Importing Modules
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
const path = require("path");
const bcrypt = require('bcrypt');
const mongoose = require("mongoose");
const axios = require('axios');
const nodemailer = require("nodemailer");
const { Timestamp } = require("mongodb");

// Connecting with database
const url = "mongodb+srv://cp-user:12345@cluster.ye5s9.mongodb.net/CP-Dashboard?retryWrites=true&w=majority"
mongoose.connect(String(url), { useNewUrlParser: true, useUnifiedTopology: true });

// Cofiguring app
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
const publicdirectory = path.join(__dirname, './public')
app.use(express.static(publicdirectory));
app.use(bodyParser.json());

// Defining Schema
const userSchema = new mongoose.Schema(
	{
		cf_handle: { type: String, required: true, unique: true },
		cf_email: { type: String, required: true },
		inst_email: { type: String, required: true },
		password: { type: String, required: true },
		num_of_contests: { type: String, required: true },
		max_rating: { type: String, required: true },
		num_of_questions: { type: String, required: true },
		batch: { type: String, required: true },
	},
	{ collection: 'Password-Details' }
);
const contestSchema = new mongoose.Schema(
	{
		contest_id: { type: Number, required: true, unique: true },
		contest_name: { type: String, required: true, unique: true },
		start_time: { type: String }
	},
	{ collection: 'All-Contests' }
);
const userContestSchema = new mongoose.Schema(
	{
		contest_id: { type: Number, required: true, unique: true },
		contest_name: { type: String, required: true, unique: true },
		participants: [
			{
				cf_handle: { type: String, required: true, uniqueItems: true },
				rank: { type: Number, required: true },
				oldRating: { type: Number, required: true },
				newRating: { type: Number, required: true }
			}
		],
	},
	{ collection: 'User-Contests' }
);
const User = mongoose.model('UserSchema', userSchema);
const Contests = mongoose.model('ContestSchema', contestSchema);
const UserContests = mongoose.model('userContestSchema', userContestSchema);

// Main Work

// Function for getting details of a user while registering
async function make_api_call(cf_handle) {
	const cf_api = "https://codeforces.com/api/";
	const req1 = await axios.get(cf_api + "user.status?handle=" + cf_handle);
	const req2 = await axios.get(cf_api + "user.rating?handle=" + cf_handle);
	const req3 = await axios.get(cf_api + "user.info?handles=" + cf_handle);
	let number_of_solved_questions = 0;
	let max_rating = 0;
	let number_of_contests = 0;
	async function get_details() {
		try {
			let res = await axios.all([req1, req2, req3]).then(axios.spread((...responses) => {
				const responseOne = responses[0];
				const responseTwo = responses[1];
				const responesThree = responses[2];
				let all_attempted_questions = [];
				for (let i = 0; i < responseOne.data.result.length; i++) {
					if (responseOne.data.result[i].verdict === 'OK') {
						let str = String(responseOne.data.result[i].problem.contestId) + '-' + responseOne.data.result[i].problem.index;
						all_attempted_questions.push(str);
					}
				}
				number_of_solved_questions = [...new Set(all_attempted_questions)].length;
				number_of_contests = responseTwo.data.result.length;
				if(responesThree.data.result[0].maxRating !== undefined)
				{
					max_rating = responesThree.data.result[0].maxRating;
				}
				else
				{
					max_rating=0;
				}
			}))
		}
		catch (err) {
			console.log(err);
		}
	}
	await get_details();
	return { num_of_questions: number_of_solved_questions, num_of_contests: number_of_contests, max_rating: max_rating };
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
	const cf_handle=req.body.cf_handle;
	const password=req.body.password;
	const user = await User.findOne({ cf_handle }).lean()
	if (!user) {
		return res.json({ status: 'error', error: 'Invalid username/password' })
	}
	try {
		console.log("login")
		console.log(password)
		console.log(user.password)
		if (await bcrypt.compare(password, user.password)) {

			return res.json({ status: 'ok', token: '123' })
		}
	} catch (error) {
		return res.json({ status: 'error', error: error })
	}

	return res.json({ status: 'error', error: 'Invalid username/password' });


})
app.post('/api/reset', async(req,res)=>{
	console.log("reset");
	const cf_handle=req.body.cf_handle;
	const new_pswd=req.body.new_pswd;
	const hashpswd = await bcrypt.hash(new_pswd, 10);
	User.updateOne({cf_handle}, 
		{password:hashpswd}, function (err, docs) {
		if (err){
			console.log(err)
		}
		else{
			console.log("Updated Docs : ", docs);
		}
	});
	//const user = await User.findOne({ cf_handle }).lean()
	//console.log(user.password);
	//user.password=new_pswd;
	//user.save(function(){});
	//await user.save();
	//return res.json({ status: 'error', error: user.id });
})
app.post('/api/register', async (req, res) => {
	// console.log(req.body)
	const { cf_handle, cf_email, inst_email, password: plainTextPassword } = req.body
	const user = await User.findOne({ cf_handle }).lean();
	if(user){
		return res.json({ status: 'error', error: 'CF Handle already in use' });
	}

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
		result = response;
	});
	let contests_details = await axios.get("https://codeforces.com/api/user.rating?handle=" + cf_handle);
	let contests_array = contests_details.data.result;
	let num_of_questions = result.num_of_questions;
	let max_rating = result.max_rating;
	let num_of_contests = result.num_of_contests;
	let batch = "20" + inst_email.slice(1, 3);
	try {
		const response = await User.create({
			cf_handle,
			cf_email,
			inst_email,
			password,
			num_of_contests,
			max_rating,
			num_of_questions,
			batch,
		})
		console.log('User created successfully: ', response);
	} catch (error) {
		if (error.code === 11000) {
			// duplicate key
			return res.json({ status: 'error', error: 'CF Handle already in use' })
		}
		throw error
	}
	for (var i = 0; i < contests_array.length; i++) {
		const contest_id = contests_array[i].contestId;
		const contest_name = contests_array[i].contestName;
		const contest = await UserContests.findOne({ contest_id }).lean()
		if (!contest) {
			const participants = [{
				cf_handle: cf_handle,
				rank: contests_array[i].rank,
				oldRating: contests_array[i].oldRating,
				newRating: contests_array[i].newRating,
			}]
			try {
				const response = await UserContests.create({
					contest_id,
					contest_name,
					participants
				})
				console.log("created", contest_id);
			} catch (error) {
				console.log(error);
			}
			// console.log("Contest Created",response);
		}
		else {
			const participants = {
				cf_handle: cf_handle,
				rank: contests_array[i].rank,
				oldRating: contests_array[i].oldRating,
				newRating: contests_array[i].newRating,
			}

			UserContests.findOneAndUpdate(
				{ contest_id: contest_id },
				{ $addToSet: { participants: participants } },
			);
			console.log("pushed",contest_id);
		}
	}
	return res.json({ status: 'ok', token: '123' });
})

const otpEmail = nodemailer.createTransport({
	host: "smtp.gmail.com",
	port: 587,
	secure: false,
	requireTLS: true,
	auth: {	
		user: "cp.dashboard.iitmandi@gmail.com",
		pass: "A@123456",
	},
});

otpEmail.verify((error) => {
	if (error) {
		console.log(error);
	} else {
		console.log("Ready to Send");
	}
});
app.post("/api/send_email", async (req, res) => {
	const message = req.body.message;
	const email = req.body.email;
	const sub=req.body.sub;
	//const email=req.body.email;
	const mail = {
	  from: "cp.dashboard.iitmandi@gmail.com",
	  to: email,
	  subject: sub,
	  html: `<p>${message}</p>`,
	};
	otpEmail.sendMail(mail, (error) => {
		if (error) {
			console.log(error);
			res.json({ status: "ERROR" });
		} else {
			console.log("mail sent");
			res.json({ status: "Message Sent" });
		}
	});
});
app.get("/leaderboard", async (req, res) => {
	const data = await User.find({}).lean();
	res.send(data);
});

app.get("/get-contests", async (req, res) => {
	const data = await Contests.find({}).lean();
	res.send(data);
});

async function getContestDetails() {
	let fetched_data = await axios.get("https://codeforces.com/api/contest.list?gym=false");
	let data = fetched_data.data;
	var contests = [];

	for (var i = 0; i < data.result.length; i++) {
		var id = data.result[i].id;
		var name = data.result[i].name;
		var startTime = data.result[i].startTimeSeconds;
		var phase = data.result[i].phase;

		if (name.length > 1 && startTime > 0 && phase !== "FINISHED") {
			var item = {
				contestId: parseInt(id),
				name: name,
				startTime: parseInt(startTime)
			};

			contests.push(item);
		}
	}

	contests.sort(function (a, b) {
		if (a.startTime > b.startTime) return -1;
		if (a.startTime < b.startTime) return 1;
		return 0;
	});
	let to_be_updated_contest_ids= [];
	for(let i=0;i<contests.length;i++)
	{
		let contest_id=contests[i].contestId;
		let contest_name=contests[i].name;
		let startTime=contests[i].startTime;
		let check = await Contests.findOne({contest_id}).lean();
		if(check)
		{
			try {
				const response = await Contests.create({
					contest_id : contest_id,
					contest_name : contest_name,
					startTime : startTime
				})
				to_be_updated_contest_ids.push(contest_id);
			} catch (error) {
				console.log(contest_id);
				console.log(error);
			}
		}
	}
	return to_be_updated_contest_ids;
}
app.get("/update_contests", async (req, res) => {
	let contests = await getContestDetails();
	if(contests.length ===0 )
	{
		res.send({status:'ok',message:'Already Up to date'});
	}

	// For updating user info
	User.find({}).forEach(async function (user) {
		let response = await axios.get("https://codeforces.com/api/user.info?handles="+user.cf_handle);
		let response2 = await axios.get("https://codeforces.com/api/user.rating?handle="+user.cf_handle);
		let check=false; 
		if(response.data.result[0].maxRating !== undefined && response.data.result[0].maxRating>user.max_rating)
		{
			let max_rating = response.data.result[0].maxRating;
			user.max_rating = max_rating;
			check=true;
		}
		if(response2.data.result.length > user.num_of_contests)
		{
			user.num_of_contests= response2.data.result.length;
			check=true;
		}
		if(check === true)
		{
			User.save(user);
		}
	});

	for(var i=0;i<contests.length;i++)
	{
		var contest_id = contests[i];
	}
});
// For backend use only - one time
app.get("/all_contests", async (req, res) => {
	let fetched_data = await axios.get("https://codeforces.com/api/contest.list?gym=false");
	let data = fetched_data.data;
	var contests = [];

	for (var i = 0; i < data.result.length; i++) {
		var id = data.result[i].id;
		var name = data.result[i].name;
		var startTime = data.result[i].startTimeSeconds;
		var phase = data.result[i].phase;

		if (name.length > 1 && startTime > 0 && phase === "FINISHED") {
			var item = {
				contestId: parseInt(id),
				name: name,
				startTime: parseInt(startTime)
			};

			contests.push(item);
		}
	}

	contests.sort(function (a, b) {
		if (a.startTime > b.startTime) return -1;
		if (a.startTime < b.startTime) return 1;
		return 0;
	});
	// Worked only for single time
	// for(let i=0;i<contests.length;i++)
	// {
	// 	let contest_id=contests[i].contestId;
	// 	let contest_name=contests[i].name;
	// 	let startTime=contests[i].startTime;
	// 	try {
	// 		const response = await Contests.create({
	// 			contest_id : contest_id,
	// 			contest_name : contest_name,
	// 			startTime : startTime
	// 		})
	// 	} catch (error) {
	// 		console.log(contest_id);
	// 		console.log(error);
	// 		break;
	// 	}
	// }
	console.log(contests.length);
	res.send(contests);
});

app.get("/contest-info/:contest_id", async (req, res) => {
	const id = req.params.contest_id;
	const dummy = [
		{
			cf_handle : '-',
			rank : '-',
			oldRating : '-',
			newRating : '-',
		}
	]
	function compare(a,b){
		if(a.rank<b.rank){
			return -1;
		}
		if(a.rank>b.rank){
		return 1;
		}
		return 0;
	}
	
	
	if(id==='None')
	{
		return res.send({status: "Wrong Contest", data : dummy, contest_name : "None"});
	}
	const contest = await UserContests.findOne({ contest_id : id }).lean();
	const contest_details = await Contests.findOne({contest_id : id}).lean();
	contest.participants.sort(compare);
	console.log(contest.participants)
	if(!contest)
	{
		return res.send({status: "no users", data : dummy, contest_name : contest_details.contest_name});
	}
	return res.send({status:"ok" , data : contest.participants, contest_name : contest_details.contest_name});
});

// Hosting it
var port = process.env.PORT || 5000;
app.listen(port, function () {
	console.log("Server started at: http://localhost:" + String(port) + "/");
});
