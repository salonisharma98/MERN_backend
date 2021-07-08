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
		maxlength: 10,
		required: true
	},
	cpassword:
	{
		type: String,
		maxlength: 10,
		required: true
	},
	tokens:[
		{
			token:{
				type: String,
				// required:true
			}
		}
	]
	// gender:
	// {
	// 	type: String

	// }
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
// generating token
userSchema.methods.generateAuthToken=async function(){
	try{
		console.log("inside try block");
		let token=jwt.sign({_id:this._id},process.env.SECRET_KEY);
		this.tokens=this.tokens.concat({token:token});
		await this.save();
		return token;
		
	}catch(err){
		console.log("inside catch block");
		console.log(err);
	}
};

module.exports = mongoose.model('User', userSchema);