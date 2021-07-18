const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const User = require('../models/userSchema');
const bcrypt = require('bcrypt');
const { JWT_SECRET } = require("../jwt/Keys")
const authenticate = require("../middleware/authenticate")
const mongoose = require('mongoose');


router.get('/', (req, res) => {
	res.send('heelo router')
})
//get registerd user
router.get('/register', authenticate, async (req, res) => {
	try {
		const users = await User.find()
		res.json(users);
	}
	catch (err) {
		res.send('Error occured' + err);
	}
})
//search user
router.get('/search_user', authenticate, async (req, res) => {
	try {
		const users = await User.find()
		res.json(users);
	}
	catch (err) {
		res.send('Error occured' + err);
	}
})
//get curent user
router.get('/current_user', authenticate, async (req, res) => {
	try {
		const users = await User.findOne({ _id: req.User._id })
		res.json(users);
		console.log(users)
	}
	catch (err) {
		res.send('Error occured' + err);
	}
})

//get other users profile
router.get('/search_user/:id', (req, res) => {
	try {
		let id = req.params.id
		const users = User.findById(id, function (err, data) {
			console.log(data, 'i am data')
			res.json(data);
		});
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
				const token = jwt.sign({ _id: userLogin._id }, JWT_SECRET)
				const { _id } = userLogin
				res.json({ token, user: { _id }, userLogin })

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

//logout history 
router.put('/logouthistory/:id', (req, res) => {
	console.log('inside route')
	let id = req.params.id
	console.log(id, 'i am id');
	const date = req.body.logoutHistory;
	console.log(date, 'i am date');
	User.findByIdAndUpdate(id, {
		$push: { logoutHistory: { date: date } }
	},
		{ new: true, upsert: true }, function (error, result) {
			if (result) {
				console.log(result, 'i m result new')
				res.json(result)
			} else {
				console.log(error, 'i m errror new')
				res.json(error)
			}
		}
	)
})
module.exports = router;