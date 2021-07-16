const mongoose=require('mongoose');
const url = 'mongodb://localhost/SignDB';

mongoose.connect(url,{useCreateIndex:true,useNewUrlParser:true,useUnifiedTopology: true ,useFindAndModify:false});

//to get hold on connection
const con=mongoose.connection;

con.on('open', function() {
   console.log('connected...'); 
})


