import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  name:{type:String,required:true,trim:true}, email:{type:String,required:true,unique:true,lowercase:true,trim:true},
  password:{type:String,required:true,select:false}, phone:{type:String,default:''},
  role:{type:String,enum:['Admin','Doctor','Reception','Senior Staff','Junior Staff','Accountant'],default:'Junior Staff'},
  isActive:{type:Boolean,default:true}, lastLoginAt:Date
},{timestamps:true});
export default mongoose.models.User || mongoose.model('User',schema);
