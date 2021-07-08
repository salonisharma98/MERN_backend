const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const User = require('../models/userSchema');
const bcrypt = require('bcrypt');


router.get('/', (req, res) => {
	res.send('heelo router')
})

//adding user
router.post('/register', async (req, res) => {
	const { fName, lName, mobile, email, password, cpassword } = req.body;

	if (!fName || !lName || !mobile || !email || !password || !cpassword) {
		return res.json({ error: "fill the fields properly" });
	}
	try {
		const userExist = await User.findOne({ email: email });

		if (userExist) {
			return res.status(404).json({ error: "user already exist" })
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
		let token;
		const { email, password } = req.body;
		if (!email || !password) {
			return res.status(400).json({ error: "fill the data properly" })
		}

		const userLogin = await User.findOne({ email: email });
		// console.log(userLogin);

		if (userLogin) {
			const isMatch = await bcrypt.compare(password, userLogin.password);
			token = await userLogin.generateAuthToken();
			console.log(token);

			//storing token in cookies
			res.cookie("jwttoken",token,{
				expires:new Date(Date.now()+ 25892000000),
				httpOnly:true
			});
			
			if (!isMatch) {
				//if password is invalid 
				return res.status(400).json({ error: "invalid credentials" });
			}
			else {
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
module.exports = router;