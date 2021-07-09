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
		// let token;
		const { email, password } = req.body;
		if (!email || !password) {
			return res.status(400).json({ error: "fill the data properly" })
		}

		const userLogin = await User.findOne({ email: email });
		// console.log(userLogin);

		if (userLogin) {
			const isMatch = await bcrypt.compare(password, userLogin.password);
			const token = await userLogin.generateAuthToken();

			

			// if (typeof localStorage === "undefined" || localStorage === null) {
			// 	var LocalStorage = require('node-localstorage').LocalStorage;
			// 	localStorage = new LocalStorage('./scratch');
			// }
			
			// localStorage.setItem('myFirstKey', 'myFirstValue');
			//console.log(localStorage.getItem('myFirstKey'));

			if (!isMatch) {
				//if password is invalid 
				return res.status(400).json({ error: "invalid credentials" });
			}
			else {
				// const token = jwt.sign({
				// 	_id: userLogin._id,
				// 	email:userLogin.email
				// },
				// 	'secretvariable', {
				// 	expiresIn: '1h'
				// }
				// );
				// res.status(200).json({
				// 	message: "user found",
				// 	token: token
				// });
				return res.json({ message: "user sign in successfully" });
			}

		}
		else {
			//if email is invalid 
			return res.status(400).json({ error: "invalid credentials of  email" })
		}
	}
	catch (err) {
		console.log(err)
	}

})
module.exports = router;