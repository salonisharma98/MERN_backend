//require("dotenv").config();
const dotenv=require("dotenv");
require('./db/connect');

const express = require('express');
const router = require('./routes/users')
// const port=process.env.PORT||3000;
const User = require('./models/userSchema');


const app = express();
dotenv.config({path:'../config.env'});
app.use(express.json());



//router file link
app.use(require('./routes/users'))

app.listen(3000, () => {
	console.log('listening to port 3000');
})
