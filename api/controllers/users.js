const mongoose = require('mongoose');

const User = require("../models/users");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require("dotenv").config();

exports.user_signup =  async (req,res,next) => {
  const emailCount =await
  User.find({
    email:req.body.email
  }).count();
  const phoneCount = await
  User.find({
    phone:req.body.phone
  }).count();
  if(emailCount>0){
    return res.status(409).json({
      message:'email exists'
    });
  }else if(phoneCount>0){
    return res.status(409).json({
      message:'phone exists'
    });
  }else{
    bcrypt.hash(req.body.password,10,(err,hash) => {
      if(err){
        return res.status(500).json({
          error: err
        });
      }else{
        const user = new User({
          _id: new mongoose.Types.ObjectId(),
          name: req.body.name,
          email: req.body.email,
          phone:req.body.phone,
          password: hash
        });
        user.save()
        .then(result => {
          console.log(result);
          res.status(201).json({
            message:'User Created'
          });
        })
        .catch(err => {
          console.log(err);
          res.status(500).json({
            error: err
          });
        });
      }
    });
  }
}


exports.user_login = (req,res,next) => {
  User.find({ email:req.body.email})
  .exec()
  .then(user => {
    if(user.length<1){
      return res.status(401).json({
        message:'Auth failed'
      });
    }
    bcrypt.compare(req.body.password, user[0].password,(err, result) =>{
      if(err){
        return res.status(401).json({
          message:'Auth failed'
        });
      }
      if(result){
        const token = jwt.sign({
          email: user[0].email,
          userId:user[0]._id
        },
        process.env.JWT_KEY,{
          expiresIn:"1h"
        }
      );
        console.log(token);
      return res.status(200).json({
        message:"Auth successfull",
        token:token
      });
    }
      res.status(401).json({
        message:'auth failed'
      });
    });
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({
    error:err
    });
  });
}
