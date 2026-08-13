import mongoose from 'mongoose';
const schema=new mongoose.Schema({user:{type:mongoose.Schema.Types.ObjectId,ref:'User'},action:{type:String,required:true},entityType:String,entityId:String,details:String,ipAddress:String,userAgent:String},{timestamps:true});
export default mongoose.models.ActivityLog||mongoose.model('ActivityLog',schema);
