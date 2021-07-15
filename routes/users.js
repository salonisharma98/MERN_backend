const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const User = require('../models/userSchema');
const bcrypt = require('bcrypt');
const { JWT_SECRET } = require("../jwt/Keys")
const authenticate = require("../middleware/authenticate")
const mongoose = require('mongoose')

router.get('/', (req, res) => {
	res.send('heelo router')
})
router.get('/register',authenticate, async (req, res) => {
	try {
		const users = await User.find()
		res.json(users);		
	}
	catch (err) {
		res.send('Error occured' + err);
	}
})
//search user
router.get('/search_user',authenticate, async (req, res) => {
	try {
		const users = await User.find()
		res.json(users);		
	}
	catch (err) {
		res.send('Error occured' + err);
	}
})
//get curent user
router.get('/current_user',authenticate, async (req, res) => {
	try {		
	const users = await User.findOne({_id:req.User._id})
	res.json(users);
	console.log(users)		
	}
	catch (err) {	
		res.send('Error occured' + err);
	}
})
//get other users profile
router.get('/search_user/:id',authenticate, async (req, res) => {
	try {		
	const users = await User.findOne({_id:req.params.id})
	res.json(users);
	console.log(users)		
	}
	catch (err) {	
		res.send('Error occured' + err);
	}
})


//registering user
router.post('/register', async (req, res) => {
	const { fName, lName, mobile, email, password, cpassword } = req.body;
	console.log(req.body)
	if (!fName || !lName || !mobile || !email || !password || !cpassword) {
		return res.json({ error: "fill the fields properly" });
	}
	try {
		const userExist = await User.findOne({ email: email });

		if (userExist) {
			return res.status(422).json({ error: "user already exist" })
		}
		else if (password != cpassword) {
			return res.json({ error: "password & confrimpassword does not match" })
		}
		else {
			const user = new User({
				fName, lName, mobile, email, password, cpassword,
			})

			//bcrypting password using pre method  before saving 

			await user.save()
			return res.status(201).json({ message: "user registered succesfully" });
		}
	}
	catch (err) {
		console.log(err);
	}

});

//login route
router.post('/signin', async (req, res) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			return res.status(400).json({ error: "fill the data properly" })
		}
		const userLogin = await User.findOne({ email: email });
		if (userLogin) {
			const isMatch = await bcrypt.compare(password, userLogin.password);

			if (!isMatch) {
				//if password is invalid 
				return res.status(400).json({ error: "invalid credentials" });
			}
			else {
				const token = jwt.sign({ _id:userLogin._id }, JWT_SECRET)
				const{_id,fName,lName,mobile,email}=userLogin
				res.json({ token,user:{_id,fName,lName,mobile,email} })
				
				return res.json({ message: "user sign in successfully" });
			}
		}
		else {
			//if email is invalid 
			return res.status(400).json({ error: "invalid credentials" })
		}
	}
	catch (err) {
		console.log(err)
	}

})
//home
router.get('/Home', authenticate, (req, res) => {
	res.send('Home page')
})
//logout

module.exports = router;