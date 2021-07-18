const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userSchema = new mongoose.Schema({
	fName:
	{
		type: String,
		required: true
	},
	lName:
	{
		type: String,
		required: true
	},
	mobile:
	{
		type: String,
		required: true
	},
	email:
	{
		type: String,
		required: true,
		unique: true

	},
	password:
	{
		type: String,
		
		required: true
	},
	cpassword:
	{
		type: String,
		
		required: true
	},
	
	logoutHistory:[{
		date:{
			type:Date
		}
	}]
})
userSchema.pre('save', async function (next) {
	try {
		console.log("inside try")
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(this.password, salt);
		const hashedPasswordconfirm = await bcrypt.hash(this.cpassword, salt);
		this.password = hashedPassword;
		this.cpassword = hashedPasswordconfirm;
		next();
	} catch (error) {
		console.log("inside catch");
		next(error);
	}
});
module.exports = mongoose.model('User', userSchema);