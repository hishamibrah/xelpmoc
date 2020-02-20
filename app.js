const express = require('express');
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan');
//const bodyParser = require('body-parser');
//const dotenv = require('dotenv').config();

//const recipeRoutes = require('./api/routes/recipes');
const userRoutes = require('./api/routes/users');
const cors = require('cors');

app.use(cors());

mongoose.connect('mongodb+srv://xelpmoc:xelpmocpass@cluster0-0jxp7.mongodb.net/test?retryWrites=true&w=majority',{
  useNewUrlParser: true,
  useUnifiedTopology:true
});
mongoose.Promise = global.Promise;
app.use(morgan('dev'));
app.use(express.urlencoded({extended:false}));
app.use(express.json());

app.use((req,res,next)=>{
  res.header('Acess-Control-Allow-Origin','*');
  res.header('Acess-Control-Allow-Headers','*');
  if(req.method === 'OPTIONS'){
    res.header('Acess-Control-Allow-Methods','PUT,POST,PATCH,DELETE,GET');
    return res.status(200).json({});
  }
  next();
});

app.use('/user',userRoutes);

app.use((req,res,next)=>{
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

app.use((error,req,res,next)=>{
  res.status(error.status || 500);
  res.json({
    error:{
      message:error.message
    }
  })
});


module.exports = app;
