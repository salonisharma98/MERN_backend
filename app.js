require('./db/connect');
const express = require('express');
var cors = require('cors')
const router = require('./routes/users')
const User = require('./models/userSchema');
const app = express();


app.use(express.json());

app.use(cors());
//router file link
app.use(require('./routes/users'))

// app.use(cors());
app.listen(5000, () => {
	console.log('listening to port 5000');
})
