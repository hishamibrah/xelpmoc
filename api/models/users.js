const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  _id:mongoose.Schema.Types.ObjectId,
  name:{type: String,required:true},
  phone:{type:Number, required:true, unique:true},
  email:{type: String,required:true, unique:true},
  password:{type:String,required:true}
});

module.exports = mongoose.model('User',userSchema);
